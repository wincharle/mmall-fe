var _address = require('service/address-service.js');
var _mm = require('util/mm.js');
var templateAddressModal = require('./address-modal.string');
var _cities = require('util/cities/index.js');


var addressModal = {
   show: function(option){
	   this.option = option;
	   this.option.data = option.data || {};
       this.$modalWrap = $('.modal-wrap');
       // 渲染modal框
       this.loadModal();
       // 绑定事件
       this.bindEvent();
   },
   hide: function(){
	   this.$modalWrap.empty();
   },
   bindEvent: function(){
		var _this = this;
		// 省份和城市的二级联动
		this.$modalWrap.find('#receiver-province').change(function(){
			var selectedProvince = $(this).val();
			_this.loadCities(selectedProvince);
		});
		// 提交收货地址
		this.$modalWrap.find('.address-btn').click(function(){
			var receiverInfo = _this.getReceiverInfo();
			var isUpdate = _this.option.isUpdate;
			// 使用新地址，且验证通过
			if(!isUpdate && receiverInfo.status){
				_address.save(receiverInfo.data, function(res){
					_mm.successTips('地址添加成功');
					_this.hide();
					typeof _this.option.onSuccess == 'function' && _this.option.onSuccess(res);
				}, function(errMsg){
					_mm.errorTips(errMsg);
				})
			}
			// 更新信息，且验证通过
			else if(isUpdate && receiverInfo.status){
				_address.update(receiverInfo.data, function(res){
					_mm.successTips('地址修改成功');
					_this.hide();
					typeof _this.option.onSuccess == 'function' && _this.option.onSuccess(res);
				}, function(errMsg){
					_mm.errorTips(errMsg);
				})
			}
			// 验证不通过
			else{
				_mm.errorTips(receiverInfo.errMsg || '出错了');
			}
		});
		// 关闭弹窗
		this.$modalWrap.find('.modal-container').click(function(e){
			e.stopPropagation();
		});
		this.$modalWrap.find('.close').click(function(){
			_this.hide();
		});
   },
   loadModal: function(){
       var addressHtml = _mm.renderHtml(templateAddressModal, {
		   isUpdate: this.option.isUpdate,
		   data: this.option.data
	   });
       this.$modalWrap.html(addressHtml);
       // 加载省份
       this.loadProvince();
   },
   loadProvince: function(){
       var provinces = _cities.getProvinces() || [];
       var $provinceSelect = this.$modalWrap.find('#receiver-province');
	   $provinceSelect.html(this.getSelectOption(provinces));
	   // 更新地址
	   if(this.option.isUpdate && this.option.data.receiverProvince){
			$provinceSelect.val(this.option.data.receiverProvince);
			this.loadCities(this.option.data.receiverProvince);
	   }
   },
   loadCities: function(provinceName){
	   var cities = _cities.getCities(provinceName) || [];
	   var $citySelect = this.$modalWrap.find('#receiver-city');
	   $citySelect.html(this.getSelectOption(cities));
	   if(this.option.isUpdate && this.option.data.receiverCity){
			$citySelect.val(this.option.data.receiverCity);
		}
   },
   // 获取select框的选项
   getSelectOption: function(optionArray){
       var html = '<option value="">请选择</option>';
       for(var i = 0, length = optionArray.length; i < length; i++){
           html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>';
       }
       return html;
   },
   getReceiverInfo: function(){
	   var receiverInfo = {};
	   var result = {
		   status: false,
	   };
	   receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
	   receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
	   receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val();
	   receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
	   receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
	   receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());

	   if(this.option.isUpdate){
		   receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
	   }
	   if(!receiverInfo.receiverName){
		   result.errMsg = '请输入收件人姓名';
	   }
	   else if(!receiverInfo.receiverProvince){
		   result.errMsg = '请选择收件人所在省份';
	   }
	   else if(!receiverInfo.receiverCity){
		   result.errMsg = '请选择收件人所在城市';
	   }
	   else if(!receiverInfo.receiverAddress){
		result.errMsg = '请选择收件人的详细地址';
	   }
	   else if(!receiverInfo.receiverPhone){
		   result.errMsg = '请选择收件人的手机号码';
	   }

	   else{
		   result.status = true;
		   result.data = receiverInfo;
	   }
	   return result;
   }
}
module.exports = addressModal