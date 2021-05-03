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

function buildAddress(transactionFamily) {
  return (key) => {
    return getAddress(transactionFamily, key);
  }
}

const address = buildAddress(TRANSACTION_FAMILY);

module.exports.getAllQuote = async function (req, res) {

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
      if (!(status === "quote")) {
        return "";
      }
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(allQuote);
  res.json(allQuote);

};
module.exports.getAll = async function (req, res) {

  let params = {
    headers: { 'Content-Type': 'application/json' }
  };
  const query = await axios.get(
    `${process.env.SAWTOOTH_REST}/state?address=${INT_KEY_NAMESPACE}&limit=${20}`,
    params
  );
  console.log(query.data.data);
  let all = _.chain(query.data.data)
    .map((d) => {
      let base = JSON.parse(Buffer.from(d.data, 'base64'));
      var tr = base;
      return tr[0].value;
    })
    .flatten()
    .value();
  console.log(all);
  res.json(all);

};
module.exports.getQuote = async function (req, res) {
  try {
    let values = await queryState(address(req.params.id + ""));
    let value = _.find(values, v => v.key == req.params.id + "");
    if (!value) {
      return res.status(404).json("not found");
    }
    var tr = value;
    const status = tr.value.status;
    if (!(status === "quote")) {
      return res.status(201).json("The quote exists, but it is no longer just a quote");
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
module.exports.postQuote = async function (req, res) {
  try {
    //Get the quote values
    const values = req.body;
    console.log(values);
    const txid1 = req.body.id;
    const {deliveryDate,price,clientId,manufacturerId,catalogItemId,printSettingsIds,printerId}=req.body;
    //Get signature
    const signature=req.body.signature;
    const msg=
    {
      catalogItemId,printSettingsIds,clientId
    }
    console.log(msg);
    if (deliveryDate === undefined|| price === undefined || clientId === undefined || printerId === undefined || manufacturerId === undefined) {
      throw new Error('Incomplete data')
    }
    const status = "quote";
    const fecha = new Date();
    const date_quote = new Date(fecha);
    const address = getAddress(TRANSACTION_FAMILY, txid1);
    const payload = JSON.stringify({ func: 'post', args: { transaction: { values, date_quote, status,signature }, txid: txid1 } });
    let resc = await sendTransaction([{
      transactionFamily: TRANSACTION_FAMILY,
      transactionFamilyVersion: TRANSACTION_FAMILY_VERSION,
      inputs: [address],
      outputs: [address],
      payload
    }]);
    console.log(resc.data)
    return res.status(200).json("The quote was made on date: " + date_quote + "correctly, with the id: " + txid1);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ err });
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

module.exports.getQuoteHistory = async function (req, res) {
  let state = await readFile('./data/current_state.json');
  if (!(req.params.id in state)) {
    return res.status(404).json('not found');
  }
  return res.json(state[req.params.id]);
} 