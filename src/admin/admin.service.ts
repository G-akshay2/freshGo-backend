import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get("ADMIN"));
  }
}
