import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';
import { BarcodeGateway } from '../../providers/barcode-gateway/barcode-gateway';
import { ModalController } from 'ionic-angular';
import { SuccessModalPage } from '../success-modal/success-modal';
import { Set } from '../../providers/database-gateway/set';

@IonicPage()
@Component({
  selector: 'set-entry',
  templateUrl: 'set-entry.html',
})
export class SetEntryPage implements OnInit {
  public scanData : {};
  public options :BarcodeScannerOptions;
  public setForm: FormGroup;
  public barcodeValue: any;
  public scanFailed = false;
  public displayFormSuccess = false;
  public sets: Set[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public dbGateway: DatabaseGateway,
              public barcodeGateway: BarcodeGateway,
              public modalCtrl: ModalController,
              private barcodeScanner: BarcodeScanner) {
      this.dbGateway.getCollection()
      .subscribe(sets => {
        this.sets = sets;
      });
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
      // barcodeValue: this.barcodeValue,
      disabled: [false]
    });
  }

  addSet(event) {
    let newSet;
    newSet = {setName: this.setForm.get('setName').value,
            setNumber : this.setForm.get('setNumber').value,
            setPieces : this.setForm.get('setPieces').value,
            setYear : this.setForm.get('setYear').value,
            setTheme : this.setForm.get('setTheme').value,
            setLocation: this.setForm.get('storageLocation').value,
            // barcodeValue: this.barcodeGateway.getBarcodeData(this.barcodeValue),
    }
    this.dbGateway.addSet(newSet)
      .subscribe(set => {
        this.sets.push(set)
        this.displayFormSuccess = true;
        this.setForm.reset();
      })
  }

  scanButton() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.barcodeValue = barcodeData;
      console.log('barcode value', this.barcodeValue);
      this.barcodeGateway.getBarcodeData(this.barcodeValue)
      .map(res => res.json())
      .subscribe(set => {
          console.log(set);
      })
     }, (err) => {
      this.scanFailed = true;
     });
  }

  openModal() {
    let myModal = this.modalCtrl.create(SuccessModalPage);
    myModal.present();
  }

  closeBanner() {
    if (this.displayFormSuccess === true) {
      this.displayFormSuccess = false;
    } else {
      this.displayFormSuccess  = false;
    }
  }
}