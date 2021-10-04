const dr = require('./dirtyRead/dityRead');
const c_dr = require('./dirtyRead/counterDityRead');
const nrr = require('./nonRepeatableRead/nonRepeatableRead');
const c_nrr = require('./nonRepeatableRead/counterNonRepeatableRead');
const pr = require('./phantomRead/phantomRead');
const c_pr = require('./phantomRead/counterPhantomRead');

module.exports = {
    cr: async () => {
        const mobile = await db.Sales.create({ sName: 'mobile', nQuantity: 20, nPrice: 2000 });
        const laptop = await db.Sales.create({ sName: 'laptop', nQuantity: 30, nPrice: 3000 });
    },
    sh: async () => {
        const table = await db.Sales.findAll({ raw: true });
        console.table(table, ['id', 'sName', 'nQuantity', 'nPrice']);
    },
    dr,
    c_dr,
    nrr,
    c_nrr,
    pr,
    c_pr,
};
