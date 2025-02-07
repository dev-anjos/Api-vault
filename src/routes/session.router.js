const express = require("express");
const userModel = require("../database/models/user.model");
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

router.use((req, res, next) => {
    if (req.session.user) {
        res.locals = {user: req.session.user}
    }
    next();
});

router.post('/login' ,  passport.authenticate("login" , { failureRedirect: "/api/view/forbidden" }), async (req, res) => {

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        birthday: req.user.birthday
    }

    res.redirect("/api/user/profile")

    // const { email, password } = req.body;
    //
    // try {
    //     const user = await userModel.findOne({ email });
    //     console.log(user)
    //     if (!user) {
    //         return res.status(401).json({ error: "Usuário ou senha incorretos" });
    //     }
    //
    //     const isValidPassword = await bcrypt.compare(password, user.password);
    //     if (!isValidPassword) {
    //         return res.status(401).json({ error: "Usuário ou senha incorretos" });
    //     }
    //     req.session.user = user;
    //     const sessionUser = JSON.stringify(req.session)
    //     console.log(sessionUser)

    // }catch (error) {
    //     res.status(500).send({ error: error.message });
    // }
})

router.get('/loginwithgithub', passport.authenticate('loginWithGithub', scope = ['user']), (req, res) => {
    console.log(req.session);
});

router.get(
'/githubcallback', passport.authenticate('loginWithGithub', { failureRedirect: '/api/view/forbidden' }),
    async (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/user/profile');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            return res.redirect("/api/view");
        }else{
            return res.status(500).send({ error: err.message });
        }
    });
});

module.exports = router;
