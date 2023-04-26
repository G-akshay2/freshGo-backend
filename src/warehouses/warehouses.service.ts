import { HttpException, Injectable } from '@nestjs/common';
import { WAREHOUSE_NAME, WareHouseDocument } from './schema/warehouse.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, WareHouseDTO } from './dto/warehouse.dto';
import { Client } from "@googlemaps/google-maps-services-js";
import Stripe from 'stripe';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(WAREHOUSE_NAME) private readonly wareHouseModel: Model<WareHouseDocument>,
  ) { }

  async getLocations() {
    try {
      return await this.wareHouseModel.find();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getMapLocations() {
    // https://developers.google.com/maps/documentation/places/android-sdk/supported_types
    // client
    // .placesNearby({
    //   params: {
    //     location: location,
    //     radius: 1500,
    //     type: "restaurant",
    //     key: functions.config().google.key,
    //   },
    //   timeout: 1000,
    // })
    // .then((res) => {
    //   res.data.results = res.data.results.map(addMockImage);
    //   return response.json(res.data);
    // })
    // .catch((e) => {
    //   response.status(400);
    //   return response.send(e.response.data.error_message);
    // });
    const client = new Client({});
    console.log(process.env.GOOGLE_API_KEY);
    let locs = await client.geocode({
      params: {
        address: "New York",
        key: process.env.GOOGLE_API_KEY,
      },
      timeout: 1000, // milliseconds
    })
    return locs.data;
  }

  async pay(payment: Payment) {
    try {
      const stripe = new Stripe(process.env.STRIPE_KEY, {
        apiVersion: "2022-11-15"
      });
      const { token, amount } = payment;
      console.log(token, amount);
      const pay = await stripe.paymentIntents
      .create({
        amount,
        currency: "USD",
        payment_method_types: ["card"],
        // confirm: true,
        // payment_method: token
      })
      return pay;
      console.log(pay);
    } catch (error) {
      console.log(error)
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
