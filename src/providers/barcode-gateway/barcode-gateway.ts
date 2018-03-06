import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()
export class BarcodeGateway {

  constructor(private http: Http) {
  }

  getBarcodeData = (barcode: string) => {
    let headers = { headers: new Headers({ 'Content-Type': 'application/json' }) }; 		
    let apiUrl: string = 'https://api.upcitemdb.com/prod/trial/lookup?upc='+ barcode;
    return this.http.get(apiUrl, headers)
      .map(response => response.json());
  }

}