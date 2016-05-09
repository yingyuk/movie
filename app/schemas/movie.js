/*
 * @Author: Yuk
 * @Date:   2016-04-20 20:45:35
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-05-09 13:05:07
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// 定义类型;
var MovieSchema = new Schema({
    title: String,
    doctor: String,
    summary: String,
    country: String,
    flash: String,
    videoId:String,
    douban:String,
    tencent:String,
    poster: String,
    year: Number,
    category: {
        type: ObjectId,
        ref:'Category'
    },
    pv: {
        type: Number,
        default: 0
    },
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
// 时间更新;
MovieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    // 将存储流程走下去
    next();
});
// 静态方法实例化
MovieSchema.statics = {
    // 取出所有数据,按照更新时间排序;
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    // 查询单条数据
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb);
    }
};
// 暴露接口
module.exports = MovieSchema;
