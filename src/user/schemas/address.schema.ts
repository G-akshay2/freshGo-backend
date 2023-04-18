import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Address {
  @Prop({ required: true })
  houseNumber: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zipCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);