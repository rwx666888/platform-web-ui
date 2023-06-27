/**
 * 自定义 ajax,支持loading遮罩
 * @param {Object} ajaxOpt $.ajax原生配置属性;
 * @param {Number} shadeType 1:全屏loading遮罩；2:button loading遮罩; 3:模态遮罩，如果对象是button，则优先使用button遮罩（注意，可能存在z-index层级问题）;
 * @param {Object|String} shadeOpt 遮罩配置信息； shadeType=1时，默认[0.5,'#000']；shadeType=2 或 shadeType=3时，为button id 或 jQuery对象;
 */
COM_TOOLS.ajaxFn = function (ajaxOpt, shadeType, shadeOpt) {
    var _default = {
        beforeSend: function (XHR) {
            if (shadeType == 1) {
                COM_TOOLS.loadingShade.open(0, shadeOpt);
            } else if (shadeType == 2) {
                COM_TOOLS.loadingBtn.open(shadeOpt);
            } else if (shadeType == 3) {
                COM_TOOLS.loadingOverlay.open(shadeOpt);
            }
            $.type(ajaxOpt['beforeSend']) == 'function' && ajaxOpt['beforeSend'](XHR);
        },
        complete: function (XHR, textStatus) {
            setTimeout(function () { //延时解锁，等待关闭动画（dom-remove）执行完再解锁
                if (shadeType == 1) {
                    COM_TOOLS.loadingShade.close();
                } else if (shadeType == 2) {
                    COM_TOOLS.loadingBtn.close(shadeOpt);
                } else if (shadeType == 3) {
                    COM_TOOLS.loadingOverlay.close(shadeOpt);
                }
            }, 300);
            $.type(ajaxOpt['complete']) == 'function' && ajaxOpt['complete'](XHR, textStatus);
        }
    };
    var _aOpt = {
        dataType: "json",
        cache: false
    };
    $.extend(true, _aOpt, ajaxOpt, _default);
    return $.ajax(_aOpt);
};