import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service';

@Injectable()
export class TokenBlacklistService {
  constructor(private readonly sessionService: SessionService) {}

  async addByUserAndJti(
    userId: string | number,
    jti: string,
    ttlSeconds?: number,
  ) {
    await this.sessionService.invalidateToken(userId, jti, ttlSeconds);
  }

  async isBlacklistedByUserAndJti(
    userId: string | number,
    jti: string,
  ): Promise<boolean> {
    return this.sessionService.isTokenInvalid(userId, jti);
  }
}
