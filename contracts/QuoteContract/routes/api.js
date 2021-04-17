var express = require('express');
var router = express.Router();
const {
  getAllQuote,
  getAll, 
  getQuote, 
  postQuote, 
  getQuoteHistory
} = require('../controllers/quote');
//const {authTransactionMiddleware} = require('../controllers/transaction');
router.get('/quote', getAllQuote);
router.get('/all', getAll);
router.get('/quote/:id', getQuote);
router.post('/quote', postQuote);


router.get('/:id/:history', getQuoteHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

