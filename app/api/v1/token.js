const Router = require('koa-router')

const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { WXManager } = require('../../services/wx')
const { loginType } = require('../../lib/enum')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/token'
})

/**
* @route   POST /
* @desc    获取token
* @access  public
*/
router.post('/', async (ctx, next) => {
    const v = await new TokenValidator().validate(ctx)
    let token
    switch (v.get('body.type')) {
    case loginType.USER_EMAIL:
        token = await eamilLogin(v.get('body.account'), v.get('body.secret'))
        break
    case loginType.USER_MINI_PROGRAM:
        token = await WXManager.codeToToken(v.get('body.account'))
        break
    // case loginType.USER_EMAIL:
    //     break
    default:
        throw new global.errs.ParameterException('没有相应的处理函数')
    }
    ctx.body = {
        msg: '获取token成功！',
        error_code: 10000,
        token
    }
})

async function eamilLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    const token = generateToken(user.id, Auth.USER)
    return token
}

/**
* @route   POST /verify
* @desc    校验token
* @access  public
*/
router.post('/verify', async (ctx, next) => {
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid: result
    }
})

module.exports = router
