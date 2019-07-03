const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Image } = require('./image')

class OrderProduct extends Model {}

OrderProduct.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: Sequelize.INTEGER,           // 订单id
    productId: Sequelize.INTEGER,         // 商品id
    count: Sequelize.INTEGER              // 商品数量
}, {
    sequelize: db,
    tableName: 'order_product'
})

//  关联 Image 模型
// OrderProduct.belongsTo(Image, {
//     foreignKey: 'imgId',
//     as: 'img'
// })

module.exports = { OrderProduct }
