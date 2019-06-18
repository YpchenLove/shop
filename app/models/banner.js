const util = require('util')
const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { BannerItem } = require('./bannerItem')

class Banner extends Model {
    // 获取banner列表
    static async getBanner(id) {
        const banner = await Banner.findOne({
            where: { id }
        })
        if (!banner) {
            throw new global.errs.NotFound()
        }
        const items = await BannerItem.findAll({
            where: { banner_id: id }
        })
        banner.setDataValue('items', items)
        return banner
    }
}

Banner.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(16),             // 名字
    description: Sequelize.STRING(128)      // 描述
}, {
    sequelize: db,
    tableName: 'banner'
})

module.exports = { Banner }
