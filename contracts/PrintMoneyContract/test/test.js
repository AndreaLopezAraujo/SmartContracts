//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const axios = require('axios').default;
const assert = require('chai').assert;
const valor = "abc2334567891011121314";
//Math.floor(Math.random() * (1000 - 0) + 0);
const valor2 = "abc2334567891011121314";
//Math.floor(Math.random() * (1000 - 0) + 0);

describe('Put deliver', async () => {
  //f();
  it('must have an quotationId',
    async () => {
      try {
        var data1 = {
          id: "" + valor2,
          quotation: {
            clientId: 8372
          },
          signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
        };
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an id',
    async () => {
      try {
        var data1 = {
          order: {
            id: "8372",
            quotationId: "" + valor
          }
        };
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an signature',
    async () => {
      try {
        var data1 = {
          id: "" + valor2,
          order: {
            id: "8372",
            quotationId: "" + valor
          },
        };
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('Should add the order deliver correctly',
    async () => {
      try {
        var data1 = {
          id: "a" + valor2,
          order: {
            id: "8372",
            quotationId: "a" + valor
          },
          signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
        };
        const put = await axios.put(`http://localhost:3004/api/deliver/`, data1)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
})

describe('Put finish printed', async () => {
  //f2();
  it('must have an quotationId',
    async () => {
      try {
        var data1 = {
          id: "" + valor2,
          quotation: {
            clientId: 8372
          },
          signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
        };
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an id',
    async () => {
      try {
        var data1 = {
          order: {
            id: "8372",
            quotationId: "" + valor
          }
        };
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('must have an signature',
    async () => {
      try {
        var data1 = {
          id: "" + valor2,
          order: {
            id: "8372",
            quotationId: "" + valor
          },
        };
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.fail(put);
      } catch (e) {
        assert.equal(e.message, "Request failed with status code 500");
      }
    }).timeout(20 * 1000);
  it('Should add the order finish correctly',
    async () => {
      try {
        var data1 = {
          id: "" + valor2,
          order: {
            id: "8372",
            quotationId: "" + valor
          },
          signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
        };
        const put = await axios.put(`http://localhost:3004/api/printFinish/`, data1)
        assert.equal(put.status, 200);
      } catch (e) {
        assert.fail(e.message);
      }
    }).timeout(20 * 1000);
})








async function f() {
  try {
    var data = {
      price: 100,
      id: "" + valor,
      deliveryDate: "20/03/2021",
      clientId: "ac.lopez",
      printerId: 8372,
      manufacturerId: "rer2323342",
      catalogItemId: "sjdfhgfhrefrf",
      printSettingsIds: "hdahdjsahdsjde",
      signature: "cVbdRomnb0GQIjVI7itA6A+Xam7Y7oPewCMgejLJMl0GfOW7PHH6cl57F1zNbdHPz1GT2qnKaV5f5QJj39R6uylfNOwWGk4yv332b8PBGwRbHauqtLXV5WayxjTHEtCUmSrtvUVcsVrLGlgXyjOCuTJ800xzGRrVwzRcx/Ugo56d4Gx7omA6zHcHigY/GCSVImRwxBoOeFUiEywUVIctCkZGvUGemmlex0+/cRQg/WG6sGQJub+CNJCO5iLFPhvn0R5RAal++Qbs0fpj2Ki3eAf9gvhh0KROFCDN5k8rNPsLK6XoJ9Mg7egZvBkn9mvZmljmL3ycocv0MIEDZ/GEKw=="
    };
    await axios.post(`http://localhost:3001/api/quote/`, data);
    var data1 = {
      id: "" + valor2,
      quotationId: "" + valor,
      quotation: {
        clientId: 8372
      },
      signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
    };
    await axios.put(`http://localhost:3003/api/order/`, data1);
    var data5 = {
      id: "" + valor2,
      order: {
        id: "8372",
        quotationId: "" + valor
      },
      signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
    }
    await axios.put(`http://localhost:3002/api/print/`, data5);
  }
  catch (e) {
  }
}


async function f2() {
  try {
    var data = {
      price: 100,
      id: "a" + valor,
      deliveryDate: "20/03/2021",
      clientId: "ac.lopez",
      printerId: 8372,
      manufacturerId: "rer2323342",
      catalogItemId: "sjdfhgfhrefrf",
      printSettingsIds: "hdahdjsahdsjde",
      signature: "cVbdRomnb0GQIjVI7itA6A+Xam7Y7oPewCMgejLJMl0GfOW7PHH6cl57F1zNbdHPz1GT2qnKaV5f5QJj39R6uylfNOwWGk4yv332b8PBGwRbHauqtLXV5WayxjTHEtCUmSrtvUVcsVrLGlgXyjOCuTJ800xzGRrVwzRcx/Ugo56d4Gx7omA6zHcHigY/GCSVImRwxBoOeFUiEywUVIctCkZGvUGemmlex0+/cRQg/WG6sGQJub+CNJCO5iLFPhvn0R5RAal++Qbs0fpj2Ki3eAf9gvhh0KROFCDN5k8rNPsLK6XoJ9Mg7egZvBkn9mvZmljmL3ycocv0MIEDZ/GEKw=="
    };
    await axios.post(`http://localhost:3001/api/quote/`, data);
    var data1 = {
      id: "a" + valor2,
      quotationId: "a" + valor,
      quotation: {
        clientId: 8372
      },
      signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
    };
    await axios.put(`http://localhost:3003/api/order/`, data1);
    var data5 = {
      id: "a" + valor2,
      order: {
        id: "8372",
        quotationId: "a" + valor
      },
      signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
    }
    await axios.put(`http://localhost:3002/api/print/`, data5);
    var data6 = {
      id: "a" + valor2,
      order: {
        id: "8372",
        quotationId: "a" + valor
      },
      signature: "W8VO/naC7b5msluGMvWsX5XScOvajAYWTKn2l6dSsfWQmC5S/Ze7JddljSJEIJTM7QmGjsF8ls958VPNwOhdKuAlUvPmp0T1rsq/rS4SEaCcdV8eygXKPJNfjvLc71WsHt2We8wYwlfAJr/pQyhG3lwZ182LwPJtA3rE1ob1E6wrTpdTZ78i/g8Z2LS3DRiD35IqeXjq/uFAUtnE1v9O29LHqrHUN1xnbYGp8gu2C3aXXBGFMi8ibJzHSU5noZBgzGc5bLGO+sPIQMTLBHa+/1FO8QUqx2Ffs/tAgaX08L1jWvt7dYDgzuGovEeBvyk0WEeNqaT/HpfQNgpBSeZESg=="
    };
    await axios.put(`http://localhost:3004/api/deliver/`, data6)
  }
  catch (e) {
  }
}