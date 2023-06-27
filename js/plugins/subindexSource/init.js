/*
 * 全局初始化，放在最后执行；
 */
(function () {
    /* 应用外部配置信息 */
    if (window.cus_default_ && $.type(window.cus_default_) == 'object') {
        $.extend(true, COM_DEFAULT, window.cus_default_);
        if (COM_TOOLS.localStorageSupport()) {
            COM_TOOLS.save_toLocal('cus_default', window.cus_default_);
            //console.log('#save_toLocal-', window.cus_default_);
        }
    } else {
        if (COM_TOOLS.localStorageSupport()) {
            var opt_ = {},
                strOpt_ = COM_TOOLS.get_fromLocal('cus_default');
            //console.log('#get_fromLocal-', strOpt_);
            if (strOpt_) {
                try {
                    opt_ = $.parseJSON(strOpt_);
                } catch (e) {
                    console.error('修改默认配置参数出错！');
                }
                $.extend(true, COM_DEFAULT, opt_);
            }
        }
    }
    /* 全局监听会话状态,会话过期强制跳转到登录页(注意这里要配合登录页的防嵌套使用,否则请改成top.location形式) */
    $.ajaxSetup({
        dataFilter: function (data, type) {
            COM_TOOLS._ajax_jumpToLogin(data);
            return data;
        }
    });
})();

/* 初始化全局组件配置 */
COM_TOOLS.initjSDefaultOpt('ALL');

$(function () {
    /* 帮助按钮交互方法 */
    COM_DEFAULT._isOpenHelpMsg['helpBtn'] && $(document).on('click', '.js-helpbtn', function (e) {
        var this_ = $(this),
            selt = this_.data('helpbtn');
        if (this_.is('#js_cushelpbtn')) {
            selt = '#' + ($('#t_tabBox > li.active > a').data('itemid') || '');
        }
        if (selt) {
            this_.attr({
                'href': /^#\w+/.test(selt) ? COM_DEFAULT._helpPage + selt.replace(/^#{1}/, '#help_') : selt,
                'target': 'cushelppage'
            });
        } else {
            return false;
        }
        e.stopPropagation();
    });
    /* 自定义提示信息，使用方法 将需要添加提示信息的元素 class中 加入”js-helpmsg“，然后设置 data-helpmsg="msgkey"； msgkey = TEDU_MESSAGE[key]; */
    COM_DEFAULT._isOpenHelpMsg['helpMsgTips'] && $(document).delayPopover({
        selector: '.js-helpmsg[data-titlemsg="true"],.js-helpmsg:not(:text)',
        placement: 'auto',
        trigger: 'hover',
        html: true,
        container: 'body',
        content: function () {
            var param_ = $(this).data('helpdata');
            param_ = param_ ? param_.toString().split(',') : [];
            return TEDU_MESSAGE.get($(this).data('helpmsg'), param_);
        }
    });
    /* 初始化input 默认提示信息（defaultValueMsg） */
    COM_TOOLS.fnInitInputHelpVal();
});