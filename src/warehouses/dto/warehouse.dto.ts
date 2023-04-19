import { IsNotEmpty } from "class-validator"

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
}