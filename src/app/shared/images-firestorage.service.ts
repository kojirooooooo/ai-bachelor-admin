import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ImagesFirestorageService {
  constructor(private afs: AngularFireStorage) {}

  async uploadOnePhoto(file: string, fileName: string, filePath: string) {
    if (!file) {
      throw new Error('ファイルがありません');
    } else {
      const fullFilePath = filePath + '/' + fileName;
      const ref = this.afs.ref(fullFilePath);
      const task = ref.putString(file, 'data_url');
      const snapshot = await task;
      const url = await snapshot.ref.getDownloadURL();
      return url;
    }
  }

  //既存の写真を削除する
  deletePhoto(fileName: string, filePath: string) {
    const fullFilePath = filePath + '/' + fileName;
    this.afs.ref(fullFilePath).delete();
  }
}
