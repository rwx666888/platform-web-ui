/**
 * @description 设置文本框的校验状态(不建议与tooltips混用，有样式兼容问题：tooltips会与icon争抢相邻兄弟节点，导致CSS选择器失效)
 * @param {Object} obj $(obj) or selector;
 * @param {String} status success:成功, warning：警告, error：失败, default：reset 默认;
 * @param {Boolean} noIcon 是否包含验证ICON，默认包含
 */
COM_TOOLS._view.setInputStatus = function (obj, status, noIcon) {
    if (obj) {
        obj = typeof (obj) === 'string' ? $(obj) : obj;
        if (obj.length > 0) {
            var p_ = obj.parent();
            var isInpGroup = p_.hasClass('input-group');
            var icon = isInpGroup ? p_.next('.form-control-feedback') : obj.next('.form-control-feedback');
            var offsetParent = isInpGroup ? p_.parent() : p_;
            offsetParent.removeClass('has-success has-warning has-error has-feedback');
            if (icon.length) {
                icon.remove();
            }
            var iconStr = '';
            switch (status) {
                case 'success':
                    offsetParent.addClass('has-feedback has-success');
                    iconStr = '<span class="glyphicon glyphicon-ok form-control-feedback "></span>';
                    break;
                case 'warning':
                    offsetParent.addClass('has-feedback has-warning');
                    iconStr = '<span class="glyphicon glyphicon-warning-sign form-control-feedback "></span>';
                    break;
                case 'error':
                    offsetParent.addClass('has-feedback has-error');
                    iconStr = '<span class="glyphicon glyphicon-remove form-control-feedback "></span>';
                    break;
                default:
                    iconStr = '';
                    break;
            }
            if (noIcon) {
                iconStr = '';
            }
            if (iconStr) {
                if (isInpGroup) {
                    var icon_ = $(iconStr);
                    var inpGroupControls = obj.nextAll('.input-group-btn, .input-group-addon');
                    if (inpGroupControls.length) {
                        var offsetPosition = 0;
                        $.each(inpGroupControls, function (index, inpGroupElement) {
                            offsetPosition += $(inpGroupElement).outerWidth();
                        })
                        icon_.css('right', offsetPosition + 15 + 'px');
                    }
                    /*if (p_.hasClass('input-group-sm') || p_.hasClass('input-group-lg')) {
                        obj.css('paddingRight', '42.5px');
                    }*/
                    p_.after(icon_);
                } else {
                    obj.after($(iconStr));
                }
            }
        }
    }
};