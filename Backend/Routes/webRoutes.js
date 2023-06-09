const express = require('express');
const user_route= express();
user_route.set('view engine', 'ejs');
user_route.set('views', './views');

const userController=require('../Services/userServices');

user_route.get('/mail-verification',userController.verifyMail);

module.exports = user_route;