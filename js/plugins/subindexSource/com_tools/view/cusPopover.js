/**
 * @description 生成一个带关闭按钮的popover弹窗
 * @param {String} id 触发这个弹窗按钮的id;
 * @param {Object} opt pop弹窗的配置项;
 * @param {Function} startcb 打开弹窗时执行的方法;
 * @param {Function} endcb 关闭弹窗时执行的方法;
 */
COM_TOOLS._view.cusPopover = function (id, opt, startcb, endcb) {
    var param_ = {
        container: 'body',
        placement: 'bottom',
        content: '',
        trigger: 'click',
        width: '',
        html: true,
        title: '<button type="btn" class="btn btn-warning btn-sm cus-pop-close" onclick="javascript:$(\'#' + id + '\').trigger(\'click\')"><i class="glyphicon glyphicon-chevron-up"></i></button>'
    };
    var tar_ = '',
        rep_ = '';
    if ($.type(opt) == "object") {
        tar_ = $(opt['content']);
        opt['content'] = tar_.html();
        $.extend(param_, opt);
    }
    $('#' + id).popover({
        html: param_['html'],
        container: param_['container'],
        placement: param_['placement'],
        content: param_['content'],
        trigger: param_['trigger'],
        title: param_['title'],
        template: '<div class="popover cus-popover-box2" role="tooltip"><div class="arrow"></div><h3 class="popover-title text-right"></h3><div class="popover-content"></div></div>',
    }).on('show.bs.popover', function () {
        $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        rep_ = $('<div>').hide().insertBefore(tar_);
        tar_.remove();
    }).on('shown.bs.popover', function () {
        (typeof startcb == 'function') && startcb(id);
    }).on('hidden.bs.popover', function () {
        $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        rep_.replaceWith(tar_);
        (typeof endcb == 'function') && endcb(id);
    }).on('inserted.bs.popover', function () {
        if (param_['width']) {
            $('#' + $(this).attr('aria-describedby')).css({
                'width': param_['width'],
                'max-width': 'none'
            });
        }
    });
};