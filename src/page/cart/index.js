require('./index.css')
require('page/common/header/index.js');
var nav = require('page/common/nav/index.js');
var _cart = require('service/cart-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');

var page = {
    data: {
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        this.loadCart();
    },
    loadCart: function(){
       var _this = this;

       _cart.getCartList(function(res){
            _this.renderCart(res);
       }, function(errMsg){
            _this.showCartError();
       })
    },
    filter: function(data){
        data.notEmpty = !!data.cartProductVoList.length;
    },
    bindEvent: function(){
        var _this = this;
        // 选中商品 和 取消选中商品
        $(document).on('click', '.cart-select', function(){
            var $this = $(this);
            var productId = $this.parents('.cart-table').data('product-id');
            // 切换选中状态
            if($this.is(':checked')){
                _cart.selectProduct(productId, function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }else{
                _cart.unselectProduct(productId, function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
        })
        // 商品全选 和 取消全选
        $(document).on('click', '.cart-select-all', function(){
            var $this = $(this);
            // 切换选中状态
            if($this.is(':checked')){
                _cart.selectAllProduct(function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }else{
                _cart.unselectAllProduct(function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
        });
        // 商品数量变化绑定
        $(document).on('click', '.count-btn', function(){
            var $this = $(this);
            var $pCount = $this.siblings('.count-input');
            var currCount = parseInt($pCount.val());
            var type = $this.hasClass('plus') ? 'plus' : 'minus';
            var productId = $this.parents('.cart-table').data('product-id');
            var minCount = 1;
            var maxCount = parseInt($pCount.data('max'));
            var newCount = 0;

            if(type === 'plus'){
                if(currCount >= maxCount){
                    _mm.errorTips('改商品数量达到上限');
                    return;
                }
                newCount = currCount + 1;
            }else if(type === 'minus'){
                if(currCount <= minCount){
                    return;
                }
                newCount = currCount - 1;
            }

            _cart.updateProduct({
                productId: productId,
                count: newCount
            }, function(res){
                _this.renderCart(res);
            }, function(errorMsg){
                _this.showCartError();
            })
        });
        // 删除单个商品
        $(document).on('click', '.cart-delete', function(){
            if(window.confirm('确认要删除该商品?')){
                var productId = $(this).parents('.cart-table').data('product-id');
                _this.deleteCartProduct(productId);
            }
        });
        $(document).on('click', '.delete-selected', function(){
            if(window.confirm('确认要删除选中的商品?')){
                var arrProductIds = [];
                var $selectedItem = $('.cart-select:checked');
                for(var i = 0, iLength = $selectedItem.length; i < iLength; i++){
                    arrProductIds
                        .push($($selectedItem[i]).parents('.cart-table').data('product-id'));
                }
                if(arrProductIds.length){
                    _this.deleteCartProduct(arrProductIds.join(','));
                }else{
                    _mm.errorTips('你还没有选中要删除的商品');
                }
            }
        });
        $(document).on('click', '.btn-submit', function(){
            // 总价大于0，就可提交
            if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0){
                window.location = './order-confirm.html';
            }else{
                _mm.errorTips('请选择商品后再提交');
            }
        });
    },
    // 删除指定商品，支持批量操作
    deleteCartProduct: function(productIds){
        var _this = this;
        _cart.deleteProduct(productIds, function(res){
            _this.renderCart(res);
        }, function(errorMsg){
            _this.showCartError();
        });
    },
    renderCart: function(data){
        this.filter(data);
        // 缓存购物车信息
        this.data.cartInfo = data;
        // 生成html
        var cartHtml = _mm.renderHtml(templateIndex, data);
        $('.page-wrap').html(cartHtml);

        // 通知导航购物车， 更新数量
        nav.loadCartCount();
    },
    showCartError: function(){
        $('.page-wrap').html('<p class="err-tip">出错了，刷新试下</p>');
    },

}

$(function(){
    page.init();
});