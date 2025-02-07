const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require("../database/models/user.model");
const { createHash, isValidPassword } = require('../utils/utils');
const {hashSync} = require("bcrypt");

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy({
        passReqToCallback: true, usernameField: 'email', passwordField: 'password'
    }, async (req, username, password, done) => {
        const { firstName, lastName, email, birthday } = req.body;
        try {
            let user = await User.findOne({ email: username });
            if (user) {
                return done(null, false,  req.session.messages = 'Email já cadastrado, faça o login ou use outro email.');
            }

            const passwordHashed = await createHash(password);
            const newUser = new User({ firstName, lastName, email, birthday, password: passwordHashed });

            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                newUser.role = 'admin';
            } else {
                newUser.role = 'user';
            }

            let result = await newUser.save();

            return done(null, result);
        } catch (error) {
            console.log(error);
            return done(null, false, { messages: 'Erro interno no servidor ao registrar o usuário' });
        }
    }));

    passport.use('login', new localStrategy({ passReqToCallback: true,usernameField: 'email', passwordField: 'password' },
        async ( req,username, password, done) => {
            try {
                let user = await User.findOne({ email: username });
                if (!user) {

                    return done(null, false, req.session.messages = 'Usuário ou senha incorretos');
                }
                if (!isValidPassword(password, user.password)) {
                    return done(null, false, req.session.messages = 'Usuário ou senha incorretos');
                }
                return done(null, user);
            } catch (error) {

                return done(null, false, req.session.messages = 'Erro ao autenticar usuário' );
            }
        }
    ));

    passport.use('loginWithGithub', new GitHubStrategy({
        passReqToCallback: true,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
    }, async (req, accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile)
            let user = await User.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    firstName: profile._json.name.split(' ')[0],
                    lastName: profile._json.name.split(' ')[1],
                    email: profile._json.email,
                    password: createHash("coder1234", 10),
                    avatar: profile._json.profileUrl
                }
                let result = await User.create(newUser);
                return done(null, result);
            }else {
                return done(null, user);
            }
        }catch (error) {
            return done(null, false, req.session.messages = `Erro ao autenticar usuário com github ${error}` );
        }

    }));

    // passport.use('reset-password', new localStrategy({ usernameField: 'email', passwordField: 'password' }, async (username, password, done) => {
    //     try {
    //         const userFound = await User.findOne({ email: username });
    //
    //         if (!userFound) {
    //             console.log("User not found");
    //             return done(null, false, { message: 'Usuário não encontrado' });
    //         }
    //         const newPass = createHash(password);
    //
    //         await User.updateOne({ email: username }, { password: newPass });
    //         return done(null, userFound);
    //     } catch (error) {
    //         return done(null, false, { message: `Erro ao alterar a password do usuário: ${error}` });
    //     }
    // }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(`Erro ao buscar usuário: ${error}`);
        }
    });
};

module.exports = initializePassport;
