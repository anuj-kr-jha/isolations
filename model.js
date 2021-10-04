module.exports = (sequelize, DataTypes) => {
    const Sales = sequelize.define(
        'Sales',
        {
            sName: {
                type: DataTypes.STRING,
            },
            nQuantity: {
                type: DataTypes.INTEGER,
            },
            nPrice: {
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false,
        }
    );

    return Sales;
};
