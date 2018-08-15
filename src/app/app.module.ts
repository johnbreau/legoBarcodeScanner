import { BrowserModule } from '@angular/platform-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SetEntryPage } from '../pages/set-entry/set-entry';
import { SetDatabasePage } from '../pages/set-database/set-database';
import { QueryMyCollectionPage } from '../pages/query-my-collection/query-my-collection';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseGateway } from '../providers/database-gateway/database-gateway';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { SuccessModalPage } from '../pages/success-modal/success-modal';
import { BarcodeGateway } from '../providers/barcode-gateway/barcode-gateway';
import { BricksetGateway } from '../providers/brickset-gateway/brickset-gateway';
import { AllSetsDbGateway } from '../providers/all-sets-db-gateway/all-sets-db-gateway';

@NgModule({
  declarations: [
    MyApp,
    SetEntryPage,
    SetDatabasePage,
    QueryMyCollectionPage,
    SuccessModalPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SetDatabasePage,
    SetEntryPage,
    SuccessModalPage,
    QueryMyCollectionPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseGateway,
    BarcodeGateway,
    BricksetGateway,
    AllSetsDbGateway,
  ]
})
export class AppModule {}
