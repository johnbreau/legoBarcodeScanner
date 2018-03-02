import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';
import { Set } from '../../providers/database-gateway/set';

@IonicPage()
@Component({
  selector: 'set-database',
  templateUrl: 'set-database.html',
})
export class SetDatabasePage implements OnInit {
  public sets: Set[]; 

  constructor (public navCtrl: NavController, public navParams: NavParams, public dbGateway: DatabaseGateway) {
      this.dbGateway.getCollection()
        .subscribe(sets => {
          this.sets = sets;
        });
  }

  deleteSet(id){
    var sets = this.sets;
    this.dbGateway.deleteSet(id)
      .subscribe(data => {
        if (data.n === 1) {
          for (var i = 0; i < sets.length; i++){
            if (sets[i]._id == id){
              sets.splice(i, 1);
            }
          }
        }
      })
    }

  // To be finished - requires some UX work...
  // updateSet(set){
  //   var _set = {
  //     _id: set._id,
  //     setName: set.setName,
  //     setNumber: set.setNumber,
  //     setPieces: set.setPieces,
  //     setYear: set.setYear,
  //     setTheme: set.setTheme,
  //     setLocation: set.setLocation
  //   }
  //   this.dbGateway.updateSet(_set)
  //   .subscribe( data => {
  //     console.log(data;)
  //   }
  // }

  ngOnInit() {
    // this.dbGateway.getCollection();
  }

}
