var express = require('express');
var router = express.Router();
const {
  getAllPrintMoney, 
  getPrintMoney, 
  postPrintMoney, 
  putPrintMoney,
  getPrintMoneyHistory
} = require('../controllers/print');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/quote', getAllPrintMoney);
router.get('/quote:id', getPrintMoney);
router.post('/quote', postPrintMoney);
router.put('/quote', putPrintMoney);


router.get('/:id/:history', getPrintMoneyHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

