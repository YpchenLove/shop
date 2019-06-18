const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Banner } = require('@models/banner')

const router = new Router({
    prefix: '/v1/banner'
})

/**
 * @route   GET /:id
 * @desc    查询banner详情
 * @access  public
 */
router.get('/:id', async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const id = v.get('path.id')
    const banner = await Banner.getBanner(id)
    ctx.body = banner
})

module.exports = router
