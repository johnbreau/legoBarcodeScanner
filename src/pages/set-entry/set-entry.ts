import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';
import { BarcodeGateway } from '../../providers/barcode-gateway/barcode-gateway';
import { ModalController } from 'ionic-angular';
import { SuccessModalPage } from '../success-modal/success-modal';
import { Set } from '../../providers/database-gateway/set';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@IonicPage()
@Component({
  selector: 'set-entry',
  templateUrl: 'set-entry.html',
})
export class SetEntryPage implements OnInit {
  public scanData : {};
  public options :BarcodeScannerOptions;
  public setForm: FormGroup;
  public barcodeScannerValue: {};
  public dummyValue: any;
  public scanFailed = false;
  public displayFormSuccess = false;
  public fromUPCDatabase: Observable<any>;
  public barcodeReturn: any;
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

  // scanButton() {
  //   this.barcodeScanner.scan()
  //     .then((barcodeData) => {
  //     this.barcodeScannerValue = barcodeData;
  //     console.log('barcode value', this.barcodeScannerValue);
  //     this.barcodeGateway.getBarcodeData(this.barcodeScannerValue)
  //     .map(res => res.json())
  //     .subscribe(set => {
  //         console.log(set);
  //     })
  //    }, (err) => {
  //     this.scanFailed = true;
  //    });
  // }

  scanButton(){
    this.barcodeScanner.scan().then((barcodeData) => {
      this.barcodeScannerValue = barcodeData
    });
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log('scanned UPC', barcodeData);
      this.barcodeScannerValue = barcodeData;
      console.log('value', this.barcodeScannerValue)
     }, (err) => {
      console.log('a scannning error occurred');
     });
    // this.fromUPCDatabase = Observable.combineLatest(
    //   this.barcodeScannerValue,
    //   this.dummyValue,
    //   (scannerValue, dummyValue) => {
    //     this.barcodeGateway.getBarcodeData(scannerValue)
    //     .subscribe(barcodeObject => {
    //       this.barcodeReturn = barcodeObject;
    //     });
    //   }
    // );
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