import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
})
export class WareHouse {
  @Prop({
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number],
    }
  })
  location: {
    type: string,
    coordinates: Array<number>,
  };

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  town: string;
}

export type WareHouseDocument = WareHouse & Document;
export const WAREHOUSE_NAME = WareHouse.name;
export const WareHouseSchema = SchemaFactory.createForClass(WareHouse);
