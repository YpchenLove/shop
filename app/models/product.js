const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Image } = require('./image')

class Product extends Model {
    // 获取最近新品
    static async getRecent(count) {
        const products = await Product.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            attributes: {
                exclude: ['summary', 'from', 'categoryId', 'imgId']
            },
            limit: count
        })
        if (products.length < 1) {
            throw new global.errs.NotFound('分类不存在！')
        }
        for (let p of products) {
            const url = await Image.getImgUrl(p.getDataValue('mainImgUrl'), p)
            p.setDataValue('mainImgUrl', url)
        }
        return products
    }
}

Product.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(64),
        comment: '商品的名称'
    },                                      // 名字
    price: Sequelize.FLOAT,                 // 价格
    stock: Sequelize.INTEGER,               // 库存
    categoryId: Sequelize.INTEGER,          // 分类id
    from: Sequelize.INTEGER,                // 属于
    imgId: Sequelize.INTEGER,               // 图片id
    mainImgUrl: Sequelize.STRING(128),      // 图片url
    summary: Sequelize.STRING(128)          // 描述
}, {
    sequelize: db,
    tableName: 'product'
})

module.exports = { Product }
