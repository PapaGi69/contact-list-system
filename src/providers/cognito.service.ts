import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CacheService } from './cache.service';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { decode, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

const TAG = '[CognitoService]';

/**
 * Class to manage cognito user pools
 */
@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);
  /**
   * @constructor
   */
  constructor(
    private _cacheService: CacheService,
    private configService: ConfigService,
  ) {}
  /**
   * Validates access token
   * @param {object} token The cognito access token
   * @return {object} User claims and username
   */
  async validateToken(token) {
    const METHOD = '[validateToken]';
    this.logger.log(`${TAG} ${METHOD}`);
    const cognitoIssuer = this._getIssuer();

    // Cache cognito user pool pub key to avoid extra external api call on each  api request on backend service
    const cachedPubKeys = await this._cacheService.get('cognitoPubKeys');

    let pubKeys;

    if (cachedPubKeys) {
      pubKeys = cachedPubKeys;
    } else {
      try {
        pubKeys = await this._getPublicKeys(cognitoIssuer);

        await this._cacheService.set('cognitoPubKeys', pubKeys, null);
      } catch (error) {
        throw new UnauthorizedException();
      }
    }

    if (!pubKeys) {
      throw new UnauthorizedException();
    }

    const decodedToken = decode(token, { complete: true });

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid Access Token');
    }

    const key = pubKeys[decodedToken.header.kid];

    if (!key) {
      throw new UnauthorizedException('Invalid Access Token');
    }

    const verificationOptions = {
      ignoreExpiration: false,
    };

    // For testing purposes
    if (
      this.configService.get('IGNORE_EXPIRATION') &&
      this.configService.get('IGNORE_EXPIRATION').toLowerCase() === 'true'
    ) {
      verificationOptions.ignoreExpiration = true;
    }

    let claim;
    try {
      claim = verify(token, key.pem, verificationOptions);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access Token has expired');
      } else {
        throw new UnauthorizedException();
      }
    }

    if (claim.token_use !== 'access') {
      throw new UnauthorizedException();
    }

    if (claim.iss !== cognitoIssuer) {
      throw new UnauthorizedException();
    }

    // get user data with role
    // const user = await this._userRepository.getByUserId(claim.username);
    return { ...claim, userId: claim.username };
  }

  /**
   * Retrieves public key for signature verification
   * @param {string} cognitoIssuer The cognito issuer
   * @return {object}
   */
  async _getPublicKeys(cognitoIssuer) {
    let result;
    try {
      result = await axios({
        method: 'GET',
        url: `${cognitoIssuer}/.well-known/jwks.json`,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }

    return result.data.keys.reduce((keys, current) => {
      const pem = jwkToPem(current);
      keys[current.kid] = { instance: current, pem };
      return keys;
    }, {});
  }

  _getIssuer() {
    const region = this.configService.get('COGNITO_REGION');
    const userPoolId = this.configService.get('COGNITO_USER_POOL_ID');

    return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
  }
}
