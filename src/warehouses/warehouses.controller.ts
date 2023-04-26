import { Controller, Get, Post, Body, Query, HttpException } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Payment, WareHouseDTO } from './dto/warehouse.dto';

@Controller('warehouse')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  async getLocations() {
    try {
      return await this.warehousesService.getLocations();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post()
  async addLocation(@Body() location: WareHouseDTO) {
    try {
      return await this.warehousesService.getMapLocations();;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post('pay')
  async pay(@Body() body: any) {
    return await this.warehousesService.pay(body);
  }

  @Get('state/locations')
  async getLocationsByState(@Query('state') state: string) {
    try {
      return await this.warehousesService.getLocationByState(state);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('state')
  async getStatesOfWarehouses() {
    try {
      return await this.warehousesService.getStatesOfWarehouses();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
