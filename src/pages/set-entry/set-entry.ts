import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';
import { ModalController } from 'ionic-angular';
import { SuccessModalPage } from '../success-modal/success-modal';

@IonicPage()
@Component({
  selector: 'set-entry',
  templateUrl: 'set-entry.html',
})
export class SetEntryPage implements OnInit {
  public setForm: FormGroup;
  public barcodeValue: any;
  public scanFailed = false;
  public displayFormSuccess = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public dbGateway: DatabaseGateway,
              public modalCtrl: ModalController,
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
      barcodeValue: this.barcodeValue,
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

  scanButton() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.barcodeValue = barcodeData;
      console.log(barcodeData)
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