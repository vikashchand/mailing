const express=require('express');
const Router =express.Router();
const userService=require('../Services/userServices');

Router.post('/login',userService.userLogin);

module.exports=Router