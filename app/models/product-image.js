const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Image } = require('./image')
const { Product } = require('./product')

class ProductImage extends Model {}

ProductImage.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imgId: Sequelize.INTEGER,           // 图片id
    productId: Sequelize.INTEGER,       // 商品id
    order: Sequelize.INTEGER            // 商品排序
}, {
    sequelize: db,
    tableName: 'product_image'
})

module.exports = { ProductImage }
