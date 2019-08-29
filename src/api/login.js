import request from '@/utils/request';
import base from '@/utils/api';
export function loginByUsername(username, password) {
  return request({
    url:  base+'/slogin/loggedin',
    method: 'get',
    params: {username,password}
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: base+'/v1/session/user',
    method: 'get'
  })
}

