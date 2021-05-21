//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const axios = require('axios').default;
const assert = require('chai').assert;


describe('Post', async () => {
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
  it('must have data',
    async () => {
      try {
        var data1 = {
          id: "1827172y2ws2w2",
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an manufacturerId',
    async () => {
      try {
        var data1 = {
          price: 100,
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an printerId',
    async () => {
      try {
        var data1 = {
          price: 100,
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          manufacturerId: "rer2323342"
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an clientId',
    async () => {
      try {
        var data1 = {
          price: 100,
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an price',
    async () => {
      try {
        var data1 = {
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an deliveryDate',
    async () => {
      try {
        var data1 = {
          price: 100,
          id: "1827172y2ws2w2",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an id',
    async () => {
      try {
        var data1 = {
          price: 100,
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342"
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an signature',
    async () => {
      try {
        var data1 = {
          price: 100,
          id: "1827172y2ws2w2",
          deliveryDate: "20/03/2021",
          clientId: "ac.lopez",
          printerId: 8372,
          manufacturerId: "rer2323342",
          catalogItemId: "sjdfhgfhrefrf",
          printSettingsIds: "hdahdjsahdsjde",
        }
        const post = await axios.post(`http://localhost:3001/api/quote/`, data1);
        assert.fail(200);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('I should add the quote correctly',
    async () => {
      try {
        const post = await axios.post(`http://localhost:3001/api/quote/`, data);
        assert.equal(post.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
  it('Get quote',
    async () => {
      try {
        const txid1 = "1827172y2ws2w2";
        const post = await axios.get(`http://localhost:3001/api/quote/${txid1}`);
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