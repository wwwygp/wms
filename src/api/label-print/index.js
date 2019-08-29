import request from '@/utils/request';

/**
 * @Author    chenyinhuan
 * @DateTime  2019-05-07
 * @copyright 标签打印相关接口
 * @license   [license]
 * @version   [version]
 * @param     {[type]}    LableType,TemplateType,CustomerId,SourceNo [description]
 * @return    {[type]}     Description,Height,Id,Width     [description]
 */
export function labelPrint (query) {
  return request({
    url: '/labelprint/api/Template/Index',
    method: 'GET',
    params: query
  })
}

/**
 * @Author    chenyinhuan
 * @DateTime  2019-05-07
 * @copyright 调用打印地址
 * @license   [license]
 * @version   [version]
 * @param     {[type]}    ID,LabelType,TemplateType,CustomerId,JsonParameter [description]
 */

export const labelPrintPage = (params) => {
    var print_url = staticConfiguration.newPrintUrl + '/labelprint/label/preview/index';
    if (params.JsonParameter.length > 0) {
        var strHtml = "";
        strHtml += "<form method='post'  id='_hgpFormPrint'  target='_blank' action=" + print_url + ">";
        strHtml += "<input type='hidden' name='JsonParameter'  value='" + params.JsonParameter+ "' />";
        strHtml += "<input type='hidden' name='ID'  value=" + params.ID + " />";
        strHtml += "</form>";
        if ($("#_hgpFormPrint").length == 0) {
            $("body").append(strHtml);
        } else {
            $("#_hgpFormPrint").remove();//测试兼容问题
            $("body").append(strHtml);
        }
        $("#_hgpFormPrint").submit();
    }
}
