const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const {
    PositiveIntegerValidator
} = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
// const { Auth } = require('@models/product')

const router = new Router({
    prefix: '/v1/pay'
})

/**
 * @route   post /
 * @desc    支付前校验
 * @access  private
 */
router.post('/pre', new Auth().m, async (ctx, next) => {
    
})

module.exports = router
