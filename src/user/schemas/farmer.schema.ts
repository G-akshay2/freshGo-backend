import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/menu/schema/menu.schema";
import { User } from "./user.schema";

@Schema({
  timestamps: true,
})
export class Farmer extends User {
  @Prop([{
    name: { type: Types.ObjectId, ref: Menu.name },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }])
  menuList: Array<{
    name: string | Types.ObjectId,
    quantity: number,
    price: number
  }>

  @Prop({ type: Boolean })
  payOnDelivery?: boolean;

  @Prop([
    {
      status: { type: String },
      customer: { type: Types.ObjectId, required: true, ref: User.name },
      items: [{
        groceries: { type: Types.ObjectId, ref: Menu.name },
        quantity: { type: Number }
      }]
    }
  ])
  orders: Array<{
    status: string,
    customer: Types.ObjectId,
    items: Array<{ groceries: Types.ObjectId | String, quantity: number }>,
  }>;

  @Prop({ type: String })
  storeName?: string;
}

export type FarmerDocument = Farmer & Document;
export const FARMER_NAME = Farmer.name;
export const FarmerSchema = SchemaFactory.createForClass(Farmer);
