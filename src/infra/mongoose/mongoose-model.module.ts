import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MENU_NAME, MenuSchema } from "src/menu/schema/menu.schema";
import { CUSTOMER_NAME, CustomerSchema } from "src/user/schemas/customer.schema";
import { DISTRIBUTOR_NAME, DistributorSchema } from "src/user/schemas/distibutor.schema";
import { FARMER_NAME, FarmerSchema } from "src/user/schemas/farmer.schema";
import { USER_NAME, UserSchema } from "src/user/schemas/user.schema";
import { VENDOR_NAME, VendorSchema } from "src/user/schemas/vendor.schema";

const MODELS = [
  { name: MENU_NAME, schema: MenuSchema },
  { name: USER_NAME, schema: UserSchema, discriminators: [
    { name: FARMER_NAME, schema: FarmerSchema },
    { name: DISTRIBUTOR_NAME, schema: DistributorSchema },
    { name: VENDOR_NAME, schema: VendorSchema },
    { name: CUSTOMER_NAME, schema: CustomerSchema },
  ] },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModelsModule {}