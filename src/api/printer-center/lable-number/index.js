import request from '@/utils/request';
import base from '@/utils/api';
export function takeLableNumber(query) {//获取出货列表明细
  return request({
    url:  base + '/rest/wms/stock/v1/stock-label/takeNumber',
    method: 'POST',
    params: query
  })
}
export function limitLableNumber(query) {//出货单状态修改
  return request({
    url:  base + '/rest/wms/stock/v1/stock-label/limit-number',
    method: 'Get',
    params: query
  })
}




