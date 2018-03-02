import { Injectable } from '@angular/core';
import { Set } from './set';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()

export class DatabaseGateway { 
  public set: Set;
  public sets: any;

  constructor(private http: Http) {
    console.log('database gateway working');
  }

  getCollection(){
    return this.http.get('http://localhost:9000/api/sets')
      .map(res => res.json());
  }

  addSet(newSet){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:9000/api/set', JSON.stringify(newSet), {headers: headers})
      .map(res => res.json());
  }

  deleteSet(id){
    return this.http.delete('http://localhost:9000/api/set/' + id)
      .map( res => res.json());
  }

  updateSet(set){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:9000/api/set/' + set._id, JSON.stringify(set), {headers: headers})
      .map(res => res.json());
  }

}