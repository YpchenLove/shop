// 核心库
const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
const catchError = require('./middlewares/exception')

// 辅助库
const chalk = require('chalk')
const config = require('./config')

require('module-alias/register')

// 实例
const app = new Koa()
const port = config.port

// 中间件
app.use(catchError)
app.use(parser())
app.use(koaStatic(path.join(__dirname, './static')))

//  初始化
InitManager.initCore(app)

// 启动服务
app.listen(port, () =>
    console.log(
        chalk.blue(`Server Started on ${port}...`)
    )
)
