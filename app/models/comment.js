/*
* @Author: Yuk
* @Date:   2016-04-22 18:24:40
* @Last Modified by:   Yuk
* @Last Modified time: 2016-04-25 22:29:58
*/

'use strict';
var mongoose=require('mongoose');
var CommentSchema=require('../schemas/comment');
var Comment=mongoose.model('Comment',CommentSchema);

module.exports=Comment;
