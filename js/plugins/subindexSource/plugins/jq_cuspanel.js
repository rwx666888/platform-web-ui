(function ($) {
    var Cuspanel = function (element, options) {
        this.init('cuspanel', element, options);
    }
    Cuspanel.VERSION = '1.0.0';
    Cuspanel.DEFAULTS = {
        /* 加载中罩板 */
        overlay: '<div class="panel-overlay"><div class="panel-overlay-loading">' +
            '<i class="glyphicon glyphicon-refresh cus-animation-spin"></i></div></div>',
        /* 面板按钮组 */
        btn: {
            'fullscreen': {
                iconClass: ['glyphicon glyphicon-resize-full', 'glyphicon glyphicon-resize-small']
            },
            'reload': {
                iconClass: ['glyphicon glyphicon-refresh']
            },
            'collapse': {
                iconClass: ['glyphicon glyphicon-chevron-up', 'glyphicon glyphicon-chevron-down']
            },
            'close': {
                iconClass: ['glyphicon glyphicon-remove']
            }
        },
        /* 面板高度 */
        height: false,
        /* iframe地址，如果有则启用iframe模式 */
        iframesrc: false
    };
    Cuspanel.prototype.init = function (type, element, options) {
        var that = this;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$btnbox = this.$element.find('.cus-panel-btn-box');
        this.$body = this.$element.children('.cus-panel-body');
        this.$overlay = $(this.options.overlay);

        if (this.options.iframesrc) {
            this.$body.addClass('iframe-panel');
            this.$iframe = $('<iframe/>');
            this.overlay('open');
            this.$iframe.on('load', function () {
                that.overlay('close');
            }).attr({
                'allowtransparency': 'yes',
                'frameborder': 0,
                'height': '100%',
                'width': '100%',
                'src': this.options.iframesrc
            });
            this.$body.html(this.$iframe);
        }
        if (this.options.height) {
            this.$body.height(this.options.height);
        }
        this.btns();
    };
    /* 构造按钮组 */
    Cuspanel.prototype.btns = function () {
        var that = this;
        var $btnbox = this.$btnbox;
        if ($btnbox.length == 0) { //没有按钮面板
            return false;
        }
        var btnHtml = [];
        var btn = this.options.btn;
        if (btn && !$.isEmptyObject(btn)) {
            $.each(btn, function (action, n) {
                if (n && n.iconClass) {
                    if ($.type(n.iconClass) == 'string') {
                        btn[action].iconClass = [n.iconClass];
                    }
                    if (action == 'reload' && !that.options.iframesrc) {
                        return true;
                    }
                    btnHtml.push('<span class="c-p-btn js-evt-btnbar" data-active="', action, '">');
                    btnHtml.push('<i class="', n.iconClass[0], '"></i>');
                    btnHtml.push('</span>');
                    if (/^(fullscreen|reload|collapse|close)$/.test(action)) { //内部api
                        $btnbox.on('click.com.' + that.type + '.data-api', '.js-evt-btnbar[data-active="' + action + '"]', $.proxy(that[action], that));
                    } else { //自定义按钮
                        $btnbox.on('click.com.' + that.type + '.data-api', '.js-evt-btnbar[data-active="' + action + '"]', $.proxy(function (e) {
                            var $curBtn = $(e.currentTarget);
                            this.$element.trigger($.Event(action + '.com.' + this.type, {
                                relatedTarget: $curBtn[0]
                            }));
                        }, that));
                    }
                }
            });
            $btnbox.html(btnHtml.join(''));
        } else {
            $btnbox.hide();
        }
    };
    /* 获取默认全局配置信息 */
    Cuspanel.prototype.getDefaults = function () {
        return Cuspanel.DEFAULTS;
    };
    /* 获取当前实例的配置信息 */
    Cuspanel.prototype.getOptions = function (options) {
        var data_ = $.extend({}, this.$element.data());
        if (data_ && data_.btn && $.trim(data_.btn).substring(0, 1) == "{") {
            data_.btn = (new Function("return " + $.trim(data_.btn)))();
        }
        options = $.extend(true, {}, this.getDefaults(), data_, options);
        return options;
    };
    /* 全屏展示 */
    Cuspanel.prototype.fullscreen = function (action) {
        var thisBtnOpt = this.options.btn.fullscreen;
        var btnClass = thisBtnOpt.iconClass && thisBtnOpt.iconClass.length > 1 ? thisBtnOpt.iconClass : false;
        var $curBtn = action instanceof $.Event ? $(action.currentTarget) : this.$btnbox.children('.js-evt-btnbar[data-active="fullscreen"]');
        this.$element.toggleClass('fullscreen');
        btnClass && $curBtn.children('i').toggleClass(this.ckeckIcon(btnClass[0])).toggleClass(this.ckeckIcon(btnClass[1]));
        this.$element.trigger($.Event('fullscreen.com.' + this.type, {
            relatedTarget: $curBtn[0],
            actionType: this.$element.hasClass('fullscreen') ? 'isfullscreen' : 'nofullscreen'
        }));
    };
    /* 刷新iframe */
    Cuspanel.prototype.reload = function (action) {
        var thisBtnOpt = this.options.btn.reload;
        if (this.options.iframesrc) {
            this.$iframe.attr('src', this.$iframe.attr('src'));
            this.overlay('open');
        }
        var $curBtn = action instanceof $.Event ? $(action.currentTarget) : this.$btnbox.children('.js-evt-btnbar[data-active="reload"]');
        this.$element.trigger($.Event('reload.com.' + this.type, {
            relatedTarget: $curBtn[0]
        }));
    };
    /* 展开与收起 */
    Cuspanel.prototype.collapse = function (action) {
        var that = this;
        var thisBtnOpt = this.options.btn.collapse;
        var btnClass = thisBtnOpt.iconClass && thisBtnOpt.iconClass.length > 1 ? thisBtnOpt.iconClass : false;
        var $curBtn = action instanceof $.Event ? $(action.currentTarget) : this.$btnbox.children('.js-evt-btnbar[data-active="collapse"]');
        var callback_ = function () {
            that.$element.trigger($.Event('collapse.com.' + that.type, {
                relatedTarget: $curBtn[0],
                actionType: that.$body.is(':hidden') ? 'hidden' : 'show'
            }));
        };
        if (action == 'up') { //收起
            if (!this.$body.is(':hidden')) {
                this.$body.slideToggle('fast', callback_);
                btnClass && $curBtn.children('i').toggleClass(this.ckeckIcon(btnClass[0])).toggleClass(this.ckeckIcon(btnClass[1]));
            }
        } else if (action == 'down') { //展开
            if (this.$body.is(':hidden')) {
                this.$body.slideToggle('fast', callback_);
                btnClass && $curBtn.children('i').toggleClass(this.ckeckIcon(btnClass[0])).toggleClass(this.ckeckIcon(btnClass[1]));
            }
        } else { //用户点击按钮事件调用或无参数调用
            this.$body.slideToggle('fast', callback_);
            btnClass && $curBtn.children('i').toggleClass(this.ckeckIcon(btnClass[0])).toggleClass(this.ckeckIcon(btnClass[1]));
        }

    };
    /* 关闭 */
    Cuspanel.prototype.close = function (action) {
        var thisBtnOpt = this.options.btn.close;
        this.$element.remove();
        var $curBtn = action instanceof $.Event ? $(action.currentTarget) : this.$btnbox.children('.js-evt-btnbar[data-active="close"]');
        this.$element.trigger($.Event('close.com.' + this.type, {
            relatedTarget: $curBtn[0]
        }));
    };
    /* 过滤图标 */
    Cuspanel.prototype.ckeckIcon = function (iconClass) {
        return $.trim(iconClass.replace(/glyphicon |tedufont /g, ""));
    };
    /* 遮罩 */
    Cuspanel.prototype.overlay = function (action) {
        if (action == 'open') {
            if (!this.$element.find(this.$overlay).length) {
                this.$element.append(this.$overlay);
            }
        }
        if (action == 'close') {
            this.$overlay.detach();
        }
    };

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('com.cuspanel');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) {
                return;
            }
            if (!data) {
                $this.data('com.cuspanel', (data = new Cuspanel(this, options)));
            }
            if (typeof option == 'string') {
                data[option](_relatedTarget);
            }
        })
    }

    $.fn.cuspanel = Plugin;
    $.fn.cuspanel.Constructor = Cuspanel;
}(jQuery));