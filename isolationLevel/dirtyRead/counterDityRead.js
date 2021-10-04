async function counterDirtyRead() {
    const t1 = await db.sequelize.transaction({
        isolationLevel: db.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    const t2 = await db.sequelize.transaction({
        isolationLevel: db.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
        console.log('Transaction 1 Begins.');
        const table = await db.Sales.findAll({ transaction: t1, raw: true });
        console.log(`
        *******************************************************************************************
        * read table    // txn:1                                                                  *
        *******************************************************************************************
        `);
        console.table(table);

        console.log('Transaction 2 begins.');
        await db.Sales.increment('nQuantity', { by: 5, where: { id: 1 }, transaction: t2 });
        console.log(`
        *******************************************************************************************
        * increment nQuantity by 5  for id:1  // txn:2                                            *
        *******************************************************************************************
        `);
        console.table(await db.Sales.findAll({ transaction: t2, raw: true }));

        console.log('Transaction 1 Continues...');
        const sum = await db.Sales.sum('nQuantity', { transaction: t1 });
        console.log(`Sum(nQuantity) = ${sum}`);

        console.log('Transaction 1 COMMIT');
        await t1.commit();
        console.log('Transaction 2 ROLLBACK');
        await t2.rollback();
    } catch (error) {
        t2.rollback;
        t1.rollback;
    }
}

module.exports = counterDirtyRead;
