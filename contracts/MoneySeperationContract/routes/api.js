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
router.get('/quote', getAllSeparationMoney);
router.get('/quote:id', getSeparationMoney);
router.post('/quote', postSeparationMoney);
router.put('/quote', putSeparationMoney);


router.get('/:id/:history', getSeparationMoneyHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

