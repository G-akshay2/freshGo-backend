import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GROCERICES_TYPE } from "src/infra/constants/app.constants";

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
    enum: Object.values(GROCERICES_TYPE),
    immutable: true,
    default: GROCERICES_TYPE.FRUIT,
  })
  type: GROCERICES_TYPE; // Vegetable | Fruit

  @Prop({ required: true })
  color: string;

  @Prop(raw({}))
  metadata: any | Record<string, any>;
}

export type MenuDocument = Menu & Document;
export const MENU_NAME = Menu.name;
export const MenuSchema = SchemaFactory.createForClass(Menu);
