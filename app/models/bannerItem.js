const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Image } = require('./image')

class BannerItem extends Model {}

BannerItem.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imgId: Sequelize.INTEGER,       // 图片id
    keyWord: Sequelize.INTEGER,     // 关键词id
    type: Sequelize.INTEGER,        // 类型
    bannerId: Sequelize.INTEGER     // 轮播图类型id
}, {
    sequelize: db,
    tableName: 'banner_item'
})

//  关联 Image 模型
BannerItem.belongsTo(Image, {
    foreignKey: 'imgId',
    as: 'img'
})

module.exports = { BannerItem }
