import { 
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpException,
  Req, 
  Put,
  Query,
  Get
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async getMenu() {
    try {
      return await this.menuService.getMenu();
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadItem(@UploadedFile( new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }), // Maximum Size of file can be 1MB
      ]
    }) ) file: Express.Multer.File, @Req() req: Request) {
    try {
      return await this.menuService.createItem(req.body, file);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Put('update')
  async updateItemById(@Req() req: Request, @Query('id') id: string) {
    try {
      return await this.menuService.updateItemById(req.body, id)
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Put('edit/item/image')
  @UseInterceptors(FileInterceptor('file'))
  async editItemImage(@UploadedFile( new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000000 }), // Maximum Size of file can be 1MB
    ]
  }) ) file: Express.Multer.File, @Query('id') id: string) {
    try {
      return await this.menuService.editItemImage(file, id);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
