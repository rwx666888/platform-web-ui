// 自定义表单验证插件validation与tooltip
CUS_PLUGINS._VALID_ = { // 自定义表单验证插件validation与tooltip
    applyTooltipOptions: function (element, tipsOpt) { //获取 tooltip 配置信息
        var defaults = $.fn.tooltip.Constructor.DEFAULTS;
        var options = {
            /* tooltip 配置属性 */
            animation: element.data('animation') || false,
            html: element.data('html') || defaults.html,
            placement: element.data('placement') || defaults.placement,
            selector: element.data('selector') || defaults.selector,
            trigger: $.trim('manual ' + (element.data('trigger') || '')),
            delay: element.data('delay') || defaults.delay,
            container: element.data('container') || defaults.container,
            template: '<div class="tooltip cus-tooltip-error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        };
        /* 初始化validator 时 使用额外属性 tooltip_options对指定元素（elementName）或全部元素（_all_）添加 tooltip配置 */
        if (tipsOpt && tipsOpt['_all_']) {
            $.extend(options, tipsOpt['_all_']);
        }
        if (tipsOpt && tipsOpt[element.attr('name')]) {
            $.extend(options, tipsOpt[element.attr('name')]);
        }
        return options;
    },
    init: function () {
        var _this = this;
        $.validator.setDefaults({
            normalizer: function (value) {
                return $.trim(value);
            },
            success: function (label, element) {
                $(element).tooltip('destroy');
            },
            errorPlacement: function (error, element) {
                var _ele = $(element),
                    _opt = _this.applyTooltipOptions(_ele, this.settings['tooltip_options']);
                _opt['title'] = _opt['html'] ? error.html() : error.text();
                if (_ele.data('bs.tooltip') !== undefined) {
                    _ele.data('bs.tooltip').options.title = _opt['title'];
                } else {
                    _ele.tooltip(_opt);
                }
                //_ele.attr('data-original-title',error.text());
                _ele.tooltip('show');
            }
            /*,
            unhighlight: function(element, errorClass, validClass) {
                //$(element).tooltip('destroy');
            },
            highlight: function(element, errorClass, validClass) {
            }*/
        });
    }
};