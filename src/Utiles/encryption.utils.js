import CryptoJs from "crypto-js";


export const encrypt = (plainText) => {
    return CryptoJs.AES.encrypt(plainText, process.env.ENCRYPTION_KEY).toString()
}

export const decrypt = (cipherText) => {
    return CryptoJs.AES.decrypt(cipherText, process.env.ENCRYPTION_KEY).toString(CryptoJs.enc.Utf8)
}