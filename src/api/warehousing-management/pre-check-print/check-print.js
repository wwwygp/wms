import request from '@/utils/request';
import base from '@/utils/api';
export function prePrintInfo (id) {
  return request({
    url: base+'/rest/wms/access/v1/previous_print/print_info/'+id,
    method: 'get'
  })
}

//预验收打印前调用这个接口改变状态


export function previousPrintStatus (query) {
  return request({
    url: base+'/rest/wms/access/v1/previous_print/',
    method: 'PUT',
    data: query
  })
}
