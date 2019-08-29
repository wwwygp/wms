import request from '@/utils/request';
import base from '@/utils/api';
// 参数 		factoryId  required = false   Integer   
// 			staffId    required = false   Integer 
// 			staffIds   required = false   String
// isOnWork  required = false  Boolean 

// 说明：factoryId  前端页面调用接口时不传，后台程序调用接口需传
// staffId与staffIds 不可同时传，传staffId为获取单条，staffIds为获取多条，id逗号隔开拼成字符串。
// staffId与staffIds 都不传时，为获取所有员工（下拉框用）
// isOnWork  不传搜全部  true—在职   false—离职
export function staffsFromErp(query) {
  return request({
    url: base+'/rest/common/basematerial/v1/staff-teams/staffsFromErp',
    method: 'get',
    params: query
  })
}

export function userFromErp(query) {
  return request({
    url: base+'/rest/common/basematerial/v1/user/mes-users',
    method: 'get',
    params: query
  })
}

//settingDefCode=WMS_SHIPMENT_DELIVER_DEFICIENCY&dimensionDefCode=warehouse
//获取是否允许缺量收货参数
export function shipmentDeliverDeficiency(query) {
  return request({
    url: base + '/rest/common/customize/v1/sys_configuration/sys_customer_params',
    method: 'get',
    params: query
  })
}
