var _ = require('underscore');
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

module.exports.getAllPrint = async function (req, res) {

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
      if (!(status === "printing")) {
        return "";
      }
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(allQuote);
  res.json(allQuote);

};

module.exports.getPrint = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    var tr = value;
    const status = tr.value.status;
    if (!(status === "printing")) {
      if (!(status === "deliver")) {
        const resp = "The data exists, but it is not a printing is a " + status;
        return res.status(201).json(resp);
      }
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
module.exports.putPrint = async function (req, res) {

  try {
    let validation;
    //To test the tests please comment the following line.
    validation = true;
    let txid1 = "";
    let orderId = "";
    let quotationId = ""
    if (validation == undefined) {
      console.log(req.body.order);
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
    const or = req.body.order;
    const id = or.id;
    const creationDate = or.creationDate;
    const status = or.status;
    //Get signature from order
    let msgManufacture = "";
    const signatureManufacturer = req.body.signature;
    if (validation != undefined) {
      msgManufacture = { creationDate, id, quotationId, status };
    }
    if (orderId === undefined || or === undefined) {
      console.log(orderId);
      console.log(or);
      throw new Error('Incomplete data')
    }
    if (signatureManufacturer == undefined) {
      throw new Error('The transaction does not have a signature')
    }
    //Look for the order
    console.log()
    const j = await axios.get(`${process.env.apporg0app1}/${txid1}`);
    const tran = j.data;
    //console.log(tran);
    if (tran === "The data exists, but it is not a order is a quote"
      || tran === "The data exists, but it is not a order is a printing"
      || tran === "The data exists, but it is not a order is a printed"
      || tran === "The data exists, but it is not a order is a deliver"
      || tran === "The data exists, but it is not a order is a return") {
      console.log(tran);
      throw new Error(tran)
    }
    //Update the status of order to printing
    const { values, date_quote, date_order, signatureUser, msg, pay } = tran;
    const status1 = "printing";
    const fecha = new Date();
    const date_printing = new Date(fecha);
    const transaction = { values, msg, msgManufacture, status: status1, date_quote, date_order, date_printing, signatureUser, signatureManufacturer, pay };
    const input = getAddress(TRANSACTION_FAMILY, orderId);
    const address = getAddress(TRANSACTION_FAMILY, txid1);
    const payload = JSON.stringify({ func: 'put', args: { transaction, txid: txid1 } });
    await sendTransactionWithAwait([
      {
        transactionFamily: TRANSACTION_FAMILY,
        transactionFamilyVersion: TRANSACTION_FAMILY_VERSION,
        inputs: [input, address],
        outputs: [input, address],
        payload
      }
    ]);
    const resp = "The status of the order with id: " + txid1 + " was changed to printing";
    console.log(resp)
    return res.status(200).json(resp);
  }
  catch (err) {
    let errMsg;
    console.log(err);
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
module.exports.getPrintHistory = async function (req, res) {
  let state = await readFile('./data/current_state.json');

  if (!(req.params.id in state)) {
    return res.status(404).json('not found');
  }
  return res.json(state[req.params.id]);
}