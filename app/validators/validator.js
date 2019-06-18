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

// 任务校验
class TaskValidator extends LinValidator {
    constructor () {
        super()
        this.title = [
            new Rule('isLength', '必须是1-32位字符串', { min: 1, max: 32 })
        ]
        this.startTime = [
            new Rule('isLength', '不允许为空', { min: 1 })
        ]
        this.validateType = checkType
    }
}

// 修改任务校验
class PutTaskValidator extends TaskValidator {
    constructor () {
        super()
        this.status = [
            new Rule('isInt', '状态必须为0或1', { min: 0, max: 1 })
        ]
        this.id = [
            new Rule('isInt', '需要是正整数', { min: 1 })
        ]
        this.validateType = checkType
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    // 业务
    TaskValidator,
    PutTaskValidator
}
