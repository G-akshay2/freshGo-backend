import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
    if(process.env["LOCAL"] === "true") {
      return {
        uri: "mongodb://localhost:27017/freshgo"
      }
    }
    return { 
      uri: this.configService.get("DATABASE.url") 
    };
  }
}