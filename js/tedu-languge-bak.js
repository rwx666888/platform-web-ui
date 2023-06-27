/* 
 * 组件语言扩展
 * Last modified time :2017-8-18
 */
var TEDU_LANGUAGE = {
    /* dataTable 中文 */
    _dataTable: {
        'zh-CN': {
            "processing": "处理中...",
            "lengthMenu": "显示 _MENU_ 项结果",
            "zeroRecords": "没有匹配结果",
            "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "infoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "infoFiltered": "(由 _MAX_ 项结果过滤)",
            "infoPostFix": "",
            "search": "搜索:",
            "url": "",
            "emptyTable": "表中数据为空",
            "loadingRecords": "载入中...",
            "infoThousands": ",",
            "paginate": {
                "first": "首页",
                "previous": "上页",
                "next": "下页",
                "last": "末页"
            },
            "aria": {
                "sortAscending": ": 以升序排列此列",
                "sortDescending": ": 以降序排列此列"
            }
        }
    },
    /* validate 中文 */
    _validate: function() {
        return($.validator && {
            'zh-CN': {
                required: "这是必填字段",
                remote: "请修正此字段",
                email: "请输入有效的电子邮件地址",
                url: "请输入有效的网址",
                date: "请输入有效的日期",
                dateISO: "请输入有效的日期 (YYYY-MM-DD)",
                number: "请输入有效的数字",
                digits: "只能输入整数",
                creditcard: "请输入有效的信用卡号码",
                equalTo: "你的输入不相同",
                extension: "请输入有效的后缀",
                maxlength: $.validator.format("最多可以输入 {0} 个字符"),
                minlength: $.validator.format("最少要输入 {0} 个字符"),
                rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
                range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
                max: $.validator.format("请输入不大于 {0} 的数值"),
                min: $.validator.format("请输入不小于 {0} 的数值")
            }
        });
    },
    _select2: function() {
        if(jQuery.fn.select2 && jQuery.fn.select2.amd) {
            var e = jQuery.fn.select2.amd;
            return e.define("select2/i18n/zh-CN", [], function() {
                return {
                    errorLoading: function() {
                        return "无法载入结果。"
                    },
                    inputTooLong: function(e) {
                        var t = e.input.length - e.maximum,
                            n = "请删除" + t + "个字符";
                        return n
                    },
                    inputTooShort: function(e) {
                        var t = e.minimum - e.input.length,
                            n = "请再输入至少" + t + "个字符";
                        return n
                    },
                    loadingMore: function() {
                        return "载入更多结果…"
                    },
                    maximumSelected: function(e) {
                        var t = "最多只能选择" + e.maximum + "个项目";
                        return t
                    },
                    noResults: function() {
                        return "未找到结果"
                    },
                    searching: function() {
                        return "搜索中…"
                    }
                }
            }), {
                define: e.define,
                require: e.require,
                qwe: 1
            }
        }
    },
    _datetimepicker: {
        "zh-CN": {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            clear: "清除",
            suffix: [],
            meridiem: ["上午", "下午"],
            format: "yyyy-mm-dd",
            weekStart: 1
        }
    }
};

/* 错误提示信息 */
var TEDU_MESSAGE = function() {
    var _obj = {};
    var msg = {
        "noPermission": {
            "zh-CN": "无权限！"
        },
        "noGetPermission": {
            "zh-CN": "鉴权失败，请重新登陆或联系管理员！"
        },
        "noLogin": {
            "zh-CN": "请先登陆！"
        },
        "checkWinVer": {
            "zh-CN": "您的浏览器版本过低，请使用IE10+,火狐，谷歌，Safari等主流产品！"
        },
        "success": {
            "zh-CN": "操作成功!"
        },
        "fail": {
            "zh-CN": "操作失败!"
        },
        "error": {
            "zh-CN": "系统异常,请联系管理员！"
        },
        "networkError": {
            "zh-CN": "请求异常！"
        },
        "noData": {
            "zh-CN": "无匹配数据！"
        },
        "noSelrows": {
            "zh-CN": "请选择要修改的行！"
        },
        "noSaverows": {
            "zh-CN": "请选择要保存的行！"
        },
        "del": {
            "zh-CN": "删除"
        },
        "delConfirm": {
            "zh-CN": "确认删除吗?"
        },
        "yes": {
            "zh-CN": "确认"
        },
        "cancel": {
            "zh-CN": "取消"
        },
        "minLength": {
            "zh-CN": "不能少于{0}个！"
        },
        "maxLength": {
            "zh-CN": "不能多于{0}个！"
        },
        "rangeLength": {
            "zh-CN": "只能输入{0}至{1}个字符！"
        },
        "enterName": {
            "zh-CN": "请输入名称!"
        },
        "enterUname": {
            "zh-CN": "请输入用户名"
        },
        "enterPwd": {
            "zh-CN": "请输入密码"
        },
        "enterSearch": {
            "zh-CN": "请输入搜索内容!"
        },
        "noEmpty": {
            "zh-CN": "不能为空"
        },
        "pause": {
            "zh-CN": "暂停"
        },
        "end": {
            "zh-CN": "结束"
        },
        "nextStep": {
            "zh-CN": "下一步"
        },
        "prevStep": {
            "zh-CN": "上一步"
        },
    };
    /**
     * 替换内容中的{n}
     * @param {String} source 内容模板
     * @param {Array} params 要替换的参数数组
     */
    _obj.format = function(source, params) {
        if(typeof(source) !== 'undefined' && $.isArray(params) && params.length > 0) {
            $.each(params, function(i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
                    return n;
                });
            });
        }
        return source;
    }
    /**
     * 获取指定的消息内容
     * @param {String} key 消息key
     * @param {String} lang 可选，缺省为默认配置语言,可自动进位为params
     * @param {Array} params 可选，替换模板中{n}的位置，n为params数组下标从0开始
     * 备注：消息value值为 0 或 null\false等强制转换为空字符串输出；
     */
    _obj.get = function(key, lang, params) {
        var t_ = $.isArray(lang);
        if(t_) {
            params = lang;
            lang = COM_TOOLS['_language'];
        }
        if(typeof LOCAL_MESSAGE_DATA != "undefined") {
            //return LOCAL_MESSAGE_DATA[key] ? (_obj.format(LOCAL_MESSAGE_DATA[key], params) || '') : '';
            return LOCAL_MESSAGE_DATA[key] ? (_obj.format(LOCAL_MESSAGE_DATA[key], params) || '') : (
                msg[key] ? (_obj.format(msg[key][lang || COM_TOOLS['_language']], params) || '') : ''
            );
        }
        /*var t_ = $.isArray(lang);
        return t_ && (params = lang, lang = COM_TOOLS['_language']),
            msg[key] ? (_obj.format(msg[key][lang || COM_TOOLS['_language']], params) || '') : '';*/
        return msg[key] ? (_obj.format(msg[key][lang || COM_TOOLS['_language']], params) || '') : '';
    };
    /**
     * 扩展msg对象，对象原属性不可修改
     * @param {Object} obj
     */
    _obj.set = function(obj) {
        msg = $.extend(true, obj, msg);
    };
    return _obj;
}();