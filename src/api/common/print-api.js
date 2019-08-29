
// 打印服务
/**
 * templateType：打印模板类型
 * userId：当前登录用户ID
 * dataSource:传递打印数据,json格式
 * templateId:模板Id
 * @param params
 */
export const print = (params) => {
		var print_url = staticConfiguration.printUrl;
    if (params.dataSource.length > 0) {
        var strHtml = "";
        strHtml += "<form method='post'  id='_hgpFormPrint'  target='_blank' action=" + print_url + ">";
        strHtml += "<input type='hidden' name='template_type'  value=" + params.templateType+ " />";
        // strHtml += "<input type='hidden' name='user_id'  value=" + 95 + " />";
        strHtml += "<input type='hidden' name='template_id'  value=" + params.templateId + " />";
        strHtml += "<textarea style='display:none;' id='data_source' name='data_source'>" + params.dataSource + "</textarea>";
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
