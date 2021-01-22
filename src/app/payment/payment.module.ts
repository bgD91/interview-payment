import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {PaymentCreateComponent} from "./payment-create/payment-create.component";
import {PaymentListComponent} from "./payment-list/payment-list.component";
import {AngularMaterialModule} from "../angular-material.module";
import {NumbersOnly} from "../../directives/numbers-only.directive";

@NgModule({
    declarations: [
        PaymentCreateComponent,
        PaymentListComponent,
        NumbersOnly
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        FormsModule,
    ]
})
export class PaymentModule {
}
