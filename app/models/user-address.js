const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class UserAddress extends Model {
    // 获取 address
    static async getAddress(userId) {
        const address = await UserAddress.findOne({
            where: {
                userId
            },
            attributes: {
                exclude: ['userId', 'id']
            }
        })
        if (!address) {
            throw new global.errs.NotFound('没有保存地址~')
        }
        return address
    }

    // 创建和更新 address
    static async createOrUpdateAddress(params) {
        const address = await UserAddress.findOne({
            where: {
                userId: params.userId
            }
        })
        let type = 0
        if (!address) {
            await UserAddress.create({ ...params })
            type = 1
        } else {
            await address.update({ ...params })
            type = 2
        }
        return type
    }

    static async delAddress(userId) {
        const result = await UserAddress.destroy({
            where: { userId },
            force: true
        })
        if (!result) {
            throw new global.errs.NotFound('用户还没有创建地址！')
        }
        return result
    }
}

UserAddress.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    mobile: {
        type: Sequelize.STRING(11),
        unique: true
    },
    province: {
        type: Sequelize.STRING(32),
        unique: true
    },
    city: {
        type: Sequelize.STRING(32),
        unique: true
    },
    country: {
        type: Sequelize.STRING(32),
        unique: true
    },
    detail: {
        type: Sequelize.STRING(128),
        unique: true
    },
    userId: {
        type: Sequelize.STRING(32),
        unique: true
    }
}, {
    sequelize: db,
    tableName: 'user_address'
})

module.exports = { UserAddress }
