var express = require('express');
var router = express.Router();
const {
  getAllReturn, 
  getReturn, 
  putReturn,
  getAll
} = require('../controllers/return');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/return', getAllReturn);
router.get('/all/:id', getAll);
router.get('/return/:id', getReturn);
router.put('/return', putReturn);

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

