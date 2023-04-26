import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/menu/schema/menu.schema";
import { User } from "./user.schema";

@Schema({
  timestamps: true,
})
export class Vendor extends User {
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
        groceries: { type: Types.ObjectId, ref: Menu.name, required: true } ,
        quantity: { type: Number, required: true }
      }]
    }],
  })
  cartItems: Array<{seller: Types.ObjectId, items : Array<{ groceries: Types.ObjectId | String, quantity: number }> }>;

  @Prop({ type: Boolean })
  preOrder?: boolean;

  @Prop({ type: String })
  storeName?: string;
  
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

  @Prop({
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number],
    }
  })
  location?: {
    type: string,
    coordinates: Array<number>,
  };

  @Prop({ default: false })
  isOnlinePaymentAvailable: boolean;

  @Prop({ default: false })
  doorDelivery: boolean;
}

export type VendorDocument = Vendor & Document;
export const VENDOR_NAME = Vendor.name;
export const VendorSchema = SchemaFactory.createForClass(Vendor);
