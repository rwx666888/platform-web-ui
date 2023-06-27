/**
 * 自定义下拉菜单
 * @param {String} selector id或jQuery对象
 * @param {Object} opt 配置信息
 */
COM_TOOLS._view.cus_dropdown = function (selector, opt) {
    opt = opt || {};
    opt = $.extend(true, { //配置项
        placement: 'bottom', //默认展开位置，bottom 、 top
        container: 'body',
        autoPlace: 'auto', //自动定位
        pull: 'left', //对齐方向
        height: 'auto', //下拉框高度
        width: '', //下拉框宽度，默认为初始化元素的宽度
        autoDestroy: false, //下拉框收起后，是否销毁；
        maxWidth: 'none',
        maxHeight: parseInt(($(window).height() || 500) * .4),
        content: '',
        template: '<div class="cus-dropdown-plugin"><div class="drop-cbox"><div class="drop-cbox-overflow"><div class="drop-cbox-cont"></div></div></div></div>'
    }, opt);
    var _obj = {};
    var $ele = $.type(selector) == 'string' ? $('#' + selector) : (selector.selector ? selector : $()),
        $box = $(opt.template);
    if ($ele.length == 0) {
        console.error('未找到操作对象');
        return false;
    }
    if ($ele.data('cus_dropdown')) {
        return $ele.data('cus_dropdown');
    }
    _obj.show = function () {
        if ($ele.attr('cus-cus_dropdown')) {
            $ele.trigger('inserted.cus_dropdown');
            $box.show();
            $ele.trigger('shown.cus_dropdown');
            return false;
        }
        var placement = opt.placement;
        var uid = COM_TOOLS.get_UID('cus_dropdown');
        var pos = COM_TOOLS.getPosition($ele);

        $box.attr('id', uid).find('.drop-cbox-cont').html(opt.content);
        $ele.attr('cus-cus_dropdown', uid);
        $box.detach().css({
            top: 0,
            left: 0,
            height: opt.height || 'auto',
            width: opt.width || pos.width || 'auto',
            maxWidth: opt.maxWidth || 'none',
            display: 'block'
        }).addClass(placement);

        opt.container ? $box.appendTo(opt.container) : $box.insertAfter($ele);
        $ele.trigger('inserted.cus_dropdown');

        var actualWidth = $box.outerWidth();
        var actualHeight = $box.outerHeight();

        if (opt.autoPlace) {
            var orgPlacement = placement;
            var viewportDim = COM_TOOLS.getPosition($('body'));
            placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? placement.replace('bottom', 'top') :
                placement == 'top' && pos.top - actualHeight < viewportDim.top ? placement.replace('top', 'bottom') :
                placement;
            $box.removeClass(orgPlacement).addClass(placement);
        }

        var offset = {
            top: placement == 'top' ? pos.top - actualHeight : pos.top + pos.height,
            left: opt.pull == 'left' ? pos.left : pos.right - actualWidth
        }

        $box.css({
            top: Math.round(offset.top),
            left: Math.round(offset.left)
        });
        $ele.trigger('shown.cus_dropdown');
    };
    _obj.hide = function (autoDestroy, element) {
        if (autoDestroy) {
            (element ? $('#' + element.attr('cus-cus_dropdown')) : $box).detach();
            (element || $ele).removeAttr('cus-cus_dropdown').trigger('hidden.cus_dropdown');
        } else {
            (element ? $('#' + element.attr('cus-cus_dropdown')) : $box).hide();
        }
    };
    _obj.getdropbox = function () {
        return $box;
    };
    _obj.autoDestroy = opt.autoDestroy;
    $ele.data('cus_dropdown', _obj);

    $ele.on('click.cus_dropdown', function (e) {
        if ($box.is(':hidden')) {
            $(document).one('mouseup.cus_dropdown_api', function (ee) { //在点击事件 触发前，重置状态
                var $target = $(ee.target);
                if ($target.closest($ele).length || $target.closest($box).length) {
                    return false;
                }
                _obj.hide(opt.autoDestroy);
            });
            _obj.show();
        } else {
            $(document).off('mouseup.cus_dropdown_api');
            _obj.hide(opt.autoDestroy);
        }
    });
    $box.on('mouseup.cus_dropdown_api', function () {
        return false;
    });
    /*
    // 与上面 cus_dropdown_api事件处理形式一致；
    var events_had = $._data( $(document)[0], "events");
    var flag_es = false;
    if(events_had && events_had['click']){
        var es_ = events_had['click'];
        $.each(es_, function(i, n) {
            if(n.namespace == 'cus_dropdown_api'){
                flag_es = true;
                return false;
            }
        });
    }
    if(!flag_es){
        $(document).on('click.cus_dropdown_api', function(e){
            var $target = $(e.target);
            $('[cus-cus_dropdown]').each(function(){
                var that_ = $(this);
                if(that_.is($target)){return true;}
                _obj.hide(that_.data('cus_dropdown').autoDestroy,that_);
            });
            if($target.closest('[cus-cus_dropdown]').length || $target.closest('.cus-dropdown-plugin').length){
                return false;
            }
        });
    }*/
    return _obj;
};