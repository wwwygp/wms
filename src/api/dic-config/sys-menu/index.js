import request from '@/utils/request';
import base from '@/utils/api';
export function listSysMenuByMenu(query) {//查询所有菜单类型的接口权限数据
  return request({
    url:  base + '/v1/sys-menu/menu',
    method: 'GET',
    params: query
  })
}

export function pageSysMenu(query) {//分页查询接口权限数据
  return request({
    url:  base + '/v1/sys-menu/page',
    method: 'GET',
    params: query
  })
}

export function increasedSysMenu(query) {//新增接口权限
  return request({
    url:  base + '/v1/sys-menu/increased',
    method: 'POST',
    data: query
  })
}

export function modifySysMenu(query) {//修改接口权限数据
  return request({
    url:  base + '/v1/sys-menu/modify',
    method: 'PUT',
    data: query
  })
}

export function sysMenuRefresh(query) {//修改接口权限数据
  return request({
    url:  base + '/permission/refresh',
    method: 'PUT',
    data: query
  })
}
