import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
export class ApiService {
  // public url = 'https://dummyjson.com/products';
  public http: HttpClient = inject(HttpClient);

  public urlEmitter = new Subject();

  constructor() {}
  urlDataStore;

  public chUrl = '';

  get(UrlData: any) {
    console.log(UrlData);
    if (this.urlDataStore != UrlData) {
      this.urlDataStore = UrlData;
      console.log(UrlData.ApiUrl);

      this.http.get(UrlData?.ApiUrl).subscribe((res) => {
        const resObj = {
          res: res,
          UrlKey: UrlData.ApiId,
        };
        console.log(resObj);
        //  resObj;
        this.urlEmitter.next(resObj);
      });
    }
  }
}
