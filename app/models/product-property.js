const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ProductProperty extends Model {
    toJSON() {
        return {
            name: this.getDataValue('name'),
            detail: this.getDataValue('detail')
        }
    }
}

ProductProperty.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(12),             // 名称
    detail: Sequelize.INTEGER,              // 详情
    productId: Sequelize.STRING(12)         // 商品id
}, {
    sequelize: db,
    tableName: 'product_property'
})

module.exports = { ProductProperty }
