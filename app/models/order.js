const _ = require('lodash')
const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Product } = require('./product')
const { UserAddress } = require('./user-address')
const { Auth } = require('../../middlewares/auth')

class Order extends Model {
    constructor() {
        super()
        this.oProducts = []
        this.products = []
        this.uid = null
    }
    static async createOrder(oProducts, uid) {
        // 获取商品数组的 ids
        this.oProducts = oProducts
        this.uid = uid
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
        this.products = products

        // 验证订单状态
        const status = await Order.getOrderStatus(oProducts, products)
        if (!status.pass) {
            status.orderId = -1
            return status
        }
        // 创建订单
        const orderSnap = await Order.snapOrder(status)

        const order = Object.assign(orderSnap, {
            userId: this.uid,
            orderNo: Order.nameOrderNo()
        })
        delete order.pStatus
        console.log(order)
        await Order.create(order)

        return 1
    }

    

    // 生成订单号
    static nameOrderNo() {
        const myDate = new Date()
        const myYear = myDate.getFullYear()             // 获取当前年份
        const myMonth = myDate.getMonth() + 1           // 获取当前月份
        const myDay = myDate.getDate()                  // 获取当前日（1- 31）
        const myHours = myDate.getHours()               // 获取当前小时(0-23)
        const myMinu = myDate.getMinutes()              // 获取当前分钟(0-59)
        const mySec = myDate.getSeconds()               // 获取当前秒数(0-59)
        const myMilSec = myDate.getMilliseconds()          // 获取当前毫秒数(1-999)
        const yCode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

        const orderSn = yCode[myYear - 2018] + myMonth.toString(16) + myDay + myHours + myMinu + mySec + myMilSec + _.random(0, 999)
        return orderSn
    }

    // 订单快照
    static async snapOrder(status) {
        const snap = {
            totalPrice: 0,
            totalCount: 0,
            pStatus: [],
            snapAddress: null,
            snapName: '',
            snapImg: '',
        }
        snap.totalPrice = status.orderPrice
        snap.totalCount = status.totalCount
        snap.snapItems = JSON.stringify(status.pStatusArray)
        snap.snapAddress = await Order.getOrderAddress()
        snap.snapName = this.products[0].name
        snap.snapImg = this.products[0].mainImgUrl
        if (this.products.length > 1) {
            snap.snapName += '等'
        }
        return snap
    }

    // 订单地址
    static async getOrderAddress() {
        const address = await UserAddress.getAddress(this.uid)
        return JSON.stringify(address)
    }

    // 判断订单状态
    static getOrderStatus(oProducts, products) {
        const status = {
            pass: true,
            orderPrice: 0,
            totalCount: 0,
            pStatusArray: []
        }
        oProducts.forEach(oProduct => {
            const pStatus = Order.getProductStatus(oProduct.product_id, oProduct.count, products)
            if (!pStatus.havaStock) {
                status.pass = false
            }
            status.orderPrice += pStatus.totalPrice
            status.totalCount += pStatus.count
            status.pStatusArray = _.concat(status.pStatusArray, pStatus)
        })
        return status
    }


    // 判断商品状态
    static getProductStatus(oid, ocount, products) {
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
        comment: '订单号'
    },                                      // 名字
    userId: Sequelize.INTEGER,                 // 价格
    totalPrice: Sequelize.FLOAT,               // 库存
    status: Sequelize.INTEGER,                  // 分类id
    snapImg: Sequelize.STRING,                // 属于
    snapName: Sequelize.STRING,               // 图片id
    totalCount: Sequelize.INTEGER,          // 图片url
    snapItems: Sequelize.STRING,            // 描述
    snapAddress: Sequelize.STRING,          // 描述
    prepayId: Sequelize.INTEGER,            // 描述
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
