const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Category } = require('@models/category')
const { Product } = require('@models/product')

const router = new Router({
    prefix: '/v1/category'
})

/**
 * @route   GET /
 * @desc    获取 category列表
 * @access  public
 */
router.get('/', async (ctx, next) => {
    const categorys = await Category.getAllCategory()
    ctx.body = categorys
})

/**
 * @route   GET /:id
 * @desc    获取 category列表
 * @access  public
 */
router.get('/:id', async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const id = v.get('path.id')
    const categorys = await Product.getProductByCategoryID(id)
    ctx.body = categorys
})

module.exports = router
