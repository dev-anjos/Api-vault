import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


