/*
 * @Author: Yuk
 * @Date:   2016-04-24 14:59:32
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-05-09 22:50:11
 */

'use strict';
var Movie = require('../models/movie'); // 传入本地数据库
var Category = require('../models/category'); // 传入本地数据库
exports.index = function(req, res) {
  Category
    .find({})
    .populate({
      path: 'movies',
      options: {
        limit: 5
      }
    })
    .exec(function(err, categories) {
      if (err) {
        console.log(err);
      }
      res.render('index', {
        title: '首页',
        categories: categories
      });
    })
}
exports.search = function(req, res) {
  var cateId = req.query.cate;
  var q = req.query.q;
  var page = parseInt(req.query.p, 10) || 0;
  var limit = 6;
  var skip = page * limit;
  if (cateId) {
    Category
      .find({
        _id: cateId
      })
      .populate({
        path: 'movies',
        select: 'title poster'
          // ,options: {
          //     limit: limit,
          //     skip: skip
          // }
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err);
        }
        var category = categories[0] || {};
        var movies = category.movies;
        var results = movies.slice(skip, skip + limit);
        res.render('results', {
          title: '结果列表',
          keyword: category.name,
          currentPage: page + 1,
          query: 'cate=' + cateId,
          totalPage: Math.ceil(movies.length / limit),
          movies: results
        });
      })
  } else {
    Movie
      .find({
        "title": new RegExp(q+'.*','i')
      })
      .exec(function(err, movies) {
        if (err) {
          console.log(err);
        }
        var results = movies.slice(skip, skip + limit);
        res.render('results', {
          title: '结果列表',
          keyword: q,
          currentPage: page + 1,
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / 2),
          movies: results
        });
      })

  }
}
