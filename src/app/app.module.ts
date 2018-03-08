import { BrowserModule } from '@angular/platform-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SetEntryPage } from '../pages/set-entry/set-entry';
import { SetDatabasePage } from '../pages/set-database/set-database';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseGateway } from '../providers/database-gateway/database-gateway';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { SuccessModalPage } from '../pages/success-modal/success-modal';
import { BarcodeGateway } from '../providers/barcode-gateway/barcode-gateway';
import { BricksetGateway } from '../providers/brickset-gateway/brickset-gateway';

@NgModule({
  declarations: [
    MyApp,
    SetEntryPage,
    SetDatabasePage,
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
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseGateway,
    BarcodeGateway,
    BricksetGateway,
  ]
})
export class AppModule {}
