var _ = require('underscore');
const secp256k1 = require('secp256k1')
const { ethers } = require("ethers");
const crypto = require('crypto');
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

module.exports.getAllPrintMoney = async function (req, res) {

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
      if (!(status === "printed")) {
        return "";
      }
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(allQuote);
  res.json(allQuote);
};
module.exports.getAllDelivered = async function (req, res) {

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
      if (!(status === "deliver")) {
        return "";
      }
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(allQuote);
  res.json(allQuote);
};

module.exports.getPrintMoney = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    var tr = value;
    const status = tr.value.status;
    if (!(status === "finish")) {
      const resp = "The data exists, but it is not a printed is a " + status;
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
module.exports.getDelivered = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    var tr = value;
    const status = tr.value.status;
    if (!(status === "deliver")) {
      const resp = "The data exists, but it is not a deliver is a " + status;
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
module.exports.putPrintMoney = async function (req, res) {

  try {
    //console.log(req.body);
    const quotationId = req.body.order.quotationId;
    const txid1 = quotationId;
    const orderId = req.body.order.id;
    const or = req.body.order;
    const id = or.id;
    const creationDate = or.creationDate;
    const status = or.status;
    const m = { creationDate, id, quotationId, status };
    //Get signature from order
    const signatureM = req.body.signature;
    const msg1 = JSON.stringify(m);
    console.log("Mensaje");
    console.log(msg1);
    console.log("firma");
    console.log(signatureM);
    if (orderId === undefined || or === undefined) {
      throw new Error('Incomplete data')
    }
    //Look for the printing
    const j = await axios.get(`http://localhost:3004/api/deliver/${txid1}`);
    const tran = j.data;
    //console.log(tran);
    if (tran === "The data exists, but it is not a deliver is a quote"
      || tran === "The data exists, but it is not a deliver is a printed"
      || tran === "The data exists, but it is not a deliver is a order"
      || tran === "The data exists, but it is not a deliver is a return") {
      return res.status(210).json(tran);
    }

    //Get signature from the quote
    const signatureUser = tran.signatureUser;
    const msgManufacture2 = JSON.stringify(tran.msg);
    console.log("Mensaje2");
    console.log(msgManufacture2);
    console.log("firma2");
    console.log(signatureUser,);
    //Comaparate signatures
    const {
      getPublicKey
    } = require('../controllers/printMoney');
    const s = getPublicKey(msg1, signatureM);
    //console.log("llave 1: " + s)
    const s2 = getPublicKey(msgManufacture2, signatureUser);
    //console.log("llave 2: " + s2)
    if (s != s2) {
      throw new Error('Public keys are different')
    }
    const pay = tran.pay;
    //Pay the money to the printer
    try {
      const { transactionCNK } = req.body.order;
      const sng = transactionCNK.signature;
      //console.log(pay);
      const jk = await axios.put(`${process.env.CNK_API_URL}/cryptocurrency/${pay}`, {}, { params: { approve: true, signature: sng } });
    }
    catch (e) {
      if (e.response != undefined) {
        console.log(e.response.data);
        return res.status(500).json(e.response.data);
      }
      else {
        console.log(e);
        return res.status(500).json(e);
      }
    }
    //Update the status of order to printing
    const { values, date_quote, date_order, date_printing, date_deliver, msg, msgManufacture, signatureManufacturer } = tran;
    const status1 = "finish";
    const fecha = new Date();
    const date_printed = new Date(fecha);
    const transaction = {
      values, msg, msgManufacture, status: status1, date_quote, date_order, date_printing,
      date_deliver, date_printed, signatureUser, signatureManufacturer, pay
    };
    const input = getAddress(TRANSACTION_FAMILY, orderId);
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
    const resp = "The status of the deliver with id: " + txid1 + " was changed to finish";
    console.log("The money was pay correctly with address " + pay);
    console.log(resp)
    return res.status(200).json(resp);
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
    return res.status(500).json(errMsg);
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
module.exports.putDeliver = async function (req, res) {
  try {
    console.log(req.body);
    let validation;
    //To test the tests please comment the following line.
    validation = true;
    let quotationId = "";
    let txid1 = "";
    let orderId = "";
    if (validation == undefined) {
      console.log(req.body.order['id']);
      clientId = req.body.order['id'];
      txid1 = req.body.order['quotationId'];
      quotationId = req.body.order['quotationId'];
    }
    else {
      orderId = req.body.order.id;
      quotationId = req.body.order.quotationId;
      txid1 = quotationId;
    }
    let or = "";
    let id = "";
    let creationDate = "";
    let status = "";
    let m = { creationDate, id, quotationId, status };
    if (validation != undefined) {
      console.log("aqui")
      or = req.body.order;
      id = or.id;
      creationDate = or.creationDate;
      status = or.status;
      m = { creationDate, id, quotationId, status };
    }
    //console.log(m);
    //Get signature from order
    let signatureM = req.body.signature;
    let msg1 = "";
    if (validation != undefined) {
      signatureM = req.body.signature;
      msg1 = JSON.stringify(m);
    }
    if (orderId === undefined || or === undefined) {
      throw new Error('Incomplete data')
    }
    if (signatureM === undefined) {
      throw new Error('The transaction does not have a signature')
    }
    //Look for the printing
    const j = await axios.get(`${process.env.PRINT_CONTRACT}/${txid1}`);
    const tran = j.data;
    //console.log(tran);
    if (tran === "The data exists, but it is not a printing is a quote"
      || tran === "The data exists, but it is not a printing is a finish"
      || tran === "The data exists, but it is not a printing is a order"
      || tran === "The data exists, but it is not a printing is a return"
      || tran === "The data exists, but it is not a printing is a deliver") {
      console.log(tran)
      throw new Error(tran)
    }
    //Get signature from the quote
    let signatureManufacturer = "";
    let msgManufacture2 = "";
    if (validation != undefined) {
      signatureManufacturer = tran.signatureManufacturer;
      msgManufacture2 = JSON.stringify(tran.msgManufacture);
      //Comaparate signatures
      const {
        getPublicKey
      } = require('../controllers/printMoney');
      const s = getPublicKey(msg1, signatureM);
      const s2 = getPublicKey(msgManufacture2, signatureManufacturer);
      if (s != s2) {
        throw new Error('Public keys are different')
      }
    }
    //Update the status of order to delever
    const { values, date_quote, date_order, signatureUser, msg, msgManufacture, date_printing, pay } = tran;
    const status1 = "deliver";
    const fecha = new Date();
    const date_deliver = new Date(fecha);
    const transaction = {
      values, msg, msgManufacture, status: status1, date_quote, date_order, date_printing, date_deliver, signatureUser,
      signatureManufacturer, pay
    };
    const input = getAddress(TRANSACTION_FAMILY, orderId);
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
    const resp = "The status of the printing with id: " + txid1 + " was changed to deliver";
    console.log(resp);
    return res.status(200).json(resp);
  }
  catch (err) {
    console.log(err)
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
    return res.status(500).json(errMsg);
  }
};
module.exports.getPrintMoneyHistory = async function (req, res) {
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