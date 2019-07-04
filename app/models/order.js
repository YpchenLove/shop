const _ = require('lodash')
const { db } = require('../../core/db')
const { Sequelize, Model, Op } = require('sequelize')
const { Product } = require('./product')
const { OrderProduct } = require('./order-product')
const { UserAddress } = require('./user-address')
const { User } = require('./user')
const { Auth } = require('../../middlewares/auth')

let _uid = 111
let _products = []
let _oProducts = []

class Order extends Model {
    // 创建订单
    static async createOrder(oProducts, uid) {
        // 获取商品数组的 ids
        _uid = uid
        _oProducts = oProducts

        // 找到传递过来的商品
        const products = await Order.getProductsByOrder(oProducts)
        _products = products

        // 验证订单状态
        const status = await Order.getOrderStatus(oProducts, products)
        if (!status.pass) {
            status.orderId = -1
            return status
        }
        
        // 创建订单
        const orderSnap = await Order.snapOrder(status)
        
        // 订单参数
        const snap = {
            orderNo: Order.OrderNo(),
            userId: 1,
            totalPrice: orderSnap.totalPrice,
            totalCount: orderSnap.totalCount,
            snapImg: orderSnap.snapImg,
            snapName: orderSnap.snapName,
            snapAddress: orderSnap.snapAddress,
            snapItems: orderSnap.pStatus
        }

        // 订单通过 事务
        return db.transaction(async t => {
            const order = await Order.create({ ...snap }, { transaction: t })
            const orderId = order.id
            _oProducts.forEach(_oProduct => {
                _oProduct.orderId = orderId
            })
            
            await OrderProduct.bulkCreate(_oProducts, {transaction: t})

            return {
                orderId: order.id,
                // createdAt: new Date(order.created_at).toLocaleString(),
                createdAt: order.created_at,
                orderNo: order.orderNo,
                pass: true
            }

        })
    }

    // 分页获取订单  page count
    static async getOrders(userId, page, count) {
        const orders = await Order.findAll({
            limit: count,
            offset: (page - 1) * count,
            where: {
                userId
            },
            attributes: {
                exclude: ['userId']
            }
        })
        // if (orders.length < 1) {
        //     throw new global.errs.NotFound('当前用户没有创建订单了！')
        // }
        return orders

    }

    // 获取订单详情
    static async getOrderDetail(userId, orderID) {
        const order = await Order.findOne({
            where: {
                id: orderID,
                userId
            },
            raw: true,
            attributes: {
                exclude: ['deleted_at', 'updated_at', 'userId']
            }
        })
        if (!order) {
            throw new global.errs.NotFound('没有查询到订单详情！')
        }
        order.created_at = new Date(order.created_at).toLocaleString()
        order.snapAddress = JSON.parse(order.snapAddress)
        return order
    }

    // 根据orderId 查询订单信息
    static async checkOrderStock(orderId) {
        const oProducts = await OrderProduct.findAll({
            where: {
                orderId
            }
        })
        const products = await Order.getProductsByOrder(oProducts)
        const status = await Order.getOrderStatus(oProducts, products)
        
        return status

    }

    // 根据传递的参数获取商品信息
    static async getProductsByOrder(oProducts) {
        const ids = oProducts.map(product => {
            return product.productId
        })
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            attributes: ['id', 'price', 'stock', 'name', 'mainImgUrl']
        })
        return products
    }

    // 生成订单号
    static OrderNo() {
        const myDate = new Date()
        const myYear = myDate.getFullYear()             // 获取当前年份
        const myMonth = myDate.getMonth() + 1           // 获取当前月份
        const myDay = myDate.getDate()                  // 获取当前日（1- 31）
        const myHours = myDate.getHours()               // 获取当前小时(0-23)
        const myMinu = myDate.getMinutes()              // 获取当前分钟(0-59)
        const mySec = myDate.getSeconds()               // 获取当前秒数(0-59)
        const myMilSec = myDate.getMilliseconds()          // 获取当前毫秒数(1-999)
        const yCode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

        const orderSn = yCode[myYear - 2018] + myMonth.toString(16) + myDay + myHours + myMinu + mySec + myMilSec + _.random(10, 99)
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
        snap.pStatus = JSON.stringify(status.pStatusArray)
        snap.snapAddress = await Order.getOrderAddress()
        snap.snapName = _products[0].name
        snap.snapImg = global.config.host + 'images' + _products[0].mainImgUrl
        if (_products.length > 1) {
            snap.snapName += '等'
        }
        return snap
    }

    // 订单地址
    static async getOrderAddress() {
        const address = await UserAddress.getAddress(_uid)
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
            const pStatus = Order.getProductStatus(oProduct.productId, oProduct.count, products)
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
            totalPrice: 0,
            mainImgUrl: ''
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
            pStatus.mainImgUrl =  global.config.host + 'images' + product.mainImgUrl
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
        unique: true
    },                                      // 订单号
    userId: Sequelize.INTEGER,              // 用户id
    totalPrice: Sequelize.FLOAT,            // 总价格
    status: {
        type: Sequelize.INTEGER,              // 状态id
        defaultValue: 1
    },
    snapImg: Sequelize.STRING,              // 订单图片
    snapName: Sequelize.STRING,             // 图片
    totalCount: Sequelize.INTEGER,          // 图片url
    snapItems: Sequelize.STRING,            // 子类
    snapAddress: Sequelize.STRING,          // 地址
    prepayId: Sequelize.INTEGER,            // 支付id
}, {
    raw: false,
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
