var _ = require('underscore');
const crypto = require('crypto');
const secp256k1 = require('secp256k1')
const { ethers } = require("ethers");
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

function buildAddress(transactionFamily) {
  return (key) => {
    return getAddress(transactionFamily, key);
  }
}

const address = buildAddress(TRANSACTION_FAMILY);

function getAppURL(appNum){
  if(!process.env.ORG_NUM){
    console.log('process.env.ORG_NUM not defined');
    process.exit(0);
  }
  else{
    console.log(`process.env.ORG_NUM = ${process.env.ORG_NUM}`);
  }
  const APP_N_PORT = `APPORG${process.env.ORG_NUM}APP${appNum}_PORT`;
  const ledgerUrl = process.env[APP_N_PORT] && new URL(process.env[APP_N_PORT]);
  const ledgerHostPort = ledgerUrl && `http://${ledgerUrl.hostname}:${ledgerUrl.port}`;
  return ledgerHostPort;
}

const APPORG0APP0_PORT = getAppURL(0);
const APPORG0APP4_PORT = getAppURL(4);

module.exports.getAllSeparationMoney = async function (req, res) {

  let params = {
    headers: { 'Content-Type': 'application/json' }
  };
  const query = await axios.get(
    `${process.env.SAWTOOTH_REST}/state?address=${INT_KEY_NAMESPACE}&limit=${20}`,
    params
  );
  console.log(query.data.data);
  let allQuote = _.chain(query.data.data)
    .map((d) => {
      let base = JSON.parse(Buffer.from(d.data, 'base64'));
      var tr = base;
      const status = tr[0].value.status;
      if (!(status === "order")) {
        return "";
      }
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(allQuote);
  res.json(allQuote);

};

module.exports.getSeparationMoney = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    var tr = value;
    const status = tr.value.status;
    if (!(status === "order")) {
      const resp = "The data exists, but it is not a order is a " + status;
      return res.status(201).json(resp);
    }
    return res.status(200).json(value.value);
  }
  catch (e) {
    if (e.response && e.response.status === 404) {
      return res.status(404).json(e.response.data)
    }
    return res.status(500).json({ error: e })
  }
}
module.exports.putSeparationMoney = async function (req, res) {

  try {
    let validation;
    //To test the tests please comment the following line.
    validation = true; 
    const quotationId = req.body.quotationId
    const txid1 = req.body.quotationId
    const order = req.body.id;
    let clientId;

    if (validation == undefined) {
      console.log(req.body.quotation['clientId']);
      clientId = req.body.quotation['clientId'];
    }
    else {
      clientId = req.body.quotation.clientId;
    }
    //Get signature from order
    let pay = "";
    const msg1 = JSON.stringify({ clientId, quotationId });
    const signature2 = req.body.signature;
    if (signature2 == undefined) {
      throw new Error('The transaction does not have a signature')
    }
    if (order === undefined || clientId === undefined) {
      throw new Error('Incomplete data')
    }
    //Look for the quote
    const j = await axios.get(`${APPORG0APP4_PORT}/api/quote/${txid1}`);
    const tran = j.data;
    //console.log(tran);
    if (tran === "The quote exists, but it is no longer just a quote") {
      throw new Error('The quote exists, but it is no longer just a quote')
    }
    const signatureUser = tran.signatureUser;
    const msg2 = JSON.stringify(tran.msg);
    let moneyModule;
    //Get signature from the quote
    if (validation != undefined) {
      console.log(signatureUser);
      //Comaparate signatures
      const {
        getPublicKey
      } = require('../controllers/separation');
      const s = getPublicKey(msg1, signature2);
      const s2 = getPublicKey(msg2, signatureUser);
      if (s != s2) {
        console.log("llave orden: "+s);
        console.log("lleve cuotizacion: "+s2);
        throw new Error('Public keys are different');
      }
      //Separate the money
      const { transactionCNK } = req.body;
      try {
        moneyModule = await axios.post(`${APPORG0APP0_PORT}/cryptocurrency`, { ...transactionCNK });
        //console.log(moneyModule.data);
        pay = moneyModule.data.payload.signature;
      }
      catch (e) {
        console.log(e.response.data);
        return res.status(500).json(e.response.data);
      }
    }
    //Update the status of quote to order
    const { values, date_quote, msg } = tran;
    //console.log(msg);
    const status = "order";
    const fecha = new Date();
    const date_order = new Date(fecha);
    const transaction = { values, msg, status, date_quote, date_order, signatureUser, pay };
    const input = getAddress(TRANSACTION_FAMILY, order);
    const address = getAddress(TRANSACTION_FAMILY, txid1);
    const payload = JSON.stringify({ func: 'put', args: { transaction, txid: txid1 } });
    const resc = await sendTransactionWithAwait([
      {
        transactionFamily: TRANSACTION_FAMILY,
        transactionFamilyVersion: TRANSACTION_FAMILY_VERSION,
        inputs: [input, address],
        outputs: [input, address],
        payload
      }
    ]);
    const resp = "The status of the quote with id: " + txid1 + " was changed to order";
    console.log("The money was separated correctly with address " + pay);
    console.log(resp);
    let resp2 = ""
    if (moneyModule != undefined) {
      resp2 = moneyModule.data;
    }
    return res.status(200).json({ resp, CNKAPI: resp2 });
  }
  catch (err) {
    console.log(err);
    let errMsg;
    if (err.data) {
      errMsg = err.data;
      if (err.message == 'Invalid transaction') {
        errMsg = "Invalid Transaction: " + err.data.data[0].invalid_transactions[0].message;
      }
      else {
        errMsg = err;
      }
    }
    else {
      errMsg = err;
    }
    return res.status(500).json({ error: errMsg.message });
  }
};



function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        resolve(null);
      }
      try {
        let p = JSON.parse(data);
        return resolve(p);
      }
      catch (e) {
        resolve(null);
      }
    });
  });
}

module.exports.getSeparationMoneyHistory = async function (req, res) {
  let state = await readFile('./data/current_state.json');

  if (!(req.params.id in state)) {
    return res.status(404).json('not found');
  }
  return res.json(state[req.params.id]);
}
module.exports.getPublicKey = (msg, signature) => {
  const wrapped = "\x19Ethereum Signed Message:\n" + msg.length + msg;
  const hashSecp256 = ethers.utils.keccak256(
    "0x" + Buffer.from(wrapped).toString("hex")
  );
  const pubKey = secp256k1.ecdsaRecover(
    Uint8Array.from(Buffer.from(signature.slice(2, -2), "hex")),
    parseInt(signature.slice(-2), 16) - 27,
    Buffer.from(hashSecp256.slice(2), "hex"),
    true
  );

  return Buffer.from(pubKey).toString("hex");
};