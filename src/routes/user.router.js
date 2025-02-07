const express = require("express");
const router = express.Router();
const passport = require('passport');

router.post("/register",  passport.authenticate("register", { failureRedirect: "/api/view/forbidden" }), async (req, res) => {

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        birthday: req.user.birthday
    }
    return res.redirect("/api/user/profile");
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        const messages = req.session.messages = "Acesso negado! Verifique seu você possui acesso a essa pagina ou está logado"
        res.redirect('/api/view/forbidden')
    }else{
        const { firstName, lastName, email, birthday } = req.session.user;
        res.render('profile', { firstName, lastName, email, birthday });
    }
});
module.exports = router;

