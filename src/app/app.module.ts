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

@NgModule({
  declarations: [
    MyApp,
    SetEntryPage,
    SetDatabasePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SetDatabasePage,
    SetEntryPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseGateway
  ]
})
export class AppModule {}
