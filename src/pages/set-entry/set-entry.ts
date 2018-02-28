import { Component, OnInit } from '@angular/core';
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
export class SetEntryPage implements OnInit {
  public setForm: FormGroup;
  // public barcodeValue: any;
  public displayFormSuccess = false;
  public scanFailed = false;

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
      barcodeValue: '',
      disabled: [false]
    });
  }

  addSet() {
    let data;
    data = {setName: this.setForm.get('setName').value,
            setNumber : this.setForm.get('setNumber').value,
            setPieces : this.setForm.get('setPieces').value,
            setYear : this.setForm.get('setYear').value,
            setTheme : this.setForm.get('setTheme').value,
            setLocation: this.setForm.get('storageLocation').value,
            barcodeValue: this.setForm.get('barcodeValue').value,
    }
    this.dbGateway.addSet(data);
    this.displayFormSuccess = true;
    this.setForm.reset();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetEntryPage');
  }

  scanButton() {
    this.barcodeScanner.scan().then((barcodeData) => {
      // this.barcodeValue = barcodeData;
      console.log(barcodeData)
     }, (err) => {
      this.scanFailed = true;
     });
  }
}