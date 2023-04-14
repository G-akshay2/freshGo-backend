import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';
import { Cloudinary_Upload } from './interfaces/cloudinary.interface';
import { InjectModel } from '@nestjs/mongoose';
import { MENU_NAME, MenuDocument } from './schema/menu.schema';
import { Model } from 'mongoose';
import { ItemDTO } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MENU_NAME) private readonly menuModel: Model<MenuDocument>,
    private configService: ConfigService,
  ) {
    v2.config(this.configService.get('cloudinary'));
  }

  async uploadImageInClodinary(file: Express.Multer.File) {
    const upload_details: Cloudinary_Upload = await new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      Readable.from(file.buffer).pipe(upload);
    });
    return {
      url: upload_details.url,
      secureUrl: upload_details.secure_url,
      imageHeight: upload_details.height,
      imageWidth: upload_details.width,
      publicId: upload_details.public_id,
    };
  }

  async createItem(item: ItemDTO, file: Express.Multer.File) {
    try {
      const image = await this.uploadImageInClodinary(file);
      item.metadata = {}
      item.metadata.width = image.imageHeight;
      item.metadata.height = image.imageWidth;
      item.imageUrl = image.secureUrl;
      const menuItem = await this.menuModel.create(item);
      return menuItem.save();
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors);
      }
      throw new HttpException(error.errors, error.status);
    }
  }

  async getMenu() {
    try {
      return await this.menuModel.find();
    } catch (error) {
      throw new NotFoundException("Menu Not Found");
    }
  }

  async updateItemById(item: ItemDTO, id: string) {
    try {
      return await this.menuModel.findByIdAndUpdate(id, item);
    } catch (error) {
      throw new HttpException(error.errors, error.status);
    }
  }

  async editItemImage(file: Express.Multer.File, id: string) {
    try {
      const image = await this.uploadImageInClodinary(file);
      let item = {
        metadata: {
          width: image.imageHeight,
          height: image.imageWidth,
        },
        imageUrl:  image.secureUrl,
      }
      return await this.menuModel.findByIdAndUpdate(id, item);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
