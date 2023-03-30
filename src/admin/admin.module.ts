import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ADMIN_CONFIG } from './admin.config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    // Partial Registration: Admin config will be regiseted Globally
    ConfigModule.forFeature(ADMIN_CONFIG)
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
