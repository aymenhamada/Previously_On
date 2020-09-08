const express = require("express");
const axios = require("axios");
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const md5 = require('md5');

require("dotenv").config({path: '../variables.env'});

router.get('/oauth/redirect', AuthController.loginWithOauth);

router.post('/login', AuthController.DefaultLogin);

router.get('/register', AuthController.Register);


router.get('/', (req, res) => {
    axios.get(`https://api.betaseries.com/shows/member?key=${process.env.KEY}&id=1197749`)
    .then((response) => {
        res.send(response.data);
        console.log(response.data);
    })
    .catch(err => {
        res.send(err.response.data);
        console.log(err.reponse.data);
    })
})


module.exports = router;