//datatable插件
CUS_PLUGINS._DT_ = {
    _numbers_nototal: function (page, pages) { //分页,无总页数
        var numbers = [];
        var buttons = $.fn.DataTable.ext.pager.numbers_length;
        var half = Math.floor(buttons / 2);
        var _range = function (len, start) {
            var end;
            if (typeof start === "undefined") {
                start = 0;
                end = len;
            } else {
                end = start;
                start = len;
            }
            var out = [];
            for (var i = start; i < end; i++) {
                out.push(i);
            }
            return out;
        };
        if (pages <= buttons) {
            numbers = _range(0, pages);
        } else if (page <= half) {
            numbers = _range(0, buttons - 1);
            numbers.push('ellipsis');
        } else if (page >= pages - 1 - half) {
            numbers = _range(pages - (buttons - 2), pages);
            numbers.splice(0, 0, 'ellipsis');
            numbers.splice(0, 0, 0);
        } else {
            numbers = _range(page - half + 2, page + half);
            numbers.push('ellipsis');
            numbers.splice(0, 0, 'ellipsis');
            numbers.splice(0, 0, 0);
        }
        numbers.DT_el = 'span';
        return numbers;
    },
    init: function () {
        var that_ = this;
        $.fn.DataTable.ext.pager['simple_numbers_no_totalpage'] = function (page, pages) { //分页插件，上、下页，数字，无总页数
            return ['previous', that_._numbers_nototal(page, pages), 'next'];
        };
        $.fn.DataTable.ext.pager['simple_numbers_input'] = function (page, pages) { //分页插件，上、下页，数字，带跳转框
            return ['previous', $.fn.DataTable.ext.pager._numbers(page, pages), 'next', 'cusPageInput'];
        };
        $.fn.DataTable.ext.pager['simple_numbers_inputAndPages'] = function (page, pages) { //分页插件，上、下页，数字，带跳转框+总页数
            return ['previous', $.fn.DataTable.ext.pager._numbers(page, pages), 'next', 'cusPageInputAndPages'];
        };
        $.fn.DataTable.ext.pager['simple_inputAndPages'] = function (page, pages) { //分页插件，上、下页，带跳转框+总页数
            return ['previous', 'next', 'cusPageInputAndPages'];
        };
    }
};