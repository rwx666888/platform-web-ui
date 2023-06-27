/**
 * 自定义组织架构组件
 * @param {String} editbtn_selector 必填 编辑按钮选择器，用于打开组件；
 * @param {String} data_selector 必填 存放数据的textarea 对象
 * @param {Object} opt 配置项
 */
COM_TOOLS._model.orgModel =  function (editbtn_selector, data_selector, opt) {
    var $sel_dataInput = $.type(data_selector) == 'string' ? $('#' + data_selector) : data_selector;
    /* 编辑按钮 */
    var $edit_btn = $.type(editbtn_selector) == 'string' ? $('#' + editbtn_selector) : editbtn_selector;
    if ($edit_btn.length == 0 || $sel_dataInput.length == 0 || $edit_btn.data('orgmodel')) {
        return false;
    }
    var obj = COM_TOOLS._model._orgModel_(opt);

    var $wrap = obj._initSelBox($sel_dataInput);
    $edit_btn.click(function () {
        obj._openModel(JSON.parse($.trim($sel_dataInput.val()) || "[]"), function (arr, sArr) {
            obj._updateSelItem(sArr, $wrap);
            $sel_dataInput.val(JSON.stringify(arr));
        });
    });
    $edit_btn.data('orgmodel', 'inited');
};