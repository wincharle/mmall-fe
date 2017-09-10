var Hogan = require('hogan.js');
var conf = {
    serverHost: ''
};
var _mm = {
    request: function(param) {
        var _this = this;
        $.ajax({
            type: param.method || 'get',
            url: param.url || '',
            dataType: param.type || 'json',
            data: param.data || '',
            success: function(res) {
                if(0 === res.status) {
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                } else if(10 === res.status) {
                    _this.doLogin();
                } else if(1 === res.status) {
                    // 请求完成了
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            // 请求失败比如404等
            error: function(err) {
                typeof param.error === 'function' && param.error(err.statusText);
            }
        })
    },
    doLogin: function() {
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    // 获取服务器地址
    getServerUrl: function(path) {
        return conf.serverHost + path;
    },
    // 获取url参数
    // http://happymmall.com/product/list?keyword=1&page=1
    getUrlParam: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    renderHtml: function(htmlTemplate, data) {
        var template = Hogan.compile(htmlTemplate);
        var result = template.render(data);
        return result;
    },
    successTips: function(msg) {
        alert(msg || '操作成功');
    },
    errorTips: function(msg) {
        alert(msg || '操作失败');
    },
    // type表示是否为空，手机号，邮箱
    validate: function(value, type) {
        var value = $.trim(value);
        // 非空判断
        if('require' === type) {
            return !!value;
        }
        // 手机号验证
        if('phone' === type) {
            return /^1\d{10}$/.test(value);
        }
        // 邮箱验证
        if('email' === type) {
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    goHome: function() {
        window.location.href = './index.html';
    }
};

module.exports = _mm;