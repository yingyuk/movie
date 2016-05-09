/*
 * @Author: Yuk
 * @Date:   2016-05-03 21:34:51
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-03 22:23:33
 */

'use strict';
var url = 'http://v.qq.com/page/l/0/t/l0014hrmq0t.html';
var href = url.match(/([^\/]+)(?=\.html)/g);
// var  href = url.match(/[^\/](.+)\.html/g);
console.log(href);


// var url = 'http://blog.163.com/album?id=1#comment';
// var arr = url.match(/(https?:)\/\/([^\/]非斜杠,就是匹配主机名+)(\/[^\?]*)?(\?[^#]*)?(#.*)?/);
// // var arr = url.match(/(https?:)\/\/([^\/]+)([^\?]*)([^#]*)(.*)/);
// console.log(arr);
