/*
 * @Author: Yuk
 * @Date:   2016-04-24 15:02:56
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-25 20:38:20
 */

'use strict';
var Comment = require('../models/comment'); // 传入本地数据库

exports.save = function(req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;
    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            var reply = {
                content: _comment.content,
                from: _comment.from,
                to: _comment.tid
            };
            comment.reply.push(reply);
            comment.save(function(err, comment) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movieId);
            })
        })
    } else {
        var comment = new Comment(_comment);
        comment.save(function(err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        })
    }

};
