//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const axios = require('axios').default;
const assert = require('chai').assert;


describe('Put deliver', async () => {
  var data = {
    price: 100,
    id: "1827172y2ws2w2",
    deliveryDate: "20/03/2021",
    clientId: "ac.lopez",
    printerId: 8372,
    manufacturerId: "rer2323342"
  }
  it('must have an quotationId',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
        await axios.put(`http://localhost:3002/api/print/`, data1)
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('must have an id',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          quotationId: "1827172y2ws2w2"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
        await axios.put(`http://localhost:3002/api/print/`, data1)
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('Should add the order delivered correctly',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
        await axios.put(`http://localhost:3002/api/print/`, data1)
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('Get deliver',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2";
        const post = await axios.get(`http://localhost:3004/api/deliver/${txid1}`);
        assert.equal(post.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('There is no deliver with that id',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2dd";
        const post = await axios.get(`http://localhost:3004/api/deliver/${txid1}`);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 404");
      }
    }).timeout(20 * 1000);
    it('Get quote is not a quote',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2";
        const post = await axios.get(`http://localhost:3001/api/quote/${txid1}`);
        assert.equal(post.status, 201);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
});
//Finish print
describe('Put order finish', async () => {
  var data = {
    price: 100,
    id: "1827172y2ws2w23",
    deliveryDate: "20/03/2021",
    clientId: "ac.lopez",
    printerId: 8372,
    manufacturerId: "rer2323342"
  }
  it('must have an quotationId',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
        await axios.put(`http://localhost:3002/api/print/`, data1)
        await axios.put(`http://localhost:3004/api/deliver/`, data1)
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('must have an id',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          quotationId: "1827172y2ws2w2"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
        await axios.put(`http://localhost:3002/api/print/`, data1)
        await axios.put(`http://localhost:3004/api/deliver/`, data1)
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('Should add the order delivered correctly',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w23"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
        await axios.put(`http://localhost:3002/api/print/`, data1)
        await axios.put(`http://localhost:3004/api/deliver/`, data1)
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('Get order finish',
    async () => {
      try {
        const txid1 = "1827172y2ws2w23";
        const post = await axios.get(`http://localhost:3004/api/printFinish/${txid1}`);
        assert.equal(post.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('There is no order finish with that id',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2dd";
        const post = await axios.get(`http://localhost:3004/api/printFinish/${txid1}`);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 404");
      }
    }).timeout(20 * 1000);
});