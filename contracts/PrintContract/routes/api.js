var express = require('express');
var router = express.Router();
const {
  getAllPrint, 
  getPrint, 
  postPrint, 
  putPrint,
  getPrintHistory
} = require('../controllers/Print');
const {authTransactionMiddleware} = require('../controllers/transaction');


router.get('/print', getAllPrint);
router.get('/print:id', getPrint);
router.post('/print', postPrint);
router.put('/print', putPrint);


router.get('/:id/:history', getPrintHistory)

router.use('/*', function(req, res){
  res.status(404).json({msg: 'Resource not found'});
});

module.exports = router;

