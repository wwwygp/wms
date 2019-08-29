import request from '@/utils/request';
let uploadUrl = staticConfiguration.uploadUrl
import base from '@/utils/api';
export function uploadfile(query) { // 上传文件
  return request({
    // url: uploadUrl + '/api/WMSUploadFile/UploadFile',
    url: base + '/rest/wms/access/v1/app/distribution/uploadPhoto',
    method: 'post',
    data: query
  })
}
