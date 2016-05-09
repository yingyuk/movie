/*
 * @Author: Yuk
 * @Date:   2016-04-23 22:41:16
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-09 16:15:43
 */

'use strict';
var Category = require('../app/controllers/category');
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
// var Flv = require('../app/crawler/doubanFlv');
var Test = require('../app/crawler/us');
var Flv = require('../app/crawler/one');
var Comment = require('../app/controllers/comment');

var multipart = require('connect-multiparty');// 表单提交多种类型;
var multipartMiddleware = multipart();

module.exports = function(app) {
    app.use('', function(req, res, next) {
        var _user = req.session.user;
        // 如果为空;赋值为空;
        app.locals.user = _user;
        next();
    });
    // 首页
    app.get('/', Index.index);

    // Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/flv', User.signinRequired, User.adminRequired, Flv.flv);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.post('/admin/movie/save',multipartMiddleware, User.signinRequired, User.adminRequired,Movie.savePoster, Movie.save);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

    app.get('/admin/movie/top', User.signinRequired, User.adminRequired, Test.list);
    app.post('/admin/movie/addtop', User.signinRequired, User.adminRequired, Test.addtop);

    // User
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
    app.get('/loginout', User.loginout);
    app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del);

    // Comment
    app.post('/user/comment',  User.signinRequired,Comment.save);

    // category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.post('/admin/category/save', User.signinRequired, User.adminRequired, Category.save);
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
    app.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.del);

    //results
    app.get('/results', Index.search);
};
