var express = require('express');
var router = express.Router();
const expenseController = require('../controllers/controller-expense');
const auth = require('../middleware/auth');

router.post('/',auth,expenseController.createExpense);

router.get ('/all',auth, expenseController.getExpenses);

router.get('/balance',auth, expenseController.getBalance);

module.exports = router;