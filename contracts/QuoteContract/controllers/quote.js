var _ = require('underscore');
const crypto = require('crypto');
const mongo = require('../mongodb/mongo')
const protobuf = require('sawtooth-sdk/protobuf');
const { 
  sendTransaction, 
  getAddress, 
  sendTransactionWithAwait, 
  queryState } = require('../sawtooth/sawtooth-helpers')

const hash512 = (x) =>
  crypto.createHash('sha512').update(x).digest('hex');

const TRANSACTION_FAMILY = 'quotes';
const TRANSACTION_FAMILY_VERSION = '1.0';
const INT_KEY_NAMESPACE = hash512(TRANSACTION_FAMILY).substring(0, 6)

const { default: axios } = require("axios");
const fs = require('fs');

function buildAddress(transactionFamily){
  return (key) => {
    return getAddress(transactionFamily, key);
  }
}

const address = buildAddress(TRANSACTION_FAMILY);

module.exports.getAllQuote = async function(req, res) {

  let params = {
    headers: {'Content-Type': 'application/json'}
  };
  const query = await axios.get(
    `${process.env.SAWTOOTH_REST}/state?address=${INT_KEY_NAMESPACE}&limit=${20}`,
    params
  );
  console.log(query.data.data);
  let allQuote = _.chain(query.data.data)
    .map((d) => {
     let base = JSON.parse(Buffer.from(d.data, 'base64'));
     var tr=base;
     const separate=tr[0].value.separate;
     const printing=tr[0].value.printing;
     const paidOut=tr[0].value.paidOut;
     const refund=tr[0].value.refund;
     if(separate||printing||paidOut||refund)
     {
       return "";
     }
      return tr[0].value;
    })
    .flatten()
    .value();
    console.log(allQuote);
  res.json(allQuote);

};

module.exports.getQuote = async function(req, res) {
  try{
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if(!value){
      return res.status(404).json("not found"); 
    }
    var tr=value;
     const separate=tr.value.separate;
     const printing=tr.value.printing;
     const paidOut=tr.value.paidOut;
     const refund=tr.value.refund;
     if(separate||printing||paidOut||refund)
     {
       return "The quote exists, but it is no longer just a quote";
     }
    return res.status(200).json(value.value);
  }
  catch(e){
    if(e.response && e.response.status === 404){
      return res.status(404).json(e.response.data) 
    }
    return res.status(500).json({error:e})
  }
}
module.exports.postQuote = async function(req, res) {
  const values = req.body;
  const txid1=req.body.id;
  const quote=true;
  const separate=false;
  const printing=false;
  const paidOut=false;
  const refund=false;
  const address = getAddress(TRANSACTION_FAMILY, txid1);
  const payload = JSON.stringify({func: 'post', args:{transaction:{values,quote,separate,printing,paidOut,refund}, txid:txid1}});
  try{
    let resc= await sendTransaction([{
      transactionFamily: TRANSACTION_FAMILY, 
      transactionFamilyVersion: TRANSACTION_FAMILY_VERSION,
      inputs: [address],
      outputs: [address],
      payload
    }]);
    console.log(resc)
    return res.status(200).json(payload);
  }
  catch(err){
    console.log(err);
    return res.status(500).json({err});
  }
};

module.exports.putQuote = async function(req, res) {
  const {transaction, txid} = req.body;

  const input = getAddress(TRANSACTION_FAMILY, JSON.parse(transaction).input);
  const address = getAddress(TRANSACTION_FAMILY, txid);
  const payload = JSON.stringify({func: 'put', args:{transaction, txid}});
  
  try{
    await sendTransactionWithAwait([
      {
        transactionFamily: TRANSACTION_FAMILY, 
        transactionFamilyVersion: TRANSACTION_FAMILY_VERSION, 
        inputs: [input, address],
        outputs: [input, address],
        payload
      }
    ]);
    return res.json({msg:'ok'});

  }
  catch(err){
    let errMsg;
    if(err.data){
      errMsg = err.data;
      if(err.message == 'Invalid transaction'){
        errMsg = "Invalid Transaction: " + err.data.data[0].invalid_transactions[0].message;
      }
      else {
        errMsg = err;
      }
    }
    else{
      errMsg = err;
    }
    return res.status(500).json({msg: errMsg});
  }
};


function readFile(file){
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) =>{
      if(err){
        resolve(null);
      }
      try{
        let p = JSON.parse(data);
        return resolve(p);
      }
      catch(e){
        resolve(null);
      }
    });
  });
}

module.exports.getQuoteHistory = async function(req, res) {
  let state = await readFile('./data/current_state.json');

  if(!(req.params.id in state)){
    return res.status(404).json('not found');
  }
  return res.json(state[req.params.id]);
}