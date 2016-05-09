/*
* @Author: Yuk
* @Date:   2016-04-20 20:45:24
* @Last Modified by:   Yuk
* @Last Modified time: 2016-04-26 18:50:17
*/
'use strict';
var mongoose=require('mongoose');
var CategorySchema=require('../schemas/category');
var Category=mongoose.model('Category',CategorySchema);

module.exports=Category;
