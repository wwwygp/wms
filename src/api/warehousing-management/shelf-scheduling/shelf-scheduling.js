import request from '@/utils/request';
import base from '@/utils/api';
export function limportAccptanceNoteList (query) {
  return request({
    url: base+'/rest/wms/access/v1/acceptance_note/',
    method: 'get',
    params: query
  })
}
//上架调度右表格
export function importScheduleList (query) {
  return request({
    url: base+'/rest/wms/access/v1/import-schedule',
    method: 'get',
    params: query
  })
}
//上架调度
export function importSchedule (query) {
  return request({
    url: base+'/rest/wms/access/v1/import-schedule',
    method: 'post',
    params: query
  })
}
