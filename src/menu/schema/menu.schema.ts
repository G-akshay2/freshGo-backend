import { Prop, raw, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { GROCERICES_TYPE } from "src/infra/constants/app.constants";
import { Address, AddressSchema } from "./address.schema";

@Schema({
  timestamps: true,
})
export class Menu {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({required: true})
  imageUrl: string;

  @Prop({
    type: String,
    required: true,
    select: false,
    enum: Object.values(GROCERICES_TYPE) ,
    immutable: true,
    default: GROCERICES_TYPE.FRUIT,
  })
  type: GROCERICES_TYPE; // Vegetable | Fruit

  @Prop({ required: true })
  color: string;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop(raw({}))
  metadata: any;

  @Prop({type: Types.ObjectId, required: true, ref: "Menu"})
  menuList: Array<string | Types.ObjectId>
}




// User
// Email, Password, UserName, Address, CartItems, type
// Farmers
// Email, Password, UserName, Address, type, MenuItems,
// Distributors
// Email, Password, UserName, Address, type, MenuItems, CartItems
// Vendor
// Email, Password, UserName, Address, type, MenuItems, CartItems, Locations,
// Admin
// Username, Password, Type