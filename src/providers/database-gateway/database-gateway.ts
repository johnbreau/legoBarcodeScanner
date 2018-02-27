// mongodb+srv://legoSetAdmin:dbpassword71Xp!@legosetdb-uwnjt.mongodb.net/test

import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { StitchClientFactory } from 'mongodb-stitch';
import 'rxjs/add/operator/map';
 
@Injectable()
export class DatabaseGateway{
  private appId: string;
  data: any;
 
  constructor(public http: HttpClient) {
  }
 
  getSet() { 
    this.appId = 'legobarcodescanner-eeybg';
    console.log('get set!')
    const clientPromise = StitchClientFactory.create(this.appId);
    clientPromise.then(client => {
      const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
      client.login().then(() =>
        db.collection('sets').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
      ).then(()=>
        db.collection('sets').find({owner_id: client.authedId()}).limit(100).execute()
      ).then(docs => {
        console.log("Found docs", docs)
        console.log("[MongoDB Stitch] Connected to Stitch")
      }).catch(err => {
        console.error(err)
      });
    });
    // if (this.data) {
    //   return Promise.resolve(this.data);
    // }
    // return new Promise(resolve => { 
    //   this.http.get('http://localhost:8080/api/reviews')
    //     .map(res => res)
    //     .subscribe(data => {
    //       this.data = data;
    //       resolve(this.data);
    //     });
    // }); 
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