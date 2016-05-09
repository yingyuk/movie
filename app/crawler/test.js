/*
 * @Author: Yuk
 * @Date:   2016-05-03 14:56:35
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-03 20:10:06
 */

'use strict';
var https = require('https');
var cheerio = require('cheerio');
var movieIds = ['1292052','5323957'];
var videoIds = [];
var videoUrls = [];

var baseMovieUrl = 'https://movie.douban.com/subject/';
var baseVideoUrl = 'https://movie.douban.com/trailer/video_url?tid=';

movieIds.forEach(function(movieId) {
  var videoId = getVideoId(baseMovieUrl + movieId + '/');
  videoIds.push(videoId);
});
Promise
  .all(videoIds)
  .then(function(videoIds) {
    // return new Promise(function(resolve, reject) {
      videoIds.forEach(function(videoId) {
        var videoUrl = getVideoUrl(baseVideoUrl + videoId)
        videoUrls.push(videoUrl);
      })

    // })
  });
function res (videoUrls) {
	
}
function getVideoId(url) {
  console.log('爬取页面: ', url);
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        var videoId = filterFlvId(html);
        // console.log(videoId,'videoId');
        // return videoId;
        // resolve(videoUrl);
        resolve(videoId);
      })
    }).on('error', function(e) {
      reject(e);
      console.log('error 爬取id页面: ')
    })
  })
}

function filterFlvId(html) {
	console.log('过滤页面,提取videoId');
  var $ = cheerio.load(html)
  var href = $('.related-pic-video');
  var url = href[0]['attribs']['href'];
  var id = url.match(/(\d)+/g)[0];
  return id;
}

function getVideoUrl(url) {
	console.log('获取videoUrl');
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        var flvUrl = html.match(/(http).*/g);
        console.log('flvUrl', flvUrl[0]);
        reject(flvUrl[0]);
      })
    }).on('error', function() {
      console.log('error')
    })

  })
}

// http://vt3.douban.com/201605031914/fca5aead6ef953fce73d812df58c3069/view/movie/F/301080756.flv
