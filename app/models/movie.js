/*
* @Author: Yuk
* @Date:   2016-04-20 20:45:24
* @Last Modified by:   Yuk
* @Last Modified time: 2016-04-20 21:00:35
*/

'use strict';
var mongoose=require('mongoose');
// 引入模式下的模块,不需要写.js
var MovieSchema=require('../schemas/movie');
 
/*
 * 编译生成movie模型 ;'模型的名字',模式
 */
var Movie=mongoose.model('Movie',MovieSchema);

module.exports=Movie;
