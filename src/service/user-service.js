var _mm = require('util/mm.js');

var _user = {
    login: function(userInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/login.do'),
            data: userInfo,
            method: 'POST',
            success: resolve,
            error: reject
        })
    },
    logout: function(resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/logout.do'),
            method: 'POST',
            success: resolve,
            error: reject
        })
    },
    checkLogin: function(resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/get_user_info.do'),
            method: 'POST',
            success: resolve,
            error: reject
        })
    },
    checkUsername: function(username, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/check_valid.do'),
            method: 'POST',
            data: {
                type: 'username',
                str: username
            },
            success: resolve,
            error: reject
        })
    },
    register: function(userInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/register.do'),
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        })
    },
    getQuestion: function(username, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/forget_get_question.do'),
            method: 'POST',
            data: {
                username: username
            },
            success: resolve,
            error: reject
        })
    },
    checkAnswer: function(userInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/forget_check_answer.do'),
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        })
    },
    resetPassword: function(userInfo, resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/forget_reset_password.do'),
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        })
    },
    getUserInfo: function(resolve, reject) {
        _mm.request({
            url: _mm.getServerUrl('/user/get_information.do'),
            method: 'POST',
            success: resolve,
            error: reject
        })
    },
    updateUserInfo: function(userInfo, resolve, reject){
        _mm.request({
            url: _mm.getServerUrl('/user/update_information.do'),
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        })
    },
    updatePassword: function(userInfo, resolve, reject){
        _mm.request({
            url: _mm.getServerUrl('/user/reset_password.do'),
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        })
    },
}

module.exports = _user;