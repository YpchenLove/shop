const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Product extends Model {}

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

//  关联 bannerItem模型
// Banner.hasMany(BannerItem, {
//     foreignKey: 'bannerId',
//     as: 'items'
// })
module.exports = { Product }
