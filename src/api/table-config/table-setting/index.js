import request from '@/utils/request';
import base from '@/utils/api';


export function getTablePage(query) {//获取表头主档信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/table',
    method: 'Get',
    params: query
  })
}

export function insertTable(query) {//新增表头主档信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/table',
    method: 'post',
    data: query
  })
}

export function updateTable(query) {//修改表头主档信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/table',
    method: 'put',
    data: query
  })
}

export function getTableDtlPage(query) {//获取表头明细信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/field_table',
    method: 'Get',
    params: query
  })
}

export function insertTableDtl(query) {//新增表头字段信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/field_table',
    method: 'post',
    data: query
  })
}

export function updateTableDtl(query) {//修改表头字段信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/field_table',
    method: 'put',
    data: query
  })
}

export function viewSql(query) {//修改表头字段信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/field_table/codes',
    method: 'get',
    params: query
  })
}

export function getFormType(query) {//修改表头字段信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/form-type',
    method: 'get',
    params: query
  })
}


export function getUrl(url,requestType) {//修改表头字段信息 接口
  return request({
    // url:  base + url,
    url:   url,
    method: requestType,
    params: '',
    data:''
  })
}

export function addFieldBatch(query) {//修改表头字段信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/field-table-list',
    method: 'post',
    data: query
  })
}

export function delFieldBatch(query) {//修改表头字段信息 接口
  return request({
    url:  base + '/rest/common/customize/v1/field-table',
    method: 'delete',
    params: query
  })
}
