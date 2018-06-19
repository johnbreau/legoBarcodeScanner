import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseGateway } from '../../providers/database-gateway/database-gateway';
import { BarcodeGateway } from '../../providers/barcode-gateway/barcode-gateway';
import { AllSetsDbGateway } from '../../providers/all-sets-db-gateway/all-sets-db-gateway';
import { BricksetGateway } from '../../providers/brickset-gateway/brickset-gateway';
import { ModalController } from 'ionic-angular';
import { SuccessModalPage } from '../success-modal/success-modal';
import { Set } from '../../providers/database-gateway/set';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'set-entry',
  templateUrl: 'set-entry.html',
})
export class SetEntryPage implements OnInit {
  public scanData : {};
  public options :BarcodeScannerOptions;
  public setForm: FormGroup;
  public findSetForm: FormGroup;
  public barcodeScannerValue: string;
  public scanFailed = false;
  public displayFormSuccess = false;
  public fromUPCDatabase: Observable<any>;
  public barcodeReturn: any;
  public sets: Set[];
  public displaySet: any;
  public setData: any;
  public showSection = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public dbGateway: DatabaseGateway,
              public barcodeGateway: BarcodeGateway,
              public bricksetGateway: BricksetGateway,
              public allSetsGateway: AllSetsDbGateway,
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
      // barcodeValue: this.barcodeValue,
      disabled: [false]
    });

    this.findSetForm = this.formBuilder.group({
      findSetFormNumber: [
        '',
        Validators.compose([Validators.required])
      ]
    });
  }

  findSetByNumber() {
    let inputNumber;
    inputNumber = {
      findSetFormNumber: this.findSetForm.get('findSetFormNumber').value,
    }
    this.allSetsGateway.getOneSet(inputNumber.findSetFormNumber)
      .subscribe(set => {
        this.setForm.controls['setName'].setValue(set.name);
        this.setForm.controls['setNumber'].setValue(set.number);
        this.setForm.controls['setPieces'].setValue(set.pieces);
        this.setForm.controls['setYear'].setValue(set.year);
        this.setForm.controls['setTheme'].setValue(set.theme);
      })
  }

  addSet() {
    let newSet;
    newSet = {setName: this.setForm.get('setName').value,
            setNumber : this.setForm.get('setNumber').value,
            setPieces : this.setForm.get('setPieces').value,
            setYear : this.setForm.get('setYear').value,
            setTheme : this.setForm.get('setTheme').value,
            setLocation: this.setForm.get('storageLocation').value,
            // barcodeValue: this.barcodeGateway.getBarcodeData(this.barcodeValue),
    }
    this.dbGateway.addToCollection(newSet)
      .subscribe(set => {
        this.displayFormSuccess = true;
        this.setForm.reset();
      })
  }

  bricksetTester(){
    this.bricksetGateway.bricketGetSet();
    console.log('bs test');
  }

  scanButton(){
    this.barcodeScanner.scan()
      .then((barcodeData) => {
        this.barcodeGateway.getBarcodeData(barcodeData.text)
      .subscribe(barcodeObject => {
        this.barcodeReturn = barcodeObject;
        this.setForm.controls['setName'].setValue(barcodeObject.items[0].title);
        this.setForm.controls['setNumber'].setValue(barcodeObject.items[0].ean);
        this.setForm.controls['setPieces'].setValue(barcodeObject.items[0].title);
        this.setForm.controls['setYear'].setValue(barcodeObject.items[0].title);
        this.setForm.controls['setTheme'].setValue(barcodeObject.items[0].title);
        this.setForm.controls['setLocation'].setValue(barcodeObject.items[0].title);
      });
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