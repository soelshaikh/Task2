import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';

export class ApiService {
  public http: HttpClient = inject(HttpClient);

  get(Url: any) {
    return this.http.get(Url);
  }
}
