const Payment = require('../models/payment');

exports.createPayment = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const payment = new Payment({
    cardholder: req.body.cardholder,
    creditCardNumber: req.body.creditCardNumber,
    expirationDate: req.body.expirationDate,
    amount: +req.body.amount,
    securityCode: req.body.securityCode,
    creator: req.userData.userId,
  });
  console.log(payment);
  payment.save()
    .then(createdPayment => {
      res.status(201).json({
        message: 'Payment added successfully',
        payment: {
          ...createdPayment,
          id: createdPayment._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a payment failed!',
        error: error,
      })
    });
};

exports.editPayment = (req, res, next) => {
  // let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    // imagePath = url + "/images/" + req.file.filename
  }

  const payment = new Payment({
    _id: req.body.id,
    cardholder: req.body.cardholder,
    creditCardNumber: req.body.creditCardNumber,
    expirationDate: req.body.expirationDate,
    amount: +req.body.amount,
    securityCode: req.body.securityCode,
    creator: req.userData.userId,
  });

  console.log(payment);
  console.log(req.params.id);
  console.log(req.userData.userId);

  Payment.updateOne({
      _id: req.params.id,
      creator: req.userData.userId,
    },
    payment)
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: 'Update successful!',
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized',
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update payment method",
        error: error,
      })
    });
};

exports.deletePayment = (req, res, next) => {
  Payment.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Payment deleted!", result: result
        });
      } else {
        res.status(401).json({
          message: "Not Authorized"
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting payment failed!'
      })
    });
};

exports.getPayments = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  const postQuery = Payment.find();

  let fetchedPayments;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPayments = documents;
      return Payment.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Payments fetched successfully',
        payments: fetchedPayments,
        maxPosts: count,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed!',
      })
    });
};

exports.getPayment = (req, res, next) => {
  Payment.findById(req.params.id)
    .then(payment => {
      if (payment) {
        res.status(200).json(payment);
      } else {
        res.status(404).json({
          message: 'Payment not found!',
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching payment failed!',
      })
    });
};
