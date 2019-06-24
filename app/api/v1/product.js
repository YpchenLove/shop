const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const { PositiveIntegerValidator, ProductValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Product } = require('@models/product')

const router = new Router({
    prefix: '/v1/product'
})

/**
 * @route   GET /
 * @desc    查询 最新商品
 * @access  public
 */
router.get('/recent', async (ctx, next) => {
    const v = await new ProductValidator().validate(ctx)
    const count = v.get('query.count')
    const product = await Product.getRecent(count)

    ctx.body = product
})

/**
 * @route   GET /:id
 * @desc    获取商品详情
 * @access  public
 */
router.get('/:id', async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const id = v.get('path.id')
    const product = await Product.getProduct(id)

    ctx.body = product
})

module.exports = router
