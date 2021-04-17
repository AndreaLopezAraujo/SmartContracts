var express = require('express');
var router = express.Router();
const {
  getAllReturn, 
  getReturn, 
  postReturn, 
  putReturn,
  getReturnHistory
} = require('../controllers/return');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/return', getAllReturn);
router.get('/return/:id', getReturn);
router.put('/return', putReturn);


router.get('/:id/:history', getReturnHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

