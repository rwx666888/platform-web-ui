COM_TOOLS._model.panel = {
    /**
     * 面板自定义样式构造器
     */
    makePanelStyle: function () {
        var obj_ = {
            styleCache: {}
        };
        obj_.addStyle = function (itemid, opt) {
            if (!itemid || !opt) {
                return false;
            }
            var style_ = {};
            $.each(opt, function (k, v) {
                var s_ = skin_[k];
                if (s_) {
                    var val_ = s_.classAttr(v);
                    var newClass_ = s_.className.replace(/\.cus-panel( |$)/g, '.cus-panel[data-itemid="' + itemid + '"] ');
                    if (val_) {
                        if (!style_[newClass_]) {
                            style_[newClass_] = val_;
                        } else {
                            $.extend(true, style_[newClass_], val_);
                        }
                    }
                }
            });
            obj_.styleCache[itemid] = style_;
        };
        obj_.getStyle = function () {
            return obj_.styleCache;
        };
        obj_.formatStyle = function () {
            var html_ = [];
            var splitter_ = '\n'; //格式化样式输出格式 ，'\n' 或 ''；
            $.each(obj_.styleCache, function (mi, mv) {
                $.each(mv, function (cname, cobj) {
                    var r_ = '';
                    $.each(cobj, function (k, v) {
                        r_ += k + ':' + v + ';' + splitter_;
                    });
                    html_.push(cname + '{' + splitter_ + r_ + '}');
                });
            });
            return html_.join(splitter_) || '';
        };
        obj_.useStyle = function () { //应用于dom
            var $styleCode_ = $('#cuspanel_stylebox');
            if (!$styleCode_.length) {
                $styleCode_ = $('<style type="text/css" id="cuspanel_stylebox"></style>').appendTo("head");
            }
            $styleCode_.html(obj_.formatStyle());
        };

        var skin_ = { //注意 className 中必须以 .cus-panel开头，并且如果有子选择器“.cus-panel”后面必须有空格, 例如'.cus-panel > .cus-panel-body'；
            panelBorder: {
                className: '.cus-panel',
                classAttr: function (v) {
                    if ($.isNumeric(v)) {
                        return {
                            'border-width': parseInt(v) + 'px'
                        };
                    } else if (!v) { //没有值
                        return false;
                    } else {
                        return {
                            'border': v
                        }
                    }
                }
            },
            height: {
                className: '.cus-panel > .cus-panel-body',
                classAttr: function (v) {
                    if ($.isNumeric(v)) {
                        return {
                            'height': v + 'px'
                        };
                    } else if (!v) { //没有值
                        return false;
                    } else {
                        return {
                            'height': v
                        }
                    }
                }
            },
            headHidden: {
                className: '.cus-panel > .cus-panel-heading',
                classAttr: function (v) {
                    return v == 'true' ? {
                        'display': 'none'
                    } : false;
                }
            },
            headBorder: {
                className: '.cus-panel > .cus-panel-heading',
                classAttr: function (v) {
                    if ($.isNumeric(v)) {
                        return {
                            'border-bottom-width': parseInt(v) + 'px'
                        };
                    } else if (!v) { //没有值
                        return false;
                    } else {
                        return {
                            'border-bottom': v
                        }
                    }
                }
            }
        };
        return obj_;
    },
    /**
     * 添加一个面板
     * @param m 面板配置项 ；必须
     * @example {
     *   id: "m101", //面板id
     *   name: 'bbb', //面板名称
     *   parent: 'p101', //所属区块id
     *   type: 3, //类型
     *   order: 2, //序号
     *   url: 'http://baidu.com', //面板地址
     *   skin: { //必须包含 skin对象，可为空对象
     *     className: 'cus-panel-success', //皮肤样式
     *     panelBorder: '3', //面板边框（默认，宽度（border-width数字），非数字为border）
     *     headHidden: 'true', //标题栏显隐
     *     height: '100', //面板高度（body）
     *     headBorder: '0' //标题栏边框（默认，宽度（border-bottom-width数字），非数字为border-bottom）
     *   }
     * }
     * @param $target 内部批量构造时为缓存对象jq,作为外部API时，为目标区块的格栅对象jq(col);
     * @param action 操作类型；makeAndCache：批量构造面板及配置器并缓存；makeOne：构造一个目标面板及配置器；onlyShow：只显示不构造配置器；
     *
     */
    add_one_panel: function (m, $target, action) {
        var modelHtml = [];
        modelHtml.push('<div class="cus-panel ', (m.skin && m.skin.className ? m.skin.className : 'cus-panel-default'), '" data-itemid="', m.id, '" data-iframesrc="', m.url, '">');
        modelHtml.push('<div class="cus-panel-heading"><span class="cus-panel-title">', m.name, '</span>');
        modelHtml.push('<div class="cus-panel-btn-box"></div></div>');
        modelHtml.push('<div class="cus-panel-body"><p class="panel-no-permission"><i class="glyphicon glyphicon-exclamation-sign"></i><span>您还没有[', m.name, ']模块的访问权限！</span></p></div></div>');
        if (action == 'makeAndCache' || action == 'makeOne') {
            (action == 'makeAndCache' ? $target.find('#' + m.parent) : $target).children('.cus-col-box').append(COM_TOOLS._model.panel.model_wrap(modelHtml.join(''), m.id, m.modelid, m.parent, 3).data('skin', m.skin));
            if (action == 'makeOne') {
                $('.cus-panel[data-itemid="' + m.id + '"]').cuspanel();
            }
        } else if (action == 'onlyShow') {
            $target.find('#' + m.parent).append(modelHtml.join(''));
        }
    },
    /**
     * 构建包裹框架
     * @param {Object} $html 模块html内容，jq对象
     * @param {String} itemid 应用关系id
     * @param {String} model_id 模块id
     * @param {String} parentid 父节点id
     * @param {String} itemtype 模块类型； 1：区块；2：预留；3：模块（面板）
     */
    model_wrap: function ($html, itemid, model_id, parentid, itemtype) {
        var $wrap = $('<div class="js-model-item" data-wrapitem_id="' + itemid + '"  data-model_id="' + model_id + '" data-parent_id="' + parentid + '" data-model_type="' + itemtype + '"><div class="js-code-box"></div>' +
            '<div class="js-btn-box">' +
            (itemtype != 1 ? '<span class="label label-info js-evt-btnbar" data-active="config"><i class="glyphicon glyphicon-cog"></i>设置</span>' : '') +
            '<span class="label label-danger js-evt-btnbar" data-active="del"><i class="glyphicon glyphicon-remove"></i>删除</span>' +
            '<span class="label label-warning js-evt-btnbar" data-active="move"><i class="glyphicon glyphicon-move"></i>拖动</span>' +
            '</div></div>');
        $wrap.children('.js-code-box').html($html);
        return $wrap;
    }
};