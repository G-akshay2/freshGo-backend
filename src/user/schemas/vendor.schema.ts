import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Menu } from "src/menu/schema/menu.schema";
import { User } from "./user.schema";

@Schema({
  timestamps: true,
})
export class Vendor extends User {
  @Prop({type: Types.ObjectId, required: true, ref: Menu.name})
  menuList: Array<string | Types.ObjectId>

  @Prop({
    type: [{
      vendor: { type: Types.ObjectId, required: true, ref: User.name },
      groceries: [ { type: Types.ObjectId, ref: Menu.name } ],
    }],
  })
  cartItems: Array<{vendor: Types.ObjectId, groceries: Array<Types.ObjectId | String>}>;
}

export type DistributorDocument = Vendor & Document;
export const VENDOR_NAME = Vendor.name;
export const VendorSchema = SchemaFactory.createForClass(Vendor);
