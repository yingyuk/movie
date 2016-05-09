/*
 * @Author: Yuk
 * @Date:   2016-04-24 15:02:56
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-09 14:53:06
 */

'use strict';
var User = require('../models/user'); // 传入本地数据库

exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面',
    });
};
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面',
    });
};



// 用户注册
exports.signup = function(req, res) {
    /**
     * post('/user/signup/:useid1?useid3query'
     * {userid2body:abc}
     * req.param('userid'); 3个全部查一遍; 
     * query 问题;
     * post('/user/signup/dizhi?userid=123'
     * req.query.userid;
     */
    var _user = req.body.user;
    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    })
};
// 用户列表页
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '列表页',
            users: users
        });
    })

};
// 登录
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.redirect('/signup');
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                req.session.user = user;
                return res.redirect('/');
            } else {
                return res.redirect('/signin');
            }

        });
    })
};
exports.loginout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/')
};
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin');
    }
    next();
};
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role<=10) {
        return res.redirect('/signin');
    }
    next();
};
// 删除
exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    User.remove({
      _id: id
    }, function(err, user) {
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
