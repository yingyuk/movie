/*
 * @Author: Yuk
 * @Date:   2016-04-20 20:45:35
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-27 22:03:55
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchema = new Schema({
    movie:{type:ObjectId,ref:'Movie'},
    from:{type:ObjectId,ref:'User'},
    reply:[{
        from:{type:ObjectId,ref:'User'},
        to:{type:ObjectId,ref:'User'},
        content:String
    }],
    content:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
CommentSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb);
    }
};
module.exports = CommentSchema;
