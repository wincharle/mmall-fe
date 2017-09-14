require('./index.css')
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _order = require('service/order-service.js');
var _address = require('service/address-service.js');
var _mm = require('util/mm.js');
var templateProduct = require('./product-list.string');
var templateAddress = require('./address-list.string');
var addressModal = require('./address-modal.js');

var page = {
    data: {
        selectedAddressId: null
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent: function(){
        var _this = this;
        // 地址选择
        $(document).on('click', '.address-item', function(){
            $(this).addClass('active')
                .siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $(this).data('id');
        }); 
        $(document).on('click', '.order-submit', function(){
            var shippingId = _this.data.selectedAddressId;
            if(shippingId){
                _order.createOrder({
                    shippingId: shippingId
                }, function(res){
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                })
            }else{
                _mm.errorTips('请选择地址后再提交');
            }
        }); 
        // 添加地址
        $(document).on('click', '.address-add', function(){
            addressModal.show({
                isUpdate: false,
                onSuccess: function(){
                    _this.loadAddressList();
                }
            });
        })
        // 添加编辑
        $(document).on('click', '.address-update', function(e){
            var shippingId = $(this).parents('.address-item').data('id');
            e.stopPropagation();
            _address.getAddress(shippingId, function(res){
                addressModal.show({
                    isUpdate: true,
                    data: res,
                    onSuccess: function(){
                        _this.loadAddressList();
                    }
                })
            }, function(errMsg){
                _mm.errorMsg(errMsg)
            });
        })
        // 地址删除
        $(document).on('click', '.address-delete', function(e){
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data('id');
            if(window.confirm('确认要删除该地址吗？')){
                _address.deleteAddress(shippingId, function(res){
                    _this.loadAddressList();
                }, function(errMsg){
                    _mm.errorTips(errMsg)
                })
            }
        })

    },
    loadAddressList: function(){
        var _this = this;
        $('.address-con').html('<div class="loading"></div>');
        _address.getAddressList(function(res){
            _this.addressFilter(res);
            var addressListHtml = _mm.renderHtml(templateAddress, res);
            $('.address-con').html(addressListHtml);
        }, function(errMsg){
            $('.address-con').html('<p class="err-tip">地址加载失败，请刷新重新加载</p>');
        })
    },
    addressFilter: function(data){
        if(this.data.selectedAddressId){
            var selectedAddressIdFlag = false;
            for(var i = 0, length = data.list.length; i < length; i++){
                if(data.list[i].id === this.data.selectedAddressId){
                    data.list[i].isActive = true;
                    selectedAddressIdFlag = true;
                }
            }
            if(!selectedAddressIdFlag){
                this.data.selectedAddressId = null;
            }
        }
    },
    loadProductList: function(){
        var _this = this;
        $('.product-con').html('<div class="loading"></div>');
        _order.getProductList(function(res){
            var productListHtml = _mm.renderHtml(templateProduct, res);
            $('.product-con').html(productListHtml);
        }, function(errMsg){
            $('.product-con').html('<p class="err-tip">商品信息加载失败</p>');
        })
    },
}

$(function(){
    page.init();
});