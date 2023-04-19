import { Controller, Get, Post, Body, HttpException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDTO, RegisterDTO, AddToCart, BuyItemsDTO, MenuDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDetails: RegisterDTO) {
    try {
      return await this.userService.createUser(userDetails);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('login')
  async login(@Body() userDetails: LoginDTO) {
    try {
      return await this.userService.loginUser(userDetails);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('farmers')
  async farmers() {
    try {
      return await this.userService.farmers();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('distributors')
  async distributors() {
    try {
      return await this.userService.distributors();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
  
  @Post('addToCart')
  async addToCart(@Query('id') id: string, @Body() cart: AddToCart) {
    try {
      return await this.userService.addToCart(cart, id);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('buy/items')
  async buyGrocery(@Body() data: BuyItemsDTO[], @Query('buyerId') buyerId: string, @Query('sellerType') sellerType: string, @Query('orderType') orderType: string) {
    try {
      return await this.userService.buyGroceries(data, buyerId, sellerType, orderType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('update/menu')
  async updateMenu(@Body() menu: MenuDTO[], @Query('id') id: string, @Query('type') type: string) {
    try {
      return await this.userService.updateMenu(menu, id, type);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('customers/orders')
  async customersOrder(@Query('id') id: string, @Query('type') type: string, @Query('orderType') orderType: string) {
    try {
      return await this.userService.customersOrders(id, type, orderType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('your/orders')
  async yourOrders(@Query('id') id: string, @Query('type') type: string, @Query('orderType') orderType: string) {
    try {
      return await this.userService.orders(id, type, orderType);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
