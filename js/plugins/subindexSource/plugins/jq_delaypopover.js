/* JQUERY 插件，自定义延时气泡Popover */
(function ($, document, window) {
    var DelayPopover = function (element, options) {
        this.init('delayPopover', element, options);
        this.initDelayPopover();
    };
    DelayPopover.DEFAULTS = $.extend({}, $.fn.popover.Constructor.DEFAULTS, {
        trigger: 'hover',
        delay: {
            hide: 160
        }
    });
    DelayPopover.prototype = $.extend({}, $.fn.popover.Constructor.prototype);
    DelayPopover.prototype.constructor = DelayPopover;
    DelayPopover.prototype.getDefaults = function () {
        return DelayPopover.DEFAULTS;
    };
    DelayPopover.prototype.delayPopoverEnter = function () {
        this.hoverState = 'in';
    };
    DelayPopover.prototype.delayPopoverLeave = function () {
        this.hoverState = 'out';
        this.leave(this);
    };
    DelayPopover.prototype.initDelayPopover = function () {
        this.tip()
            .on('mouseenter.' + this.type, $.proxy(this.delayPopoverEnter, this))
            .on('mouseleave.' + this.type, $.proxy(this.delayPopoverLeave, this));
    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.delayPopover');
            var options = typeof option == 'object' && option;
            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('bs.delayPopover', (data = new DelayPopover(this, options)));
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.delayPopover;
    $.fn.delayPopover = Plugin;
    $.fn.delayPopover.Constructor = DelayPopover;
    $.fn.delayPopover.noConflict = function () {
        $.fn.delayPopover = old;
        return this;
    };
}(jQuery, document, window));