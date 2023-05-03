import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/menu/schema/menu.schema";
import { User } from "./user.schema";

@Schema({
  timestamps: true,
})
export class Customer extends User {
  @Prop({
    type: [{
      seller: { type: Types.ObjectId, required: true, ref: User.name },
      items: [{
        groceries: { type: Types.ObjectId, ref: Menu.name } ,
        quantity: { type: Number },
        price: { type: Number }
      }]
    }],
  })
  cartItems: Array<{seller: Types.ObjectId, items : Array<{ groceries: Types.ObjectId | String, quantity: number, price: number }> }>;

  @Prop([{
    status: { type: String },
    seller: { type: Types.ObjectId, required: true, ref: User.name },
    items: [{
      groceries: { type: Types.ObjectId, ref: Menu.name },
      quantity: { type: Number }
    }]
  }])
  ordersPlaced: Array<{
    status: string,
    seller: Types.ObjectId,
    items: Array<{ groceries: Types.ObjectId | String, quantity: number }>,
  }>;
}

export type CustomerDocument = Customer & Document;
export const CUSTOMER_NAME = Customer.name;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
