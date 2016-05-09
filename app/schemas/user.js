/*
 * @Author: Yuk
 * @Date:   2016-04-20 20:45:35
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-24 16:15:30
 */

'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); // 为密码存储的算法; 加盐
var SALT_WORK_FACTOR = 10; // 计算强度,默认10

// 定义类型;
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    role:{
        // 0: normal user,
        // 1: verified user,
        // 2:professional user,
        // 10:admin,
        // 50:super admin
        type:Number,
        default:0
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
UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    // 随机生成一个盐;  计算强度,回调
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            // 如果有错也带入到下一个;
            return next(err)
        }
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err)
            }
            user.password = hash;
            // 将存储流程走下去
            next();
        })
    });
});
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        })
    }
};

// 静态方法实例化
UserSchema.statics = {
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
module.exports = UserSchema;
