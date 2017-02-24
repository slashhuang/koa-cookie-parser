/*
 * built by slashhuang
 * cookie parser
 */
let CipherUtil = require('./util')
module.exports =(option)=>{
    let {
        cookieNameList,
        cipherKey,
        maxAge
    } = option;
    maxAge = maxAge || 60*60*2;
    let { U_decipher,U_cipher } = CipherUtil(cipherKey)
    return (ctx, next)=>{
        ctx.cookie_decoder={
            cookieList:cookieNameList,
            //加密后的数据
            cipherValues:{},
            //解密后的数据
            rawValues:{},
            //是否验证通过
            certificate:false,
            //批量解密验证
            batchDecipher:function() {
                return new Promise((resolve,reject)=>{
                    let index=0;
                    let hasError = null
                    while(index<cookieNameList.length){
                        let cookieName = cookieNameList[index];
                        let cipherName = ctx.cookies.get(cookieName);
                        let tmp = U_decipher(cipherName);
                        if(tmp){
                            this.rawValues[cookieName] = tmp;
                            index++
                        }else{
                            // break loop
                            index = cookieNameList.length;
                            hasError = true;
                        }
                    }
                    if(!hasError){
                        resolve()
                    }else{
                       reject()
                    }
                });
            },
            cookieTemp(key,value){
                return `${key}=${value}; Path=/; HttpOnly; Max-Age=${maxAge}`
            },
            //批量加密数据
            batchCipher:function(sourceData,callback){
                let cookieArr = [];
                Object.keys(sourceData).forEach((key,index,arr)=>{
                    //在cookie列表中，则加密
                    if(cookieNameList.indexOf(key)>-1){
                        let cipherValue= U_cipher(sourceData[key]);
                        this.cipherValues[key] =cipherValue
                        cookieArr.push(this.cookieTemp(key,cipherValue))
                    }
                })
                callback(cookieArr)
            }
        };
        //如果有加密数据
        return Promise.resolve(ctx.cookie_decoder.batchDecipher())
                .then(data=>{
                    ctx.cookie_decoder.certificate = true;
                    let {cookieList} = ctx.cookie_decoder;
                    let cookieArr = cookieList.map((cookie,index)=>{
                        return ctx.cookie_decoder.cookieTemp(cookie,ctx.cookies.get(cookie))
                    })
                    ctx.set('Set-Cookie',cookieArr);
                })
                .catch(()=>ctx.cookie_decoder.certificate = false)
                .then(()=>next())
    }
};