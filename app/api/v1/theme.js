const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Theme } = require('@models/theme')

const router = new Router({
    prefix: '/v1/theme'
})

/**
 * @route   GET /
 * @desc    查询所有主题
 * @access  public
 */
router.get('/', async (ctx, next) => {
    const theme = await Theme.getThemeList()

    ctx.body = theme
})

module.exports = router
