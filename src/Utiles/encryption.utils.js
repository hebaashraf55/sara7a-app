import CryptoJs from "crypto-js";


export const encrypt = (plainText) => {
    return CryptoJs.AES.encrypt(plainText, "secret").toString()
}

export const decrypt = (cipherText) => {
    return CryptoJs.AES.decrypt(cipherText, "secret").toString(CryptoJs.enc.Utf8)
}