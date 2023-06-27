/* 
 * 组件语言扩展
 * Last modified time :2017-8-31
 */

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
        if(params === undefined) {
            return source;
        }
        if(params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
                return n;
            });
        });
        return source;
    }
    /**
     * 获取指定的消息内容
     * @param {String} key 消息key
     * @param {Array} params 可选，替换模板中{n}的位置，n为params数组下标从0开始
     * @param {String} lang 可选，缺省为默认配置语言,可自动进位为params
     * 备注：消息value值为 0 或 null\false等强制转换为空字符串输出；
     */
    _obj.get = function(key, params, lang) {
        lang = 'zh-CN';
        if(typeof LOCAL_MESSAGE_DATA != "undefined") {
            return LOCAL_MESSAGE_DATA[key] ? (_obj.format(LOCAL_MESSAGE_DATA[key], params) || '') : (
                msg[key] ? (_obj.format(msg[key][lang], params) || '') : ''
            );
        }
        return msg[key] ? (_obj.format(msg[key][lang], params) || '') : '';
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

var TEDU_LANGUAGE = {
    /* dataTable 中文 */
    _dataTable: {
        'zh-CN': {
            "processing": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.processing"],
            "lengthMenu": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.lengthMenu"],
            "zeroRecords": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.zeroRecords"],
            "info": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.info"],
            "infoEmpty": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.infoEmpty"],
            "infoFiltered": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.infoFiltered"],
            "infoPostFix": "",
            "search": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.search"],
            "url": "",
            "emptyTable": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.emptyTable"],
            "loadingRecords": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.loadingRecords"],
            "infoThousands": ",",
            "paginate": {
                "first": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_first"],
                "previous": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_previous"],
                "next": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_next"],
                "last": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_last"]
            },
            "aria": {
                "sortAscending": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.sortAscending"],
                "sortDescending": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.sortDescending"]
            }
        }
    },
    /* validate 中文 */
    _validate: function() {
        var _lang_ = "platform.plugin.validate.";
        return($.validator && {
            'zh-CN': {
                required: LOCAL_MESSAGE_DATA[_lang_ + "required"],
                remote: LOCAL_MESSAGE_DATA[_lang_ + "remote"],
                email: LOCAL_MESSAGE_DATA[_lang_ + "email"],
                url: LOCAL_MESSAGE_DATA[_lang_ + "url"],
                date: LOCAL_MESSAGE_DATA[_lang_ + "date"],
                dateISO: LOCAL_MESSAGE_DATA[_lang_ + "dateISO"],
                number: LOCAL_MESSAGE_DATA[_lang_ + "number"],
                digits: LOCAL_MESSAGE_DATA[_lang_ + "digits"],
                creditcard: LOCAL_MESSAGE_DATA[_lang_ + "creditcard"],
                equalTo: LOCAL_MESSAGE_DATA[_lang_ + "equalTo"],
                extension: LOCAL_MESSAGE_DATA[_lang_ + "extension"],
                maxlength: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "maxlength"]),
                minlength: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "minlength"]),
                rangelength: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "rangelength"]),
                range: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "range"]),
                max: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "max"]),
                min: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "min"])
            }
        });
    },
    _select2: function() {
        if(jQuery.fn.select2 && jQuery.fn.select2.amd) {
            var e = jQuery.fn.select2.amd;
            var _lang_ = "platform.plugin.select2.";
            return e.define("select2/i18n/zh-CN", [], function() {
                return {
                    errorLoading: function() {
                        return LOCAL_MESSAGE_DATA[_lang_ + "errorLoading"];
                    },
                    inputTooLong: function(e) {
                        var t = e.input.length - e.maximum;
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "inputTooLong"], [t]);
                    },
                    inputTooShort: function(e) {
                        var t = e.minimum - e.input.length;
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "inputTooShort"], [t]);
                    },
                    loadingMore: function() {
                        return LOCAL_MESSAGE_DATA[_lang_ + "loadingMore"];
                    },
                    maximumSelected: function(e) {
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "maximumSelected"], [e.maximum]);
                    },
                    noResults: function() {
                        return LOCAL_MESSAGE_DATA[_lang_ + "noResults"];
                    },
                    searching: function() {
                        return LOCAL_MESSAGE_DATA[_lang_ + "searching"];
                    }
                };
            }), {
                define: e.define,
                require: e.require
            };
        }
    },
    _datetimepicker: function() {
        var _lang_ = "platform.plugin.datetimepicker.";
        return {
            "zh-CN": {
                days: [LOCAL_MESSAGE_DATA[_lang_ + "sunday"], LOCAL_MESSAGE_DATA[_lang_ + "monday"], LOCAL_MESSAGE_DATA[_lang_ + "tuesday"], LOCAL_MESSAGE_DATA[_lang_ + "wednesday"], LOCAL_MESSAGE_DATA[_lang_ + "thursday"], LOCAL_MESSAGE_DATA[_lang_ + "friday"], LOCAL_MESSAGE_DATA[_lang_ + "saturday"], LOCAL_MESSAGE_DATA[_lang_ + "sunday"]],
                daysShort: [LOCAL_MESSAGE_DATA[_lang_ + "sun"], LOCAL_MESSAGE_DATA[_lang_ + "mon"], LOCAL_MESSAGE_DATA[_lang_ + "tue"], LOCAL_MESSAGE_DATA[_lang_ + "wed"], LOCAL_MESSAGE_DATA[_lang_ + "thu"], LOCAL_MESSAGE_DATA[_lang_ + "fri"], LOCAL_MESSAGE_DATA[_lang_ + "sat"], LOCAL_MESSAGE_DATA[_lang_ + "sun"]],
                daysMin: [LOCAL_MESSAGE_DATA[_lang_ + "s"], LOCAL_MESSAGE_DATA[_lang_ + "m"], LOCAL_MESSAGE_DATA[_lang_ + "t"], LOCAL_MESSAGE_DATA[_lang_ + "w"], LOCAL_MESSAGE_DATA[_lang_ + "th"], LOCAL_MESSAGE_DATA[_lang_ + "f"], LOCAL_MESSAGE_DATA[_lang_ + "s"], LOCAL_MESSAGE_DATA[_lang_ + "s"]],
                months: [LOCAL_MESSAGE_DATA[_lang_ + "jan"], LOCAL_MESSAGE_DATA[_lang_ + "feb"], LOCAL_MESSAGE_DATA[_lang_ + "mar"], LOCAL_MESSAGE_DATA[_lang_ + "apr"], LOCAL_MESSAGE_DATA[_lang_ + "may"], LOCAL_MESSAGE_DATA[_lang_ + "jun"], LOCAL_MESSAGE_DATA[_lang_ + "jul"], LOCAL_MESSAGE_DATA[_lang_ + "aug"], LOCAL_MESSAGE_DATA[_lang_ + "sep"], LOCAL_MESSAGE_DATA[_lang_ + "oct"], LOCAL_MESSAGE_DATA[_lang_ + "nov"], LOCAL_MESSAGE_DATA[_lang_ + "dec"]],
                monthsShort: [LOCAL_MESSAGE_DATA[_lang_ + "short_jan"], LOCAL_MESSAGE_DATA[_lang_ + "short_feb"], LOCAL_MESSAGE_DATA[_lang_ + "short_mar"], LOCAL_MESSAGE_DATA[_lang_ + "short_apr"], LOCAL_MESSAGE_DATA[_lang_ + "short_may"], LOCAL_MESSAGE_DATA[_lang_ + "short_jun"], LOCAL_MESSAGE_DATA[_lang_ + "short_jul"], LOCAL_MESSAGE_DATA[_lang_ + "short_aug"], LOCAL_MESSAGE_DATA[_lang_ + "short_sep"], LOCAL_MESSAGE_DATA[_lang_ + "short_oct"], LOCAL_MESSAGE_DATA[_lang_ + "short_nov"], LOCAL_MESSAGE_DATA[_lang_ + "short_dec"]],
                today: LOCAL_MESSAGE_DATA[_lang_ + "today"],
                clear: LOCAL_MESSAGE_DATA[_lang_ + "clear"],
                suffix: [],
                meridiem: [LOCAL_MESSAGE_DATA[_lang_ + "am"], LOCAL_MESSAGE_DATA[_lang_ + "pm"]],
                format: LOCAL_MESSAGE_DATA[_lang_ + "format"],
                weekStart: 1
            }
        }
    }()
};