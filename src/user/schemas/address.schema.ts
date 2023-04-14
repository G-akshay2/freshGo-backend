import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Address {
  @Prop({ required: true })
  houseNumber: string;

  @Prop({ required: true })
  state: boolean;

  @Prop({ required: true })
  city: boolean;

  @Prop({ required: true })
  zipCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);