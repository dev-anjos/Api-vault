import express from "express";
import passport from 'passport';

const router = express.Router();
let scope;

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

export default router;
