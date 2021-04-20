//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const assert = require('chai').assert;

const TPHandler = require('../controller/quote')
//const contextMock = require('../src/helpers/contextMock')


describe('simple', ()=>{
  it('constants are defined', ()=>{
    assert.equal(TPHandler.TRANSACTION_FAMILY, 'quotes');
    assert.equal(TPHandler.TRANSACTION_FAMILY_VERSION, '1.0');
    assert.equal(TPHandler.TINT_KEY_NAMESPACE.length, 6);
  })

  it('address works', ()=>{
    assert.equal(TPHandler.addresses.length, 1);
    assert.equal(TPHandler.addresses[0]('some key').length, 70);
    assert.equal(TPHandler.addresses[0]('some key').slice(0,6), TPHandler.TP_NAMESPACE);
  })
});

describe('pst handler', ()=>{
  it('no id', async ()=>{
    try{
      await TPHandler.postQuote({value:'value1'},{})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('no value', async ()=>{
    let contexts = [contextMock()];
    try{
      await TPHandler.handlers.put(contexts, {id: 'id1'})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('ok', async ()=>{
    let contexts = [contextMock()];
    await  TPHandler.handlers.put(contexts, {
      price: 100,
      id: "1827172y2ws2w2", 
      deliveryDate: "20/03/2021",
      clientId: "ac.lopez",
      printerId: "8372",
      manufacturerId: "rer2323342"
      })
    assert.equal(contexts[0]._state['id']);
    //assert.deepEqual(contexts[0]._events[0].slice(0,3), ["myevent", [['name', 'handlerCalled']], Buffer.from("event", "utf8")]);
  })

});  