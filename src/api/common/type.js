import request from '@/utils/request';
import base from '@/utils/api';
export function dictionarysType(query) {
  return request({
    url: base+'/rest/common/dic/v1/dictionarys',
    method: 'get',
    params: query
  })
}
export function dictionarysTypeNew(param,obj,key) {
  request.get(base+'/rest/common/dic/v1/dictionarys', {
      params: {code: param}
  }).then(response => {
    if(response){
      obj[key] = response.data
    }
  })
}
// codeName  参数   String类型
// WMS_WAREHOUSE_AREA_CODE_KQ
// WMS_STORAGE_AREA_CODE_CQ
// WMS_CHANNEL_CODE_TD
export function codeCharCount(query) {
  return request({
    url: base+'/rest/wms/stock/v1/code-char-count',
    method: 'get',
    params: query
  })
}
//标准字典值接口api
export function standardDic(query) {
  return request({
    url: base+'/rest/common/dic/v1/standard-dic',
    method: 'get',
    params: query
  })
}
export function standardDicNew(param,obj,key) {
  request.get(base+'/rest/common/dic/v1/standard-dic', {
      params: {code: param}
  }).then(response => {
    if(response){
      obj[key] = response.data
    }
  })
}
//标准字典值分页查询接口api
export function standardDicPage(query) {
  return request({
    url: base+'/rest/common/dic/v1/standardPage',
    method: 'get',
    params: query
  })
}
//通过父节点编号获取字典值接口api
export function standardDicChild(query) {
  return request({
    url: base+'/rest/common/dic/v1/standard-dic-child',
    method: 'get',
    params: query
  })
}
