/**
 * 系统消息弹窗 【M：3.9.3 后续版本移除】
 * @param {Object} data 数据对象，JSON数组对象
 * @param {Object} opt 弹窗配置
 */
COM_TOOLS._model.msg_fn = function (data, opt) {
    var content_ = [],
        opt = opt || {},
        def = {
            type: 1, //关键
            area: ['280px', 'auto'],
            other: {
                offset: 'rb', // 位置：右下角
                cusOffsetLeft: -10, //据右侧偏移量
                shade: 0,
                skin: 'layui-skin-msg',
                move: false,
                maxHeight: 400,
                id: 'cus_msg_wid_' + (data['id'] || '')
            }
        };
    $.extend(true, def, opt);
    def['other']['skin'] += ' ';
    if (data.type == '1') {
        def['other']['skin'] += 'layui-skin-warning';
    } else {
        def['other']['skin'] += 'layui-skin-primary';
    }
    content_.push('<h3>', data.title, '</h3>');
    content_.push('<div class="ind-msg-cont">', data.msg, '</div>');
    cumCurWinModal(TEDU_MESSAGE.get('platform.plugin.com_msg.message_notice'), content_.join(''), top, def);
};