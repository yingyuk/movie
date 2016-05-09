/*
 * @Author: Yuk
 * @Date:   2016-05-03 23:39:18
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-08 17:33:36
 */

'use strict';
var Movie = require('../models/movie'); // 传入本地数据库
var Category = require('../models/category');

var https = require('https');
var cheerio = require('cheerio');

var movieIds = [];




// function top() {
//   return new Promise(function(resolve, reject) {
//     var url = 'https://api.douban.com/v2/movie/top250?count=2';
//     https.get(url, function(res) {
//       var html = '';
//       res.on('data', function(data) {
//         html += data;
//       })
//       res.on('end', function() {
//         resolve(html)
//       })
//     }).on('error', function(e) {
//       reject(e);
//     })
//   })
// }

// var category;

// function getData(id) {
//   return new Promise(function(resolve, reject) {
//     var url = 'https://api.douban.com/v2/movie/subject/' + id;
//     https.get(url, function(res) {
//       var html = '';
//       res.on('data', function(data) {
//         html += data;
//       });
//       res.on('end', function() {
//         html = JSON.parse(html)
//         var result = {
//           doctor: html.directors[0].name,
//           title: html.title,
//           country: html.countries[0],
//           poster: html.images.large,
//           year: html.year,
//           summary: html.summary,
//           categoryName: html.genres[0]
//         };
//         resolve(result);
//       })
//     })
//   })
// }


// top()
//   .then(function(datas) {
//     return new Promise(function(resolve, reject) {
//       var data = JSON.parse(datas);
//       var subjects = data.subjects;
//       subjects.forEach(function(item) {
//         movieIds.push(item.id);
//       });
//       resolve(movieIds);
//     })
//   })
//   .then(function(movieIds) {
//     return new Promise(function(resolve, reject) {
//       movieIds.forEach(function(item) {
//         getData(item)
//           .then(function(movieData) {
//             return new Promise(function(resolve, reject) {
//               var categoryName = movieData.categoryName;
//               console.log(movieData);

//               _movie = new Movie(movieData);
//               console.log(_movie);
//               _movie.save(function(err, movie) {
//                 if (err) {
//                   console.log(err);
//                 }
//                 console.log('mive', movie);
//                 var category = new Category({
//                   name: categoryName,
//                   movies: [_movie._id]
//                 });
//                 category.save(function(err, category) {
//                   _movie.category = category;
//                   _movie.save(function(err, movie) {})
//                 })
//               })
//             })
//           })
//           .then(function(category) {
//             console.log(category);

//           })

//       })
//     })
//   });

// var movieData = {
//   doctor: '吕克·贝松',
//   title: '这个杀手不太冷',
//   country: '法国',
//   poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p511118051.jpg',
//   year: '1994',
//   summary: '里昂（让·雷诺饰）是名孤独的职业杀手，受人雇佣。一天，邻居家小姑娘马蒂尔达（纳塔丽·波特曼饰)敲开他的房门， 要求在他那里暂避杀身之祸。原来邻居家的主人是警方缉毒组的眼线，只因贪污了一小包毒品而遭恶警（加里·奥德曼饰）杀害全家的惩 罚。马蒂尔达得到里昂的留救，幸免于难，并留在里昂那里。里昂教小女孩使枪，她教里昂法文，两人关系日趋亲密，相处融洽。\n女孩 想着去报仇，反倒被抓，里昂及时赶到，将女孩救回。混杂着哀怨情仇的正邪之战渐次升级，更大的冲突在所难免……©豆瓣',
//   categoryName: '剧情'
// };
// var _movie = new Movie(movieData);
// _movie.save(function(err, movie) {
//   if (err) {
//     console.log(err);
//   }
//   console.log('mive', movie);
//   var category = new Category({
//     name: categoryName,
//     movies: [_movie._id]
//   });
//   category.save(function(err, category) {
//     _movie.category = category;
//     _movie.save(function(err, movie) {})
//   })
// })
