import request from '@/utils/request';
import base from '@/utils/api';
export function loaddBtn(menusKey) {
  return request({
    url: base+'/v1/menus/'+ menusKey,
    method: 'get'
  })
}
