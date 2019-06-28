const _ = require('lodash')
const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Product } = require('./product')

class Order extends Model {
    static async createOrder(oProducts) {
        // 获取商品数组的 ids
        const ids = oProducts.map(product => {
            return product.product_id
        })
        // 找到传递过来的商品
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            attributes: ['id', 'price', 'stock', 'name', 'mainImgUrl']
        })
        // 验证订单状态
        const status = this.getOrderStatus(oProducts, products)
        if (!status.pass) {
            // throw new global.errs.NotFound(`id: ${oProduct.product_id}的商品库存不足，创建商品失败！`)
            status.orderId = -1
            return status
        }
        // 创建订单

        return products
    }

    getOrderStatus(oProducts, products) {
        const status = {
            pass: true,
            orderPrice: 0,
            pStatusArray: []
        }
        oProducts.forEach(oProduct => {
            const pStatus = this.getProductStatus(oProduct.product_id, oProduct.count, products)
            if (!pStatus.havaStock) {
                status.pass = false
            }
            status.orderPrice += pStatus.totalPrice
            status.pStatusArray = _.concat(status.pStatusArray, pStatus)
        })
        return status
    }

    // 判断商品状态
    getProductStatus(oid, ocount, products) {
        let pIndex = -1
        const pStatus = {
            id: null,
            havaStock: false,
            count: 0,
            name: '',
            totalPrice: 0
        }
        for (let i = 0; i < products.length; i++) {
            if (oid === products[i].id) {
                pIndex = i
            }
        }
        if (pIndex === -1) {
            throw new global.errs.NotFound(`id: ${oid}的商品不存在，创建商品失败！`)
        } else {
            const product = products[pIndex]
            pStatus.id = product.id
            pStatus.count = ocount
            pStatus.name = product.name
            pStatus.havaStock = product.stock >= ocount
            pStatus.totalPrice = product.price * ocount
        }
        return pStatus
    }
}

Order.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNo: {
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
    tableName: 'order'
})

//  关联 bannerItem模型
// Product.hasMany(ProductImage, {
//     foreignKey: 'productId',
//     as: 'detail'
// })

//  关联 ProductProperty
// Product.hasMany(ProductProperty, {
//     foreignKey: 'productId',
//     as: 'properties'
// })

module.exports = { Order }
