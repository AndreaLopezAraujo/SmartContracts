//https://mochajs.org
//https://www.chaijs.com/guide/styles/#assert
const assert = require('chai').assert;

const TPHandler = require('../src/handler')
const contextMock = require('../src/helpers/contextMock')


describe('simple', ()=>{
  it('constants are defined', ()=>{
    assert.equal(TPHandler.TP_FAMILY, 'quotes');
    assert.equal(TPHandler.TP_VERSION, '1.0');
    assert.equal(TPHandler.TP_NAMESPACE.length, 6);
  })

  it('address works', ()=>{
    assert.equal(TPHandler.addresses.length, 1);
    assert.equal(TPHandler.addresses[0]('some key').length, 70);
    assert.equal(TPHandler.addresses[0]('some key').slice(0,6), TPHandler.TP_NAMESPACE);
  })
});

describe('post handler', ()=>{
  
  it('type not todo', async ()=>{
    let contexts = [contextMock()];
    try{
      const data = {type: 'something'};
      await TPHandler.handlers.post(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('no id', async ()=>{
    let contexts = [contextMock()];
    try{
      const data = {type: 'todo'};
      await TPHandler.handlers.post(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('input not null', async ()=>{
    let contexts = [contextMock()];
    try{
      const data = {price: 100,
        id: "1827172y2ws2w2" ,
        deliveryDate: "20/03/2021",
        clientId: "ac.lopez",
        printerId: 8372,
        manufacturerId: "rer2323342"};
      await TPHandler.handlers.post(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw');
    }
  })

});

describe('put handler', ()=>{
  
  it('type not todo', async ()=>{
    let contexts = [contextMock()];
    try{
      const data = {type: 'something'};
      await TPHandler.handlers.put(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('no input', async ()=>{
    let contexts = [contextMock()];
    try{
      const data = {type: 'quotes'};
      await TPHandler.handlers.put(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('UTXO does not exist', async ()=>{
    let contexts = [contextMock()];
    try{
      const data = {type: 'quotes', input: '123'};
      await TPHandler.handlers.put(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })

  it('not owner of UTXO', async ()=>{
    let contexts = [contextMock()];
    try{
      const txid0 = '000'
      contexts[0]._state[txid0] = {owner: '007', value: 1};
      contexts[0].publicKey = '008';

      const data = {type: 'quotes', input: txid0};
      await TPHandler.handlers.put(contexts, {transaction: JSON.stringify(data)})
      assert.fail('Should Throw');
    }
    catch(e){
      assert.equal(e.message, 'Should Throw')
    }
  })
});