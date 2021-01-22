const express = require("express");

const PaymentController = require("../controllers/payment");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post(
  "",
  checkAuth,
  PaymentController.createPayment
);

router.put(
  "/:id",
  checkAuth,
  PaymentController.editPayment
);

router.delete(
  "/:id",
  checkAuth,
  PaymentController.deletePayment
);

router.get(
  "",
  PaymentController.getPayments
);

router.get(
  "/:id",
  PaymentController.getPayment
);


module.exports = router;
