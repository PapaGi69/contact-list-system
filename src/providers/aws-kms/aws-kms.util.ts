import * as asn1 from 'asn1.js';
import BN from 'bn.js';
import { ethers } from 'ethers';

export const ecdsaPubKey = asn1.define('EcdsaPubKey', function (this: any) {
  // parsing this according to https://tools.ietf.org/html/rfc5480#section-2
  this.seq().obj(
    this.key('algo').seq().obj(this.key('a').objid(), this.key('b').objid()),
    this.key('pubKey').bitstr(),
  );
});

export const getEthereumAddress = (publicKey: Buffer): string => {
  // The public key is ASN1 encoded in a format according to
  // https://tools.ietf.org/html/rfc5480#section-2
  // I used https://lapo.it/asn1js to figure out how to parse this
  // and defined the schema in the EcdsaPubKey object
  const res = ecdsaPubKey.decode(publicKey, 'der');
  let pubKeyBuffer: Buffer = res.pubKey.data;

  // The public key starts with a 0x04 prefix that needs to be removed
  // more info: https://www.oreilly.com/library/view/mastering-ethereum/9781491971932/ch04.html
  pubKeyBuffer = pubKeyBuffer.slice(1, pubKeyBuffer.length);

  const address = ethers.utils.keccak256(pubKeyBuffer); // keccak256 hash of publicKey
  const EthAddr = `0x${address.slice(-40)}`; // take last 20 bytes as ethereum adress
  return EthAddr;
};

export const ecdsaSigAsnParse: {
  decode: (asnStringBuffer: Buffer, format: 'der') => { r: BN; s: BN };
} = asn1.define('EcdsaSig', function (this: any) {
  // parsing this according to https://tools.ietf.org/html/rfc3279#section-2.2.3
  this.seq().obj(this.key('r').int(), this.key('s').int());
});

export const findEthereumSig = (signature: Buffer): Record<string, BN> => {
  const decoded = ecdsaSigAsnParse.decode(signature, 'der');
  const { r, s } = decoded;

  const secp256k1N = new BN(
    'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
    16,
  ); // max value on the curve
  const secp256k1halfN = secp256k1N.div(new BN(2)); // half of the curve
  // Because of EIP-2 not all elliptic curve signatures are accepted
  // the value of s needs to be SMALLER than half of the curve
  // i.e. we need to flip s if it's greater than half of the curve
  // if s is less than half of the curve, we're on the "good" side of the curve, we can just return
  return { r, s: s.gt(secp256k1halfN) ? secp256k1N.sub(s) : s };
};

export const recoverPubKeyFromSig = (
  msg: Buffer,
  r: BN,
  s: BN,
  v: number,
): string => {
  return ethers.utils.recoverAddress(`0x${msg.toString('hex')}`, {
    r: `0x${r.toString('hex')}`,
    s: `0x${s.toString('hex')}`,
    v,
  });
};

export const determineCorrectV = (
  msg: Buffer,
  r: BN,
  s: BN,
  expectedEthAddr: string,
) => {
  // This is the wrapper function to find the right v value
  // There are two matching signatues on the elliptic curve
  // we need to find the one that matches to our public key
  // it can be v = 27 or v = 28
  let v = 27;
  let pubKey = recoverPubKeyFromSig(msg, r, s, v);
  if (pubKey.toLowerCase() !== expectedEthAddr.toLowerCase()) {
    // if the pub key for v = 27 does not match
    // it has to be v = 28
    v = 28;
    pubKey = recoverPubKeyFromSig(msg, r, s, v);
  }
  return { pubKey, v };
};
