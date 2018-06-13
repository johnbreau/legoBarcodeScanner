import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AllSetsDbGateway } from '../../providers/all-sets-db-gateway/all-sets-db-gateway';
import { Set } from '../../providers/database-gateway/set';

@IonicPage()
@Component({
  selector: 'query-all-sets',
  templateUrl: 'query-all-sets.html',
})
export class QueryAllSetsPage implements OnInit {
  public sets: Set[]; 

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public allSetsGateway: AllSetsDbGateway) {
      this.allSetsGateway.getAllSets()
        .subscribe(sets => {
          this.sets = sets;
        });
  }

  ngOnInit() {
    // this.dbGateway.getCollection();
  }

}
