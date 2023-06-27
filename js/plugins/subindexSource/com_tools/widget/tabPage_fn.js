/**
 * ajax 加载tab标签页；
 * @param {String} id //tab标签Id;
 * @param {Function} startcb 点击标签时触发的方法；
 * @param {Function} endcb 标签页面加载完成后触发的方法（全局）；
 * <dom> data-itemurl : 标签页地址url;
 * <dom> data-itemcallback : 各标签页加载完成后的回调（单个）;
 * @return {Object} API => reloadOneTab : 刷新指定标签下数据;
 */
COM_TOOLS.fnTabPage = function (id, startcb, endcb) {
    var obj = {};
    if (jQuery.type(id) === "string" && $('#' + id).length) {
        var tabB_ = $('#' + id);
        if (tabB_.data('inited')) {
            return tabB_.data('inited');
        }
        var isiframe_ = tabB_.is('[isiframe]'); //是否iframe方式初始化
        if (isiframe_) {
            $('body').addClass('flex-tabpage');
            $('<style type="text/css">html, body{height: 100%;} .flex-tabpage .cus-tabmodel-box{padding-right:0;position: absolute;left: 0;top: 0;height: 42px; width: 100%;}' +
                '.flex-tabpage .tab-content{height: 100%;padding-top: 42px;}.flex-tabpage .tab-content .tab-pane{height:100%;}</style>').appendTo("head");
        }
        var tabA_ = tabB_.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e, edata) {
            var t_ = $(e.target),
                cont_ = t_.attr('aria-controls') || t.attr('href').replace('#', ''),
                url_ = $.trim(t_.data('itemurl')),
                cbox_ = $('#' + cont_),
                cb_ = t_.data('itemcallback');
            console.log('##-', 1)
            if (url_) {
                if (cbox_.length > 0) {
                    if (isiframe_) {
                        console.log('##-', 2)
                        var $iframe_ = cbox_.children('iframe');
                        if ($iframe_.length) {
                            if (t_.is('[data-isreload=true]')) {
                                COM_TOOLS.loadingOverlay.open(cbox_);
                                $iframe_.addClass('layui-layer-load').attr('src', $iframe_.attr('dsrc'));
                            }
                        } else {
                            COM_TOOLS.loadingOverlay.open(cbox_);
                            $iframe_ = $('<iframe scrolling="auto" allowtransparency="true" style="height:100%;width:100%;display:block;" id="tabmodl_' + cont_ + '" name="tabmodl_' + cont_ +
                                '" frameborder="0" src="' + url_ + '" dsrc="' + url_ + '"></iframe>');
                            $iframe_.on('load', function () {
                                COM_TOOLS.loadingOverlay.close(cbox_);
                                cb_ && cb_();
                            });
                            cbox_.html($iframe_);
                        }
                        console.log('##-', 3)
                    } else {
                        if (t_.is('[data-isreload=true]') || edata == 'API' || $.trim(cbox_.html()).length < 10) {
                            COM_TOOLS.private_obj_._curTabPageid = cont_;
                            startcb && startcb();
                            cbox_.load(url_, function () {
                                cb_ && COM_TOOLS.private_obj_[cb_]();
                                endcb && endcb();
                                COM_TOOLS.fnInitInputHelpVal();
                            });
                        }
                    }
                }
            } else {
                cb_ && COM_TOOLS.private_obj_[cb_]();
            }!isiframe_ && $(window).trigger('resize');
        });
        $.trim(tabA_.eq(0).data('itemurl')) && tabA_.eq(0).trigger('shown.bs.tab', ['API']);

        /**
         * 刷新指定的标签
         * @param {Object} href 需要刷新的标签的 href属性值,例如 #tab1
         * @param {Object} toShow 是否需要显示（切换到）目标标签卡；
         */
        obj.reloadOneTab = function (href, toShow) {
            if (href) {
                var thatA_ = $('#' + id + ' a[data-toggle="tab"][href="' + href + '"]');
                if (toShow) {
                    thatA_.tab('show');
                    if (!thatA_.is('[data-isreload=true]')) {
                        $.trim(thatA_.data('itemurl')) && thatA_.trigger('shown.bs.tab', ['API']);
                    }
                } else {
                    $.trim(thatA_.data('itemurl')) && thatA_.trigger('shown.bs.tab', ['API']);
                }
            }
        };
        tabB_.data('inited', obj);
    }
    return obj;
};