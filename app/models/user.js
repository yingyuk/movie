/*
* @Author: Yuk
* @Date:   2016-04-22 18:24:40
* @Last Modified by:   Yuk
* @Last Modified time: 2016-04-25 22:30:05
*/

'use strict';
var mongoose=require('mongoose');
var UserSchema=require('../schemas/user');
var User=mongoose.model('User',UserSchema);

module.exports=User;
