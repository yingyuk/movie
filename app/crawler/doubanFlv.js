/*
 * @Author: yingyuk
 * @Date:   2016-05-03 13:21:32
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-05-03 14:51:41
 */

'use strict';
var https = require('https');
var cheerio = require('cheerio');
// var Promise = require('Promise');
// var url = 'https://medium.com/top-stories';
// var url = 'https://movie.douban.com/subject/5327268/?tag=%E7%83%AD%E9%97%A8&from=gaia_video';
// var url = 'https://movie.douban.com/swf/movie_player_1.4.4.swf?tid=193270&has_hd=1&auto=1';
// var url = 'https://movie.douban.com/trailer/video_url?tid=147474';
// exports.flv = function(req, res) {
//   var id = 1295644;
//   getVideoUrl(147474, function(data) {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end(data + "");
//   });
// };
// // https://api.douban.com/v2/movie/subject/
// // https://api.douban.com/v2/movie/top250/



// function filterData(html) {
//   var $ = cheerio.load(html)
//   var main = $('main');
//   printCourseInfo(main);
// }

// function get(url, cb) {
//   https.get(url, function(res) {
//     var html = '';
//     console.log('res' + res);
//     res.on('data', function(data) {
//       html += data;
//     })
//     res.on('end', function() {
//       cb(html);
//       filterData(html)
//     })
//   }).on('error', function() {
//     console.log('error')
//   })
// }

// var ID250 = [];

// function getTop250Ids() {
//   var result = [];
//   var urlDefault = 'https://api.douban.com/v2/movie/top250';
//   for (var i = 0; i < 300; i += 100) {
//     url = urlDefault + '?start=' + i + '&count=100';
//     console.log(url);
//     https.get(url, function(res) {
//       var html = '';
//       res.on('data', function(data) {
//         html += data;
//       })
//       res.on('end', function() {
//         var data = JSON.parse(html);
//         var subjects = data.subjects;
//         for (var i = 0; i < subjects.length; i++) {
//           result.push(subjects[i].id);
//           ID250 = result.slice(50).concat(result.slice(0, 50));
//         }
//       })
//     }).on('error', function() {
//       console.log('error')
//     })
//   }
// }
// // getTop250Ids();




var pagesIds = ['1295644'];
var videoIds = [];
var videoUrls = [];

var baseMovieUrl = 'https://movie.douban.com/subject/';
var baseVideoUrl = 'https://movie.douban.com/trailer/video_url?tid=';

pagesIds.forEach(function(movieId) {
  videoIds.push(getVideoId(baseMovieUrl + movieId+'/'));
  // videoIds.push(getVideoId('https://movie.douban.com/subject/1295644/'));
});
videoIds.forEach(function(videoId) {
  videoUrls.push(getVideoUrl(baseVideoUrl + videoId));
});
// Promise
//   .all(videoIdArray)
//   .then(function(pages) {

//   })
function getVideoId(url) {
  console.log('爬取页面: ', url);
  https.get(url, function(res) {
    var html = '';
    res.on('data', function(data) {
      html += data;
    })
    res.on('end', function() {
      var videoId = filterFlvId(html);
      // console.log(videoId,'videoId');
      return videoId;
      // resolve(videoId);
    })
  }).on('error', function(e) {
    reject(e);
    console.log('error 爬取id页面: ')
  })
  // return new Promise(function(resolve, reject) {})
}
function filterFlvId(html) {
  var $ = cheerio.load(html)
  var chapters = $('.related-pic-video');
  var id = chapters[0]['attribs']['href'];
  return id;
}

function getVideoUrl(url) {
	console.log('爬取video',url);
  https.get(url, function(res) {
    var html = '';
    res.on('data', function(data) {
      html += data;
    })
    res.on('end', function(html) {
      var videoUrl = html.match(/(http).*/g);
      console.log('videoUrl',videoUrl);
      return videoUrl;
    })
  }).on('error', function() {
    console.log('error')
  })
}
