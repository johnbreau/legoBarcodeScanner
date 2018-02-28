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
 
  addSet() { 
    this.appId = 'legobarcodescanner-eeybg';
    console.log('get set!')
    const clientPromise = StitchClientFactory.create(this.appId);
    
    clientPromise.then(client => {
      const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
      const sets = db.collection('sets');
      client.login().then(() =>
        db.collection('sets').insertOne({
          owner_id: client.authedId(),
          setNumber:'4200',
          setName: 'Galaxy Explorer',
          setYear: '1989',
          setPieces: 3000,
          setLocation: 'Bin H',
          barcodeValue: '15678883939'})
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

  // addSet() {
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json'); 
  //   this.http.post('http://localhost:8080/api/reviews', JSON.stringify(set))
  //     .subscribe(res => {
  //       console.log(res);
  //     });
  // }

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

// getSet() { 
//   this.appId = 'legobarcodescanner-eeybg';
//   console.log('get set!')
//   const clientPromise = StitchClientFactory.create(this.appId);
  
//   clientPromise.then(client => {
//     const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
//     const sets = db.collection('sets');
//     client.login().then(()=>
//       db.collection('sets').find({owner_id: client.authedId()}).limit(100).execute()
//     ).then(docs => {
//       console.log("Found docs", docs)
//       console.log("[MongoDB Stitch] Connected to Stitch")
//     }).catch(err => {
//       console.error(err)
//     });
//   });
// }


// addSet() { 
//   this.appId = 'legobarcodescanner-eeybg';
//   console.log('get set!')
//   const clientPromise = StitchClientFactory.create(this.appId);
  
//   clientPromise.then(client => {
//     const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
//     const sets = db.collection('sets');
//     client.login().then(() =>
//       db.collection('sets').updateOne(
//         {setName: 'Galaxy Explorer',
//          setNumber: '908',
//          setPieces: 400,
//          setYear: '1979',
//          setTheme: 'Space',
//          setLocation: 'Bin G',
//          barcodeValue: '123789982399130' })
//       )
//       .then(()=>
//         db.collection('sets').find({owner_id: client.authedId()}).limit(100).execute()
//       )
//       .then(docs => {
//         console.log("Found docs", docs)
//         console.log("[MongoDB Stitch] Connected to Stitch")
//       }).catch(err => {
//         console.error(err)
//     });
//   });
// }

// getSet() { 
//   this.appId = 'legobarcodescanner-eeybg';
//   console.log('get set!')
//   const clientPromise = StitchClientFactory.create(this.appId);
  
//   clientPromise.then(client => {
//     const db = client.service('mongodb', 'mongodb-atlas').db('legoSetDb');
//     const sets = db.collection('sets');
//     client.login().then(() =>
//       // db.collection('sets').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
//       db.collection('sets').insertOne(
//        {setName: 'Galaxy Explorer',
//         owner_id: client.authedId(),
//         setNumber: '908',
//         setPieces: 400,
//         setYear: '1979',
//         setTheme: 'Space',
//         setLocation: 'Bin G',
//         barcodeValue: '123789982399130' }
//       )
//     ).then(()=>
//       db.collection('sets')
//       .then(docs => {
//       console.log("Found docs", docs)
//       console.log("[MongoDB Stitch] Connected to Stitch")
//     }).catch(err => {
//       console.error(err)
//     })
//   )
// })
// }
