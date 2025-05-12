import express from "express";
import RegisterDto from "../dto/register.dto.js";
import passport from 'passport';

const router = express.Router();

router.post("/register",  passport.authenticate("register", { failureRedirect: "/api/view/forbidden" }), async (req, res) => {
    req.session.user = new RegisterDto(req.user);
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


export default router;

