var utility = {
  //信息框
  openTips: function(content, second) {
    second = second == undefined ? 2000 : second * 1000;
    layer.msg(content, {
      time: second
    });
  },
  //在父页面弹出信息框
  openPTips: function(content) {
    parent.utility.openTips(content);
  },
  /*
  *弹出框
  */
  openDialogs: function(obj) {
    var defaultObj = {
      type: 2,
      title: false,
      scrollbar: false,
      closeBtn: 0,
      shade: [0.2],
      area: ['50%', '50%'],
      shift: 2,

    };
    obj = $.extend(defaultObj, obj);
    return layer.open(obj);
  }
}
export {utility}
