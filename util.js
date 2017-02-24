/**
 * Created by slashhuang on 17/1/13.
 * 工具相关
 */
const crypto = require('crypto');

/*加密*/
const U_cipher=key=>data=>{
    let cipher = crypto.createCipher('aes192', key);
    return cipher.update(data.toString(),'utf8', 'hex') +  cipher.final('hex')
}
/*解密*/
const U_decipher=key=>data=>{
    let decipher = crypto.createDecipher('aes192', key)
    try{
        let decipherData =  decipher.update(data,'hex','utf8') + decipher.final('utf8');
        return decipherData
    }catch(e){
        return false
    }
};
module.exports = (key)=>{
    return {
        U_cipher:U_cipher(key),
        U_decipher:U_decipher(key)
    }
}




