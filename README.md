# koa-cookie-parser

## usage
```javascript
    const app = new koa();
    const CookieParser = require('koa-cookie-parser');
    app.use(CookieParser({
        cookieNameList:['userId','uuId'],
        cipherKey:"hello world",
        maxAge:60*60*24
    }));

    //在你接下来的中间件中，你可以使用如下对象

    //是否有cookie 并且cookie验证通过
    ctx.cookie_decoder.certificate

    //cookie未加密的原始对象
    ctx.cookie_decoder.rawValues

    //cookie的数据源，返回response 头
    ctx.cookie_decoder.batchCipher(sourceData,(cookieArr)=>{
         ctx.set('Set-Cookie', cookieArr);
     })

```
