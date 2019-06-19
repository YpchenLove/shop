const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Image } = require('./image')

class Theme extends Model {
    // 返回列表
    static async getThemeList() {
        const themes = await Theme.findAll()
        for (var theme of themes) {
            theme.setDataValue('topicImgId', await Theme.getTopic(theme))
            theme.setDataValue('headImgId', await Theme.getHead(theme))
        }
        return themes
    }
    static async getTopic(item) {
        const img = await item.getTopicImg()
        return {
            url: Image.getImgUrl(img.dataValues.url, img)
        }
    }

    static async getHead(item) {
        const img = await item.getHeadImg()
        return {
            url: Image.getImgUrl(img.dataValues.url, img)
        }
    }
}

Theme.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(16),             // 名字
    description: Sequelize.INTEGER,         // 描述
    topicImgId: Sequelize.INTEGER,          // 顶部图片
    headImgId: Sequelize.INTEGER            // 头图
}, {
    sequelize: db,
    tableName: 'theme'
})

//  关联 Image 模型
Theme.belongsTo(Image, {
    foreignKey: 'topicImgId',
    as: 'topicImg'
})
Theme.belongsTo(Image, {
    foreignKey: 'headImgId',
    as: 'headImg'
})

module.exports = { Theme }
