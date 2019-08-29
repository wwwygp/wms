import request from '@/utils/request';
import base from '@/utils/api';
export function getReview(query) {//获取拣货单复核列表数据
  return request({
    url:  base + '/rest/wms/access/v1/export-review/pick_note',
    method: 'put',
    params: query
  })
}
export function getPrintingReviewList(query) {
  return request({
    url: base + '/rest/wms/access/v1/export-review/printing',
    method: 'POST',
    data: query
  })
}
