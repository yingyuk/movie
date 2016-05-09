/*
 * @Author: Yuk
 * @Date:   2016-05-03 17:07:39
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-08 20:51:01
 */

'use strict';

var Movie = require('../models/movie'); // 传入本地数据库
var Category = require('../models/category');

exports.test = function() {
  console.log('test');

  var item = {
    id: '25896953',
    title: '我盛大的希腊婚礼2',
    doctor: '柯克·琼斯',
    summary: '《我盛大的希腊婚礼2》仍将由尼娅·瓦达拉斯（Nia Vardalos）自己编剧、自己主演，而片中饰演他老公的约翰·科伯 特（John Corbett）以及她那个吵吵闹闹的希腊大家庭成员也都将回归。\n据悉，这部续集还会由汤姆·汉克斯（Tom Hanks）和他夫人 丽塔·威尔森（Rita Wilson）通过Playtone制片公司制作。\n对于自己为何等了12年才创作续集，尼娅·瓦达拉斯解释说，十二年前的 那部电影是她根据自己家庭生活创作的，如今她当了妈妈，自己的家庭生活又翻开了新的篇章，因此才会创作续集。“当然，有些媒体会 说我缺钱了，或者我想亲吻约翰·科伯特了”，她开玩笑说，“这两者中有一个是真的”。',
    country: '美国',
    fenlei: '喜剧',
    flash: '',
    douban: '',
    tencent: '',
    poster: 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2299092406.jpg',
    year: '2016',
    videoId: '186541'
  };

  var categoryName = item.fenlei;
  var movieTitle = item.title;
  Movie.find({ 'title': movieTitle }, function(err, movie) {
    console.log(movie);
    console.log(movie.length);
    if (err) {
      console.log('Movie.find error', error);
    }
    if (movie.length == 0) {
      // movie 不存在
      console.log('unexsit');
      var _movie = new Movie(item);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        Category.find({ 'name': categoryName }, function(err, category) {
          if (err) {
            console.log('Category.find error', error);
          }
          console.log(category);
          // 如果已经存在 该分类
          if (category .length != 0) {
            category.movies.push(_movie._id)
            category.save();
          } else {
            var category = new Category({
              name: categoryName,
              movies: [_movie._id]
            });
            category.save(function(err, category) {
              _movie.category = category;
              _movie.save();
            })
          }
        })
      })

    }
  })
  
  

}
