import request from '@/utils/request';
import base from '@/utils/api';
export function getDicDef(query) {//获取字典主档信息 接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdef',
    method: 'Get',
    params: query
  })
}

export function getDicDtl(query) {//获取字典明细接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdtl',
    method: 'Get',
    params: query
  })
}

export function addDicDef(query) {//新增字典主档接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdef/add',
    method: 'POST',
    data: query
  })
}

export function addDicDtl(query) {//新增字典明细接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdtl/add',
    method: 'POST',
    data: query
  })
}

export function updateDicDef(query) {//修改字典主档接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdef/update',
    method: 'PATCH',
    data: query
  })
}

export function updateDicDtl(query) {//修改字典明细接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdtl/update',
    method: 'PATCH',
    data: query
  })
}

export function getAllDataType(query) {//获取数据类型接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdatatype/listAll',
    method: 'Get',
    params: query
  })
}

export function delDicDef(query) {//删除字典主档接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdef/deleteByIds',
    method: 'DELETE',
    params: query
  })
}

export function delDicDtl(query) {//删除字典明细接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdtl/deleteByIds',
    method: 'DELETE',
    params: query
  })
}

export function viewSql(query) {//获取数据类型接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdef/sql-view',
    method: 'GET',
    params: query
  })
}

export function getDicRecord(query) {//获取数据类型接口
  return request({
    url:  base + '/rest/common/dic/v1/sys-dict-record/page',
    method: 'GET',
    params: query
  })
}

export function getParentData(query) {//获取父字典信息接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdef/parent-data',
    method: 'GET',
    params: query
  })
}

export function getParentDatadDtl(query) {//获取父字典信息接口
  return request({
    url:  base + '/rest/common/dic/v1/sysdictdtl/parent-data',
    method: 'GET',
    params: query
  })
}
