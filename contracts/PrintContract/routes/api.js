var express = require('express');
var router = express.Router();
const {
  getAllPrint, 
  getPrint, 
  postPrint, 
  putPrint,
  getPrintHistory
} = require('../controllers/print');
const {authTransactionMiddleware} = require('../controllers/transaction');


router.get('/', getAllPrint);
router.get('/:id', getPrint);
router.post('/', authTransactionMiddleware, postPrint);
router.put('/', authTransactionMiddleware, putPrint);


router.get('/:id/:history', getPrintHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

