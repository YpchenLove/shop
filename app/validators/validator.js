const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
const { loginType, taskType } = require('../lib/enum')

// 正整数校验
class PositiveIntegerValidator extends LinValidator {
    constructor () {
        super()
        this.id = [
            new Rule('isInt', '需要是正整数', { min: 1 })
        ]
    }
}

// 登录校验
class RegisterValidator extends LinValidator {
    constructor () {
        super()
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.nickname = [
            new Rule('isLength', '昵称至少4个字符，最多16个字符', { min: 4, max: 16 })
        ]
        this.password1 = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', { min: 6, max: 32 }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
        this.password2 = this.password1
    }
    // 密码一致
    validatePassword(vals) {
        const pwd1 = vals.body.password1
        const pwd2 = vals.body.password2
        if (pwd1 !== pwd2) {
            throw new Error('两次输入的密码必须相同！')
        }
    }
    // email唯一
    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({ where: { email } })
        if (user) throw new Error('email已经存在！')
    }
}

// token校验
class TokenValidator extends LinValidator {
    constructor () {
        super()
        this.account = [
            new Rule('isLength', '不符合账号规则', { min: 4, max: 32 })
        ]
        this.secret = [
            new Rule('isOptional'),
            new Rule('isLength', '不符合规则', { min: 6, max: 128 })
        ]
    }
    validateLoginType(vals) {
        const type = vals.body.type
        if (!type) {
            throw new Error('type是必填参数')
        }
        if (!loginType.isThisType(parseInt(type))) {
            throw new Error('type参数不合法')
        }
    }
}

// 校验token不能为空
class NotEmptyValidator extends LinValidator {
    constructor () {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', { min: 1 })
        ]
    }
}

function checkType(vals) {
    const type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type是必填参数')
    }
    if (!taskType.isThisType(parseInt(type))) {
        throw new Error('type参数不合法')
    }
}

// 商品校验
class ProductValidator extends LinValidator {
    constructor () {
        super()
        this.count = [
            new Rule('isInt', '需要是1~50的正整数', { min: 1, max: 50 })
        ]
    }
}

// 用户校验
class UserValidator extends LinValidator {
    constructor () {
        super()
        this.email = [
            new Rule('isOptional'),
            new Rule('isEmail', '不符合Email规范')
        ]
        this.nickname = [
            new Rule('isOptional'),
            new Rule('isLength', '昵称至少4个字符，最多16个字符', { min: 4, max: 16 })
        ]
        this.password = [
            new Rule('isOptional'),
            new Rule('isLength', '密码至少6个字符，最多32个字符', { min: 6, max: 32 }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
    }
}

// 地址校验
class AddressValidator extends LinValidator {
    constructor () {
        super()
        this.name = [
            new Rule('isLength', '昵称至少1个字符，最多16个字符', { min: 1, max: 16 })
        ]
        // this.validateMobile = checkMobile
        this.province = [
            new Rule('isLength', '至少2个字符，最多16个字符', { min: 2, max: 16 })
        ]
        this.city = [
            new Rule('isLength', '至少2个字符，最多16个字符', { min: 2, max: 16 })
        ]
        this.country = [
            new Rule('isLength', '至少2个字符，最多16个字符', { min: 2, max: 16 })
        ]
        this.detail = [
            new Rule('isLength', '密码至少1个字符，最多32个字符', { min: 1, max: 64 })
        ]
    }
}

function checkMobile(vals) {
    const mobile = vals.body.mobile
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    if (!reg.test(mobile)) {
        throw new Error('手机号不符合规范！')
    }
}

// 订单校验
class OrderValidator extends LinValidator {
    constructor () {
        super()
        this.validateProducts = checkProducts
    }
}

function checkProducts(vals) {
    const products = vals.body.products
    if (!(products instanceof Array)) {
        throw new Error('products必须是数组类型！')
    }
    if (products.length < 1) {
        throw new Error('必须传递至少一组商品！')
    }
    checkProductItem(products)
}

function checkProductItem(products) {
    products.forEach(product => {
        if (!product.count) {
            throw new Error('count是必填参数')
        }
        if (!product.productId) {
            throw new Error('productId是必填参数')
        }
        if (!(isPositiveInteger(product.count))) {
            throw new Error('count必须是不为0的正整数')
        }
        if (!(isPositiveInteger(product.productId))) {
            throw new Error('productId必须是不为0的正整数')
        }
    })
}

function isPositiveInteger(s) {
    if (s === 0) return false
    var re = /^[0-9]+$/
    return re.test(s)
}

// 订单校验
class PageValidator extends LinValidator {
    constructor () {
        super()
        this.page = [
            new Rule('isInt', '需要是正整数', { min: 1 })
        ]
        this.count = [
            new Rule('isOptional'),
            new Rule('isInt', '需要是大于5的正整数', { min: 5 })
        ]
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    // 业务
    ProductValidator,
    UserValidator,
    AddressValidator,
    OrderValidator,
    PageValidator
}
