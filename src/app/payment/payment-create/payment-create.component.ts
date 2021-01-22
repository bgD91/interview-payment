import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {PaymentService} from '../payment.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {PaymentDTO} from '../payment.model';
import {mimeType} from './mime-type.validator';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-payment-create',
    templateUrl: './payment-create.component.html',
    styleUrls: ['./payment-create.component.css']
})
export class PaymentCreateComponent implements OnInit, OnDestroy {
    cardHolder = '';

    private componentState = 'create';
    private postId: string;
    private $authStatus: Subscription;

    payment: PaymentDTO;

    isLoading = false;

    form: FormGroup;

    minDate: Date;
    maxDate: Date;


    constructor(
        public postsService: PaymentService,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currentDay = new Date().getUTCDate();
        // Minimum today
        this.minDate = new Date(currentYear, currentMonth, currentDay);
        // Maximum 5 years from now on 1st January
        this.maxDate = new Date(currentYear + 5, currentMonth, currentDay);
    }


    ngOnInit() {
        this.$authStatus = this.authService.getAuthStatusListener()
            .subscribe(authStatus => {
                this.isLoading = false;
            });
        this.form = new FormGroup({
            cardholder: new FormControl(
                null,
                {
                    validators:
                        [
                            Validators.required,
                            Validators.minLength(3),
                            Validators.pattern('^[a-zA-Z \-\']+'),
                        ]
                }
            ),
            creditCardNumber: new FormControl(
                null, {
                    validators:
                        [
                            Validators.required
                        ]
                }),
            expirationDate: new FormControl(
                null, {
                    validators:
                        [
                            Validators.required
                        ]
                }),
            amount: new FormControl(
                null, {
                    validators:
                        [
                            Validators.required,
                        ]
                }),
            securityCode: new FormControl(
                null, {
                    validators: []
                }),
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.componentState = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPayment(this.postId).subscribe((postData) => {
                    console.log(postData);
                    this.isLoading = false;
                    this.payment = {
                        id: postData._id,
                        cardholder: postData.cardholder,
                        creditCardNumber: postData.creditCardNumber,
                        expirationDate: postData.expirationDate,
                        amount: postData.amount,
                        securityCode: postData.securityCode || null,
                        creator: postData.creator
                    };
                    this.form.setValue({
                        cardholder: this.payment.cardholder,
                        creditCardNumber: this.payment.creditCardNumber,
                        expirationDate: this.payment.expirationDate,
                        amount: this.payment.amount,
                        securityCode: this.payment.securityCode || null,
                    });
                });
                // } else {
                this.componentState = 'create';
                this.postId = null;
            }
        });
    }

    onFormSubmit() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if (this.componentState === 'create') {
            this.postsService.addPayment(
                this.form.value.cardholder,
                this.form.value.creditCardNumber,
                this.form.value.expirationDate,
                this.form.value.amount,
                this.form.value.securityCode || null,
            );
        } else {
            this.postsService.editPayment(
                this.postId,
                this.form.value.cardholder,
                this.form.value.creditCardNumber,
                this.form.value.expirationDate,
                this.form.value.amount,
                this.form.value.securityCode,
            );
        }
        this.form.reset();
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    ngOnDestroy() {
        this.$authStatus.unsubscribe();
    }
}
