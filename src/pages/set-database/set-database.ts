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

  ngOnInit() {
    // this.dbGateway.getCollection();
  }

}
