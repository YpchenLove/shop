const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const {
    PositiveIntegerValidator
} = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Pay } = require('../../services/wx-pay')

const router = new Router({
    prefix: '/v1/pay'
})

/**
 * @route   post /
 * @desc    支付前校验
 * @access  private
 */
router.post('/pre', new Auth().m, async (ctx, next) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const id = v.get('body.id')
    const pay = new Pay(id)
    const p = await pay.pay()
    ctx.body = p
})

module.exports = router
