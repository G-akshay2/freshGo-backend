import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/menu/schema/menu.schema";
import { User } from "./user.schema";

@Schema({
  timestamps: true,
})
export class Distributor extends User {
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

  @Prop({
    type: [{
      seller: { type: Types.ObjectId, required: true, ref: User.name },
      items: [{
        groceries: { type: Types.ObjectId, ref: Menu.name, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number }
      }]
    }],
  })
  cartItems: Array<{ seller: Types.ObjectId, items: Array<{ groceries: Types.ObjectId | String, quantity: number, price: number }> }>;

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

  @Prop([{
    status: { type: String },
    seller: { type: Types.ObjectId, required: true, ref: User.name },
    items: [{
      groceries: { type: Types.ObjectId, ref: Menu.name },
      quantity: { type: Number }
    }]
  }])
  ordersPlaced: {
    status: string,
    seller: Types.ObjectId,
    items: Array<{ groceries: Types.ObjectId | String, quantity: number }>,
  };
}

export type DistributorDocument = Distributor & Document;
export const DISTRIBUTOR_NAME = Distributor.name;
export const DistributorSchema = SchemaFactory.createForClass(Distributor);
