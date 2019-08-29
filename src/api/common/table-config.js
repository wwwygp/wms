import request from '@/utils/request';
import base from '@/utils/api';
export function tableFieConfig(query) {
  return request({
    url: base+'/rest/common/customize/v1/table_field',
    method: 'get',
    params: query
  })
}
// table字段修改
export function updateTable(query) {
  return request({
    url: base+'/rest/common/customize/v1/table_field',
    method: 'post',
    data: query
  })
}

/**
 * @Author    chenyinhuan
 * @DateTime  2019-05-15
 * @copyright [copyright] 重置表头
 * @license   [license]
 * @version   [version]
 * @param     {[type]}    query [description]
 * @return    {[type]}          [description]
 */
export function resetTable(query) {
  return request({
    url: base +'/rest/common/customize/v1/clear-user-setting-table',
    method: 'DELETE',
    params: query
  })
}
