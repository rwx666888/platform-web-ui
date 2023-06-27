/* 消息组件 */
var TEDU_MESSAGE = function () {
    var _obj = {};
    /**
     * 替换内容中的{n}
     * @param {String} source 内容模板
     * @param {Array} params 要替换的参数数组
     */
    _obj.format = function (source, params) {
        if (params === undefined) {
            return source;
        }
        if (params.constructor !== Object && params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return n;
            });
        });
        return source;
    };
    /**
     * 获取指定的消息内容
     * @param {String} key 消息key
     * @param {Array} params 可选，替换模板中{n}的位置，n为params数组下标从0开始
     * @param {String} lang (废弃)可选，缺省为默认配置语言,可自动进位为params
     * 备注：消息value值为 0 或 null\false等强制转换为空字符串输出；
     */
    _obj.get = function (key, params, lang) {
        lang = 'zh-CN';
        if (typeof LOCAL_MESSAGE_DATA != "undefined") {
            return LOCAL_MESSAGE_DATA[key] ? (_obj.format(LOCAL_MESSAGE_DATA[key], params) || '') : '';
        }
        return '';
    };
    return _obj;
}();