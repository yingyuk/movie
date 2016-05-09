/*
 * @Author: Yuk
 * @Date:   2016-04-24 15:08:24
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-09 14:49:30
 */

'use strict';
var Category = require('../models/category'); 
exports.new = function(req, res) {
    res.render('category', {
        title: '电影分类 后台录入页',
        category: {}
    });
};

exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);
    category.save(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list');
    })
}
// category list
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('categoryList', {
            title: '列表页',
            categories: categories
        });
    })

};
// 删除
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Category.remove({
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
