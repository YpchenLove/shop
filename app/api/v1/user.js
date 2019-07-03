const Router = require('koa-router')

const { Success } = require('../../../core/http-exception')
const { RegisterValidator, UserValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/user'
})

/**
* @route   GET /register
* @desc    注册用户
* @access  public
*/
router.post('/register', async (ctx, next) => {
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        email: v.get('body.email'),
        nickname: v.get('body.nickname'),
        password: v.get('body.password2')
    }
    await User.create(user)
    throw new Success('注册成功')
})

/**
 * @route   GET /
 * @desc    更新用户信息
 * @access  private
 */
router.put('/', new Auth().m, async (ctx, next) => {
    const v = await new UserValidator().validate(ctx)
    const user = {
        email: v.get('body.email'),
        nickname: v.get('body.nickname'),
        password: v.get('body.password2')
    }
    await User.update(user)
    throw new Success('注册成功')
})

module.exports = router
