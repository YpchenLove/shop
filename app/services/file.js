const OSS = require('ali-oss')
const config = require('../../config/index')

const client = new OSS(config.oss)

class File {
    // 上传图片
    static async uploadFile(name, file) {
        try {
            const result = await client.put(name, file)
            return result
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = { File }
