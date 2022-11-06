import { Injectable } from '@angular/core';
import axios from 'axios';
import { URL_UPLOAD_IMAGE } from '../urls';
@Injectable({
  providedIn: 'root',
})
export class UnloadPhotoService {
  constructor() {}
  async unload(fileImg: any) {
    let formData: FormData = new FormData();
    formData.append('file', fileImg);

    return axios.post(`${URL_UPLOAD_IMAGE}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
