import request from '@/utils/request';
import base from '@/utils/api';
export function channelList (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel',
    method: 'get',
    params: query
  })
}
export function channelAdd (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel?',
    method: 'post',
    data: query
  })
}
export function channelUpdate (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel-change',
    method: 'post',
    data: query
  })
}
export function channelDel (channelIds) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel-delstatus?channelId=' + channelIds,
    method: 'PATCH'
  })
}

export function allChannel (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel-all',
    method: 'get',
    params: query
  })
}

export function spaceAdd (query) {//批量新增储位
  return request({
    url: base + '/rest/wms/stock/v1/base-space-channel',
    method: 'post',
    data: query
  })
}

export function selectChannel (query) {
  return request({
    url: base+'/rest/wms/stock/v1/base-channel',
    method: 'get',
    params: query
  })
}
