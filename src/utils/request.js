import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { showFullScreenLoading, tryHideFullScreenLoading } from './loading';

const service = axios.create({
  timeout: 25000 // request timeout
})
let tempUrl = ''
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.url == '/apiz/rest/common/basematerial/v1/printer-group' || config.url == '/apiz/rest/common/dic/v1/dictionarys' || config.url == '/apiz/rest/wms/stock/v1/base-space-params' ||
      config.url == '/apiz/rest/wms/stock/v1/base-space' || config.url == '/apiz/rest/wms/stock/v1/base-warehouse-area' || config.url == '/apiz/rest/wms/stock/v1/base-storage-area' ||
      config.url == '/apiz/rest/wms/stock/v1/base-channel' || config.url == '/apiz/rest/common/basematerial/v1/commodity-extend/list' || config.url == '/apiz/rest/wms/stock/v1/stock-label/pallet-label' ||
      config.url == '/apiz/rest/common/basematerial/v1/brands' || config.url == '/apiz/rest/wms/stock/v1/route/base_route/select_info' || config.url == '/apiz/rest/common/basematerial/v1/user/mes-users' ||
      config.url == '/apiz/rest/common/dic/v1/standardPage' || config.url == '/apiz/rest/wms/access/v1/movenote/moveNoteCode' || config.url == '/apiz/rest/wms/access/v1/move_plan/query_move_wave_code' || 
      config.url == '/apiz/rest/wms/access/v1/outgoing-from' || config.url == '/apiz/rest/wms/access/schedule-history/v1/query-schedule-history-list' || config.url == '/apiz/rest/wms/access/v1/move_plan/query_move_record'
    ) {
      // 这里是某些api需要loading事件
      tempUrl = config.url
    } else {
      showFullScreenLoading(); // load显示事件
    }
    return config
  },
  error => {
    tryHideFullScreenLoading();
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    return response;
  },
  error => {
    tryHideFullScreenLoading()
    if (error.response) {
      // 401 清除token信息和vuex 并跳转到登录页面【现在特殊处理了Unauthenticated.时的500错误】
      if (error.response.status === 401) {
        // window.open(uploadUrl +'/Authority/Login')
        try {
          top.window.location.href =  staticConfiguration.uploadUrl +'/Authority/Login'
        } catch (e) {
          window.open(staticConfiguration.uploadUrl +'/Authority/Login')
        }
      }
    }
    if(!tempUrl == '/apiz/rest/wms/access/schedule-history/v1/query-schedule-history-list' || 
      !tempUrl == '/apiz/rest/wms/access/v1/move_plan/query_move_record'){
      Message({
        message: '服务错误',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
