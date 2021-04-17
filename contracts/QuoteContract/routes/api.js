var express = require('express');
var router = express.Router();
const {
  getAllQuote, 
  getQuote, 
  postQuote, 
  putQuote,
  getQuoteHistory
} = require('../controllers/quote');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/quote', getAllQuote);
router.get('/quote/:id', getQuote);
router.post('/quote', postQuote);
router.put('/quote', putQuote);


router.get('/:id/:history', getQuoteHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

