import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'set-database',
  templateUrl: 'set-database.html',
})
export class SetDatabasePage implements OnInit {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbGateway: DatabaseGateway) {
  }

  ngOnInit() {
    this.dbGateway.getCollection();
  }

}
