/*
 * @Author: Yuk
 * @Date:   2016-04-24 15:08:24
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-27 19:57:25
 */

'use strict';
var Movie = require('../models/movie'); // 传入本地数据库
var Comment = require('../models/comment'); // 传入本地数据库
var Category = require('../models/category');
var _ = require('underscore'); // 替换老字段
var fs = require('fs');
var path = require('path');
//详情页
exports.detail = function(req, res) {
  var id = req.params.id;
  Movie.update({_id: id }, {$inc: {pv: 1 } }, function(err) {
    console.log(err);
  });
  Movie.findById(id, function(err, movie) {
    Comment
      .find({
        movie: id
      })
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments) {
        res.render('detail', {
          title: "详情页",
          movie: movie,
          comments: comments
        });
      });
  });
};
//后台录入
exports.new = function(req, res) {
  Category.find({}, function(err, categories) {
    res.render('admin', {
      title: '后台录入页',
      categories: categories,
      movie: {}
    });
  });
};

// 电影更新
exports.update = function(req, res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id, function(err, movie) {
      Category.find({}, function(err, categories) {
        res.render('admin', {
          title: '后台更新页',
          movie: movie,
          categories: categories
        });
      })
    })
  }
};
// 存储海报
exports.savePoster = function(req, res, next) {
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFilename = posterData.originalFilename;
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timetamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timetamp + '.' + type;
      var newPath = path.join(__dirname, '../../', 'public/upload/' + poster);
      fs.writeFile(newPath, data, function(err) {
        req.poster = poster;
        next();
      });
    });
  } else {
    next();
  }
};
// 电影保存
exports.save = function(req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (req.poster) {
    movieObj.poster = '/upload/' + req.poster;
  }
  // 数据更新
  if (id) {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      })
    })
  } else {
    // 新增电影
    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    _movie = new Movie(movieObj);
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err);
      }
      // checkbox
      if (categoryId) {
        Category.findById(categoryId, function(err, category) {
          category.movies.push(_movie._id)
          category.save(function(err, category) {
            res.redirect('/movie/' + _movie._id);
          })
        })
      } else if (categoryName) {
        // input
        var category = new Category({
          name: categoryName,
          movies: [_movie._id]
        });
        category.save(function(err, category) {
          _movie.category = category;
          _movie.save(function(err, movie) {
            res.redirect('/movie/' + _movie._id);
          })
        })
      }
    })
  }
};
// 电影列表
exports.list = function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '列表页',
      movies: movies
    });
  })

};

// 删除
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({
      _id: id
    }, function(err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
};
