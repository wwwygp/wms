import request from '@/utils/request';
import base from '@/utils/api';
export function getDeliveNotice(query) {//获取出货列表明细
  return request({
    url:  base + '/rest/wms/access/v1/export/delive-notice',
    method: 'Get',
    params: query
  })
}
export function updateDeliveNotice(query) {//出货单状态修改
  return request({
    url:  base + '/rest/wms/access/v1/export/delive-notice',
    method: 'PATCH',
    params: query
  })
}
export function updateDeliveNoticeDelivestatus(query) {//修改出货通知单出货状态
  return request({
    url:  base + '/rest/wms/access/v1/export/delive-notice-delivestatus',
    method: 'PATCH',
    params: query
  })
}

export function addDeliveNotice(query) {//新增出货通知单
  return request({
    url:  base + '/rest/wms/access/v1/export/delive-notice',
    method: 'POST',
    data: query
  })
}
export function getDeliveNoticeDtl(query) {//查询出货通知单明细列表信息
  return request({
    url:  base + '/rest/wms/access/v1/export-dtl/delive-notice',
    method: 'Get',
    params: query
  })
}
export function addDeliveNoticeDtl(query) {//新增出货通知单明细
  return request({
    url:  base + '/rest/wms/access/v1/export-dtl/delive-notice',
    method: 'POST',
    data: query
  })
}

export function closeDeliveNotice(query) {//结案
  return request({
    url:  base + '/rest/wms/access/v1/export/delive-notice-close-file',
    method: 'get',
    params: query
  })
}



