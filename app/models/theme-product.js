const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Image } = require('./image')
const { Product } = require('./product')

class ThemeProduct extends Model {}

ThemeProduct.init({
    themeId: Sequelize.INTEGER,         // 主题id
    productId: Sequelize.INTEGER        // 商品id
}, {
    sequelize: db,
    tableName: 'theme_product'
})

module.exports = { ThemeProduct }
