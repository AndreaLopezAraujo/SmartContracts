const crypto = require('crypto')

const {
  InvalidTransaction
} = require('sawtooth-sdk/processor/exceptions');

const TP_FAMILY = 'quotes';
const TP_VERSION = '1.0';

const hash512 = (x) =>
  crypto.createHash('sha512').update(x).digest('hex');

const TP_NAMESPACE = hash512(TP_FAMILY).substring(0, 6)

const addressIntKey = (key) => {
  return TP_NAMESPACE + hash512(key).slice(-64)
}
addressIntKey.keysCanCollide = true;


const handlers = {
  async post([context], { transaction, txid }) {
    const { values, date_quote, status, signatureUser, msg } = transaction;
    if (values === undefined || date_quote === undefined || status === undefined || signatureUser === undefined || msg === undefined) {
      throw new InvalidTransaction('Incomplete data');
    }
    if (status != "quote") {
      throw new InvalidTransaction('status incorrect');
    }
    await context.putState(txid, transaction);
    return;
  },
  async put([context], { transaction, txid }) {
    let ps = false;
    const { values, date_quote, status, signatureUser, msg } = transaction;
    if (values === undefined || date_quote === undefined || status === undefined || signatureUser === undefined || msg === undefined) {
      throw new InvalidTransaction('Incomplete data');
    }
    if (status == "order") {
      const { date_order, pay } = transaction;
      if (date_order === undefined || pay === undefined) { throw new InvalidTransaction('Incomplete data'); }
      else ps = true;
    }
    else if (status == "printing") {
      const { msgManufacture, date_order, date_printing, signatureManufacturer, pay } = transaction;
      if (msgManufacture === undefined || date_order === undefined || date_printing === undefined || signatureManufacturer === undefined || pay === undefined) { throw new InvalidTransaction('Incomplete data'); }
      else ps = true;
    }
    else if (status == "deliver") {
      const { msgManufacture, date_order, date_printing, date_deliver, signatureManufacturer, pay } = transaction;
      if (date_deliver === undefined || msgManufacture === undefined || date_order === undefined || date_printing === undefined || signatureManufacturer === undefined || pay === undefined) { throw new InvalidTransaction('Incomplete data'); }
      else ps = true;
    }
    else if (status == "finish") {
      const { msgManufacture, date_order, date_printing, date_deliver, date_printed, signatureManufacturer, pay } = transaction;
      if (date_printed === undefined || date_deliver === undefined || msgManufacture === undefined || date_order === undefined || date_printing === undefined || signatureManufacturer === undefined || pay === undefined) { throw new InvalidTransaction('Incomplete data'); }
      else ps = true;
    }
    else if (status == "return") {
      const { msgManufacture, date_order, date_printing, date_return, signatureManufacturer } = transaction;
      if ( date_return== undefined|| msgManufacture === undefined || date_order === undefined || date_printing === undefined || signatureManufacturer === undefined ) { throw new InvalidTransaction('Incomplete data'); }
      else ps = true;
    }
    if (ps === true) {
      await context.deleteState(txid);
      await context.putState(txid, transaction);
    }
    else{
      throw new InvalidTransaction('status incorrect');
    }
    return;
  }
};

module.exports = { TP_FAMILY, TP_VERSION, TP_NAMESPACE, handlers, addresses: [addressIntKey] };