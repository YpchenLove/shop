const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Image extends Model {
    // 获取完整路径列表
    static getImgUrl(value, data) {
        let finalUrl = value
        if (data.from === 1) {
            finalUrl = global.config.host + 'images' + value
        }
        return finalUrl
    }
}

Image.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: Sequelize.STRING,             // 图片路径
    from: Sequelize.INTEGER            // 来源
}, {
    sequelize: db,
    tableName: 'image'
})

module.exports = { Image }
