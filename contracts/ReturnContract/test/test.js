//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const axios = require('axios').default;
const assert = require('chai').assert;


describe('Put', async () => {
  it('must have an quotationId',
    async () => {
      try {
        var data = {
          price: 100,
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
              await axios.put(`http://localhost:3002/api/print/`, data1)
              await axios.put(`http://localhost:3004/api/deliver/`, data1)
        var data3 = {
          id: "dwwedwe323ede"
        }
        const put = await axios.put(`http://localhost:3005/api/return/`, data3)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('must have an id',
    async () => {
      try {
        var data = {
          price: 100,
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2"
        }
        await axios.put(`http://localhost:3003/api/order/`, data1)
              await axios.put(`http://localhost:3002/api/print/`, data1)
              await axios.put(`http://localhost:3004/api/deliver/`, data1)
        var data3 = {
          quotationId: "1827172y2ws2w25"
        }
        const put = await axios.put(`http://localhost:3005/api/return/`, data3)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('Should add the cancel order correctly (order)',
    async () => {
      try {
        var data2 = {
          price: 100,
          id: "1827172y2ws2w256",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        await axios.post(`http://localhost:3001/api/quote/`, data2);
        var data3 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w256"
        }
        const a=await axios.put(`http://localhost:3003/api/order/`, data3)
        const put = await axios.put(`http://localhost:3005/api/return/`, data3)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
    it('Should add the cancel order correctly (print)',
    async () => {
      try {
        var data2 = {
          price: 100,
          id: "1827172y2ws2w25",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        await axios.post(`http://localhost:3001/api/quote/`, data2);
        var data3 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w25"
        }
        const a=await axios.put(`http://localhost:3003/api/order/`, data3)
        const b=await axios.put(`http://localhost:3002/api/print/`, data3)
        const put = await axios.put(`http://localhost:3005/api/return/`, data3)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
    it('Should add the cancel order correctly (delivered)',
    async () => {
      var data2 = {
        price: 100,
        id: "1827172y2ws2w2567",
        deliveryDate: "20/03/2021",
        clientId: "ac.lopez",
        printerId: 8372,
        manufacturerId: "rer2323342"
      }
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data2);
        var data3 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2567"
        }
        const a=await axios.put(`http://localhost:3003/api/order/`, data3)
        const b=await axios.put(`http://localhost:3002/api/print/`, data3)
        const c=await axios.put(`http://localhost:3004/api/deliver/`, data3)
        const put = await axios.put(`http://localhost:3005/api/return/`, data3)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
});