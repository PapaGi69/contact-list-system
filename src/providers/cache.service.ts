import { Injectable, Logger } from '@nestjs/common';
import NodeCache from 'node-cache';

const TAG = '[CacheService]';
/**
 * A class for caching
 */
@Injectable()
export class CacheService {
  private readonly _logger = new Logger(CacheService.name);
  /**
   * @constructor
   */
  constructor(private _cache: NodeCache) {
    this._cache.on('set', (key) => this._logger.log(`${TAG} Added ${key}`));
  }

  /**
   * Retrieves cached key
   * @param {string} key The cache key
   * @return {*} The value stored in the key
   */
  async get(key) {
    const METHOD = '[get]';
    this._logger.log(`${TAG} ${METHOD}`);

    return new Promise((resolve) => {
      resolve(this._cache.get(key));
    });
  }

  /**
   * Sets cached key/value
   * @param {*} key The cache key
   * @param {*} value The value to cache
   * @param {number} expiry The expiry of the key/value in seconds.
   * `Default`: `0` - `No expiration`
   * @return {boolean} True on success
   */
  async set(key, value, expiry) {
    const METHOD = '[set]';
    this._logger.log(`${TAG} ${METHOD}`);

    // if (arguments.length < 3) throw new Error('Invalid number of arguments');
    if (!expiry) {
      this._logger.log(`${TAG} ${METHOD} Will expire on restart`);
    }

    return new Promise((resolve) => {
      resolve(this._cache.set(key, value, expiry));
    });
  }
}
