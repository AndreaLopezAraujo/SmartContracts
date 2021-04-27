//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const axios = require('axios').default;
const assert = require('chai').assert;


describe('Put', async () => {
  var data = {
    price: 100,
    id: "1827172y2ws2w2",
    deliveryDate: "20/03/2021",
    clientId: "ac.lopez",
    printerId: 8372,
    manufacturerId: "rer2323342"
  }
  it('I should add the order correctly',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1={
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2"
        }
        const put= await axios.put(`http://localhost:3003/api/order/`, data1)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('Get order',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2";
        const post = await axios.get(`http://localhost:3003/api/order/${txid1}`);
        assert.equal(post.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('There is no quote with that id',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2dd";
        const post = await axios.get(`http://localhost:3001/api/quote/${txid1}`);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 404");
      }
    }).timeout(20 * 1000);
});