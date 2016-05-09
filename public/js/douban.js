/*
 * @Author: Yuk
 * @Date:   2016-04-26 22:29:28
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-04 23:04:01
 */

'use strict';
var ol;
$(function() {
    $('#douban').blur(function() {
      var douban = $(this);
      var id = douban.val();
      if (id) {
        $.ajax({
          url: 'https://api.douban.com/v2/movie/subject/' + id,
          cache: true,
          type: 'get',
          dataType: 'jsonp',
          crossDomain: true,
          jsonp: 'callback',
          success: function(data) {
            $('#inputTitle').val(data.title);
            $('#inputDoctor').val(data.directors[0].name);
            $('#inputCategory').val(data.genres[0]);
            $('#inputCountry').val(data.countries[0]);
            $('#inputPoster').val(data.images.large);
            $('#inputYear').val(data.year);
            $('#inputSummary').val(data.summary);
          }
        });
        $.get({
          url: '/admin/movie/flv?id=' + id,
          success: function(data) {
            $('#inputFlash').val(data.id);
          }
        });
      }
    });
    $('#inputCategory').change(function() {
      var inputValue = $(this).val();
      var checkboxText;
      $('#genres .radio-inline').each(function(index) {
        checkboxText = $(this).text().trim();
        $(this).find('input').attr("checked", false);
        if (checkboxText == inputValue) {
          $(this).find('input').attr("checked", true);
        }
      })
    })
  })
  // {
  //  "rating": {
  //    "max": 10,
  //    "average": 7.9,
  //    "stars": "40",
  //    "min": 0
  //  },
  //  "reviews_count": 559,
  //  "wish_count": 14368,
  //  "douban_site": "",
  //  "year": "2016",
  //  "images": {
  //    "small": "https://img1.doubanio.com\/view\/movie_poster_cover\/ipst\/public\/p2324130709.jpg",
  //    "large": "https://img1.doubanio.com\/view\/movie_poster_cover\/lpst\/public\/p2324130709.jpg",
  //    "medium": "https://img1.doubanio.com\/view\/movie_poster_cover\/spst\/public\/p2324130709.jpg"
  //  },
  //  "alt": "https:\/\/movie.douban.com\/subject\/25777636\/",
  //  "id": "25777636",
  //  "mobile_url": "https:\/\/movie.douban.com\/subject\/25777636\/mobile",
  //  "title": "\u5947\u5e7b\u68ee\u6797",
  //  "do_count": null,
  //  "share_url": "http:\/\/m.douban.com\/movie\/subject\/25777636",
  //  "seasons_count": null,
  //  "schedule_url": "https:\/\/movie.douban.com\/subject\/25777636\/cinema\/",
  //  "episodes_count": null,
  //  "countries": ["\u7f8e\u56fd"],
  //  "genres": ["\u5267\u60c5", "\u5947\u5e7b", "\u5192\u9669"],
  //  "collect_count": 70896,
  //  "casts": [{
  //    "alt": "https:\/\/movie.douban.com\/celebrity\/1341495\/",
  //    "avatars": {
  //      "small": "https://img3.doubanio.com\/img\/celebrity\/small\/mdU4sqb8u1scel_avatar_uploaded1405572903.85.jpg",
  //      "large": "https://img3.doubanio.com\/img\/celebrity\/large\/mdU4sqb8u1scel_avatar_uploaded1405572903.85.jpg",
  //      "medium": "https://img3.doubanio.com\/img\/celebrity\/medium\/mdU4sqb8u1scel_avatar_uploaded1405572903.85.jpg"
  //    },
  //    "name": "\u5c3c\u5c14\u00b7\u585e\u897f",
  //    "id": "1341495"
  //  }, {
  //    "alt": "https:\/\/movie.douban.com\/celebrity\/1054508\/",
  //    "avatars": {
  //      "small": "https://img3.doubanio.com\/img\/celebrity\/small\/651.jpg",
  //      "large": "https://img3.doubanio.com\/img\/celebrity\/large\/651.jpg",
  //      "medium": "https://img3.doubanio.com\/img\/celebrity\/medium\/651.jpg"
  //    },
  //    "name": "\u6bd4\u5c14\u00b7\u9ed8\u745e",
  //    "id": "1054508"
  //  }, {
  //    "alt": "https:\/\/movie.douban.com\/celebrity\/1054393\/",
  //    "avatars": {
  //      "small": "https://img1.doubanio.com\/img\/celebrity\/small\/1374649659.58.jpg",
  //      "large": "https://img1.doubanio.com\/img\/celebrity\/large\/1374649659.58.jpg",
  //      "medium": "https://img1.doubanio.com\/img\/celebrity\/medium\/1374649659.58.jpg"
  //    },
  //    "name": "\u672c\u00b7\u91d1\u65af\u5229",
  //    "id": "1054393"
  //  }, {
  //    "alt": "https:\/\/movie.douban.com\/celebrity\/1049501\/",
  //    "avatars": {
  //      "small": "https://img3.doubanio.com\/img\/celebrity\/small\/1410696326.11.jpg",
  //      "large": "https://img3.doubanio.com\/img\/celebrity\/large\/1410696326.11.jpg",
  //      "medium": "https://img3.doubanio.com\/img\/celebrity\/medium\/1410696326.11.jpg"
  //    },
  //    "name": "\u4f0a\u5fb7\u91cc\u65af\u00b7\u827e\u5c14\u5df4",
  //    "id": "1049501"
  //  }],
  //  "current_season": null,
  //  "original_title": "The Jungle Book",
  //  "summary": "\u6bdb\u514b\u5229\uff08\u5c3c\u5c14\u00b7\u585e\u897f Neel Sethi \u9970\uff09\u662f\u4e00\u4e2a\u7531\u72fc\u7fa4\u517b\u5927\u7684\u4eba\u7c7b\u7537\u5b69\uff0c\u5f71\u7247\u56f4\u7ed5\u4ed6\u7684\u68ee\u6797\u5192\u9669\u5f90\u5f90\u5c55\u5f00\u3002\u8c22\u5229\u00b7\u53ef\u6c57\uff0c\u4e00\u53ea\u53d7\u8fc7\u4eba\u7c7b\u4f24\u5bb3\u7684\u8001\u864e\uff08\u4f0a\u5fb7\u91cc\u65af\u00b7\u827e\u5c14\u5df4 Idris Elba \u914d\u97f3\uff09\uff0c\u53d1\u8a93\u8981\u5c06\u6bdb\u514b\u5229\u94f2\u9664\u3002\u4e3a\u4e86\u9003\u8131\u8ffd\u6355\uff0c\u6bdb\u514b\u5229\u8ddf\u968f\u4e25\u5389\u7684\u5bfc\u5e08\u9ed1\u8c79\u5df4\u5e0c\u62c9\uff08\u672c\u00b7\u91d1\u65af\u5229 Ben Kingsley \u914d\u97f3\uff09\u548c\u81ea\u7531\u81ea\u5728\u7684\u597d\u53cb\u68d5\u718a\u5df4\u9c81\uff08\u6bd4\u5c14\u00b7\u9ed8\u745e Bill Murray \u914d\u97f3\uff09\uff0c\u8e0f\u4e0a\u4e86\u4e00\u573a\u7cbe\u5f69\u7eb7\u5448\u7684\u81ea\u6211\u63a2\u7d22\u65c5\u7a0b\u3002\u5728\u8fd9\u8d9f\u65c5\u9014\u4e2d\uff0c\u6bdb\u514b\u5229\u9047\u5230\u4e86\u4e00\u4e9b\u5bf9\u4ed6\u5c45\u5fc3\u53f5\u6d4b\u7684\u4e1b\u6797\u751f\u7269\uff0c\u5305\u62ec\u5de8\u87d2\u5361\u5965\uff08\u65af\u5609\u4e3d\u00b7\u7ea6\u7ff0\u900a Scarlett Johansson \u914d\u97f3\uff09\uff0c\u5979\u7528\u8ff7\u4eba\u7684\u58f0\u97f3\u548c\u773c\u795e\u8ff7\u60d1\u6bdb\u514b\u5229\uff1b\u8fd8\u6709\u82b1\u8a00\u5de7\u8bed\u7684\u7329\u7329\u8def\u6613\u738b\uff08\u514b\u91cc\u65af\u6258\u5f17\u00b7\u6c83\u80af Christopher Walken \u914d\u97f3\uff09\uff0c\u4ed6\u8bd5\u56fe\u901a\u8fc7\u5a01\u903c\u5229\u8bf1\u8ba9\u6bdb\u514b\u5229\u4ea4\u51fa\u8ff7\u5e7b\u800c\u81f4\u547d\u7684\u201c\u7ea2\u82b1\u201d\u2014\u2014\u706b\u7130\u7684\u79d8\u5bc6\u3002\u5f53\u68ee\u6797\u4e0d\u518d\u662f\u5b89\u5168\u7684\u5bb6\u56ed\uff0c\u6bdb\u514b\u5229\u8be5\u4f55\u53bb\u4f55\u4ece\uff1f\u800c\u6bd5\u751f\u96be\u5fd8\u7684\u4f1f\u5927\u5192\u9669\uff0c\u624d\u521a\u521a\u62c9\u5f00\u5e8f\u5e55\u2026\u2026",
  //  "subtype": "movie",
  //  "directors": [{
  //    "alt": "https:\/\/movie.douban.com\/celebrity\/1027164\/",
  //    "avatars": {
  //      "small": "https://img1.doubanio.com\/img\/celebrity\/small\/6058.jpg",
  //      "large": "https://img1.doubanio.com\/img\/celebrity\/large\/6058.jpg",
  //      "medium": "https://img1.doubanio.com\/img\/celebrity\/medium\/6058.jpg"
  //    },
  //    "name": "\u4e54\u6069\u00b7\u8d39\u5112",
  //    "id": "1027164"
  //  }],
  //  "comments_count": 31807,
  //  "ratings_count": 65309,
  //  "aka": ["\u4e0e\u68ee\u6797\u5171\u821e(\u53f0)", "\u4e1b\u6797\u4e4b\u4e66", "\u68ee\u6797\u738b\u5b50"]
  // }
