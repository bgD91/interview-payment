import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

import {environment} from "../../environments/environment";
import {PaymentDTO} from "./payment.model";

const BACKEND_URL = environment.apiUrl + "/payment/";

@Injectable({providedIn: "root"})
export class PaymentService {
  private payments: PaymentDTO[] = [];
  private paymentsUpdated = new Subject<{
    payments: PaymentDTO[];
    postCount: number
  }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPaymentUpdateListener() {
    return this.paymentsUpdated.asObservable();
  }


  getPayments(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; payments: PaymentDTO[] | any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(paymentMethods => {
          return {
            payments: paymentMethods.payments.map(paymentMethod => {

              const parsedExpirationDate = Date.parse(paymentMethod.expirationDate);

              return {
                id: paymentMethod._id,
                cardholder: paymentMethod.cardholder,
                creditCardNumber: paymentMethod.creditCardNumber,
                expirationDate: this.toReadableDate(parsedExpirationDate),
                securityCode: paymentMethod.securityCode,
                creator: paymentMethod.creator,
                amount: paymentMethod.amount
              };
            }),
            maxPosts: paymentMethods.maxPosts
          };
        })
      )
      .subscribe(transformedPaymentData => {
        this.payments = transformedPaymentData.payments;
        this.paymentsUpdated.next({
          payments: [...this.payments],
          postCount: transformedPaymentData.maxPosts
        });
      });
  }

  getPayment(id: string) {
    return this.http.get<{
      _id: string;
      cardholder: string;
      creditCardNumber: string;
      expirationDate: Date;
      amount: number;
      creator: string;
      securityCode?: string;
    }>(BACKEND_URL + id);
  }

  editPayment(
    id: string,
    title: string,
    cardholder: string,
    creditCardNumber: string,
    expirationDate: Date,
    amount: number,
    securityCode?: string,
  ) {
    let postData: PaymentDTO;
    postData = {
      id: id,
      cardholder: cardholder,
      creditCardNumber: creditCardNumber,
      expirationDate: expirationDate,
      amount: amount,
      creator: null,
      securityCode: securityCode ? securityCode : null,
    };
    return this.http.put<{ payment: PaymentDTO }>(BACKEND_URL + `/${id}`, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }


  addPayment(cardholder: string,
          creditCardNumber: string,
          expirationDate: Date,
          amount: number,
          securityCode?: string,
  ) {

    let postData: PaymentDTO;
    postData = {
      id: null,
      cardholder: cardholder,
      creditCardNumber: creditCardNumber,
      expirationDate: expirationDate,
      amount: isNaN(amount) ? null : amount,
      creator: null,
      securityCode: securityCode || null,
    };

    this.http
      .post<{ message: string; post: PaymentDTO }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }


  deletePayment(paymentId: string) {
    return this.http.delete(BACKEND_URL + paymentId);
  }

  toReadableDate (dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  };
}
