import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JwtConfig {
  "JWT.sercretToken": string,
  "JWT.expiryTime": number,
}

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService<JwtConfig>) {
    const secret = this.configService.get<number>("JWT.expiryTime");
    console.log(typeof secret);
  }
}
