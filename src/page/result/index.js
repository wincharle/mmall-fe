require('./index.css');
require('page/common/nav-simple/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');

$(function() {
    var type = _mm.getUrlParam('type') || 'default';
    var $element = $('.' + type + '-success');
    if(type === 'payment'){
        var orderNumber = _mm.getUrlParam('orderNumber');
        var $orderNumber = $element.find('.order-number')
        $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);
    }
    $element.show();
});