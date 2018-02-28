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

  getCollection() { 
    this.appId = 'legobarcodescanner-eeybg';
    console.log('get set!')
    const clientPromise = StitchClientFactory.create(this.appId);
    
    clientPromise.then(client => {
      const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
      const sets = db.collection('sets');
      client.login().then(()=>
        db.collection('sets').find({owner_id: client.authedId()}).limit(100).execute()
      ).then(docs => {
        console.log("Found docs", docs)
        console.log("[MongoDB Stitch] Connected to Stitch")
      }).catch(err => {
        console.error(err)
      });
    });
  }
 
  addSet(set) { 
    this.appId = 'legobarcodescanner-eeybg';
    console.log('get set!')
    const clientPromise = StitchClientFactory.create(this.appId);
    
    clientPromise.then(client => {
      const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
      const sets = db.collection('sets');
      client.login().then(() =>
        db.collection('sets').insertOne({
          owner_id: client.authedId(),
          setNumber: set.setNumber,
          setName: set.setName,
          setYear: set.setYear,
          setPieces: set.setPieces,
          setLocation: set.setLocation,
          barcodeValue: set.barcodeValue})
      ).then(()=>
        db.collection('sets').find({owner_id: client.authedId()}).limit(100).execute()
      ).then(docs => {
        console.log("Found docs", docs)
        console.log("[MongoDB Stitch] Connected to Stitch")
      }).catch(err => {
        console.error(err)
      });
    });
  }

  findSet(set) {
    this.appId = 'legobarcodescanner-eeybg';
    const clientPromise = StitchClientFactory.create(this.appId);
    clientPromise.then(client => {
    const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
    const sets = db.collection('sets');
    const getTerms = () => {
      db.collection("sets").find({owner_id: client.authedId()})
        .then(result => {
          console.log()
        })
        .catch(err => {
          // .. do some error handling
        });
      }
    })
  }
 
  deleteSet(id) { 
    this.http.delete('http://localhost:8080/api/reviews/' + id).subscribe((res) => {
      console.log(res);
    });    
  }
 
}