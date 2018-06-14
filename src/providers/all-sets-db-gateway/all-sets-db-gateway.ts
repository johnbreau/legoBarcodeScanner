import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()
export class AllSetsDbGateway {

  constructor(private http: Http) {
    console.log('all sets db working');
  }
  
  getAllSets() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');		
    return this.http.get('https://api.mlab.com/api/1/databases/lego-barcode-scanner/collections/allSetDatabase?f={"number": 1, "name": 1, "year":1}&l=200000&apiKey=0ICZTbnaNJoaKZDCnIl-NIZZ-Jd8_TmB')
      .map(response => response.json());
  }

  getOneSet(setNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');	 		
    return this.http.get('https://api.mlab.com/api/1/databases/lego-barcode-scanner/collections/allSetDatabase?q={"number":"' + setNumber + '"}&fo=true&apiKey=0ICZTbnaNJoaKZDCnIl-NIZZ-Jd8_TmB')
      .map(response => response.json());
  }

}