const util = require('util')
const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class BannerItem extends Model {
}

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

module.exports = { BannerItem }
