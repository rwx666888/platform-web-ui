/**
 * 系统消息弹窗(新) 【A:3.8.6】
 * @param {Object} data 数据对象，JSON数组对象
 * @param {Object} opt 弹窗配置
 */
COM_TOOLS._model.msg_fn2 = function (data, opt) {
    if ($.type(data) != 'array') {
        return false;
    } else if (!data.length) {
        return false;
    }
    var opt = opt || {},
        def = {
            type: 1, //关键
            area: ['300px', 'auto'],
            other: {
                offset: 'rb', // 位置：右下角
                cusOffsetLeft: -20, //据右侧偏移量
                shade: 0,
                skin: 'layui-skin-msg layui-skin-primary',
                move: false,
                maxHeight: 280,
                id: 'cus_msg_wid_0',
                btnAlign: 'c',
                btnStyleArr: ['btn-primary'],
                btn: ['全部已读', '查看全部'],
                btn2: function (index, layero) { //查看全部按钮
                    cumCurWinModal(
                        TEDU_MESSAGE.get('platform.plugin.com_msg.message_notice'),
                        COM_DEFAULT._isOpenNotice.infoListUrl,
                        top, {
                            "ismax": true
                        }
                    );
                    cumCloseWin(index, true, top); //关闭且不触发end事件（设置为已读操作）
                    return false; //阻止默认的关闭事件
                }
            },
            success: function (layero, index) {
                $.mCustomScrollbar && layero.find('.cus-msg-overflow').mCustomScrollbar({
                    //scrollbarPosition: 'outside',
                    theme: "minimal-dark"
                });
                layero.find('.cus-msg-contbox').on('click', '.cus-msg-item', function () {
                    var $that = $(this);
                    cumCurWinModal(
                        TEDU_MESSAGE.get('platform.plugin.com_msg.message_notice'),
                        COM_DEFAULT._isOpenNotice.infoPageUrl + '?id=' + $(this).data('itemid'),
                        top, {
                            "ismax": true,
                            success: function (layero2, index2) {
                                if ($that.siblings().length == 0) {
                                    cumCloseWin(index, true, top); //关闭且不触发end事件（设置为已读操作）
                                } else {
                                    $that.remove();
                                    //cumResizeWin(index, top); //重置窗口大小及位置
                                }
                            }
                        }
                    );
                });
            },
            end: function () { //关闭时，设置为全部已读状态
                var ids_ = get_cus_ids();
                if (COM_DEFAULT._isOpenNotice.seturl && ids_.length > 0) {
                    $.ajax({
                        type: "get",
                        url: COM_DEFAULT._isOpenNotice.seturl,
                        data: {
                            'id': ids_.join(',')
                        },
                        async: true,
                        cache: false,
                        timeout: 3000, //3秒超时
                        dataType: 'json',
                        success: function (d) {
                            $cont_ = $(false);
                        }
                    });
                }
            }
        };
    $.extend(true, def, opt);
    var id_ = def.other.id;
    var $cont_ = $('#' + id_);

    function make_c(other_ids) { //构造消息
        var content_ = [];
        $.each(data, function (i, n) {
            if ($.inArray(n.id, other_ids) !== -1) {
                return true; //跳出本次循环， 类似continue
            }
            content_.push('<div class="cus-msg-item clearfix" data-itemid="', n.id, '">');
            content_.push('<div class="cus-msg-lbox">');
            content_.push('<i class="glyphicon ', (n.type == '1' ? 'glyphicon-bell' : 'glyphicon-bullhorn'), '"></i>');
            content_.push('</div>');
            content_.push('<div class="cus-msg-rbox">');
            content_.push('<h3>', n.title, '</h3>');
            content_.push('<div class="t-btn-box clearfix">');
            content_.push('<span class="t-time pull-left">', n.date, '</span>');
            //content_.push('<span class="js-cus-msg-btn01 pull-right"><i title="设为已读" class="glyphicon glyphicon-send"></i></span>');
            content_.push('</div></div></div>');
        });
        return content_;
    }

    function get_cus_ids() { //获取当前窗口中的所有消息id
        var other_ids_ = [];
        $cont_.find('.cus-msg-item').each(function () {
            other_ids_.push($(this).data('itemid'));
        });
        return other_ids_;
    }

    if (!$cont_.length) { //不存在则创建弹窗
        cumCurWinModal(
            TEDU_MESSAGE.get('platform.plugin.com_msg.message_notice'),
            '<div class="cus-msg-overflow"><div class="cus-msg-contbox">' + make_c().join('') + '</div></div>',
            top, def
        );
        $cont_ = $('#' + id_);
    } else { //存在则追加

        var arr_ = make_c(get_cus_ids());
        if (arr_.length > 0) {
            $cont_.find('.cus-msg-contbox').append(arr_.join(''));
            var $p_ = $cont_.parent('.layui-layer');
            if ($p_.length) {
                cumResizeWin($p_.attr('times'), top); //重置窗口大小及位置
            }
        }
    }
};