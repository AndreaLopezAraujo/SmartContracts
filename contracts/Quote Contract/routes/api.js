var express = require('express');
var router = express.Router();
const {
  getAllQuote, 
  getQuote, 
  postQuote, 
  putQuote,
  getQuoteHistory
} = require('../controllers/quote');
const {authTransactionMiddleware} = require('../controllers/transaction');


router.get('/', getAllQuote);
router.get('/:id', getQuote);
router.post('/', authTransactionMiddleware, postQuote);
router.put('/', authTransactionMiddleware, putQuote);


router.get('/:id/:history', getQuoteHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

