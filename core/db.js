const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const chalk = require('chalk')
const { database } = require('../config')
const { dbName, host, port, user, password } = database

const db = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: false, // true/false (process.env.NODE_ENV !== 'production' ? console.log : false)
    timezone: '+08:00',
    define: {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['created_at', 'updated_at', 'deleted_at']
                }
            }
        }
    }
})

db.sync({ force: false })

// 删除返回字段
Model.prototype.toJSON = function() {
    let data =  clone(this.dataValues)
    unset(data, 'created_at')
    unset(data, 'updated_at')
    unset(data, 'deleted_at')

    // 重写static静态资源 image 返回值
    // for (let key in data) {
    //     if (key === 'image') {
    //         if (!data[key].startsWith('http')) {
    //             data[key] = global.config.host + data[key]
    //         }
    //     }
    // }

    // 自定义删除字段
    if (isArray(this.exclude)) {
        this.exclude.forEach((value) => {
            unset(data, value)
        })
    }
    return data
}

/*
* 验证是否连接数据库成功
*/
db.authenticate()
    .then((res) => {
        console.log(
            chalk.bgCyan('连接数据库成功!'),
            chalk.bgBlueBright('O(∩_∩)O~~')
        )
    })
    .catch(err => {
        console.error(
            chalk.bgRed(`Error in MySQL connection:${err}`),
            chalk.bgMagentaBright('QAQ')
        )
    })

module.exports = { db }
