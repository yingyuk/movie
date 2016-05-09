/*
 * @Author: Yuk
 * @Date:   2016-04-19 23:42:24
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-23 22:30:58
 */

'use strict';

var express = require('express'); // 加载express模块;

var path = require('path'); // 引入路径 相对文件路径;jquery;bootstrap;
var port = process.env.PORT || 4000;
var mongoose = require('mongoose');

var _ = require('underscore'); // 替换老字段
var Movie = require('./models/movie'); // 传入本地数据库
var User = require('./models/user'); // 传入本地数据库

var app = express(); // 启动web服务器; 将实例赋给app;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dbUrl = 'mongodb://localhost/movie';
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.connect(dbUrl);


app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({ //依赖cookieParser;
    secret: 'secret',
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

app.set('views', __dirname + '\\views\\pages\\'); // 视图默认目录
app.set('view engine', 'jade');

app.use(bodyParser.json()); // 表单数据格式化 后台录入页;

app.use(express.static(path.join(__dirname, 'public'))); // 静态资源获取;
app.listen(port);
console.log('Movie started on port:' + port);
// 首页
app.get('/', function(req, res) {
    console.log('user in session:');
    console.log(req.session.user);
    var _user = req.session.user;
    if (_user) {
        app.locals.user = _user;
    }
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies
        });
    })
});

//详情页
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: "详情页",
            movie: movie
        });
    })
});
//后台录入
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
})

// 电影更新
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);

    if (id) {
        Movie.findById(id, function(err, movie) {
            console.log(movie);
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            });
        })
    }

})


// 电影新增
app.post('/admin/movie/new', function(req, res) {
        var id = req.body.movie._id;
        var movieObj = req.body.movie;
        var _movie;
        if (id !== 'undefined') {
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
            _movie = new Movie({
                doctor: movieObj.doctor,
                title: movieObj.title,
                country: movieObj.country,
                language: movieObj.language,
                year: movieObj.year,
                poster: movieObj.poster,
                summary: movieObj.summary,
                flash: movieObj.flash,
            });
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        }
    })
    // 电影列表
app.get('/admin/list', function(req, res) {
    console.log('user in session:');
    console.log(req.session.user);
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '列表页',
            movies: movies
        });
    })

});

// 删除
app.delete('/admin/list', function(req, res) {
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
});
// 用户注册
app.post('/user/signup', function(req, res) {
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
            console.log('用户已存在', user, user.name);
            return res.redirect('/');
        } else {
            var user = new User(_user);
            console.log('新增用户');
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/admin/userlist');
            })
        }
    })
});
// 用户列表页
app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '列表页',
            users: users
        });
    })

});
// 登录
app.post('/user/signin', function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    console.log(_user, name, password);

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            console.log('用户不存在');
            return res.redirect('/');
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                console.log('登录成功', isMatch);
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('密码错误');
            }

        });
    })
});
app.get('/loginout', function(req, res) {
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/')
    })
    // 用户删除
app.delete('/admin/userlist', function(req, res) {
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
});
