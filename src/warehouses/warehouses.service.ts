import { HttpException, Injectable } from '@nestjs/common';
import { WAREHOUSE_NAME, WareHouseDocument } from './schema/warehouse.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WareHouseDTO } from './dto/warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(WAREHOUSE_NAME) private readonly wareHouseModel: Model<WareHouseDocument>,
  ) {}

  async getLocations() {
    try {
      return await this.wareHouseModel.find();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async addLocation(location: WareHouseDTO) {
    try {
      console.log(location);
      const loc = new this.wareHouseModel(location)
      await loc.save();
      return {
        success: true,
        message: 'Location Added',
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
  async getStatesOfWarehouses() {
    try {

      return await this.wareHouseModel.aggregate([
        {
          $group: {
            _id: "$state",
          }
        },
      ]);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getLocationByState(state: string) {
    try {
      const data = await this.wareHouseModel.find({ state });
      return data;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
