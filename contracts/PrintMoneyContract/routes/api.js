var express = require('express');
var router = express.Router();
const {
  getAllPrintMoney, 
  getPrintMoney, 
  postPrintMoney, 
  putPrintMoney,
  getPrintMoneyHistory
} = require('../controllers/printMoney');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/printFinish', getAllPrintMoney);
router.get('/printFinish/:id', getPrintMoney);
router.put('/printFinish', putPrintMoney);


router.get('/:id/:history', getPrintMoneyHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

