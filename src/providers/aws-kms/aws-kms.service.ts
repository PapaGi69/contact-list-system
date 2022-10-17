import { Inject, Injectable } from '@nestjs/common';
import { AWS_KMS_CLIENT } from './aws-kms.constants';
import {
  CreateKeyCommand,
  GetPublicKeyCommand,
  SignCommand,
  // CreateAliasCommand,
} from '@aws-sdk/client-kms';
import { AWSKMSClient } from './aws-kms.interface';
import {
  getEthereumAddress,
  findEthereumSig,
  determineCorrectV,
} from './aws-kms.util';
import { ethers } from 'ethers';
import {
  RawTransactionOptions,
  serializeRawTransaction,
} from '../../utils/stablecoin.util';

@Injectable()
export class AWSKMSService {
  constructor(
    @Inject(AWS_KMS_CLIENT) private readonly awsKmsClient: AWSKMSClient,
  ) {}

  async createKey(keyName?: string): Promise<string> {
    const command = new CreateKeyCommand({
      KeyUsage: 'SIGN_VERIFY',
      KeySpec: 'ECC_SECG_P256K1', // (secp256k1), commonly used for cryptocurrencies
    });
    const result = await this.awsKmsClient.send(command);
    // const keyId = result.KeyMetadata.KeyId;

    // Create an alias for tagging
    // const aliasCommand = new CreateAliasCommand({
    //   AliasName: `alias/phx/${keyName}/${keyId}`, // Add key id to make sure no duplicate keys are created
    //   TargetKeyId: keyId,
    // });
    // await this.awsKmsClient.send(aliasCommand);
    return this.getEthAddressByKeyId(result.KeyMetadata.KeyId);
  }

  async getPublicKey(keyId: string): Promise<Buffer> {
    const command = new GetPublicKeyCommand({ KeyId: keyId });
    const result = await this.awsKmsClient.send(command);
    // Convert Uint8Array to Buffer Array
    // AWS KMS from aws-sdk is returning Buffer;
    // Which is required for finding the ethereum signature
    return Buffer.from(result.PublicKey);
  }

  async signTransaction(
    transaction: RawTransactionOptions,
    keyId: string,
  ): Promise<string> {
    const serializedRawTransaction = serializeRawTransaction(transaction);
    const digestBuffer = Buffer.from(
      ethers.utils.arrayify(ethers.utils.keccak256(serializedRawTransaction)),
    );
    const command = new SignCommand({
      KeyId: keyId,
      Message: digestBuffer,
      // 'ECDSA_SHA_256' is the one compatible with ECC_SECG_P256K1.
      SigningAlgorithm: 'ECDSA_SHA_256',
      MessageType: 'DIGEST',
    });
    const result = await this.awsKmsClient.send(command);
    // Convert Uint8Array to Buffer Array
    // AWS KMS from aws-sdk is returning Buffer;
    // Which is required for finding the ethereum signature
    const signatureBuffer = Buffer.from(result.Signature);
    const signature = findEthereumSig(signatureBuffer);
    // Admin burner, minter or user wallet address if for token approval
    const signerAddress = await this.getEthAddressByKeyId(keyId);
    const { v } = determineCorrectV(
      digestBuffer,
      signature.r,
      signature.s,
      signerAddress,
    );
    const transactionSignature = ethers.utils.joinSignature({
      v,
      r: `0x${signature.r.toString('hex')}`,
      s: `0x${signature.s.toString('hex')}`,
    });

    return ethers.utils.serializeTransaction(
      // Pass the raw transaction/not serialized with the signature
      ethers.utils.parseTransaction(serializedRawTransaction),
      transactionSignature,
    );
  }

  async getEthAddressByKeyId(keyId: string): Promise<string> {
    const publicKey = await this.getPublicKey(keyId);
    return getEthereumAddress(publicKey);
  }
}
