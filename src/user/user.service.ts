import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { USER_NAME, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddToCart, BuyItemsDTO, LoginDTO, MenuDTO, RegisterDTO } from './dto/user.dto';
import { CUSTOMER_NAME, CustomerDocument } from './schemas/customer.schema';
import { hash } from 'bcrypt';
import { DISTRIBUTOR_NAME, DistributorDocument } from './schemas/distibutor.schema';
import { FARMER_NAME, FarmerDocument } from './schemas/farmer.schema';
import { VENDOR_NAME, VendorDocument } from './schemas/vendor.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_NAME) private readonly userModel: Model<UserDocument>,
    @InjectModel(CUSTOMER_NAME) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(DISTRIBUTOR_NAME) private readonly distributorModel: Model<DistributorDocument>,
    @InjectModel(VENDOR_NAME) private readonly vendorModel: Model<VendorDocument>,
    @InjectModel(FARMER_NAME) private readonly farmerModel: Model<FarmerDocument>,
  ) { }

  async createUser(userDetails: RegisterDTO) {
    try {
      const ifUser = await this.userModel.findOne({ email: userDetails.email });
      if (ifUser) throw new BadRequestException("User with Details Already Exists");
      const hashedPassowrd = await hash(userDetails.password, 10);
      userDetails.password = hashedPassowrd;
      switch (userDetails.type) {
        case "Admin": {
          const user = new this.userModel(userDetails);
          await user.save();
          break;
        }
        case "Customer": {
          const user = new this.customerModel(userDetails);
          await user.save();
          break;
        }
        case "Vendor": {
          const user = new this.vendorModel(userDetails);
          await user.save();
          break;
        }
        case "Distributor": {
          const user = new this.distributorModel(userDetails);
          await user.save();
          break;
        }
        case "Farmer": {
          const user = new this.farmerModel(userDetails);
          await user.save();
          break;
        }
      }
      return {
        message: "User Created",
        success: true,
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async loginUser(userDetails: LoginDTO) {
    try {
      const user = await this.userModel.findOne({ email: userDetails.email }, "+password");
      if (!user) {
        throw new NotFoundException("User Not Found");
      }
      const userValidate = await user.passwordValidation(userDetails.password);
      console.log(userValidate);
      if (!userValidate) {
        throw new BadRequestException("Password is incorrect");
      }
      delete user.password;
      return {
        message: "Successfully Logged In",
        success: true, user
      }
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async farmers() {
    try {
      return await this.farmerModel.find(); 
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async distributors() {
    try {
      return await this.distributorModel.find(); 
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async addToCart(cartItem: AddToCart, id: string) {
    try {
      const user = await this.customerModel.findById(id);
      let flag = 1;
      for (let i = 0; i < user?.cartItems?.length; i++) {
        if (user.cartItems[i].vendor.toString() === cartItem.vendor.toString()) {
          for (let j = 0; j < user.cartItems[i].items.length; j++) {
            if (user.cartItems[i].items[j].groceries.toString() === cartItem.item.groceries.toString()) {
              user.cartItems[i].items[j].quantity++;
              flag = 0;
              break;
            }
          }
          if (flag === 1) {
            console.log("Entered");
            user.cartItems[i].items.push(cartItem.item);
            flag = 0;
            break;
          }
        }
      }
      if (flag === 1) {
        user.cartItems.push({
          vendor: cartItem.vendor,
          items: [cartItem.item]
        });
      }
      await user.save();
      return {
        message: "Added to Cart",
        success: true,
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async buyGrocery(data: BuyItemsDTO, buyerId: string, sellerType: string, orderType: string) {
    try {
      let user: DistributorDocument | VendorDocument;
      switch (sellerType) {
        case "Vendor": {
          user = await this.vendorModel.findById(data.seller);
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findById(data.seller);
          break;
        }
      }
      user.orders.push({
        status: orderType,
        customer: new mongoose.Types.ObjectId(buyerId),
        items: data.items,
      });
      await user.save();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async buyGroceries(items: BuyItemsDTO[], buyerId: string, sellerType: string, orderType: string) {
    try {
      for (let i = 0; i < items.length; i++) {
        await this.buyGrocery(items[i], buyerId, sellerType, orderType);
      }
      return {
        message: "Order Placed SuccessFully",
        success: true,
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async menu(data: MenuDTO[], id: string, type: string) {
    try {
      let user: FarmerDocument | DistributorDocument | VendorDocument;
      switch (type) {
        case "Vendor": {
          user = await this.vendorModel.findById(id);
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findById(id);
          break;
        }
        case "Farmer": {
          user = await this.farmerModel.findById(id);
          break;
        }
      }
      user.menuList = data;
      await user.save();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async updateMenu(menu: MenuDTO[], id: string, type: string) {
    try {
      await this.menu(menu, id, type);
      return {
        message: "Menu SuccessFully Updated",
        success: true,
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getAllOrders(id: string, type: string, orderType?: string) {
    let user: any;
    let aggregate = [];
    aggregate.push(
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        } 
      },
      { $unwind: '$orders' }
    )
    if(orderType) {
      aggregate.push(
        {
          $match:{
            'orders.status': orderType,
          },
        },
      )
    }
    else {
      aggregate.push({
        $group: { _id: '$orders.status', orders: { $push: '$$ROOT' } } 
      });
    }
    aggregate.push({
      $project: {
        orders: 1
      }
    });
    switch (type) {
      case "Vendor": {
        user = await this.vendorModel.aggregate(aggregate);
        break;
      }
      case "Distributor": {
        user = await this.distributorModel.aggregate(aggregate);
        break;
      }
      case "Farmer": {
        user = await this.farmerModel.aggregate(aggregate);
        break;
      }
    }
    return user;
  }

  async customersOrders(id: string, type: string, orderType?: string) {
    try {
      return await this.getAllOrders(id, type, orderType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async allOrders(id: string, type: string, orderType?: string) {
    let user: any;
    let aggregate = [];
    aggregate.push(
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        } 
      },
      { $unwind: '$ordersPlaced' }
    )
    if(orderType) {
      aggregate.push(
        {
          $match:{
            'ordersPlaced.status': orderType,
          },
        },
      )
    }
    else {
      aggregate.push({
        $group: { _id: '$ordersPlaced.status', orders: { $push: '$$ROOT' } } 
      });
    }
    aggregate.push({
      $project: {
        ordersPlaced: 1
      }
    });
    switch (type) {
      case "Vendor": {
        user = await this.vendorModel.aggregate(aggregate);
        break;
      }
      case "Distributor": {
        user = await this.distributorModel.aggregate(aggregate);
        break;
      }
      case "Customer": {
        user = await this.customerModel.aggregate(aggregate);
        break;
      }
    }
    return user;
  }

  async orders(id: string, type: string, orderType?: string) {
    try {
      return await this.allOrders(id, type, orderType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
