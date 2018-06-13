import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()
export class AllSetsDbGateway {

  constructor(private http: Http) {
  }

  getAllSets = () => {
    let headers = { headers: new Headers({ 'Content-Type': 'application/json' }) }; 		
    let apiUrl: string = 'https://api.mlab.com/api/1/databases/lego-barcode-scanner/collections/allSetDatabase?f={"number": 1, "name": 1, "year":1}&l=200000&apiKey=0ICZTbnaNJoaKZDCnIl-NIZZ-Jd8_TmB';
    return this.http.get(apiUrl, headers)
      .map(response => response.json());
  }

}