import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, HttpException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadItem(@UploadedFile( new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }), // Maximum Size of file can be 1MB
      ]
    }) ) file: Express.Multer.File) {
    try {
      console.log(file);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
