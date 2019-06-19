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
        const items = await banner.getItems()
        items.forEach((item) => {
            console.log(item)
        })
        banner.setDataValue('items', items)
        return banner
    }

    // 获取banner详情
    static async getBannerDetail(id) {
        const banner = await BannerItem.findOne({
            where: { id }
        })
        if (!banner) {
            throw new global.errs.NotFound()
        }
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

//  关联 bannerItem模型
Banner.hasMany(BannerItem, {
    foreignKey: 'bannerId',
    as: 'items'
})
module.exports = { Banner }
