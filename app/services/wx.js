const util = require('util')
const axios = require('axios')
const { User } = require('../models/user')
const { wx } = require('../../config')
const { Auth } = require('../../middlewares/auth')
const { generateToken } = require('../../core/util')

class WXManager {
    // code 换取 token
    static async codeToToken (code) {
        const url = util.format(wx.loginUrl, wx.AppID, wx.AppSecret, code)
        const result = await axios.get(url)

        if (result.status !== 200) {
            throw new global.errs.AuthFailed('openid获取失败！')
        }
        const errcode = result.data.errcode
        const errmsg = result.data.errmsg
        if (errcode) {
            throw new global.errs.AuthFailed(`${errcode}：${errmsg}`)
        }
        let user = await User.getUserByOpenid(result.data.openid)

        if (!user) {
            user = await User.registerByOpenid(result.data.openid)
        }

        return generateToken(user.id, Auth.USER)
    }
}

module.exports = { WXManager }
