import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { USER_TYPE } from "src/infra/constants/app.constants";
import { Address, AddressSchema } from "./address.schema";
import { compare, hash } from "bcrypt";

@Schema({
  timestamps: true,
  methods: {
    passwordValidation: async function(this: any, password: string) {
      const hashedPassowrd = this.password;
      const isMatched = await compare(password, hashedPassowrd);
      return isMatched;
    },
  },
  discriminatorKey: "userKey"
})
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({
    type: String,
    required: true,
    select: false,
    enum: Object.values(USER_TYPE) 
  })
  type: USER_TYPE;

  passwordValidation: (password: string) => Promise<boolean>
}

export type UserDocument = User & Document;
export const USER_NAME = User.name;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function(next: Function) {
  const hashedPassowrd = await hash(this.password, 10);
  this.password = hashedPassowrd;
  next();
})

//Instance Methods

UserSchema.method("isValidMethod", async function(password: string) {
  const hashedPassowrd = this.password;
  const isMatched = await compare(password, hashedPassowrd);
  return isMatched;
})

//or

UserSchema.methods.isValidate = async function(password: string) {
  const hashedPassowrd = this.password;
  const isMatched = await compare(password, hashedPassowrd);
  return isMatched;
}

// Hooks
// Populates menuList if we call findOne function
UserSchema.pre("findOne", function(next: Function) {
  this.populate("menuList");
  next();
})

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