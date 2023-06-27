/**
 * @description 弹出消息
 * @param {String} title 文字信息
 * @param {Object} opt 配置信息，选填
 * @example
 * {
 *  time: 6000, //6s后自动关闭   ;默认关闭时间，毫秒数； 0：不自动关闭（慎用）
 *  btn: ['按钮1', '按钮2'],
 *  btn1:function(index){
 *    alert(1);
 *    layer.close(index);
 *  },
 *  btn2:function(index){
 *    alert(2);
 *  },
 *  btnAlign: 'r', //按钮排列方式 默认右对齐;左对齐:'l';居中对齐:'c'
 *  shade:0.3, //背景蒙版,透明度
 *  shadeClose:false //是否点击遮罩关闭
 * }
 * @constructor
 */
COM_TOOLS.alert = function (title, opt) {
    return layer.msg(title || '', $.extend({
        zIndex: layer.zIndex
    }, opt));
};
/**
 * 带确认按钮的弹出消息 类似系统的alert
 * @param {Object} title 文字信息
 * @param {Object} opt  配置信息，选填，同 alert
 */
COM_TOOLS.alert2 = function (title, opt) {
    return layer.msg(title || '', $.extend({
        zIndex: layer.zIndex
    }, {
        time: 0,
        btn: [LOCAL_MESSAGE_DATA["platform.plugin.com_btn.confirm"]],
        btnAlign: 'c',
        shade: 0.3,
        shadeClose: false
    }, opt));
};
/**
 * @description 询问框,另外它不是和系统的confirm一样阻塞，所以你需要把交互的语句放在回调中；
 * @param {String} title
 * @param {Object} opt 个性化属性； btnStyleArr：[Array] 用于设置按钮样式，同bootstrap按钮样式; btn: [Array] 按钮名称数组；
 * @param {Function} yes 确认按钮回调方法  返回当前索引，需执行layer.close(index);关闭
 * @param {Function} cancel 取消按钮回调方法
 * @example #1
 * COM_TOOLS.confirm('AAA',function(){
 *     //点击确认按钮后的回调方法
 * });
 * @example #2
 * COM_TOOLS.confirm('AAA',{
 *  btnStyleArr:['btn-info','btn-danger','btn-primary'],
 *  btn:['btnName1','btnName2','btnName3']
 * });
 */
COM_TOOLS.confirm = function (title, opt, yes, cancel) {
    var l_ = "function" == typeof opt;
    return l_ && (cancel = yes, yes = opt),
        layer.confirm(title || '', $.extend({
            zIndex: layer.zIndex,
            btn: [LOCAL_MESSAGE_DATA["platform.plugin.com_btn.confirm"], LOCAL_MESSAGE_DATA["platform.plugin.com_btn.cancel"]],
            title: LOCAL_MESSAGE_DATA["platform.plugin.com_label.message"]
        }, (l_ ? {} : opt)), yes, cancel);
};