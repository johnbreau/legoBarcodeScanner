// mongodb+srv://legoSetAdmin:dbpassword71Xp!@legosetdb-uwnjt.mongodb.net/test


import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class DatabaseGateway{
 
  data: any;
 
  constructor(public http: HttpClient) {
    this.data = null;
    console.log('Hello DatabaseGatewayProvider Provider');
  }
 
  getSet() { 
    console.log('get set!')
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => { 
      this.http.get('http://localhost:8080/api/reviews')
        .map(res => res)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    }); 
  }
 
  addSet(set) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json'); 
    this.http.post('http://localhost:8080/api/reviews', JSON.stringify(set))
      .subscribe(res => {
        console.log(res);
      });
  }
 
  deleteSet(id) { 
    this.http.delete('http://localhost:8080/api/reviews/' + id).subscribe((res) => {
      console.log(res);
    });    
  }
 
}