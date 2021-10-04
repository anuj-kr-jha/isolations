const cors = require('cors');
const db = require('./db');
const app = require('express')();
const { cr, sh, dr, c_dr, nrr, c_nrr, pr, c_pr } = require('./isolationLevel/index');
global.db = db;

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send('Welcome to mysql.');
});

app.listen(3000, function () {
    console.log(`Server is listening @ http://localhost:${3000}`);
});


global.db.sequelize.sync({force: true});

process.stdin.on('data', (data) => {
    switch (data.toString().slice(0, -1)) {
        case 'cr':
            cr();
            break;
        case 'sh':
            sh();
            break;
        case 'dr':
            dr();
            break;
        case 'c_dr':
            c_dr();
            break;
        case 'nrr':
            nrr()
            break;
        case 'c_nrr':
            c_nrr();
            break;
        case 'pr':
            pr();
            break;
        case 'c_pr':
            c_pr();
            break;
        case 'cls':
            console.clear();
            break;
        case 'h':
            const structDatas = [
                { Keyword: 'sh', Description: 'show table', Isolation_Level: '-------------', Defination: 'Display Table Data' },
                { Keyword: 'cr', Description: 'create sample data', Isolation_Level: '-------------', Defination: 'Insert 2 sample row.' },
                { Keyword: 'dr', Description: 'dirty read', Isolation_Level: 'READ_UNCOMMITTED', Defination: 'It happens when a transaction reads data written by other concurrent transaction that has not been committed yet.' },
                { Keyword: 'c_dr', Description: 'counter dirty read', Isolation_Level: 'READ_COMMITTED', Defination: 'Here transactions can only see data that has been committed by other transactions. Because of this, dirty read is' },
                { Defination: 'no longer possible.' },
                { Keyword: 'nrr', Description: 'non repeatable read', Isolation_Level: 'READ_COMMITTED', Defination: 'When a transaction reads the same record twice and see different values, because the row has been modified' },
                { Defination: 'by other transaction that was committed after the first read' },
                { Keyword: 'c_nnr', Description: 'counter non-repeatable read', Isolation_Level: 'REPEATABLE_READ', Defination: 'When a transaction reads the same record any number of times, this level ensure to return same values' },
                { Keyword: 'pr', Description: 'phantom read', Isolation_Level: 'REPEATABLE_READ', Defination: 'Confusion due to deletion or insertion of new row' },
                { Keyword: 'c_pr', Description: 'counter phantom read', Isolation_Level: 'SERIALIZABLE', Defination: 'Concurrent transactions running in this level are guaranteed to be able to yield the same result as if they’re ' },
                { Defination: 'executed sequentially in some order' },
            ];
            console.table(structDatas);
            break;

        default:
            break;
    }
});
