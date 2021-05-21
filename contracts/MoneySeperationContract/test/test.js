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
    manufacturerId: "rer2323342",
    catalogItemId: "sjdfhgfhrefrf",
    printSettingsIds: "hdahdjsahdsjde",
    signature: "cVbdRomnb0GQIjVI7itA6A+Xam7Y7oPewCMgejLJMl0GfOW7PHH6cl57F1zNbdHPz1GT2qnKaV5f5QJj39R6uylfNOwWGk4yv332b8PBGwRbHauqtLXV5WayxjTHEtCUmSrtvUVcsVrLGlgXyjOCuTJ800xzGRrVwzRcx/Ugo56d4Gx7omA6zHcHigY/GCSVImRwxBoOeFUiEywUVIctCkZGvUGemmlex0+/cRQg/WG6sGQJub+CNJCO5iLFPhvn0R5RAal++Qbs0fpj2Ki3eAf9gvhh0KROFCDN5k8rNPsLK6XoJ9Mg7egZvBkn9mvZmljmL3ycocv0MIEDZ/GEKw=="
  }
  it('must have an quotationId',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
        }
        const put = await axios.put(`http://localhost:3003/api/order/`, data1)
        assert.fail("ee");
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
        const put = await axios.put(`http://localhost:3003/api/order/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
    it('must have an signature',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2",
          quotation: {
            clientId: 8372
          }
        }
        const put = await axios.put(`http://localhost:3003/api/order/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('Should add the order correctly',
    async () => {
      try {
        await axios.post(`http://localhost:3001/api/quote/`, data);
        var data1 = {
          id: "dwwedwe323ede",
          quotationId: "1827172y2ws2w2",
          quotation: {
            clientId: 8372
          },
          signature:"W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
        }
        const put = await axios.put(`http://localhost:3003/api/order/`, data1)
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
  it('There is no order with that id',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2dd";
        const post = await axios.get(`http://localhost:3003/api/order/${txid1}`);
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