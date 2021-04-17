var express = require('express');
var router = express.Router();
const {
  getAllSeparationMoney, 
  getSeparationMoney, 
  postSeparationMoney, 
  putSeparationMoney,
  getSeparationMoneyHistory
} = require('../controllers/separation');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/order', getAllSeparationMoney);
router.get('/order/:id', getSeparationMoney);
router.put('/order', putSeparationMoney);


router.get('/:id/:history', getSeparationMoneyHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

