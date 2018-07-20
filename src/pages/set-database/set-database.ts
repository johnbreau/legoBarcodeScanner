import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';
import { BarcodeGateway } from '../../providers/barcode-gateway/barcode-gateway';
import { Set } from '../../providers/database-gateway/set';

@IonicPage()
@Component({
  selector: 'set-database',
  templateUrl: 'set-database.html',
})
export class SetDatabasePage implements OnInit {
  public sets: Set[]; 
  public barcode = '6009705662678';
  public barcodeReturn: any;
  public displaySet: any;
  public setData: any;

  constructor (public navCtrl: NavController,
    public navParams: NavParams,
    public dbGateway: DatabaseGateway,
    public barcodeGateway: BarcodeGateway,) {
      this.dbGateway.getCollection()
      .subscribe(sets => {
        this.setData = (JSON.stringify(sets));
        this.displaySet = JSON.parse(this.setData);
      });
      this.barcodeGateway.getBarcodeData(this.barcode)
      .subscribe(barcodeObject => {
        this.barcodeReturn = barcodeObject;
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
  //

  ngOnInit() {
    // this.dbGateway.getCollection();
  }

}
