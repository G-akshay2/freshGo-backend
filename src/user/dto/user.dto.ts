import { Type } from "class-transformer";
import { MinLength, IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested, IsObject, IsNumber, IsNumberString, IsAlphanumeric, IsEnum } from "class-validator";
import { Types } from "mongoose";
import { USER_TYPE } from "src/infra/constants/app.constants";

class AddressDTO {
  @IsNotEmpty()
  houseNumber: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  zipCode: string;
}

export class RegisterDTO {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric("en-US")
  @MinLength(8, {
    message: 'Password Should be atleast 8 Characters and contain alphabets and numbers',
  })
  password: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  phoneNumber?: number;

  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => AddressDTO)
  address: AddressDTO[];
  
  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  type: USER_TYPE;
}

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class Pagination {
  @IsNumberString()
  @IsNotEmpty()
  pageSize: string;

  @IsNumber({}, { message: "pageNumber must be a number" })
  @IsNotEmpty()
  @Type(() => Number)
  pageNumber: string;
}

export class AddToCart {
  @IsNotEmpty()
  seller: Types.ObjectId;
  @IsNotEmpty()
  item: {
    groceries: Types.ObjectId | String,
    quantity: number,
    price: number
  };
}

export class BuyItemsDTO {
  seller: Types.ObjectId | string;
  items: Array<{ groceries: Types.ObjectId | String, quantity: number }>;
}

export class MenuDTO {
  name: string | Types.ObjectId;
  quantity: number;
  price: number;
}

export class GoeData {
  lat: number;
  long: number;
  dist: number
}