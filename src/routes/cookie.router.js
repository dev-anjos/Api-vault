const express = require("express");
const router = express.Router();

router.get("/set", (req, res) => {
    res.cookie("CookieJuan", "Cookie setado", {
        maxAge: 900000,
        signed: true
    })
    .send("Cookie")
})

router.get("/setSigned", (req, res) => {
    res.cookie("SignedCookie", "SignedCookie", {
        maxAge: 900000,
    }).send("Signed Cookie")
});

router.get("/get", (req, res) => {
    res.send(req.cookies)
});

router.get("/getSigned", (req, res) => {
    res.send(req.signedCookies)
});

router.get("/set", (req, res) => {
    const {name , email} = req.body;
    res.cookie(name,email, {
        maxAge: 900000
    }).send("Cookie setado com sucesso")
})

router.get("/delete", (req, res) => {
    res.clearCookie("CookieJuan").send("Cookie deletada com sucesso")
})

module.exports = router
