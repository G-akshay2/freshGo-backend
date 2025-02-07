import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { USER_NAME, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddToCart, BuyItemsDTO, GoeData, LoginDTO, MenuDTO, RegisterDTO, UpdateProfileDTO } from './dto/user.dto';
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
      console.log(userDetails);
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

  async getCoordinatesOfvendors(geoData: GoeData) {
    try {
      console.log(geoData);
      const distnace = Number(geoData.dist) * 1609;
      console.log(distnace);
      const data = await this.vendorModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [geoData.long, geoData.lat],
            },
            distanceField: 'distance',
            maxDistance: distnace,
            spherical: true,
            distanceMultiplier: 0.000621371,
          },
        },
        {
          $lookup: {
            from: "menus",
            localField: "menuList.name",
            foreignField: "_id",
            as: "list"
          }
        }
      ]);
      console.log(data);
      return { success: true, data } ;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async farmers() {
    try {
      return await this.farmerModel.find().populate('menuList.name'); 
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async distributors() {
    try {
      return await this.distributorModel.find().populate('menuList.name'); 
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getMenuItemsOfSeller(id: string, userType: string) {
    try {
      let user: FarmerDocument | DistributorDocument | VendorDocument;
      switch (userType) {
        case "Vendor": {
          user = await this.vendorModel.findById(id).populate('menuList.name');
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findById(id).populate('menuList.name');
          break;
        }
        case "Farmer": {
          user = await this.farmerModel.findById(id).populate('menuList.name');
          break;
        }
      }
      return user.menuList;
    } catch (error) {
      console.log(error)
      throw new HttpException(error, error.status);
    }
  }

  async getMenuItems(id: string, userType: string) {
    try {
      return await this.getMenuItemsOfSeller(id, userType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async findUserCartItems(id: string, userType: string) {
    try {
      let user: DistributorDocument | VendorDocument | CustomerDocument;
      switch (userType) {
        case "Vendor": {
          user = await this.vendorModel.findById(id).populate(['cartItems.seller', 'cartItems.items.groceries']);
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findById(id).populate(['cartItems.seller', 'cartItems.items.groceries']);
          break;
        }
        case "Customer": {
          console.log(userType);
          user = await this.customerModel.findById(id, 'cartItems').populate(['cartItems.seller', 'cartItems.items.groceries']);
          break;
        }
      }
      return user;
    } catch (error) {
      console.log(error)
      throw new HttpException(error, error.status);
    }
  }


  async userCartItems(id: string, userType: string) {
    try {
      return await this.findUserCartItems(id, userType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async addToCart(cartItem: AddToCart, id: string, type?: string) {
    try {
      let user: any;
      if(type === "Vendor") {
        user = await this.vendorModel.findById(id);
      }
      else if(type === "Distributor") {
        user = await this.distributorModel.findById(id);
      }
      else
        user = await this.customerModel.findById(id);
      let flag = 1;
      for (let i = 0; i < user?.cartItems?.length; i++) {
        if (user.cartItems[i].seller.toString() === cartItem.seller.toString()) {
          for (let j = 0; j < user.cartItems[i].items.length; j++) {
            if (user.cartItems[i].items[j].groceries.toString() === cartItem.item.groceries.toString()) {
              user.cartItems[i].items[j].quantity = cartItem.item.quantity;
              user.cartItems[i].items[j].price = cartItem.item.price;
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
          seller: cartItem.seller,
          items: [cartItem.item]
        });
      }
      const userCart = await (await user.save()).populate(['cartItems.seller', 'cartItems.items.groceries']);
      return {
        message: "Added to Cart",
        success: true, data: userCart.cartItems
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async buyGrocery(data: BuyItemsDTO, buyerId: string, sellerType: string, buyerType: string, orderType: string) {
    try {
      let user: DistributorDocument | VendorDocument | FarmerDocument;
      switch (sellerType) {
        case "Vendor": {
          user = await this.vendorModel.findById(data.seller);
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findById(data.seller);
          break;
        }
        case "Farmer": {
          user = await this.farmerModel.findById(data.seller);
          break;
        }
      }
      user.orders.push({
        status: orderType,
        customer: new mongoose.Types.ObjectId(buyerId),
        items: data.items,
      });
      await user.save();
      let buyer: DistributorDocument | VendorDocument | CustomerDocument;
      switch (buyerType) {
        case "Vendor": {
          buyer = await this.vendorModel.findById(buyerId);
          break;
        }
        case "Distributor": {
          buyer = await this.distributorModel.findById(buyerId);
          break;
        }
        case "Customer": {
          buyer = await this.customerModel.findById(buyerId);
          break;
        }
      }
      buyer.ordersPlaced.push({
        status: orderType,
        seller: new mongoose.Types.ObjectId(data.seller),
        items: data.items,
      });
      await buyer.save();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async buyGroceries(items: BuyItemsDTO[], buyerId: string, sellerType: string, buyerType: string, orderType: string) {
    try {
      if(!sellerType) {
        console.log("Hello World---------")
        for (let i = 0; i < items.length; i++) {
          let user: any = await this.userModel.findById(items[i].seller);
          let sellerType = user.userType;
          console.log(user);
          await this.buyGrocery(items[i], buyerId, sellerType, buyerType, orderType);
        }
      }
      else {
        for (let i = 0; i < items.length; i++) {
          await this.buyGrocery(items[i], buyerId, sellerType, buyerType, orderType);
        }
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
      { $unwind: '$orders' },
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
      }, {
        $project: { 'orders.orders': 1, 'orders.customer': 1 }
      },
      {
        $lookup: {
          from: "menus",
          localField: "orders.orders.items.groceries",
          foreignField: "_id",
          as: "orderedItems"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "orders.orders.customer",
          foreignField: "_id",
          as: "buyer"
        }
      },
      {
        $project: { 'buyer.address': 1, 'buyer.phoneNumber': 1, 'buyer.userName': 1, 'buyer._id': 1, orders: 1, 'orderedItems.name': 1, 'orderedItems.imageUrl': 1, 'orderedItems._id': 1 }
      }
      );
    }
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
    for (let i = 0; i < user.length; i++) {
      for (let j = 0; j < user[i].orders.length; j++) {
        for (let k = 0; k < user[i].orders[j].orders.items.length; k++) {
          let id = user[i].orders[j].orders.items[k].groceries;
          for (let l = 0; l < user[i].orderedItems.length; l++) {
            if(id.toString() === user[i].orderedItems[l]._id.toString()) {
              user[i].orders[j].orders.items[k].groceries = user[i].orderedItems[l];
            }
          }
        }
      }
    }
    for (let i = 0; i < user.length; i++) {
      for (let j = 0; j < user[i].orders.length; j++) {
        let id = user[i].orders[j].orders.customer;
        for (let k = 0; k < user[i].buyer.length; k++) {
          if(id.toString() === user[i].buyer[k]._id.toString()) {
            user[i].orders[j].orders.customer = user[i].buyer[k];
          }
        }
      }
    }
    return user;
  }

  async customersOrders(id: string, type: string, orderType?: string) {
    try {
      console.log(id, type)
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

  async emptyCart(id: string, type: string) {
    try {
      let user: CustomerDocument | DistributorDocument | VendorDocument;
      switch (type) {
        case "Vendor": {
          user = await this.vendorModel.findById(id);
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findById(id);
          break;
        }
        case "Customer": {
          user = await this.customerModel.findById(id);
          break;
        }
      };
      user.cartItems = [];
      await user.save();
      return {
        success: true,
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async updateProfile(id: string, type: string, body: UpdateProfileDTO) {
    try {
      let user: CustomerDocument | DistributorDocument | VendorDocument | FarmerDocument;
      switch (type) {
        case "Vendor": {
          user = await this.vendorModel.findByIdAndUpdate(id, body);
          break;
        }
        case "Distributor": {
          user = await this.distributorModel.findByIdAndUpdate(id, body);
          break;
        }
        case "Customer": {
          user = await this.farmerModel.findByIdAndUpdate(id, body);
          break;
        }
        case "Farmer": {
          user = await this.farmerModel.findByIdAndUpdate(id, body);
          break;
        }
      };
      return {
        success: true,
      }
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
