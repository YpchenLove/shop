const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Image } = require('./image')

class Category extends Model {
    // 获取 category 分类列表
    static async getAllCategory(id) {
        const categorys = await Category.findAll()
        for (let c of categorys) {
            const url = await Category.getImgUrl(c)
            c.setDataValue('img', url)
        }
        return categorys
    }

    // 获取图片url
    static async getImgUrl(item) {
        const img = await item.getImg()
        return {
            url: Image.getImgUrl(img.dataValues.url, img)
        }
    }
}

Category.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    topicImgId: Sequelize.INTEGER,          // 图片id
    name: Sequelize.STRING(16),             // 名字
    description: Sequelize.STRING(128)      // 描述
}, {
    sequelize: db,
    tableName: 'category'
})

//  关联 Image 模型
Category.belongsTo(Image, {
    foreignKey: 'topicImgId',
    as: 'img'
})

module.exports = { Category }
