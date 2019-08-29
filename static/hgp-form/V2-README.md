## 页面改动：
 * 将页面内的表单布局改成只有一行，列自适应
*  form表单标签增加两个自定义属性，分别是1. tableCode：data-value="WMS_COMMODITY_FORM"   2. 是哪个系统： data-sys="WMS"    WMS/MES/ERP
* 表单没有id的需要新增一个id，供控件渲染使用
## erp：
1. 页面引入css、js
 ```
<link rel="stylesheet" type="text/css" href="~/plugins/hgp-form/hgp-form.css">
<script src="~/plugins/hgp-form/axios.js"></script>
<script src="~/plugins/hgp-form/hgp-form-v2.js"></script>
2. 调用方法
var hgpForm = new HgpFormV2({
    trigger: '#formSearch'
});
hgpForm.getFormCustomField();
```
3. 样式问题：
因为组件的高度不一样会遇到布局不对，设置表单内的组件高度一致


## mes、wms
1. 在index.html中引入js和css
```
<script>
    document.write("<link rel='stylesheet' href='./static/hgp-form/hgp-form.css?v=" + Math.random() + "' \/>");
    document.write("<script src='./static/hgp-form/axios.js?v=" + Math.random() + "'><\/script>");
    document.write("<script src='./static/hgp-form/hgp-form-v2.js?v=" + Math.random() + "'><\/script>");
</script>
```
2. 调用方法
  1.data定义hgpForm: {}
  2.mounted方法中调用
```
      this.hgpForm = new HgpFormV2({
          trigger: '#top-form'
      });
      this.hgpForm.getFormCustomField();
```
3. 样式问题：
因为组件的高度不一样会遇到布局不对，设置表单内的组件高度一致
mes设置：
```
<style lang="scss" scoped>
  #form {
    .item {
      margin-bottom: 0px !important;
    }
    [class*=el-col-] {
      margin-bottom: 8px;
      height: 28px;
    }
  }
</style>
```
wms设置：
```
<style lang="scss" scoped>
#top-form {
  [class*=el-col-] {
    margin-bottom: 8px;
  }
}
</style>
```