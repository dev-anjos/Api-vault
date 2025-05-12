import express from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { userService } from '../services/index.js';

const router = express.Router();
let scope;

router.use( async(req, res, next) => {
    if (req.session.user) {
        res.locals = {user: req.session.user}
    }
    next();
});

router.post('/login' ,  passport.authenticate("login" , { failureRedirect: "/api/view/forbidden" }), async (req, res) => {

    await userService.findUserByIdAndUpdate(req.user._id , { lastConnection: new Date() });

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        birthday: req.user.birthday
    }

    const userData = req.session.user;

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('userData', JSON.stringify(userData), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('userData', JSON.stringify(userData), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect("/api/user/profile")
})

router.get('/loginwithgithub', passport.authenticate('loginWithGithub', scope = ['user']), (req, res) => {});

router.get(
'/githubcallback', passport.authenticate('loginWithGithub', { failureRedirect: '/api/view/forbidden' }),
    async (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/user/profile');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.clearCookie('userData');
            res.clearCookie('authToken');
            return res.redirect("/api/view");
        }else{
            return res.status(500).send({ error: err.message });
        }
    });
});

export default router;
