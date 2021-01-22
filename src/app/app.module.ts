import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';

import {AuthInterceptor} from './auth/auth-interceptor';

import {ErrorInterceptor} from './error-interceptor';
import {ErrorComponent} from './error/error.component';

import {AngularMaterialModule} from './angular-material.module';
import {PaymentModule} from './payment/payment.module';

import {AppRoutingModule} from './app-routing.module';
import {CommonModule} from '@angular/common';
import {NumbersOnly} from '../directives/numbers-only.directive'

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ErrorComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularMaterialModule,
        PaymentModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent],

    entryComponents: [ErrorComponent]
})
export class AppModule {
}
