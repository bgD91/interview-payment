export interface PaymentDTO {
  id: string;
  cardholder: string;
  creditCardNumber: string;
  expirationDate: Date;
  amount: number;
  creator: string;
  securityCode?: string;
}
