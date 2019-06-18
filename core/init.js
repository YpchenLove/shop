const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
    // 初始化
    static initCore(app) {
        InitManager.app = app
        InitManager.loadConfig()
        InitManager.initLoadRouters()
        InitManager.loadHttpException()
    }

    // 配置项
    static loadConfig (path = '') {
        const configPath = path || process.cwd() + '/config/index.js'
        const config = require(configPath)
        global.config = config
    }

    // 配置路由
    static initLoadRouters() {
        const apiDirectory = `${process.cwd()}/app/api`
        const whenLoadModule = (obj) => {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
        requireDirectory(module, apiDirectory, { visit: whenLoadModule })
    }

    // 注入全局异常
    static loadHttpException() {
        const errors = require('./http-exception')
        global.errs = errors
    }
}

module.exports = InitManager
