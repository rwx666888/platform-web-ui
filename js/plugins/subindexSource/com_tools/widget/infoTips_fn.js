/**
 * 信息详情气泡
 * @param {Object} selector 父选择器（dom中的已存在元素）  jQuery-selector;
 * @param {Object} target 子选择器  jQuery-selector;
 * @param {Object} callback 内容构造函数，返回当前操作对象(jquery-object:target子选择器)，需内部返回（return）内容；callback($this){reutn 需要展示的内容;}
 * @param {Object} opt 配置属性
 */
COM_TOOLS.infoTipsFn = function (selector, target, callback, opt) {
    var _defaults = {
        hideTime_: 300, //隐藏的延时时间 毫秒
        showTime_: 400, //显示的延时时间 毫秒
        html: true,
        imageZoom: false,
        placement: 'left', //显示位置 top | bottom | left | right | auto
        trigger: 'manual',
        container: 'body',
        maxHeight: '',
        //minHeight: '200px',
        maxWidth: '276px',
        height: '',
        title: '',
        content: function () { //注意title为空时，此方法会执行两次；
            var html_ = callback ? callback($(this)) : '';
            if (/<img[^>]*/.test(html_)) {
                _defaults['height'] = _defaults['maxHeight'] ? _defaults['maxHeight'] : $(window).height() * (/left|right/.test(_defaults['placement']) ? .5 : .4) + 'px';
            }
            return html_;
        }
    };
    $.extend(_defaults, (opt || {}));
    _defaults['template'] = '<div class="popover cus-popover-box" role="tooltip" style="max-width:' + (_defaults['maxWidth']) + ';' +
        (_defaults['imageZoom'] ? 'width:' + (_defaults['maxWidth']) + ';' : '') + '"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="' +
        (_defaults['maxHeight'] ? "max-height:" + _defaults['maxHeight'] + ";" : "") + '"></div></div>';
    _defaults['imageZoom'] && COM_TOOLS.requireJsFn(['jqueryZoom'], [], false); //加载图片缩放组件
    $(selector).on('mouseleave', target, function (e) {
        var _this = $(this);
        var _showTimer = _this.data('show_timer');
        if (_showTimer) {
            window.clearTimeout(_showTimer);
        }
        var _hideTimer = window.setTimeout(function () {
            _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
        }, _defaults['hideTime_']);
        _this.data('hide_timer', _hideTimer);
        return false;
    }).on('mouseenter', target, function (e) {
        var _this = $(this);
        var _hideTimer = _this.data('hide_timer');
        if (_hideTimer) {
            window.clearTimeout(_hideTimer);
        }
        if (!_this.hasClass('js-mouseove')) {
            var _showTimer = window.setTimeout(function () {
                _this.on('inserted.bs.popover', function () {
                    $('#' + _this.attr('aria-describedby')).children('.popover-content').css({
                        height: _defaults['height'],
                        'max-height': 'auto'
                    });
                }).on('shown.bs.popover', function () {
                    if (_defaults['imageZoom']) {
                        $('#' + _this.attr('aria-describedby')).find('img').wrap('<span class="img-zoom-box"></span>').css('display', 'block').parent().zoom();
                    }
                });
                var _thisPop = _this.addClass('js-mouseove').popover(_defaults).popover('show').attr('aria-describedby');
                $('#' + _thisPop).on('mouseenter', function (ee) {
                    var _hideTimer_ = _this.data('hide_timer');
                    if (_hideTimer_) {
                        window.clearTimeout(_hideTimer_);
                    }
                    return false;
                }).on('mouseleave', function (ee) {
                    _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
                    return false;
                });
            }, _defaults['showTime_']);
            _this.data('show_timer', _showTimer);
        }
        return false;
    });
};