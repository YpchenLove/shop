const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Image } = require('./image')
const { ProductImage } = require('./product-image')
const { ProductProperty } = require('./product-property')

class Product extends Model {
    // 获取最近新品
    static async getRecent(count = 5) {
        const products = await Product.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            attributes: {
                exclude: ['summary', 'categoryId', 'imgId']
            },
            limit: count
        })
        if (products.length < 1) {
            throw new global.errs.NotFound()
        }
        for (let p of products) {
            const url = await Image.getImgUrl(p.getDataValue('mainImgUrl'), p)
            p.setDataValue('mainImgUrl', url)
            delete p.dataValues.from
        }
        return products
    }

    // 根据分类 id 获取商品
    static async getProductByCategoryID(id) {
        const products = await Product.findAll({
            where: {
                categoryId: id
            },
            attributes: {
                exclude: ['summary', 'imgId']
            }
        })
        if (products.length < 1) {
            throw new global.errs.NotFound()
        }
        for (let p of products) {
            const url = await Image.getImgUrl(p.getDataValue('mainImgUrl'), p)
            p.setDataValue('mainImgUrl', url)
        }
        return products
    }

    // 获取商品详情
    static async getProduct(id) {
        const product = await Product.findOne({
            where: { id }
        })
        if (!product) {
            throw new global.errs.NotFound('未找到商品！')
        }
        // url
        const url = await Image.getImgUrl(product.getDataValue('mainImgUrl'), product)
        // properties
        const properties = await product.getProperties()
        const detailImgs = await product.getDetail({
            order: [
                ['order']
            ],
            attributes: {
                exclude: ['productId']
            }
        })
        // detailImgs
        for (let d of detailImgs) {
            const img = await d.getImg()
            const url = await Image.getImgUrl(img.getDataValue('url'), img)

            d.setDataValue('url', url)
        }

        product.setDataValue('mainImgUrl', url)
        product.setDataValue('detail', detailImgs)
        product.setDataValue('properties', properties)

        return product
    }
}

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
Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    as: 'detail'
})

//  关联 ProductProperty
Product.hasMany(ProductProperty, {
    foreignKey: 'productId',
    as: 'properties'
})

module.exports = { Product }
