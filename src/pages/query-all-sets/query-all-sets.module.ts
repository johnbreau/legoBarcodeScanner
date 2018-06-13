import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QueryAllSetsPage } from './query-all-sets';

@NgModule({
  declarations: [
    QueryAllSetsPage,
  ],
  imports: [
    IonicPageModule.forChild(QueryAllSetsPage),
  ],
})
export class QueryAllSetsModule {}
