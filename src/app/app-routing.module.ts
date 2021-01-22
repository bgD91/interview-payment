import {NgModule} from '@angular/core';
import {PaymentCreateComponent} from './payment/payment-create/payment-create.component';
import {PaymentListComponent} from './payment/payment-list/payment-list.component';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: PaymentListComponent
  },
  {
    path: 'create',
    component: PaymentCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:postId',
    component: PaymentCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(module => module.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
