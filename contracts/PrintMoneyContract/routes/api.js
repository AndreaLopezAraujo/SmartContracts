var express = require('express');
var router = express.Router();
const {
  getAllPrintMoney, 
  getPrintMoney, 
  putDeliver, 
  putPrintMoney,
  getPrintMoneyHistory,
  getAllDelivered,
  getDelivered
} = require('../controllers/printMoney');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/printFinish', getAllPrintMoney);
router.get('/deliver', getAllDelivered);
router.get('/printFinish/:id', getPrintMoney);
router.get('/printFinish/:id', getDelivered);
router.put('/printFinish', putPrintMoney);
router.put('/deliver', putDeliver);


router.get('/:id/:history', getPrintMoneyHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

