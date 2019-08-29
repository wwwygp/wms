import request from '@/utils/request';
import base from '@/utils/api';
export function suppliersList(query) { // 供应商列表
  return request({
    url: base+'/rest/common/basematerial/v1/suppliers/all',
    method: 'get',
    params: query
  })
}
export function ownersList(query) { // 委托业主列表
  return request({
    url: base + '/rest/common/basematerial/v1/owners',
    method: 'get',
    params: query
  })
}
export function brandList(query) { // 品牌列表
  return request({
    url: base+'/rest/common/basematerial/v1/brands',
    method: 'get',
    params: query
  })
}
export function getStaffsFromErp(query) { // 从ERP获取员工列表
  return request({
    url: base+'/rest/common/basematerial/v1/staff-teams/staffsFromErp',
    method: 'get',
    params: query
  })
}
export function getCustomerFromErp(query) { // 从ERP获取客户列表
  return request({
    url: base+'/rest/wms/stock/v1/customers',
    method: 'get',
    params: query
  })
}
export function getRouteFromErp() { // 获取线路列表
  return request({
    url: base+'/rest/wms/stock/v1/route/base_route/select_info',
    method: 'get',
  })
}

export function getCarrier(query) { // 获取承运商
  return request({
    url: base+'/rest/common/basematerial/v1/carrier/page-carrier-from-erp',
    method: 'get',
    params: query
  })
}

