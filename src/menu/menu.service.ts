import { Injectable } from '@nestjs/common';
import cloudinary from 'cloudinary'

@Injectable()
export class MenuService {
  async uploadImageInClodinary(file: string) {
    let image = cloudinary.v2.uploader.upload(file, {
      folder: 'Menu'
    })
  }
}
