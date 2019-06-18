# API接口文档
> api接口的文档

**BaseURL**
```js
localhost:3000/
```

## 点赞
> 对书籍和期刊的点赞

### 进行点赞

**URL**
```js
POST  /like
```

**params**
* art_id： 点赞对象的id
* type：类型：100 电影  200 音乐  300 句子  400 书籍

**response**
```js
status: 201
{
    "msg": "ok",
    "error_code": 0,
    "request": "POST /v1/like/"
}

status: 400
{
    "msg": "你已经点赞过了",
    "error_code": 60001,
    "request": "POST /v1/like/"
}
```