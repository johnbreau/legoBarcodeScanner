import { Component, OnInit, OnChanges } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Set } from '../setInterface';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';

@IonicPage()
@Component({
  selector: 'set-entry',
  templateUrl: 'set-entry.html',
})
export class SetEntryPage implements OnInit, OnChanges {
  public setForm: FormGroup;
  public DBOpenRequest: any;
  public db: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public dbGateway: DatabaseGateway,
              private barcodeScanner: BarcodeScanner) {
  }

  ngOnInit() {
    this.setForm = this.formBuilder.group({
      setName: [
        '',
        Validators.compose([Validators.required])
      ],
      setNumber: [
        '',
        Validators.compose([Validators.required])
      ],
      setPieces: '',
      setYear: '',
      setTheme: '',
      storageLocation: '',
      disabled: [false]
    });
  }

  ngOnChanges() {
    this.db = this.DBOpenRequest.result;

    const objectStore = this.db.createObjectStore('setDatabase', { keyPath: 'setName' });
          objectStore.createIndex('setName', 'setName', { unique: false });
          objectStore.createIndex('setNnumber', 'setNnumber', { unique: true });
          objectStore.createIndex('setPieces', 'setPieces', { unique: false });
          objectStore.createIndex('setYear', 'setYear', { unique: false });
          objectStore.createIndex('setTheme', 'setTheme', { unique: false });
          objectStore.createIndex('storageLocation', 'storageLocation', { unique: false });
  }

  addSet(){
    this.dbGateway.addSet();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetEntryPage');
  }

  scanButton() {
    console.log('scan initiated');
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log(barcodeData);
     }, (err) => {
         // An error occurred
     });
  }
}