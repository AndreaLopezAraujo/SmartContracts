const { Contract, Context } = require('fabric-contract-api');
class LedgerContract extends Contract {
    constructor() {
        super('org.pln.PharmaLedgerContract');
    }
    async addQuote(ctx, moneyPrice, material, timePrice, docName, date, userId, printerId) {
        // addQuote logic 
        let dt = new Date();
        const quote = {
            id: 12345,
            MoneyPrice: moneyPrice,
            Material:material,
            TimePrice:timePrice,
            DocName:docName,
            PrintDate:date,
            UserId:userId,
            PrinterId:printerId,
            previousOwnerType: 'QUOTE',
            currentOwnerType: 'QUOTE',
            createDateTime: dt,
            lastUpdated: dt
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(quote)));
    }
    async getQuotationById(ctx, key) {
        let iterator = await ctx.stub.getHistoryForKey(key);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        console.info(result);
        return JSON.stringify(result);
    }
    async valideQuotationById(ctx, key,DatePrices) {
        const quote= getQuotationById(ctx, key);
        dateQuote=quote.createDateTime;
        if(DatePrices>dateQuote){
            printQuote=quote.PrinterId;
            datePrintQuote=quote.PrintDate;
            //verificarFecha impresora
            if (true)
            {
                return true;
            }
        }
            return false
    }
}