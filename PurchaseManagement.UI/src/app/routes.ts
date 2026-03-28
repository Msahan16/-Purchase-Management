import { Routes } from '@angular/router';
import { PurchaseListComponent } from './modules/purchase/purchase-list.component';
import { PurchaseFormComponent } from './modules/purchase/purchase-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/purchase-list', pathMatch: 'full' },
  { path: 'purchase-list', component: PurchaseListComponent },
  { path: 'purchase-add', component: PurchaseFormComponent },
  { path: 'purchase-edit/:id', component: PurchaseFormComponent },
];
