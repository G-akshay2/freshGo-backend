import { IsNotEmpty, IsOptional } from "class-validator"

export class WareHouseDTO {

  @IsNotEmpty()
  location: {
    coordinates: [{
      type: Number,
    }]
  };

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  town: string;

  @IsOptional()
  name: string;
}

export class Payment {
  token: string;
  name: string;
  amount: number;
}