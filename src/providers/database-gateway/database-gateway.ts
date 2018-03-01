// mongodb+srv://legoSetAdmin:dbpassword71Xp!@legosetdb-uwnjt.mongodb.net/test

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Injectable()
export class DatabaseGateway {
  data: any;
  
  constructor(public http: Http){
    this.data = null;
  }
 
  getCollection() {
    if (this.data) {
      return Promise.resolve(this.data);
    } 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:9000/api/collection')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

}


//original gateway...
// private appId: string;
//   public addSetSuccess: boolean;
//   public sets: any;
//   data: any;
 
//   constructor(public http: HttpClient) {
//     this.appId = 'legobarcodescanner-eeybg';
//   }

//   getCollection() {
//     const clientPromise = StitchClientFactory.create(this.appId);
//     clientPromise.then(client => {
//       const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
//       const sets = db.collection('sets');
//       client.login().then(()=>
//         db.collection('sets').find({owner_id: client.authedId()}).limit(1000).execute()
//       ).then(result => {
//         this.sets = result;
//         console.log("Found docs", result)
//       }).catch(err => {
//         console.error(err)
//       });
//     });
//   }
 
//   addSet(set) { 
//     const clientPromise = StitchClientFactory.create(this.appId);  
//     clientPromise.then(client => {
//       const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
//       const sets = db.collection('sets');
//       console.log('sets', sets);
//       client.login().then(() =>
//         db.collection('sets').insertOne({
//           owner_id: client.authedId(),
//           setNumber: set.setNumber,
//           setName: set.setName,
//           setYear: set.setYear,
//           setPieces: set.setPieces,
//           setLocation: set.setLocation,
//           barcodeValue: set.barcodeValue})
//       ).then(()=>
//         db.collection('sets').find({owner_id: client.authedId()}).limit(100).execute()
//       ).then(success => {
//         console.log(success);
//         this.addSetSuccess = true;
//       }).catch(err => {
//         console.error(err)
//       });
//     });
//   }

//   findSet(set) {
//     const clientPromise = StitchClientFactory.create(this.appId);
//     clientPromise.then(client => {
//     const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
//     const sets = db.collection('sets');
//     const getTerms = () => {
//       db.collection("sets").find({owner_id: client.authedId()})
//         .then(result => {
//           console.log()
//         })
//         .catch(err => {
//           // .. do some error handling
//         });
//       }
//     })
//   }
 
//   deleteSet(id) { 
//     this.http.delete('http://localhost:8080/api/reviews/' + id).subscribe((res) => {
//       console.log(res);
//     });    
//   }