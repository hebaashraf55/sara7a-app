import jwt from 'jsonwebtoken';

export const signToken = ({
    payload = {},
    signature = process.env.JWT_SECRET,
    expiresIn = "1d"
}) => {
    return jwt.sign(payload, signature, { expiresIn })
}

export const verifyToken = (token = '', signature = process.env.JWT_SECRET) => {
    return jwt.verify( token, signature )
}