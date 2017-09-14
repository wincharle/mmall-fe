require('./index.css')
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm = require('util/mm.js');
var _payment = require('service/payment-service.js');
var templateIndex = require('./index.string');

var page = {
    data: {
      orderNumber: _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
    },
    onLoad: function(){
        this.loadPaymentInfo();
    },
    loadPaymentInfo: function(){
        var paymentHtml = '';
        var _this = this;
        var $pageWrap = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');

        _payment.getPaymentInfo(_this.data.orderNumber, function(res){
            paymentHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">' + errMsg + '</p>');
        })
    },
    // 监听订单状态
    listenOrderStatus: function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNumber, function(res){
                if(res === true){
                    window.location.href = 
                        './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
                }
            }, function(errMsg){
                //
            });
        }, 5e3);
    }
}

$(function() {
    page.init();
});