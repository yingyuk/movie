/*
 * @Author: Yuk
 * @Date:   2016-05-08 17:36:07
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-09 16:33:22
 */

'use strict';
var https = require('https');
var cheerio = require('cheerio');

var Movie = require('../models/movie'); // 传入本地数据库
var Category = require('../models/category');

// 存储爬取来的数据
var result = [];
// 用于数据库存储; 通过清除result数组内的Promise得到;
var forSave = [];
// 存储电影ID;
// var movieIDs = [];
exports.list = function(req, res) {
  res.render('topmovie', {
    title: '排行榜添加'
  });
}
exports.addtop = function(req, res) {
  var id = req.query.id;
  if (id) {
    switch (id) {
      case 'us':
        getUsTop();
        break;
      case 'theatre':
        getTheaters();
        break;
      case 'coming':
        getComing();
        break;
      case 'one':
        getTop(0);
        break;
      case 'two':
        getTop(30);
        break;
      case 'three':
        getTop(60);
        break;
    }
  }
}

function getUsTop() {
  getUsJson()
    .then(function(UsIds) {
      getMovieIdData(UsIds)
    })
};

function getComing() {
  var url = 'https://api.douban.com/v2/movie/coming_soon';
  getMovieIdsJson(url)
    .then(function(movieIds) {
      getMovieIdData(movieIds)
    })
};

function getTheaters() {
  var url = 'https://api.douban.com/v2/movie/in_theaters';
  getMovieIdsJson(url)
    .then(function(movieIds) {
      getMovieIdData(movieIds)
    })
};

function getTop(start) {
  var url = 'https://api.douban.com/v2/movie/top250?start=' + start + '&count=30';
  getMovieIdsJson(url)
    .then(function(movieIds) {
      getMovieIdData(movieIds)
    })
};

function saveData(callback) {
  console.log('保存数据', forSave.length);
  if (forSave.length == 0) {
    return;
  }
  var item = forSave.shift();
  var categoryName = item.fenlei || '不存在';
  var movieTitle = item.title;
  Movie.find({ 'title': movieTitle }, function(err, movie) {
    if (err) {}
    if (movie.length == 0) {
      // movie 不存在
      var _movie = new Movie(item);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        Category.find({ name: categoryName }, function(err, category) {
          if (err) {}
          // 如果已经存在这个分类
          if (category.length == 0) {
            var category = new Category({
              name: categoryName,
              movies: [_movie._id]
            });
            category.save(function(err, category) {
              _movie.category = category;
              _movie.save(function(err, movie) {
                callback(saveData);
              });
            })
          } else {
            category[0].movies.push(_movie._id)
            category[0].save(function(err, category) {
              callback(saveData);
            });
          }
        })
      })
    } else {
      callback(saveData);
    }
  })
}


function getMovieIdsJson(url) {
  return new Promise(function(resolve, reject) {
    var movieIDs = [];
    movieIDs = movieIDs.concat(getMovieIdArr(url))
    Promise
      .all(movieIDs)
      .then(function(movieIDs) {
        resolve(movieIDs);
      })
  })
}

function getUsJson() {
  return new Promise(function(resolve, reject) {
    var usURL = 'https://api.douban.com/v2/movie/us_box';
    var movieIDs = [];
    movieIDs = movieIDs.concat(getUsIds(usURL));
    Promise
      .all(movieIDs)
      .then(function(movieIDs) {
        resolve(movieIDs);
      })
  })
}

function getUsIds(url) {
  console.log('getUsIds 北美排行');
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        var data = JSON.parse(html);
        var id = [];
        data.subjects.forEach(function(item) {
          id.push(item.subject.id);
        })
        resolve(id);
      })
    })
  })
}

function getMovieIdData(movieIDs) {
  Promise
    .all(movieIDs)
    .then(function(movieIDs) {
      return new Promise(function(resolve, reject) {
        movieIDs = movieIDs.join(',').split(',');
        resolve(movieIDs)
      })
    })
    .then(function(movieIdArr) {
      // 去获取每个ID对应的信息;返回数组;
      return new Promise(function(resolve, reject) {
        movieIdArr.forEach(function(movieId) {
          var info = getInfo(movieId);
          result.push(info);
        });
        Promise
          .all(result)
          .then(function(result) {
            resolve(result)
          });
      })
    })
    .then(function(result) {
      return new Promise(function(resolve, reject) {
        var videoIdArr = [];
        result.forEach(function(item) {
          var videoId = getVideoId(item.id);
          videoIdArr.push(videoId);
        });
        Promise
          .all(videoIdArr)
          .then(function(videoIdArr) {
            videoIdArr.forEach(function(videoId, index) {
              result[index].videoId = videoId;
            })
            resolve(result)
          });
      })
    })
    .then(function(result) {
      forSave = [];
      result.forEach(function(item, index) {
        forSave.push(item);
      });
      result = [];
      saveData(saveData);
    })
}



function getMovieIdArr(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        var data = JSON.parse(html);
        var id = [];
        data.subjects.forEach(function(item) {
          id.push(item.id);
        })
        resolve(id);
      })
    })
  })
}

function getInfo(id) {
  return new Promise(function(resolve, reject) {
    var url = 'https://api.douban.com/v2/movie/subject/' + id;
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        var data = JSON.parse(html);
        var info;
        if (data.title) {
          info = {
            id: id,
            title: data.title,
            doctor: data.directors[0].name,
            summary: data.summary,
            country: data.countries[0],
            fenlei: data.genres[0],
            flash: '',
            douban: '',
            tencent: '',
            poster: data.images.large,
            year: data.year
          };
        } else {
          info = {
            title: '豆瓣返回数据出错'
          }
        }
        resolve(info);
      })
    })
  })
}

function getVideoId(id) {
  return new Promise(function(resolve, reject) {
    var url = 'https://movie.douban.com/subject/' + id + '/';
    https.get(url, function(res) {
      var html = '';
      res.on('data', function(data) {
        html += data;
      })
      res.on('end', function() {
        filterFlvId(html)
          .then(function(videoId) {
            resolve(videoId);
          })
      })
    }).on('error', function(e) {
      reject(e);
    })
  })
}

function filterFlvId(html) {
  return new Promise(function(resolve, reject) {
    var $ = cheerio.load(html)
    var href = $('.related-pic-video');
    console.log('href.length', href.length);
    if (href.length > 0) {
      var url = href[0]['attribs']['href'];
      var id = url.match(/(\d)+/g)[0];
    } else {
      id = '';
    }
    resolve(id);
  })
}
