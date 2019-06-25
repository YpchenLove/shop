// 枚举
function isThisType(val) {
    for (let key in this) {
        if (this[key] === val) {
            return true
        }
    }
    return false
}

// 登录类型
const loginType = {
    USER_MINI_PROGRAM: 100,     // 微信小程序
    USER_EMAIL: 101,            // 邮箱登录
    USER_MOBILE: 102,           // 手机号登录
    ADMIN_EMAIL: 200,           // 管理员登录
    isThisType                  // 调用枚举方法
}

module.exports = {
    loginType
}
