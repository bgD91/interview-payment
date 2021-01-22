const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    cardholder: { type: String, required: true },
    creditCardNumber: { type: String, required: [true, 'Card number is required'] },
    expirationDate: { type: Date, required: [true, 'Expiration date is required'] },
    amount: { type: Number, required: [true, 'Amount is required']},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    securityCode: { type: String, minLength: 3, maxLength: 3 },
});

module.exports = mongoose.model('Payment', paymentSchema);

