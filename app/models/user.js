const bcrypt = require('bcryptjs')

const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { UserAddress } = require('./user-address')

class User extends Model {
    // 验证账号
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: { email }
        })
        if (!user) {
            throw new global.errs.AuthFailed('账号不存在！')
        }
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确！')
        }
        return user
    }

    // 查询openid
    static async getUserByOpenid (openid) {
        const user = await User.findOne({
            where: { openid }
        })
        return user
    }

    // 注册openid
    static async registerByOpenid (openid) {
        const user = await User.create({
            openid
        })
        return user
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    extend: {
        type: Sequelize.STRING(128)
    },
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const pwd = bcrypt.hashSync(val, salt)
            this.setDataValue('password', pwd)
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, {
    sequelize: db,
    tableName: 'user'
})

module.exports = { User }
