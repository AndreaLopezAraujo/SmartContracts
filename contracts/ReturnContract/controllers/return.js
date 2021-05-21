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

module.exports.getAllReturn = async function (req, res) {

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
      if (!(status === "return")) {
        return "";
      }
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(allQuote);
  res.json(allQuote);

};

module.exports.getReturn = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    var tr = value;
    const status = tr.value.status;
    if (!(status === "return")) {
      const resp = "The data exists, but it is not a return is a " + status;
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
module.exports.getAll = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    console.log("aqui");
    return res.status(200).json(value.value);
  }
  catch (e) {
    if (e.response && e.response.status === 404) {
      return res.status(404).json(e.response.data)
    }
    return res.status(500).json({ error: e })
  }
}
module.exports.putReturn = async function (req, res) {

  try {
    let validation;
    //To test the tests please comment the following line.
    validation = true;
    console.log(req.body);
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
    const signatureM = req.body.signature;
    const msg1 = JSON.stringify(m);
    //console.log("Mensaje");
    //console.log(msg1);
    //console.log("firma");
    //console.log(signatureM);
    if (orderId === undefined || or === undefined) {
      throw new Error('Incomplete data')
    }
    if(signatureM===undefined)
    {
      throw new Error('The transaction does not have a signature')
    }
    //Look for the printing
    const j = await axios.get(`http://localhost:3005/api/all/${txid1}`);
    const tran = j.data;
    //console.log(tran);
    const status1 = tran.status;
    if (status1 === "quote" || status1 === "printed" || status1 === "return") {
      throw new Error('The quote or order cannot be canceled')
    }
    //Get signature from the quote
    let signatureManufacturer;
    const pay = tran.pay;
    if (validation != undefined) {
      if (tran.msgManufacture != undefined) {
        signatureManufacturer = tran.signatureManufacturer;
        const msgManufacture2 = JSON.stringify(tran.msgManufacture);
        //console.log("Mensaje2");
        //console.log(msgManufacture2);
        //console.log("firma2");
        //console.log(signatureManufacturer);
        //Comaparate signatures
        const {
          getPublicKey
        } = require('../controllers/return');
        const s = getPublicKey(msg1, signatureM);
        //console.log("llave 1: " + s)
        const s2 = getPublicKey(msgManufacture2, signatureManufacturer);
        //console.log("llave 2: " + s2)
        if (s != s2) {
          throw new Error('Public keys are different')
        }
      }
      else {
        signatureManufacturer = signatureM;
      }
      //Return the money to the user
      try {
        const { transactionCNK } = req.body.order;
        const sng = transactionCNK.signature;
        const jk = await axios.put(`${process.env.CNK_API_URL}/cryptocurrency/${pay}`, {}, { params: { approve: false, signature: sng } });
        //console.log(jk);
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
    }
    //Update the status of data to return
    const { values, date_quote, date_order, date_printing, date_deliver, msg, msgManufacture, signatureUser } = tran;
    const status2 = "return";
    const fecha = new Date();
    const date_return = new Date(fecha);
    const transaction = {
      values, msg, msgManufacture, status: status2, date_quote, date_order, date_printing,
      date_deliver, date_return, signatureUser, signatureManufacturer
    };
    const input = getAddress(TRANSACTION_FAMILY, orderId);
    const address = getAddress(TRANSACTION_FAMILY, txid1);
    console.log(transaction);
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
    const resp = "The status of the printed with id: " + txid1 + " was changed to return";
    console.log("The money was returned correctly with address " + pay);
    console.log(resp);
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
    return res.status(500).json({error: errMsg.message});
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
module.exports.getReturnHistory = async function (req, res) {
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