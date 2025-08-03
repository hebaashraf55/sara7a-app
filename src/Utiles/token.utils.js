import jwt from 'jsonwebtoken';

export const signToken = ({
    payload = {},
    signature = "secret",
    expiresIn = "1d"
}) => {
    return jwt.sign(payload, signature, { expiresIn })
}

export const verifyToken = (token = '', signature = "secret") => {
    return jwt.verify( token, signature )
}