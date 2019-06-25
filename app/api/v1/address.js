const Router = require('koa-router')
const { Success } = require('../../../core/http-exception')
const {
    PositiveIntegerValidator,
    AddressValidator
} = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { UserAddress } = require('@models/user-address')

const router = new Router({
    prefix: '/v1/address'
})

/**
 * @route   GET /
 * @desc    查询 address
 * @access  private
 */
router.get('/', new Auth().m, async (ctx, next) => {
    const address = await UserAddress.getAddress(ctx.auth.uid)
    ctx.body = address
})

/**
 * @route   POST /
 * @desc    创建或者更新 address
 * @access  private
 */
router.post('/', new Auth().m, async (ctx, next) => {
    const v = await new AddressValidator().validate(ctx, { id: 'userId' })
    const params = {
        name: v.get('body.name'),
        mobile: v.get('body.mobile'),
        country: v.get('body.country'),
        province: v.get('body.province'),
        city: v.get('body.city'),
        detail: v.get('body.detail'),
        userId: ctx.auth.uid
    }
    const type = await UserAddress.createOrUpdateAddress(params)
    const msg = type === 1 ? '创建成功！' : '更新成功！'
    throw new Success(msg)
})

/**
 * @route   DELETE /
 * @desc    删除 address
 * @access  private
 */
router.del('/', new Auth().m, async (ctx, next) => {
    await UserAddress.delAddress(ctx.auth.uid)
    throw new Success('删除成功！')
})

module.exports = router
