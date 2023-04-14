import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/menu/schema/menu.schema";
import { User } from "./user.schema";

@Schema({
  timestamps: true,
})
export class Farmer extends User {
  @Prop({type: Types.ObjectId, required: true, ref: Menu.name})
  menuList: Array<string | Types.ObjectId>
}

export type FarmerDocument = Farmer & Document;
export const FARMER_NAME = Farmer.name;
export const FarmerSchema = SchemaFactory.createForClass(Farmer);
