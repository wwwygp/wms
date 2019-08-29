import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import './icons' // icon
import * as filters from './filters' // global filters
import './styles/common.scss';
import loadMore from '@/directive/scroll/selectScroll'; // 下拉加载更多的指令
import dbClick from '@/directive/repeatSubmission/clickBtn.js'; // 防止重复提交指令
// adminlte的样式
import 'bootstrap';
import 'admin-lte';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/_all-skins.min.css';
// erp样式
import './styles/erp/AdminLTE.css';
import './styles/erp/AdminLTE2.css';
import './styles/erp/Site.css';

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
})
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(loadMore)
Vue.use(dbClick)
Vue.prototype.filteParams = function(params) {
  for (let item in params) {
    if(params[item]  == null){
      delete params[item]
    }else{
      if (params[item].length == 0) {
        delete params[item]
      }
    }
  };
  return params;
};
Vue.prototype.filteType = function(params) {
  switch (params) {
    case 'green':
      return 'success'
      break;
    case 'red':
      return 'danger'
      break;
    case 'yellow':
      return 'warning'
      break;
    default:
      return 'primary'
  }
  // return params;
};
//合并json
Vue.prototype.extendJson = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;
  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }
  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object"
    //&& !jQuery.isFunction(target) 
  ) {
    target = {};
  }
  // extend jQuery itself if only one argument is passed
  if (length === i) {
    target = this;
    --i;
  }
  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];
        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }
        target[name] = copy;
      }
    }
  }
}
Vue.prototype.extendFn = function(item) { //调用一个对象的一个方法
  const reg1 = /^\w+/g
  const reg2 = /\(([^)]+)\)/
  if (reg2.test(item.methodName)) {
    let methodName = item.methodName.match(reg1)
    let args = item.methodName.match(reg2)
    this[methodName[0]].apply(this, args[1].split(','))
  } else {
    this[item.methodName].apply(this)
  }
}
Vue.prototype.handleTableData = function(handleTableData, callback) { // table数据处理函数
  // 数据copy表头数据不用管
  this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
  // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
  this.dataTable.tableStyle = { // 表格的样式
    textAlign: 'center',
    width: '100%'
  }
  this.dataTable.headerCellStyle = { // 表头文字的样式
    textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
  }
  this.$refs.tableConfig.domShow = false
  this.$nextTick(() => {
    this.$refs.tableConfig.domShow = true
    this.$refs.tableConfig.dialogVisible = false
  })
  callback()
}

Vue.prototype.routeERP = function(key, title, route) {
  top.removeTab(key); //删除tab页
  top.createTab(key, title, route)
}

Vue.prototype.replaceUrl = function(url) {
  return url.replace('#', "_").replace('#', "").replace(/\//g, "_").replace(/\\/g, "_").replace(/\?/g, "_").replace(/\&/g, "_").replace(/\=/g, "_").replace(/\-/g, "_").replace(/\:/g, "_").replace(/\,/g, "_").replace(/\./g, "_").replace(/\|/g, "_");
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
