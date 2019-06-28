const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Image extends Model {
    // 获取完整路径列表
    static getImgUrl(value, data) {
        let finalUrl = value
        if (data.from === 1) {
            // finalUrl = global.config.host + 'images' + value
            finalUrl = 'http://192.168.199.175:3000/images' + value      // 换成自己的局域网地址，可以用小程序真机访问
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
    url: {
        type: Sequelize.STRING
    },                                 // 图片路径
    from: Sequelize.INTEGER            // 来源
}, {
    sequelize: db,
    tableName: 'image'
})

module.exports = { Image }
