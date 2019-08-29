import request from '@/utils/request';
import base from '@/utils/api';
//获取当前仓库下的所有库区信息
export function warehouseAreaList () {
  return request({
    url: base + '/rest/wms/stock/v1/all-base-warehouse-area',
    method: 'get'
  })
}
//获取当前库区下的所有可拣货储区信息
export function getAblePickStorageAreaList (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area-by-whether-pick',
    method: 'get',
    params: query
  })
}
//获取当前库区下的所有可拣货通道信息
export function getAblePickChannelList (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-channel',
    method: 'get',
    params: query
  })
}
//查询保拣储区关系主档列表接口
export function pickUpStorageList (query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_pick_area',
    method: 'get',
    params: query
  })
}
//保拣储区关系主档新增接口
export function insertMainPickUpStorage (query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_pick_area',
    method: 'POST',
    data: query
  })
}
//保拣储区关系主档删除接口
export function deleteMainPickUpStorage(query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_pick_area',
    method: 'delete',
    params: query
  })
}
//保拣储区关系明细列表查询接口
export function pickUpStorageDetailsList(query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_reserve_pick_dtl',
    method: 'get',
    params: query
  })
}

//获取当前库区下的所有保拣储区信息
export function getDtlAblePickStorageAreaListAdd (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-storage-area-save-area',
    method: 'get',
    params: query
  })
}


//获取当前库区下的所有保拣通道信息
export function getDtlAblePickChannelListAddDtl (query) {
  return request({
    url: base + '/rest/wms/stock/v1/base-channel-all',
    method: 'get',
    params: query
  })
}

//保拣储区关系明细新增接口
export function insertDtlPickUpStorage (query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_reserve_pick_dtl',
    method: 'put',
    data: query
  })
}

//保拣储区关系明细修改接口
export function updateDtlPickUpStorage (query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_reserve_pick_dtl',
    method: 'POST',
    params: query
  })
}


//保拣储区关系明细删除接口
export function deleteDtlPickUpStorage (query) {
  return request({
    url: base + '/rest/wms/stock/v1/pick-storage/base_reserve_pick_dtl',
    method: 'delete',
    params: query
  })
}
