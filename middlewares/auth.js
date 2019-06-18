
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
    constructor (level) {
        this.level = level || 1
        Auth.USER = 8
        Auth.ADMIN = 8
    }
    get m () {
        return async (ctx, next) => {
            const userToken = basicAuth(ctx.req)
            let errMsg = 'token不合法！'
            let decode

            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden(errMsg)
            }

            try {
                decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                if (error.name === 'TokenExprireError') {
                    errMsg = 'token已过期！'
                }
                throw new global.errs.Forbbiden(errMsg)
            }

            // API权限控制
            if (decode.scope < this.level) {
                errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }

            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }

            await next()
        }
    }

    // 检测token有效
    static verifyToken (token) {
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true
        } catch (err) {
            return false
        }
    }
}

module.exports = { Auth }
