var _ = require('underscore');
const crypto = require('crypto');
const mongo = require('../mongodb/mongo')
const protobuf = require('sawtooth-sdk/protobuf');
const { v4: uuidv4 } = require('uuid');
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
const { values } = require('underscore');

function buildAddress(transactionFamily){
  return (key) => {
    return getAddress(transactionFamily, key);
  }
}

const address = buildAddress(TRANSACTION_FAMILY);

module.exports.getAllPrint = async function(req, res) {

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
     const status=tr[0].value.status;
     if(!(status==="printing"))
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

module.exports.getPrint = async function(req, res) {
  try{
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if(!value){
      return res.status(404).json("not found"); 
    }
    var tr=value;
    const status=tr.value.status;
     if(!(status==="printing"))
     {
       if(!(status==="deliver"))
       {
        const resp="The data exists, but it is not a printing is a "+ status;
        return res.status(201).json(resp);
       }
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
module.exports.putPrint = async function(req, res) {
  
  try{
    const quotationId=req.body.quotationId
    const txid1 = req.body.quotationId
    const order = req.body.id;
    const manufactureId=req.body.quotation.manufactureId;
    //Get signature from order
    const msg1=JSON.stringify({manufactureId,quotationId});
    console.log("Mensaje");
    console.log(msg1);
    const signatureManufacturer=req.body.signature;
    console.log("firma");
    console.log(signatureManufacturer);
    if(order===undefined||manufactureId===undefined)
    {
      throw new Error('Incomplete data')
    }
    //Look for the order
    const j=await axios.get(`http://localhost:3003/api/order/${txid1}`);
    const tran=j.data;
    console.log(tran);
    if(tran==="The data exists, but it is not a order is a quote"
    ||tran==="The data exists, but it is not a order is a printing"
    ||tran==="The data exists, but it is not a order is a printed"
    ||tran==="The data exists, but it is not a order is a deliver"
    ||tran==="The data exists, but it is not a order is a return")
    {
      throw new Error(tran)
    }
    //Update the status of order to printing
    const {values,date_quote,date_order,signatureUser}=tran;
    const status="printing";
    const fecha = new Date();
    const date_printing= new Date(fecha);
    const transaction={values,status,date_quote,date_order,date_printing,signatureUser,signatureManufacturer};
    const input = getAddress(TRANSACTION_FAMILY, order);
    const address = getAddress(TRANSACTION_FAMILY, txid1);
    const payload = JSON.stringify({func: 'put', args:{transaction, txid:txid1}});
    const resc= await sendTransactionWithAwait([
      {
        transactionFamily: TRANSACTION_FAMILY, 
        transactionFamilyVersion: TRANSACTION_FAMILY_VERSION, 
        inputs: [input, address],
        outputs: [input, address],
        payload
      }
    ]);
    const resp="The status of the order with id: "+txid1+" was changed to printing";
    return res.status(200).json(resp);
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
    return res.status(500).json(errMsg);
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
module.exports.getPrintHistory = async function(req, res) {
  let state = await readFile('./data/current_state.json');

  if(!(req.params.id in state)){
    return res.status(404).json('not found');
  }
  return res.json(state[req.params.id]);
}