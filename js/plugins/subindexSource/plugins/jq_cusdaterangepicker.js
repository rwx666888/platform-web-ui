(function ($, document, window) { //TODO
    var Cusdaterangepicker = function (element, options, _relatedTarget) {
        this.$element_ = $(element);
        // 自定义 ranges
        if (options.showRanges) {
            options.ranges = options.ranges ? options.ranges : {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '近一周': [moment().subtract(6, 'days'), moment()],
                '近一月': [moment().subtract(29, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }
        this.option_ = $.extend(true, {}, $.fn.daterangepicker.defaultOptions, options);
        this.$element_.daterangepicker(this.option_, _relatedTarget);
        // 添加对非 input 元素的数据回显支持
        this.$element_.on('apply.daterangepicker', function (ev, picker) {
            picker.updateElement(true);
        }).on('cancel.daterangepicker', function (ev, picker) {
            if (picker.$input_.length == 1) { //注意，只处理是1的情况
                // 重置日历选中当前天
                picker.setStartDate(moment().startOf('minute'));
                picker.setEndDate(moment().endOf('minute'));
                picker.$input_.val('').trigger('focusout.validate');
            }
        })
    }
    Cusdaterangepicker.VERSION = '1.1.0';
    //Cusdaterangepicker.DEFAULTS = {};

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var data = $(this).data('daterangepicker');
            var options = typeof option == 'object' && option;

            if (!data && /remove/.test(option)) {
                return;
            }
            if (!data) {
                if (window.moment) {
                    new Cusdaterangepicker(this, options, _relatedTarget);
                } else {
                    console.error('使用该组件需提前引入 moment.js 组件!');
                }
            }
            if (typeof option == 'string') {
                data[option](_relatedTarget);
            }
        });
    }

    $.fn.cusdaterangepicker = Plugin;
    $.fn.cusdaterangepicker.Constructor = Cusdaterangepicker;
}(jQuery, document, window));