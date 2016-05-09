/*
 * @Author: Yuk
 * @Date:   2016-05-03 20:11:35
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-08 17:31:28
 */

'use strict';
var https = require('https');
var cheerio = require('cheerio');


exports.flv = function(req, res) {
  getVideoId(req.query.id)
    .then(function(moviePage) {
      return new Promise(function(resolve, reject) {
        resolve(filterFlvId(moviePage))
      })
    })
    .then(function(videoId) {
      return new Promise(function(resolve, reject) {
        resolve(getVideoUrl(videoId));
      })
    })
    .then(function(videoPage) {
      return new Promise(function(resolve, reject) {
        resolve(filterEmbed(videoPage))
      })
    })
    .then(function(flvId) {
      console.log(flvId);
      res.statusCode = 200;
      res.json({
        id: flvId
      });
    })

};

function getURL(ID) {
  console.log(ID);
}

function getVideoId(id) {
  console.log('getVideoId', id);
  return new Promise(function(resolve, reject) {
    var url = 'https://movie.douban.com/subject/' + id + '/';
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        resolve(html)
      })
    }).on('error', function(e) {
      reject(e);
    })
  })
}

function filterFlvId(html) {
  console.log('filterFlvId html');
  return new Promise(function(resolve, reject) {
    var $ = cheerio.load(html)
    var href = $('.related-pic-video');
    var url = href[0]['attribs']['href'];
    var id = url.match(/(\d)+/g)[0];
    resolve(id);
  })
}

function getVideoUrl(id) {
  console.log('getVideoUrl', id);
  return new Promise(function(resolve, reject) {
    var url = 'https://movie.douban.com/trailer/' + id + '/#content';
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        resolve(html);
      })
    }).on('error', function() {
      console.log('error')
    })
  })
}

function filterEmbed(html) {
  console.log('filterEmbed html');
  return new Promise(function(resolve, reject) {
    var $ = cheerio.load(html)
    var url = $('.rec-sec').find('a')[0].attribs['data-href'];
    var id = url.match(/([^\/]+)(?=\.html)/g)[0];
    resolve(id);
  })
}

// ------

// exports.flv = function(req, res) {
//   getVideoId(1292052)
//     .then(function(htmlpage) {
//       return new Promise(function(resolve, reject) {
//         resolve(filterFlvId(htmlpage))
//       })
//     })
//     .then(function(videoId) {
//       return new Promise(function(resolve, reject) {
//         resolve(getVideoUrl(videoId));
//       })
//     })
//     .then(function(flvUrl) {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.end(flvUrl);
//     })

// };

// function getURL(ID) {
//   console.log(ID);
// }

// function getVideoId(id) {
//   console.log('getVideoId',id);
//   return new Promise(function(resolve, reject) {
//     var url = 'https://movie.douban.com/subject/' + id + '/';
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

// function filterFlvId(html) {
//   console.log('filterFlvId html');
//   return new Promise(function(resolve, reject) {
//     var $ = cheerio.load(html)
//     var href = $('.related-pic-video');
//     var url = href[0]['attribs']['href'];
//     var id = url.match(/(\d)+/g)[0];
//     resolve(id);
//   })
// }

// function getVideoUrl(id) {
//   console.log('getVideoUrl',id);
//   return new Promise(function(resolve, reject) {
//     var url = 'https://movie.douban.com/trailer/video_url?tid=' + id;
//     https.get(url, function(res) {
//       var html = '';
//       res.on('data', function(data) {
//         html += data;
//       })
//       res.on('end', function() {
//         var flvUrl = html.match(/(http).*/g)[0];
//         resolve(flvUrl);
//       })
//     }).on('error', function() {
//       console.log('error')
//     })
//   })
// }
