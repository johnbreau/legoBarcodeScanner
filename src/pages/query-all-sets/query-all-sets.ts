import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AllSetsDbGateway } from '../../providers/all-sets-db-gateway/all-sets-db-gateway';
// import { Set } from '../../providers/database-gateway/set';

@IonicPage()
@Component({
  selector: 'query-all-sets',
  templateUrl: 'query-all-sets.html',
})
export class QueryAllSetsPage implements OnInit {
  public displaySet: any;
  public setData: any;
  public setFinder: FormGroup;
  public showSection = false;

  constructor (public navCtrl: NavController,
               private formBuilder: FormBuilder,
               public navParams: NavParams,
               public allSetsGateway: AllSetsDbGateway) {
  }

  ngOnInit() {
    this.setFinder = this.formBuilder.group({
            setNumber: [
              '',
              Validators.compose([Validators.required])
            ],
            disabled: [false]
          });
  }

  getAllSetsSet(event){
    let numberOfSet;
        numberOfSet = this.setFinder.get('setNumber').value
    this.allSetsGateway.getOneSet(numberOfSet)
      .subscribe(set => {
        this.setData = (JSON.stringify(set));
        this.displaySet = JSON.parse(this.setData);
        console.log(this.displaySet);
        this.showSection = true;
      })
  }

}

// this.observableJson().subscribe(res => {
//   this.propertyData = res;
//   console.log(JSON.stringify(this.propertyData));
//  });
