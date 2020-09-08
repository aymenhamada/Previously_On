const axios = require("axios");
const md5 = require("md5");

require('dotenv').config({path: '../variables.env'});


exports.loginWithOauth = (req, res) => {
    const { code } = req.query;
    axios.post("https://api.betaseries.com/oauth/access_token", {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: "http://localhost:4242/oauth/redirect",
        code,
    })
    .then((response) => {
        res.status(200).redirect(`http://localhost:4200?access_token=${response.data.access_token}`);
    })
    .catch(err => {
        res.status(400).send(err.reponse.data);
    });
}


exports.DefaultLogin = (req, res) => {
    if(!req.body.login || !req.body.password) return res.status(400).send({errors: [{text: "Provide a email or a password"}]});
    const hashed = md5(req.body.password);
    axios.post(`https://api.betaseries.com/members/auth?key=${process.env.KEY}`, {
        login: req.body.login,
        password: hashed,
    })
    .then((response) => {
        res.status(200).send(response.data);
    })
    .catch(err => {
        res.status(400).send(err.response.data);
    });
}

exports.Register = (req, res) => {
    const hashed = md5(req.body.password);
    axios.post(`https://api.betaseries.com/members/signup?key=${process.env.KEY}`, {
        login: req.body.login,
        password: hashed,
        email: req.body.email,
    })
    .then((response) => {
        res.status(200).send(response.data);
    })
    .catch(err => {
        res.status(400).send(err.response.data);
    });
}