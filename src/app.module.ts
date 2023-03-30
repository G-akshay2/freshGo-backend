import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import configuration from "./config/configuration"
import { DatabaseModule } from './infra/mongoose/database.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      cache: true,
      expandVariables: true,
      isGlobal: true,
      load: configuration,
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => {
        // if(process.env["LOCAL"] === "true") {
        //   return {
        //     uri: "mongodb://localhost:27017/freshgo"
        //   }
        // }
        // return { 
        //   uri: configService.get("DATABASE.url") 
        // };
    //   },
    //   inject: [ConfigService],
    // }),
    AuthModule,
    AdminModule,
    DatabaseModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
