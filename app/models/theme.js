const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Image } = require('./image')
const { Product } = require('./product')
const { ThemeProduct } = require('./theme-product')

class Theme extends Model {
    // 获取列表
    static async getThemeList(ids) {
        const themes = await Theme.findAll({
            where: {
                id: {
                    [Op.or]: ids
                }
            }
        })
        if (themes.length < 1) {
            throw new global.errs.NotFound()
        }
        for (var theme of themes) {
            theme.setDataValue('topicImg', await Theme.getTopic(theme))
            delete theme.dataValues.topicImgId
            theme.setDataValue('headImg', await Theme.getHead(theme))
            delete theme.dataValues.headImgId
        }
        return themes
    }

    // 获取主题详情
    static async getThemeWithProduct(id) {
        const theme = await Theme.findOne({
            where: { id }
        })
        if (!theme) {
            throw new global.errs.NotFound()
        }
        theme.setDataValue('topicImg', await Theme.getTopic(theme))
        delete theme.dataValues.topicImgId
        theme.setDataValue('headImg', await Theme.getHead(theme))
        delete theme.dataValues.headImgId
        const products = await theme.getProducts()
        for (let p of products) {
            const url = await Image.getImgUrl(p.dataValues.mainImgUrl, p)
            p.setDataValue('mainImgUrl', url)
            delete p.dataValues.ThemeProduct
        }
        theme.setDataValue('products', products)
        return theme
    }

    // 获取topic图片
    static async getTopic(item) {
        const img = await item.getTopicImg()
        return {
            url: Image.getImgUrl(img.dataValues.url, img)
        }
    }

    // 获取head图片
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

// 关联ThemeProduct 模型
Theme.belongsToMany(Product, {
    through: ThemeProduct,
    as: 'products'
})

module.exports = { Theme }
