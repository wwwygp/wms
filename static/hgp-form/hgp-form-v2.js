/*!
 * hgp-form-v2.js
 * 1. 显示表单设置弹窗
 * 2. 
 */
(function() {
	//构造器
	function HgpFormV2(config) {
		this.HgpFormV2;
		this.init(config);
	}
	HgpFormV2.prototype = {
		constructor: HgpFormV2,
		init: function(config){
			var _this = this;
			_this.triggerDom = config.trigger || ' ';
			_this.trigger = document.querySelector(config.trigger);
			if(!_this.trigger){
				console.error('HgpFormV2 has been successfully installed, but no trigger found on your page.');
				return false;
			}
			//监听多选框
		    _this.checkbox = [];
		    _this.oLay = '';
		    _this.oWin = '';
		    //表单数据
		    _this.data = [];
		    _this.tableCode = '';
			// _this.saveCallback = config.saveCallback || function(){};
			// _this.resetCallback = config.resetCallback || function(){};
			_this.setIcon();
			_this.getFormCustomField();
		},
		setIcon: function(){
			var img = document.createElement("div");
            img.classList.add('fa');
            img.classList.add('fa-cog');
            img.classList.add('fa-fw');
            img.classList.add('form-icon');
        	this.trigger.appendChild(img);
        	var tip = document.createElement("div");
        	tip.classList.add('message-tip');
        	this.trigger.appendChild(tip);
        	this.addListenerSetting();
		},
		addListenerSetting: function(){
			var _this = this;
			var formIcon = document.querySelector('.form-icon');
			var parent = formIcon.parentNode;
			_this.tableCode = formIcon.parentNode.getAttribute('data-value');
			_this.sys = formIcon.parentNode.getAttribute('data-sys');
			formIcon.addEventListener('click', function (e) {
	  			axios({
	     			method: 'GET',
	     			url: window.location.protocol + '//' +  window.location.host + '/apiz/rest/common/customize/v1/form-field',
	     			params: {
	         			tableCode: _this.tableCode
	     			},
	     			withCredentials: true,
			 	}).then(function(response) {
					if(response.data.status == 10001){
						document.querySelector('.message-tip').innerHTML = response.data.message;
		 				document.querySelector('.message-tip').style.display = 'block';
		 				setTimeout(function(){ 
		 					document.querySelector('.message-tip').style.display = 'none';
		 				}, 2000);
	 					return;
	 				}
					_this.data = response.data;
					_this.showDialog();
			 	}).catch(function(error) {
	 				console.log(error);
	 				document.querySelector('.message-tip').innerHTML = '获取表单字段失败';
	 				document.querySelector('.message-tip').style.display = 'block';
	 				setTimeout(function(){ 
	 					document.querySelector('.message-tip').style.display = 'none';
	 				}, 2000);
			 	})
			},false);
		},
		showDialog: function(){
			var _this = this
			//显示弹窗
			if(document.querySelector('.hgp-form-row')){
				document.body.removeChild(document.querySelector('.hgp-form-row'));
			}
			var temp = document.createElement("div");
			temp.classList.add('hgp-form-row')
			var item = '<div id="overlay"></div>'+
		    	'<div id="win" class="custom-popSet">' +
				'<h2 class="popSet-top"><p>自定义筛选字段</p><span class="hgp-close">×</span></h2>' +
				'<div class="popSet-div">' +
				'<h3 class="popSet-title">' +
				'<label role="checkbox" aria-checked="true" class="title-label">' +
				'<span class="label-check">启用</span>' +
				'<span class="label-word">支持筛选的字段</span>' +
				'</label>' +
				'</h3>' +
				'<div class="form-list"></div>'+
				'<div class="popSet-foot hgp-o">' +
				'<button class="foot-reset hgp-l hgp-reset" type="button">重置</button>' +
				'<div class="hgp-r">' +
				'<button class="foot-sure popblue hgp-save" type="button">保存</button>' +
				'<button class="foot-cancel hgp-close" type="button">取消</button>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>'
    		temp.innerHTML = item;    		
    		document.body.appendChild(temp);
    		_this.renderFormList();
    		_this.addListenerDialog();
		},
		renderFormList: function(){
			var ul = document.createElement("ul");
			ul.classList.add('popSet-ul');
			var items = '';
			for (var i = 0; i <this.data.length; i++) {
				items += '<li>' +
				'<div class="hgp-form-item-checkbox pop-list">' +
				'<input id="checkbox'+i+'" class="hgp-form-input form-check-box" value="'+this.data[i].fieldId+'" data-index="'+i+'" type="checkbox" name="formList">' +
				'<label for="checkbox'+i+'">'+this.data[i].fieldName+'</label>' +
				'</div>' +
				// '<div class="fa fa-list-ul"></div>' +
				'</li>'
			}
			ul.innerHTML = items;
			document.querySelector('.form-list').appendChild(ul);
			var boxes = document.getElementsByName("formList");
			for (var i = 0; i < boxes.length; i++) {
	       		if(this.data[i].isView == 0){
	       			boxes[i].checked  = true;
	       		}
	    	}
		},
		addListenerDialog: function(){
			var _this = this;
			// 多选框元素
		    _this.checkbox = [];
			_this.oWin = document.getElementById("win");
			_this.oLay = document.getElementById("overlay");
			var oClose = document.getElementsByClassName("hgp-close");
			var saveBtn = document.getElementsByClassName('hgp-save');
			var resetBtn = document.getElementsByClassName('hgp-reset');
			_this.oLay.style.display = "block";
    		_this.oWin.style.display = "block";
    		for (var i = 0; i < oClose.length; i++) {
    		  oClose[i].onclick = function() {
    		    // 注意涉及到这个对象不能使用oClose[i],要用this代替
    		    _this.oLay.style.display = "none";
    		    _this.oWin.style.display = "none";
    		  }
    		}
    		for (var i = 0; i < saveBtn.length; i++) {
    		  saveBtn[i].onclick = function() {
    		    // _this.saveCallback('123');
    		    _this.saveFormList();
    		  }
    		}
    		for (var i = 0; i < resetBtn.length; i++) {
    		  resetBtn[i].onclick = function() {
    		    // _this.resetCallback('456');
    		    _this.resetFormList();
    		  }
    		}
    		for (var i = 0; i <_this.data.length; i++) {
    			var temp = document.querySelector('#checkbox'+i);
		    	_this.checkbox.push(temp);
    		}
    		_this.addListenerCheckBox();
		},
		hideFormDialog: function(){
			var _this = this;
			_this.oLay.style.display = "none";
    		_this.oWin.style.display = "none";
		},
		addListenerCheckBox: function(){
			var _this = this;
			var _temp = [];
			// 监听多选框
			_this.checkbox.forEach(function(item, index) {
			    item.oninput = function (e) {
			    	var _value = '';
			    	var _index = '';
			    	var _checked = '';
			    	if(e && e.target){
			    		_value = e.target.value || '';
			    		_index = e.target.attributes['data-index'].value;
			    		_checked = e.target.checked;
			    	}else if(e && e.srcElement){
			    		_value = e.srcElement.value || '';
			    		_index = e.srcElement.attributes['data-index'].value;
			    		_checked = e.srcElement.checked;
			    	}
			    	_this.data[_index].isView = _checked ? 0 : 1;
			    };
			})
		},
		saveFormList: function(){
			var _this = this;
			axios({
     			method: 'PUT',
     			url: window.location.protocol + '//' +  window.location.host + '/apiz/rest/common/customize/v1/form-field',
     			data: _this.data,
     			withCredentials: true,
		 	}).then(function(response) {
 				if(response.data.status == 10001){
 					document.querySelector('.message-tip').innerHTML = response.data.message;
	 				document.querySelector('.message-tip').style.display = 'block';
	 				setTimeout(function(){ 
	 					document.querySelector('.message-tip').style.display = 'none';
	 				}, 2000);
 					return;
 				}
 				document.querySelector('.message-tip').innerHTML = '保存成功';
 				document.querySelector('.message-tip').style.display = 'block';
 				setTimeout(function(){ 
 					document.querySelector('.message-tip').style.display = 'none';
 				}, 2000);
 				_this.data = response.data;
 				//隐藏弹窗
 				_this.hideFormDialog();
 				//隐藏表单字段
 		 		_this.getFormCustomField();
		 	}).catch(function(error) {
		 		console.log(error);
		 		document.querySelector('.message-tip').innerHTML = '保存更新失败';
 				document.querySelector('.message-tip').style.display = 'block';
 				setTimeout(function(){ 
 					document.querySelector('.message-tip').style.display = 'none';
 				}, 2000);
		 	});
		},
		resetFormList: function(){
			var _this = this;
			axios({
     			method: 'DELETE',
     			url: window.location.protocol + '//' +  window.location.host + '/apiz/rest/common/customize/v1/clear-user-setting-form',
     			params: {
         			tableCode: _this.tableCode
     			},
     			withCredentials: true,
		 	}).then(function(response) {
				if(response.data.status == 10001){
 					document.querySelector('.message-tip').innerHTML = response.data.message;
	 				document.querySelector('.message-tip').style.display = 'block';
	 				setTimeout(function(){ 
	 					document.querySelector('.message-tip').style.display = 'none';
	 				}, 2000);
 					return;
 				}
 				document.querySelector('.message-tip').innerHTML = '重置成功';
 				document.querySelector('.message-tip').style.display = 'block';
 				setTimeout(function(){ 
 					document.querySelector('.message-tip').style.display = 'none';
 				}, 2000);
				_this.data = response.data;
				//隐藏弹窗
				_this.hideFormDialog();
				//隐藏表单字段
		 		_this.getFormCustomField();
		 	}).catch(function(error) {
		 		console.log(error);
		 		document.querySelector('.message-tip').innerHTML = '重置失败';
 				document.querySelector('.message-tip').style.display = 'block';
 				setTimeout(function(){ 
 					document.querySelector('.message-tip').style.display = 'none';
 				}, 2000);
		 	});
		},
     	hideFormFeild: function(){
     		var _this = this;
     		if(_this.sys != 'ERP'){
	     		var formList = document.querySelectorAll(_this.triggerDom+' .el-form-item__label');
		 		for (var i = 0; i <_this.data.length; i++) {
		 			if(_this.data[i].isView == 1 && formList[i].innerText === _this.data[i].fieldName){//不显示
		 				formList[i].parentNode.parentNode.style.display = 'none';
		 			}else{
		 				formList[i].parentNode.parentNode.style.display = 'block';
		 			}
		 		}
     		}else{
	     		var formList = document.querySelectorAll(_this.triggerDom+' .control-label');
		 		for (var i = 0; i <_this.data.length; i++) {
		 			if(_this.data[i].isView == 1 && formList[i].innerText === _this.data[i].fieldName){//不显示
		 				formList[i].parentNode.parentNode.style.display = 'none';
		 			}else{
		 				formList[i].parentNode.parentNode.style.display = 'block';
		 			}
		 		}
     		}
     	},
  		getFormCustomField: function(){
  			var _this = this;
  			axios({
     			method: 'GET',
     			url: window.location.protocol + '//' +  window.location.host + '/apiz/rest/common/customize/v1/form-field',
     			params: {
         			tableCode: _this.tableCode
     			},
     			withCredentials: true,
		 	}).then(function(response) {
				if(response.data.status == 10001){
					document.querySelector('.message-tip').innerHTML = response.data.message;
	 				document.querySelector('.message-tip').style.display = 'block';
	 				setTimeout(function(){ 
	 					document.querySelector('.message-tip').style.display = 'none';
	 				}, 2000);
 					return;
 				}
				_this.data = response.data;
				_this.hideFormFeild();
		 	}).catch(function(error) {
 				console.log(error);
 				document.querySelector('.message-tip').innerHTML = '获取表单字段失败';
 				document.querySelector('.message-tip').style.display = 'block';
 				setTimeout(function(){ 
 					document.querySelector('.message-tip').style.display = 'none';
 				}, 2000);
		 	})
  		}
	};
	if (typeof exports == 'object') {
		module.exports = HgpFormV2;
	} else if (typeof define == 'function' && define.amd) {
		define([], function () {
			return HgpFormV2;
		})
	} else {
		window.HgpFormV2 = HgpFormV2;
	}
})();