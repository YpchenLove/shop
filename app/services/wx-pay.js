const { Auth } = require('../../middlewares/auth')
const { Order } = require('../models/order')
const { orderType } = require('../lib/enum')

class Pay {
    constructor(orderId) {
        this.orderId = this.orderId
        this.orderNo = ''
    }
    // 支付
    static async pay() {
        const status = await Order.checkOrderStock(this.orderId)
    }

    // 检验订单，返回订单号
    static async checkOrderValid() {
        const order = Order.findOne({
            where: {
                id: this.orderId
            }
        })
        if (!order) {
            throw new global.errs.NotFound('未找到订单！')
        }
        if (!Auth.isValidOperate(order.userId)) {
            throw new global.errs.AuthFailed('订单与用户不匹配！', 10003)
        }
        if (order.status !== orderType.UNPAID) {
            throw new global.errs.HttpException('订单已经支付过啦！', 80003)
        }

        // 通过校验 
        this.orderNo = order.orderNo
        return true
    }
}

module.exports = { Pay }