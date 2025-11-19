import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async storeToken(
    userId: string | number,
    jti: string,
    expiresInSeconds: number,
  ) {
    const key = `session:${userId}:${jti}`;
    await this.redis.set(key, 'Token válido', 'EX', expiresInSeconds);
    this.logger.debug(`Stored session key ${key} (ttl ${expiresInSeconds}s)`);
  }
  async invalidateToken(
    userId: string | number,
    jti: string,
    blacklistTtlSeconds = 24 * 3600,
  ) {
    const key = `session:${userId}:${jti}`;
    await this.redis.set(key, 'Token inválido', 'EX', blacklistTtlSeconds);
    this.logger.debug(
      `Invalidated session key ${key} (blacklist ttl ${blacklistTtlSeconds}s)`,
    );
  }
  async isTokenInvalid(userId: string | number, jti: string): Promise<boolean> {
    const key = `session:${userId}:${jti}`;
    const val = await this.redis.get(key);
    return val === 'Token inválido';
  }
}
