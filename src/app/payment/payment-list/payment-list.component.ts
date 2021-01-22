import {Component, OnInit, OnDestroy} from "@angular/core";
import {PageEvent} from "@angular/material";
import {Subscription} from "rxjs";

import {PaymentDTO} from "../payment.model";
import {PaymentService} from "../payment.service";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: "app-payment-list",
    templateUrl: "./payment-list.component.html",
    styleUrls: ["./payment-list.component.css"]
})
export class PaymentListComponent implements OnInit, OnDestroy {
    // posts = [
    //   { title: "First Post", content: "This is the first post's content" },
    //   { title: "Second Post", content: "This is the second post's content" },
    //   { title: "Third Post", content: "This is the third post's content" }
    // ];
    payments: PaymentDTO[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    userId: string;
    private postsSub: Subscription;
    private authStatusSub: Subscription;

    constructor(
        public postsService: PaymentService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPayments(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSub = this.postsService
            .getPaymentUpdateListener()
            .subscribe((paymentData: { payments: PaymentDTO[]; postCount: number }) => {
                this.isLoading = false;
                this.totalPosts = paymentData.postCount;
                this.payments = paymentData.payments;
                this.userId = this.authService.getUserId();
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onChangedPage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex+ 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPayments(this.postsPerPage, this.currentPage);
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePayment(postId).subscribe(() => {
            this.postsService.getPayments(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}
