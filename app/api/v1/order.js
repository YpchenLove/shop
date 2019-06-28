const Router = require('koa-router')
const {
    PositiveIntegerValidator,
    OrderValidator
} = require('../../validators/validator')
const { Order } = require('@models/order')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/order'
})

/**
 * @route   POST /
 * @desc    提交订单
 * @access  private
 */
router.post('/', async (ctx, next) => {
    const v = await new OrderValidator().validate(ctx)
    const products = v.get('body.products')
    const result = await Order.createOrder(products)
    ctx.body = result
})

module.exports = router
