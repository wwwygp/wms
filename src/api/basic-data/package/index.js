import request from '@/utils/request'
import base from '@/utils/api'

export function packageList(query) {
  return request({
    url: base + '/rest/common/basematerial/wmspackage/v1/page',
    method: 'get',
    params: query
  })
}

export function commodityUpdate(query) {
  return request({
    url: base + '/rest/common/basematerial/wmspackage/v1',
    method: 'put',
    data: query
  })
}

export function getPackageById(query) {
  return request({
    url: base + '/rest/common/basematerial/wmspackage/v1/erp-packages',
    method: 'get',
    params: query
  })
}

export function insertPackage(query) {
  return request({
    url: base + '/rest/common/basematerial/wmspackage/v1/addition',
    method: 'POST',
    data: query
  })
}

export function commodityBatchUpdate(param, query) {
  return request({
    url: base + '/rest/common/basematerial/wmspackage/v1/batch',
    method: 'put',
    params: param,
    data: query
  })
}
export function baseCommodityPackageDto (query) {
  return request({
    url: base+'/rest/common/basematerial/wmspackage/v1/package-count',
    method: 'put',
    data: query
  })
}
export function getPackageCount (query) {
  return request({
    url: base+'/rest/common/basematerial/wmspackage/v1/packages',
    method: 'get',
    params: query
  })
}
