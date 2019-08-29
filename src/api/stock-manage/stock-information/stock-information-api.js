import request from '@/utils/request'
import base from '@/utils/api'
import axios from 'axios'
axios.defaults.withCredentials = true; // 允许是否可带cookie
//库存明细查询接口
export function queryStockInformation(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-commodity-info',
    method: 'get',
    params: queryParams
  })
}


//库存按库位查询接口
export function getCommodityInfoPageBySpace(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-commodity-info-by-space',
    method: 'get',
    params: queryParams
  })

}

//库存按库位查询接口
export function getCommodityInfoPageByBatch(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-commodity-info-by-batch',
    method: 'get',
    params: queryParams
  })

}

//库存按委托业主查询接口
export function getCommodityInfoPageByOwner(queryParams) {
  return request({
    url: base + '/rest/wms/stock/v1/stock-commodity-info-by-owner',
    method: 'get',
    params: queryParams
  })

}


//导出 库存明细
export function stockExportToExcel(queryParams) {
  return request({
    method: 'post',
    url: base + '/rest/wms/stock/v1/export-stock-dtl',
    data: queryParams,
    responseType: 'blob', // 表明返回服务器返回的数据类型
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//导出 按库位
export function stockExportToExcelBySpace(queryParams) {
  return request({
    method: 'post',
    url: base + '/rest/wms/stock/v1/export-stock-by-space',
    data: queryParams,
    responseType: 'blob', // 表明返回服务器返回的数据类型
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//导出 按批次
export function stockExportToExcelByBatch(queryParams) {
  return request({
    method: 'post',
    url: base + '/rest/wms/stock/v1/export-stock-by-batch',
    data: queryParams,
    responseType: 'blob', // 表明返回服务器返回的数据类型
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//导出 按委托业主
export function stockExportToExcelByOwner(queryParams) {
  return request({
    method: 'post',
    url: base + '/rest/wms/stock/v1/export-stock-by-owner',
    data: queryParams,
    responseType: 'blob', // 表明返回服务器返回的数据类型
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getTestReportUrl(query) {//获取检报url
  return request({
    url:  base + '/rest/wms/access/v1/test-report/url',
    method: 'GET',
    params: query
  })
}
