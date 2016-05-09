/*
 * @Author: Yuk
 * @Date:   2016-04-19 23:42:24
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-27 21:59:49
 */

'use strict';

var express = require('express'); // 加载express模块;

var path = require('path'); // 引入路径 相对文件路径;jquery;bootstrap;
var port = process.env.PORT || 4000;
var mongoose = require('mongoose');
var app = express(); // 启动web服务器; 将实例赋给app;
var dbUrl = 'mongodb://localhost/movie';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var serveStatic = require('serve-static');
var morgan = require('morgan');
var fs = require('fs');

mongoose.connect(dbUrl);

// models loding;
var modelsPath = __dirname + '/app/models';
var walk = function(path) {
  fs.readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        } else if(stat.isDirectory()) {
          walk(newPath);
        };
      }
    })
}
walk(modelsPath);

app.locals.moment = require('moment');
app.use(bodyParser.json()); // 表单数据格式化 后台录入页;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({ //依赖cookieParser;
  secret: 'secret',
  resave:false,
  saveUninitialized:true,
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

app.set('views', __dirname + '\\app\\views\\pages\\'); // 视图默认目录
app.set('view engine', 'jade');


app.use(serveStatic(path.join(__dirname, 'public'))); // 静态资源获取;
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.set('showStackError', true);
  app.use(morgan(':method :url :status :response-time'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/route')(app);

app.listen(port);
console.log('Movie started on port:' + port);
