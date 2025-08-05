import crypto from 'node:crypto'

const key=process.env.CRYPTO_KEY

function decryption(text){
const [Ivhex,encrypted]=text.split(":")
const Iv=Buffer.from(Ivhex,'hex')
    const decipher=crypto.createDecipheriv("aes-256-cbc",key,Iv)
    let decrypted=decipher.update(encrypted,'hex',"utf-8")
    decrypted+=decipher.final('utf-8')
    return decrypted
}


export default decryption