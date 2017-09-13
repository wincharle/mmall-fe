require('./index.css')
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');

var page = {
    data: {
        productId: _mm.getUrlParam('productId') || ''
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        if(!this.data.productId){
            _mm.goHome();
        }
        this.loadDetail();
    },
    loadDetail: function(){
        var html = '';
        var _this = this;
        var $pageWrap = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _product.getProductDetail(this.data.productId, function(res){
            _this.filter(res);
            _this.data.detailInfo = res;
            html = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(html);
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">找不到商品啦~~~~~</p>');
        })
    },
    filter: function(data){
        data.subImages = data.subImages.split(',');
    },
    bindEvent: function(){
        var _this = this;
        // 图片预览
        $(document).on('mouseenter', '.p-img-item', function(){
            var imageUrl = $(this).find('.p-img').attr('src');
            $('.main-img').attr('src', imageUrl);
        });
        // count的操作
        $(document).on('click', '.p-count-btn', function(){
            var type = $(this).hasClass('plus') ? 'plus' : 'minus';
            var $pCount = $('.p-count');
            var currentCount = parseInt($pCount.val());
            var minCount = 1;
            var maxCount =  _this.data.detailInfo.stock || 1;

            if(type === 'plus'){
                $pCount.val(currentCount < maxCount ? currentCount + 1 : maxCount);
            }else if(type === 'minus'){
                $pCount.val(currentCount > minCount ? currentCount - 1 : minCount);
            }
        });
        $(document).on('click', '.cart-add', function(){
            _cart.addToCart({
                productId: _this.data.productId,
                count: parseInt($('.p-count').val())
            }, function(res){
                window.location.href = './result.html?type=cart-add';
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        })
    }
}

$(function(){
    page.init();
});