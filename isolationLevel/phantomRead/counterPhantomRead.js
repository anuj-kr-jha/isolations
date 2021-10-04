async function counter_phantomRead() {
    const t1 = await db.sequelize.transaction({
        isolationLevel: db.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    const t2 = await db.sequelize.transaction({
        isolationLevel: db.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    try {
        console.log('Transaction 1 Begins.');
        console.log(`
        *******************************************************************************************
        * sum nQuantity    // txn:1                                                               *
        *******************************************************************************************
        `);
        const res_1 = await db.Sales.sum('nQuantity', { transaction: t1 });
        console.log(`Sum(nQuantity) = ${res_1}`);

        console.log('Transaction 2 begins.');
        console.log('But Transaction 2 gets blocked as Txn1 is still in progress and we used strict isolation level "SERIALIZABLE".');
        await db.Sales.destroy({ where: { id: 1 }, transaction: t2 });
        console.log(`
        *******************************************************************************************
        * deleted row where id=2  // txn:2                                                        *
        *******************************************************************************************
        `);
        console.log('Transaction 2 COMMIT');
        await t2.commit();

        console.log('Transaction 1 Continues...');
        console.log(`
        *******************************************************************************************
        * sum nQuantity    // txn:1                                                               *
        *******************************************************************************************
        `);
        const res_2 = await db.Sales.sum('nQuantity', { transaction: t1 });
        console.log(`Sum(nQuantity) = ${res_2}`);

        console.log('Transaction 1 COMMIT');
        await t1.commit();
    } catch (error) {
        t2.rollback;
        t1.rollback;
    }
}

module.exports = counter_phantomRead;
