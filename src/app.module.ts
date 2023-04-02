import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import configuration from "./config/configuration"
import { DatabaseModule } from './infra/mongoose/database.module';
import { MenuModule } from './menu/menu.module';
import { v2 } from 'cloudinary';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      cache: true,
      expandVariables: true,
      isGlobal: true,
      load: configuration,
    }),
    AuthModule,
    AdminModule,
    DatabaseModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
