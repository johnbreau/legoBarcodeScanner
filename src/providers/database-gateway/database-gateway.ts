import { Injectable } from '@angular/core';
import { Set } from './set';
import { FormsModule } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()

export class DatabaseGateway { 
  public set: Set;
  public sets: any;
  constructor(public http: Http) {
   }

   getCollection() {
    this.http.get('http://localhost:9000/get-collection')
     .map((res: Response) => res.json())
     .subscribe((res: any) => {
       this.sets = res;
       console.log('get collection sets', this.sets);
     });
  } 

  addSet(value) { 
    this.set = new Set(value.name, value.email, value.age);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (value) {
      // this.sets.push(this.set);
      console.log('add set sets', this.sets);
    }
    this.http.post('http://localhost:3000/add-set',
      JSON.stringify(this.set), { headers: headers })
      .subscribe(err => console.log(err));
  }
}