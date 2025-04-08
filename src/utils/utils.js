import bcrypt from "bcrypt";

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);
