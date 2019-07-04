const Router = require('koa-router')
const {
    PositiveIntegerValidator,
    OrderValidator,
    PageValidator
} = require('../../validators/validator')
const { Success } = require('../../../core/http-exception')
const { Order } = require('@models/order')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/order'
})

/**
 * @route   GET /:id
 * @desc    获取详情
 * @access  private
 */
router.get('/:id', new Auth().m, async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const id = v.get('path.id')

    const order = await Order.getOrderDetail(ctx.auth.uid, id)
    ctx.body = order
})

/**
 * @route   GET /
 * @desc    分页获取订单
 * @access  private
 */
router.get('/', new Auth().m, async (ctx, next) => {
    const v = await new PageValidator().validate(ctx)
    const page = v.get('query.page')
    const count = v.get('query.count')

    const orders = await Order.getOrders(ctx.auth.uid, page, count)
    ctx.body = orders
})

/**
 * @route   POST /
 * @desc    提交订单
 * @access  private
 */
router.post('/', new Auth().m, async (ctx, next) => {
    const v = await new OrderValidator().validate(ctx)
    const products = v.get('body.products')
    const result = await Order.createOrder(products, ctx.auth.uid)
    ctx.body = result
})

module.exports = router
