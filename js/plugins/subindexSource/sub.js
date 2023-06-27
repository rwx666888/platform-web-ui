///<jscompress sourcefile="_a_.js" />
var cum_Modalindex_ = 0; //记录弹窗索引
var cum_ModalValobj = null; //记录弹窗透传数据对象
/**
 * @description 打开弹窗
 * @param {String} tit 弹窗名称
 * @param {String} url frame地址OR ([$('demo')|| html ]&& type==1)
 * @param {Object} partOBJ = [parent|top|self] 窗口对象 parent || top || window(self)
 * @param {Object} opt opt = {}配置属性
 */
function cumCurWinModal(tit, url, partOBJ, opt) {
    var partOBJ_ = cumCheckPwin(partOBJ || window);
    var param = {
        /* 弹窗大小[宽, 高] : ['90%', '80%'] or ['500px', '300px'] 注意：当area='auto'时  maxWidth=360px； 为0则不限制；*/
        "area": ['90%', '80%'],
        /* 是否屏蔽滚动条  true:屏蔽滚动条 */
        "scrollbar": false,
        /* 是否显示最大化按钮 */
        "ismax": false,
        /* 回调元素ID */
        "callid": '',
        /* 回调函数对象列表 ,{key1:'fn1',key2:'fn2'}*/
        "callback": {},
        /* 右上角关闭按钮触发的回调call(index)  */
        "cancel": null,
        /* 层销毁后触发的回调no-call */
        "end": null,
        /* 帮助按（ ？） 按钮 -url地址或锚链接; false:不启用 */
        "helpBtn": false,
        /* 基本层类型: 0（信息框）1（页面层）2（iframe层）3（加载层）4（tips层） */
        "type": 2,
        /* 额外扩展对象(慎用)，可覆盖所有layer原始属性
         * other:{
         *  "noTriEnd":true, // {Boolean} 是否阻止cancel（关闭按钮'X'）时触发end回调方法; 默认：false;
         *  "offset":'auto', // {String|Array} 坐标 ；默认：垂直水平居中，'rb'：右下角；'rt'：右上角；'lb'：左下角。。。；
         *  "cusOffsetLeft":0, // 弹窗定位左侧偏移量，默认0，如果是右侧定位，请使用负数；
         *  "btnStyleArr": []// 自定义弹窗按钮组样式类 默认：无； ['btn-info','btn-danger']
         * }
         */
        "other": {},
        /* 弹窗成功后的回调  function(layero,ind_){}*/
        "success": null
    }
    if (typeof opt !== "undefined") {
        $.extend(param, opt);
    }
    var this_area_ = param['area']; //当宽、高溢出窗口大小后，设置为100%；
    if (this_area_[0] && this_area_[0].toLowerCase().indexOf('px') > 0 && parseInt(this_area_[0]) > $(partOBJ_).width()) {
        this_area_[0] = '100%';
    }
    if (this_area_[1] && this_area_[1].toLowerCase().indexOf('px') > 0 && parseInt(this_area_[1]) > $(partOBJ_).height()) {
        this_area_[1] = '100%';
    }
    if (param['type'] == 2) {
        COM_TOOLS.setCacheFnForChildWin(); //强制销毁之前弹窗绑定的回调函数体
    }
    var index_1 = partOBJ_.layer.open($.extend({
        type: param['type'],
        title: tit,
        area: param['area'],
        content: url,
        scrollbar: (param['scrollbar'] && !partOBJ_.$('html').attr('layer-full')) ? false : true,
        maxmin: param['ismax'],
        helpBtn: param['helpBtn'],
        resize: false,
        //isOutAnim: false, //关闭动画（timeout=》200MS）
        zIndex: partOBJ_.layer.zIndex,
        success: function (layero, ind_) {
            //partOBJ_.layer.setTop(layero);
            if (param['type'] == 2) {
                var iWin_ = partOBJ_[layero.find('iframe')[0]['name']]; //返回目标window对象,window.fun()
                if (param['callid']) {
                    iWin_.cum_ModalValobj = param['callid'];
                }
                if (!$.isEmptyObject(param['callback']) && $.type(param['callback']) == 'object') {
                    if (!param['callid']) { //对历史代码的兼容补丁
                        iWin_.cum_ModalValobj = 'no_nodeid';
                    }
                    iWin_.COM_TOOLS.cache_obj._ptWinFnNames = param['callback'];
                }
                if (window.name && (window.name != 'welPiframe' && window.name.indexOf('mainPiframe') != 0)) {
                    var index = partOBJ_.layer.getFrameIndex(window.name); //触发新弹窗的“弹窗页面索引”
                    if (index) {
                        iWin_.cum_Modalindex_ = index;
                    }
                } else {
                    iWin_.cum_Modalindex_ = -1;
                }
            }
            $.isFunction(param['success']) && param['success'](layero, ind_, iWin_);
        },
        cancel: param['cancel'],
        end: param['end']
    }, param['other']));
    return index_1;
}

/**
 * @description 在iframe父窗口中打开弹窗
 * @param {String} tit 弹窗名称
 * @param {String} url frame地址OR ([$('demo')|| html ]&& type==1)
 * @param {Object} opt => @function :: cumCurWinModal
 * @return {Number} 弹窗索引index
 */
function cumParentWinModal(tit, url, opt) {
    return cumCurWinModal(tit, url, parent, $.extend({
        "ismax": true
    }, opt));
}

/**
 * @description 关闭当前弹窗(只限iframe弹窗)并回调方法（用于回写数据）
 * @param {Function} cb 关闭后的回调方法 ；PS ：不能在这里执行异步操作；
 * @param {Boolean} noTriEnd_ 是否阻止触发END回调方法；true,默认：false
 */
function cumParentCallValue(cb, noTriEnd_) {
    if (!window.name) {
        return false;
    }
    var parent_ = cumCheckPwin(parent);
    var index = parent_.layer.getFrameIndex(window.name);
    if (typeof (cb) === "function") {
        cb();
    }
    cumCloseWin(index, noTriEnd_, parent_);
}

/**
 * @description 关闭指定的弹窗
 * @param {Number} index 需关闭的弹窗的index
 * @param {Boolean} noTriEnd_ 是否阻止触发END回调方法；true
 */
function cumCloseWin(index, noTriEnd_, partOBJ) {
    cumCheckPwin(partOBJ || window).layer.close(index, noTriEnd_);
}

/**
 * @description 获取并返回上一个目标弹窗的 window对象(只限在弹窗中打开的新弹窗中调用)
 * @param {Object} 窗口对象 parent || top || window(self)
 */
function cumGetParentWinGlobel(partOBJ) {
    if (cum_Modalindex_ > 0) {
        return cumCheckPwin(partOBJ).window["layui-layer-iframe" + cum_Modalindex_];
    } else if (cumCheckPwin(partOBJ) == top && top.$('.js-iframe-comwin').length > 0) {
        return top.window[top.$('.js-iframe-comwin:visible').attr('name')];
    } else {
        return cumCheckPwin(partOBJ);
    }
}

/**
 * @description 获取并返回上一个目标弹窗的 body对象(只限在弹窗中打开的新弹窗中调用)
 * @param {Object} 窗口对象 parent || top || window(self)
 */
function cumGetParentBodyGlobel(partOBJ) {
    if (cum_Modalindex_ > 0) {
        return cumCheckPwin(partOBJ).layer.getChildFrame('body', cum_Modalindex_);
    } else if (cumCheckPwin(partOBJ) == top && top.$('.js-iframe-comwin').length > 0) {
        return top.window[top.$('.js-iframe-comwin:visible').attr('name')].document.body;
    } else {
        return cumCheckPwin(partOBJ).document.body;
    }
}

/**
 * @description 根据内容自适应，调整窗口的大小及位置 （暂不适用于iframe层）
 * @param {Number} index 需关闭的弹窗的index
 * @param {Object} 窗口对象 parent || top || window(self)
 */
function cumResizeWin(index, partOBJ) {
    var partOBJ_ = cumCheckPwin(partOBJ || window);
    var $win_ = partOBJ_.$('#layui-layer' + index);
    if (!$win_.length) {
        return false;
    }
    var api_ = $win_.data('source_api');
    api_.auto(index).offset();
}

/**
 * 跨域嵌套时，自动降级为非嵌套模式，即返回当前窗体self
 * @param {Object} 窗口对象 parent || top || window(self)
 */
function cumCheckPwin(partOBJ) {
    var partOBJ_ = partOBJ || parent;
    try {
        partOBJ_.location.href
    } catch (e) {
        partOBJ_ = self;
    }
    return partOBJ_;
}

/* 用于mainPiframe窗口组件渲染完成后，回调修改mainPiframe高度 ；此方法只能用于 iframe右侧框架页面mainPiframe中*/
function resizeIframeHeight() { //废弃 2017-10-17
    //parent.$('#mainPiframe').height('auto').height($(document).height());
}

function intValidateOption() {}

/**
 * 重构 dataTable ajax-data
 * @param d dataTable原数据对象
 * @param p（obj=>{name:value,name1:value1}） 用户自定义的数据对象, p中不能包含DT 的保留字段 draw、pageSize、start、sort等，将被DT覆盖处理；
 */
function cus_dt_ajaxdata(d, p) {
    var cd_ = {};
    var columns_ = d.columns;
    cd_["draw"] = d.draw;
    cd_["pageSize"] = d.length;
    cd_["start"] = d.start;
    if (columns_) {
        cd_["sort"] = [];
        $.each(d.order, function (i, n) {
            var thisCol_ = columns_[n.column];
            cd_["sort"].push({
                colData: thisCol_.data,
                colName: thisCol_.name,
                dir: n.dir
            });
        });
    }
    if (!$.isEmptyObject(p)) {
        return $.extend({}, p, cd_);
    } else {
        return cd_;
    }
}

//下拉框添加
function select_add(selectId, objs, objValue, ObjText) {
    var selObj = $("#" + selectId);
    selObj.empty();
    var strArr = [];
    $.each(objs, function (i, obj) {
        strArr.push('<option value="', obj[objValue], '">', obj[ObjText], '</option>');
    });
    selObj.append(strArr.join(''));
}

//select下拉框初始化
function select_option_init(url, listName, selectId, optionValue, optionText, dataParams) {
    $.ajax({
        type: "post",
        url: url,
        data: dataParams,
        cache: false,
        success: function (data, status) {
            if (data.result == 1) {
                select_add(selectId, data[listName], optionValue, optionText);
            } else {
                COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noData"]);
            }
        },
        error: function () {
            COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.networkError"]);
        }
    });
}

;
///<jscompress sourcefile="_message.js" />
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
}();;
///<jscompress sourcefile="_language.js" />
/* JS组件语言包 */
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
                "last": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_last"],
                "btnToPage": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_btnToPage"] || "跳转"
            },
            "aria": {
                "sortAscending": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.sortAscending"],
                "sortDescending": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.sortDescending"]
            }
        }
    },
    /* validate 中文 */
    _validate: function () {
        var _lang_ = "platform.plugin.validate.";
        return ($.validator && {
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
    _select2: function () {
        if (jQuery.fn.select2 && jQuery.fn.select2.amd) {
            var e = jQuery.fn.select2.amd;
            var _lang_ = "platform.plugin.select2.";
            return e.define("select2/i18n/zh-CN", [], function () {
                return {
                    errorLoading: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "errorLoading"]
                    },
                    inputTooLong: function (e) {
                        var t = e.input.length - e.maximum;
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "inputTooLong"], [t]);
                    },
                    inputTooShort: function (e) {
                        var t = e.minimum - e.input.length;
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "inputTooShort"], [t]);
                    },
                    loadingMore: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "loadingMore"];
                    },
                    maximumSelected: function (e) {
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "maximumSelected"], [e.maximum]);
                    },
                    noResults: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "noResults"];
                    },
                    searching: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "searching"];
                    }
                }
            }), {
                define: e.define,
                require: e.require
            }
        }
    },
    _datetimepicker: function () {
        var _lang_ = "platform.plugin.datetimepicker.";
        return {
            "zh-CN": {
                days: [
                    LOCAL_MESSAGE_DATA[_lang_ + "sunday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "monday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "tuesday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "wednesday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "thursday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "friday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "saturday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sunday"]
                ],
                daysShort: [
                    LOCAL_MESSAGE_DATA[_lang_ + "sun"],
                    LOCAL_MESSAGE_DATA[_lang_ + "mon"],
                    LOCAL_MESSAGE_DATA[_lang_ + "tue"],
                    LOCAL_MESSAGE_DATA[_lang_ + "wed"],
                    LOCAL_MESSAGE_DATA[_lang_ + "thu"],
                    LOCAL_MESSAGE_DATA[_lang_ + "fri"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sat"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sun"]
                ],
                daysMin: [
                    LOCAL_MESSAGE_DATA[_lang_ + "s"],
                    LOCAL_MESSAGE_DATA[_lang_ + "m"],
                    LOCAL_MESSAGE_DATA[_lang_ + "t"],
                    LOCAL_MESSAGE_DATA[_lang_ + "w"],
                    LOCAL_MESSAGE_DATA[_lang_ + "th"],
                    LOCAL_MESSAGE_DATA[_lang_ + "f"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sa"],
                    LOCAL_MESSAGE_DATA[_lang_ + "s"]
                ],
                months: [
                    LOCAL_MESSAGE_DATA[_lang_ + "jan"],
                    LOCAL_MESSAGE_DATA[_lang_ + "feb"],
                    LOCAL_MESSAGE_DATA[_lang_ + "mar"],
                    LOCAL_MESSAGE_DATA[_lang_ + "apr"],
                    LOCAL_MESSAGE_DATA[_lang_ + "may"],
                    LOCAL_MESSAGE_DATA[_lang_ + "jun"],
                    LOCAL_MESSAGE_DATA[_lang_ + "jul"],
                    LOCAL_MESSAGE_DATA[_lang_ + "aug"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sep"],
                    LOCAL_MESSAGE_DATA[_lang_ + "oct"],
                    LOCAL_MESSAGE_DATA[_lang_ + "nov"],
                    LOCAL_MESSAGE_DATA[_lang_ + "dec"]
                ],
                monthsShort: [
                    LOCAL_MESSAGE_DATA[_lang_ + "short_jan"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_feb"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_mar"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_apr"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_may"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_jun"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_jul"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_aug"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_sep"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_oct"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_nov"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_dec"]
                ],
                today: LOCAL_MESSAGE_DATA[_lang_ + "today"],
                clear: LOCAL_MESSAGE_DATA[_lang_ + "clear"],
                suffix: [],
                meridiem: [LOCAL_MESSAGE_DATA[_lang_ + "am"], LOCAL_MESSAGE_DATA[_lang_ + "pm"]],
                format: LOCAL_MESSAGE_DATA[_lang_ + "format"],
                weekStart: 1
            }
        }
    }(),
    _daterangepicker: function () {
        var _lang_ = "platform.plugin.datetimepicker.";
        return {
            firstDay: 1,
            separator: " - ",
            //fromLabel: "From",
            //toLabel: "To",
            applyLabel: LOCAL_MESSAGE_DATA["platform.plugin.com_btn.confirm"],
            cancelLabel: LOCAL_MESSAGE_DATA["platform.plugin.com_btn.cancel"],
            customRangeLabel: "自定义",
            weekLabel: "W",
            daysOfWeek: [
                LOCAL_MESSAGE_DATA[_lang_ + "s"],
                LOCAL_MESSAGE_DATA[_lang_ + "m"],
                LOCAL_MESSAGE_DATA[_lang_ + "t"],
                LOCAL_MESSAGE_DATA[_lang_ + "w"],
                LOCAL_MESSAGE_DATA[_lang_ + "th"],
                LOCAL_MESSAGE_DATA[_lang_ + "f"],
                LOCAL_MESSAGE_DATA[_lang_ + "sa"]
            ],
            monthNames: [
                LOCAL_MESSAGE_DATA[_lang_ + "jan"],
                LOCAL_MESSAGE_DATA[_lang_ + "feb"],
                LOCAL_MESSAGE_DATA[_lang_ + "mar"],
                LOCAL_MESSAGE_DATA[_lang_ + "apr"],
                LOCAL_MESSAGE_DATA[_lang_ + "may"],
                LOCAL_MESSAGE_DATA[_lang_ + "jun"],
                LOCAL_MESSAGE_DATA[_lang_ + "jul"],
                LOCAL_MESSAGE_DATA[_lang_ + "aug"],
                LOCAL_MESSAGE_DATA[_lang_ + "sep"],
                LOCAL_MESSAGE_DATA[_lang_ + "oct"],
                LOCAL_MESSAGE_DATA[_lang_ + "nov"],
                LOCAL_MESSAGE_DATA[_lang_ + "dec"]
            ],
            format: LOCAL_MESSAGE_DATA[_lang_ + "format"].replace("yyyy", "YYYY").replace("mm", "MM").replace("dd", "DD")
                .replace("hh", "HH").replace("ii", "mm")
        }
    }
};;
///<jscompress sourcefile="_a_.js" />
/* 自定义插件 */
var CUS_PLUGINS = {};;
///<jscompress sourcefile="_dt_.js" />
//datatable插件
CUS_PLUGINS._DT_ = {
    _numbers_nototal: function (page, pages) { //分页,无总页数
        var numbers = [];
        var buttons = $.fn.DataTable.ext.pager.numbers_length;
        var half = Math.floor(buttons / 2);
        var _range = function (len, start) {
            var end;
            if (typeof start === "undefined") {
                start = 0;
                end = len;
            } else {
                end = start;
                start = len;
            }
            var out = [];
            for (var i = start; i < end; i++) {
                out.push(i);
            }
            return out;
        };
        if (pages <= buttons) {
            numbers = _range(0, pages);
        } else if (page <= half) {
            numbers = _range(0, buttons - 1);
            numbers.push('ellipsis');
        } else if (page >= pages - 1 - half) {
            numbers = _range(pages - (buttons - 2), pages);
            numbers.splice(0, 0, 'ellipsis');
            numbers.splice(0, 0, 0);
        } else {
            numbers = _range(page - half + 2, page + half);
            numbers.push('ellipsis');
            numbers.splice(0, 0, 'ellipsis');
            numbers.splice(0, 0, 0);
        }
        numbers.DT_el = 'span';
        return numbers;
    },
    init: function () {
        var that_ = this;
        $.fn.DataTable.ext.pager['simple_numbers_no_totalpage'] = function (page, pages) { //分页插件，上、下页，数字，无总页数
            return ['previous', that_._numbers_nototal(page, pages), 'next'];
        };
        $.fn.DataTable.ext.pager['simple_numbers_input'] = function (page, pages) { //分页插件，上、下页，数字，带跳转框
            return ['previous', $.fn.DataTable.ext.pager._numbers(page, pages), 'next', 'cusPageInput'];
        };
        $.fn.DataTable.ext.pager['simple_numbers_inputAndPages'] = function (page, pages) { //分页插件，上、下页，数字，带跳转框+总页数
            return ['previous', $.fn.DataTable.ext.pager._numbers(page, pages), 'next', 'cusPageInputAndPages'];
        };
        $.fn.DataTable.ext.pager['simple_inputAndPages'] = function (page, pages) { //分页插件，上、下页，带跳转框+总页数
            return ['previous', 'next', 'cusPageInputAndPages'];
        };
    }
};;
///<jscompress sourcefile="_valid_.js" />
// 自定义表单验证插件validation与tooltip
CUS_PLUGINS._VALID_ = { // 自定义表单验证插件validation与tooltip
    applyTooltipOptions: function (element, tipsOpt) { //获取 tooltip 配置信息
        var defaults = $.fn.tooltip.Constructor.DEFAULTS;
        var options = {
            /* tooltip 配置属性 */
            animation: element.data('animation') || false,
            html: element.data('html') || defaults.html,
            placement: element.data('placement') || defaults.placement,
            selector: element.data('selector') || defaults.selector,
            trigger: $.trim('manual ' + (element.data('trigger') || '')),
            delay: element.data('delay') || defaults.delay,
            container: element.data('container') || defaults.container,
            template: '<div class="tooltip cus-tooltip-error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        };
        /* 初始化validator 时 使用额外属性 tooltip_options对指定元素（elementName）或全部元素（_all_）添加 tooltip配置 */
        if (tipsOpt && tipsOpt['_all_']) {
            $.extend(options, tipsOpt['_all_']);
        }
        if (tipsOpt && tipsOpt[element.attr('name')]) {
            $.extend(options, tipsOpt[element.attr('name')]);
        }
        return options;
    },
    init: function () {
        var _this = this;
        $.validator.setDefaults({
            normalizer: function (value) {
                return $.trim(value);
            },
            success: function (label, element) {
                $(element).tooltip('destroy');
            },
            errorPlacement: function (error, element) {
                var _ele = $(element),
                    _opt = _this.applyTooltipOptions(_ele, this.settings['tooltip_options']);
                _opt['title'] = _opt['html'] ? error.html() : error.text();
                if (_ele.data('bs.tooltip') !== undefined) {
                    _ele.data('bs.tooltip').options.title = _opt['title'];
                } else {
                    _ele.tooltip(_opt);
                }
                //_ele.attr('data-original-title',error.text());
                _ele.tooltip('show');
            }
            /*,
            unhighlight: function(element, errorClass, validClass) {
                //$(element).tooltip('destroy');
            },
            highlight: function(element, errorClass, validClass) {
            }*/
        });
    }
};;
///<jscompress sourcefile="jq_cusdaterangepicker.js" />
(function ($, document, window) { //TODO
    var Cusdaterangepicker = function (element, options, _relatedTarget) {
        this.$element_ = $(element);
        // 自定义 ranges
        if (options.showRanges) {
            options.ranges = options.ranges ? options.ranges : {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '近一周': [moment().subtract(6, 'days'), moment()],
                '近一月': [moment().subtract(29, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }
        this.option_ = $.extend(true, {}, $.fn.daterangepicker.defaultOptions, options);
        this.$element_.daterangepicker(this.option_, _relatedTarget);
        // 添加对非 input 元素的数据回显支持
        this.$element_.on('apply.daterangepicker', function (ev, picker) {
            picker.updateElement(true);
        }).on('cancel.daterangepicker', function (ev, picker) {
            if (picker.$input_.length == 1) { //注意，只处理是1的情况
                // 重置日历选中当前天
                picker.setStartDate(moment().startOf('minute'));
                picker.setEndDate(moment().endOf('minute'));
                picker.$input_.val('').trigger('focusout.validate');
            }
        })
    }
    Cusdaterangepicker.VERSION = '1.1.0';
    //Cusdaterangepicker.DEFAULTS = {};

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var data = $(this).data('daterangepicker');
            var options = typeof option == 'object' && option;

            if (!data && /remove/.test(option)) {
                return;
            }
            if (!data) {
                if (window.moment) {
                    new Cusdaterangepicker(this, options, _relatedTarget);
                } else {
                    console.error('使用该组件需提前引入 moment.js 组件!');
                }
            }
            if (typeof option == 'string') {
                data[option](_relatedTarget);
            }
        });
    }

    $.fn.cusdaterangepicker = Plugin;
    $.fn.cusdaterangepicker.Constructor = Cusdaterangepicker;
}(jQuery, document, window));;
///<jscompress sourcefile="jq_cuspanel.js" />
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
}(jQuery));;
///<jscompress sourcefile="jq_delaypopover.js" />
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
}(jQuery, document, window));;
///<jscompress sourcefile="_a_.js" />
/* 通用工具 start 2016-12-06 lianglei */

var COM_TOOLS = {
    version: '6.1.1', //年index|月index|本月内版本index
    /* 当前版本默认语言（！！ 禁止修改 ！！） */
    _language: 'zh-CN',
    /* ### option start ### */
    /**
     * 常用JS组件初始化配置
     * @param {Array} jsArr ['ALL','jstree','validator','datetimepicker']
     */
    _jsFileList: {
        jstree: {
            js: 'plugins/jsTree/jstree.min.js',
            css: 'plugins/jsTree/style.min.css'
        },
        validator: {
            js: 'plugins/validate/jquery.validate.custom.min.js',
            css: ''
        },
        datetimepicker: {
            js: 'plugins/datetimepicker/bootstrap-datetimepicker.min.js',
            css: 'plugins/datetimepicker/bootstrap-datetimepicker.min.css'
        },
        select2: {
            js: 'plugins/select2/select2.full.min.js',
            css: 'plugins/select2/select2.min.css'
        },
        cropper: {
            js: 'plugins/cropper/cropper.min.js',
            css: 'plugins/cropper/cropper.min.css'
        },
        quicksearch: {
            js: 'plugins/lou-multi-select/js/jquery.quicksearch.js',
            css: ''
        },
        multiSelect: {
            js: 'plugins/lou-multi-select/js/jquery.multi-select.js',
            css: ''
        },
        jqueryZoom: {
            js: 'plugins/jquery-zoom/jquery.zoom.min.js',
            css: ''
        },
        echarts: {
            js: 'plugins/echarts/echarts.min.js',
            css: ''
        },
        icheck: {
            js: 'plugins/iCheck/icheck.min.js',
            css: 'plugins/iCheck/custom.css'
        },
        cusPinYin: {
            js: 'pinyin.js',
            css: ''
        },
        datatable: {
            js: 'plugins/datatables/datatables.min.js',
            css: 'plugins/dataTables/datatables.min.css'
        },
        mCustomScrollbar: {
            js: 'plugins/customScrollbar/jquery.mCustomScrollbar.concat.min.js',
            css: 'plugins/customScrollbar/jquery.mCustomScrollbar.min.css'
        }
    },
    initjSDefaultOpt: function (jsArr) {
        if (!jsArr) {
            return false;
        }
        /* 数据表格datatable默认配置信息（不建议修改） */
        (jsArr == 'ALL' || $.inArray('DTmain', jsArr) !== -1) && $.fn.dataTable && (CUS_PLUGINS['_DT_'].init(),
            $.extend($.fn.dataTable.defaults, COM_DEFAULT._dataTableOpt, {
                language: TEDU_LANGUAGE['_dataTable'][COM_TOOLS['_language']],
                fnPreDrawCallback: function (settings) { //表格重绘后取消全选框选中状态
                    $(settings.nTableWrapper).find('.cus-checkbox-all').removeClass('cus-checked');
                }
            }),
            $.fn.dataTable.ext.errMode = function (settings, techNote, message) {
                var msg = '数据表格错误: ' + (settings ? 'table id=' + settings.sTableId + ' - ' : '');
                if (techNote) {
                    switch (techNote) {
                        case 1:
                            msg += '无效的JSON数据格式';
                            break;
                        case 2:
                            msg += '非table节点初始化';
                            break;
                        case 3:
                            msg += '无法重复初始化DataTable；可能原因：表格ID重复，或未销毁之前的实例对象（特殊场景）；';
                            break;
                        case 4:
                            msg += '数据源中缺少对象，或其它数据格式错误：' + message;
                            break;
                        case 5:
                            msg += '分页操作越界，可能原因：分页参数错误，数据越界；';
                            break;
                        case 6:
                            msg += '表格渲染异常，表格布局错误，可能原因：表格初始化容器过小';
                            break;
                        case 7:
                            msg += 'Ajax错误,可能原因：应用响应异常；';
                            break;
                        default:
                            msg += message;
                    }
                    msg += '#Code:' + techNote;
                }
                if (window.console && console.error) {
                    console.error(msg);
                }
            });
        /*修改jstree默认跟节点id,必须为字符串类型*/
        (jsArr == 'ALL' || $.inArray('jstree', jsArr) !== -1) && $.jstree && (COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'jstree'), $.jstree.root = COM_DEFAULT._jsTreeOpt['root']);
        /*修改validate中文*/
        (jsArr == 'ALL' || $.inArray('validator', jsArr) !== -1) && $.validator && (CUS_PLUGINS['_VALID_'].init(), $.extend($.validator.messages, TEDU_LANGUAGE['_validate']()[COM_TOOLS['_language']]),
            COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'validator'));
        /*修改datetimepicker默认配置*/
        (jsArr == 'ALL' || $.inArray('datetimepicker', jsArr) !== -1) && $.fn.datetimepicker && (COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'datetimepicker'),
            $.fn.datetimepicker.dates['cus-lang'] = TEDU_LANGUAGE['_datetimepicker'][COM_TOOLS['_language']],
            $.extend($.fn.datetimepicker.defaults, COM_DEFAULT._dateTimePickerOpt, {
                language: 'cus-lang' //语言，禁止修改
            }));
        /*修改daterangeicker默认配置*/
        (jsArr == 'ALL' || $.inArray('daterangepicker', jsArr) !== -1) && $.fn.daterangepicker && ($.fn.daterangepicker.defaultOptions = {}) && (COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'daterangepicker'),
            $.extend($.fn.daterangepicker.defaultOptions, COM_DEFAULT._dateRangePickerOpt, {
                locale: TEDU_LANGUAGE['_daterangepicker']()
            }));
        /*修改select2中文*/
        (jsArr == 'ALL' || $.inArray('select2', jsArr) !== -1) && $.fn.select2 && (TEDU_LANGUAGE['_select2'](), $.fn.select2.defaults.set('language', COM_TOOLS['_language']),
            $.fn.select2.defaults.set('width', 'style'), COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'select2'));
    },
    /* ###  option end  ### */
    /*数据*/
    _data: {
        WEEKDAYS_: [], //工作日  yyyy-MM-dd(需要上班的休息日)
        PLAYDAYS_: [] //休息日  yyyy-MM-dd（不上班的工作日）
    },
    /* 私有方法及变量 ,ajax框架内，主界面载入时重置该对象(存活期为当前页面未销毁期间)，需要跨页面持久化的数据，请使用本地存储，或cookie（会话模式）
     * private_obj_.fun1=function(){}
     * private_obj_.key1=value1
     * */
    private_obj_: {},
    cache_obj: {
        /* 已ajax(loadInitJsFn)加载到当前页面的JS文件 */
        _jsfileArr: [],
        /* 存储由父窗口传递来的回调函数名称 */
        _ptWinFnNames: {},
        /* 在父窗口中存储将用于子窗口调用的交互回调方法体，该对象会在每次iframe弹窗打开前重置 (存活期为下一个iframe弹窗打开前)*/
        _ptWinFnList: {},
        /* jstree 使用的本地缓存变量*/
        _cus_jstree_cache: {}
    },
    /* 项目当前文件（JS）目录路径 http://domain/contentPath/js/ */
    _jsPath: function () {
        var jsPath = document.currentScript ? document.currentScript.src : function () {
            var js = document.scripts,
                last = js.length - 1,
                src;
            for (var i = last; i > 0; i--) {
                if (js[i].readyState === 'interactive') {
                    src = js[i].src;
                    break;
                }
            }
            return src || js[last].src;
        }();
        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }(),
    /* 检验是否支持本地持久化存储 */
    localStorageSupport: function () {
        return (('localStorage' in window) && window['localStorage'] !== null)
    },
    /* 存储持久化数据至本地 */
    save_toLocal: function (key, obj) {
        localStorage.setItem(key, (typeof obj == 'object' ? JSON.stringify(obj) : obj));
    },
    /* 获取本地指定的持久化数据 */
    get_fromLocal: function (key) {
        return localStorage.getItem(key);
    },
    /* 检验是否支持本地session存储 */
    sessionStorageSupport: function () {
        return (('sessionStorage' in window) && window['sessionStorage'] !== null)
    },
    /* 存储session至本地 */
    save_toSession: function (key, obj) {
        sessionStorage.setItem(key, (typeof obj == 'object' ? JSON.stringify(obj) : obj));
    },
    /* 获取本地指定数据 的session数据 */
    get_fromSession: function (key) {
        return sessionStorage.getItem(key);
    },
    /*获取URL参数值*/
    requestParam: function (strName) {
        var strHref = location.search;
        var intPos = strHref.indexOf('?');
        if (intPos === -1) {
            return '';
        }
        var strRight = strHref.substr(intPos + 1);
        var arrTmp = strRight.split('&');
        for (var i = 0; i < arrTmp.length; i++) {
            var arrTemp = arrTmp[i].split('=');
            if (arrTemp[0].toUpperCase() == strName.toUpperCase()) {
                if (i === arrTmp.length - 1) {
                    var sIndex = arrTemp[1].indexOf('#');
                    if (sIndex !== -1) {
                        arrTemp[1] = arrTemp[1].substring(0, sIndex);
                    }
                }
                return arrTemp[1];
            }
        }
        return '';
    },
    /*
     * 表单元素序列化为 object 可用于ajax 提交，注意：多选项返回值为逗号分隔的字符串 ；
     */
    serializeObject: function (form) {
        var o = {},
            f_ = $(form).serializeArray();
        $.each(f_, function (i, n) {
            if (o[n['name']]) {
                o[n['name']] = o[n['name']] + "," + $.trim(n['value']);
            } else {
                o[n['name']] = $.trim(n['value']);
            }
        });
        return o;
    },
    /**
     * 获取随机数
     * @param {String} len 随机数位数
     */
    get_random_fun: function (len) {
        var s_ = '';
        for (var i = 0; i < len; i++) {
            s_ += Math.floor(Math.random() * 10);
        }
        return s_;
    },
    /**
     * 获取uid,
     * @param {String} prefix 前缀字符串
     */
    get_UID: function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    },
    /**
     * 获取guid（uuid） 32位
     */
    get_GUID: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).replace(/-/g, '');
    },
    /**
     * 校验是否是休息日  return 是：true
     * @param sday_:日期 2016-10-10
     * 依赖组件 moment.js，工作日优先原则（同一日期即是休息日又是工作日，判定为工作日）
     */
    is_playerDay: function (sday_) {
        var cday_ = moment(sday_).day();
        return ((cday_ == 0 || cday_ == 6 || $.inArray(sday_, COM_TOOLS._data.PLAYDAYS_) != -1) && $.inArray(sday_, COM_TOOLS._data.WEEKDAYS_) == -1)
    },
    /**
     * 检验时间  ,获取下一个工作日
     * @param sday_待检测的时间
     * return YYYY-MM-DD
     * 依赖组件 moment.js
     */
    get_nextWeekDay: function (sday_) {
        if (COM_TOOLS.is_playerDay(sday_)) {
            sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD');
            return arguments.callee(sday_);
        } else {
            return moment(sday_).format('YYYY-MM-DD');
        }
    },
    /**
     * 获取dom的大小及位置信息
     * @param {Object} $element
     * return (相对于文档坐标原点0.0的位置top\left\bottom\right)\height\width\scrollTop\scrollLeft
     */
    getPosition: function ($element) {
        var el = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            });
        }
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : $element.offset();
        var scroll = {
            scrollTop: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
            scrollLeft: isBody ? document.documentElement.scrollLeft || document.body.scrollLeft : $element.scrollLeft()
        };
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset);
    },
    /**
     * 检测ajax接口返回状态，未登录的强制跳转到登录页；内部方法；
     * @param {String} data 待检测的ajax返回的数据；
     * @param {Object} partOBJ 跳转目标的窗口对象（parent、self、top），默认为当前窗口；
     */
    _ajax_jumpToLogin: function (data, partOBJ) {
        if (COM_DEFAULT._forcedExit && COM_DEFAULT._forcedExit.ajaxForm === true) {
            var partOBJ_ = cumCheckPwin(partOBJ || window);
            if (data && data.indexOf('"code":"8001"') !== -1) {
                partOBJ_.location.href = COM_DEFAULT._contextPath || '/';
            }
        }
    },
    /**
     * @description 货币型格式化
     * @param {Number} number 待处理的数字
     * @param {Number} places 小数位数
     * @param {String} symbol 货币标识
     * @param {String} thousand 千分位
     * @param {String} decimal 小数点
     */
    formatMoney: function (number, places, symbol, thousand, decimal) {
        number = number || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "￥";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
            (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },
    /**
     * JS加法运算方法，纠正浮点运算错误
     */
    fnFloatSum: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    },
    /**
     * 初始化input[text]框默认提示信息；placeholder; 只应用于异步load进来的input元素；
     * 用法（详见手册），class="js-helpmsg", data-helpmsg="msgkey"
     * @param {Number} time 延时时间：默认 300ms，
     */
    fnInitInputHelpVal: function (time) {
        COM_DEFAULT._isOpenHelpMsg['helpMsgDefVal'] && window.setTimeout(function () { //延时处理的、不需要立即渲染的事件；placeholder
            $('.js-helpmsg:text[data-titlemsg!="true"]:not([placeholder])').attr('placeholder', function (index, attr) {
                var param_ = $(this).data('helpdata');
                param_ = param_ ? param_.toString().split(',') : [];
                return TEDU_MESSAGE.get($(this).data('helpmsg'), param_) || attr;
            });
        }, (jQuery.type(time) === "number") ? time : 300);
    },
    /**
     * @description 回调执行上一个目标弹窗的 中定义的私有方法（COM_TOOLS.private_obj_）(只限在弹窗中打开的新弹窗中调用)
     * @param {Object} fnName 上一个页面COM_TOOLS.private_obj_中定义的方法名;
     * @param {Object} data 需要传递的参数，例如：$('selecter').data();
     */
    callParentWinFn: function (fnName, data) {
        if (fnName) {
            if (COM_TOOLS.cache_obj._ptWinFnNames[fnName]) {
                var p_ = cumGetParentWinGlobel();
                if (p_.COM_TOOLS.private_obj_[COM_TOOLS.cache_obj._ptWinFnNames[fnName]]) {
                    p_.COM_TOOLS.private_obj_[COM_TOOLS.cache_obj._ptWinFnNames[fnName]](data);
                }
            }
        }
    },
    /**
     * @description 回调执行上一个目标弹窗的 中定义的临时方法（COM_TOOLS.cache_obj._ptWinFnList）(只限在弹窗中打开的新弹窗中调用，该对象中调用的方法会在每次iframe弹窗打开前重置)
     * PS: 当回调方法为函数名时（fn.type==string），该方法需要与setCacheFnForChildWin()，配合使用
     * @param {Object} fnName 上一个页面COM_TOOLS.cache_obj._ptWinFnList中定义的方法名;
     * @param {Object} data 需要传递的参数，例如：$('selecter').data();
     */
    callParentWinCacheFn: function (fnName, data) {
        if (fnName) {
            if (COM_TOOLS.cache_obj._ptWinFnNames[fnName]) {
                if ($.type(COM_TOOLS.cache_obj._ptWinFnNames[fnName]) == 'function') {
                    COM_TOOLS.cache_obj._ptWinFnNames[fnName](data);
                } else {
                    var p_ = cumGetParentWinGlobel();
                    if (p_.COM_TOOLS.cache_obj._ptWinFnList[COM_TOOLS.cache_obj._ptWinFnNames[fnName]]) {
                        p_.COM_TOOLS.cache_obj._ptWinFnList[COM_TOOLS.cache_obj._ptWinFnNames[fnName]](data);
                    }
                }
            }
        }
    },
    /**
     * 在父页面声明弹窗回调函数体，用于子窗口交互回调使用，该对象会在每次iframe弹窗打开前重置
     * PS: 该方法需要与callParentWinCacheFn()，配合使用
     * @param {Object} obj
     * @example
     * {fn1:function(){},fn2:function(){}
     */
    setCacheFnForChildWin: function (obj) {
        if (!$.isEmptyObject(obj)) {
            COM_TOOLS.cache_obj._ptWinFnList = obj;
        } else {
            COM_TOOLS.cache_obj._ptWinFnList = {};
        }
    },
    loadingShade: { //加载中遮罩
        /**
         * @param {Object} timeOut 主动销毁时间 单位秒，默认不过期
         * @param {Object} shadeOpt 遮罩背景 颜色及透明度，默认[0.5,'#000']
         */
        open: function (timeOut, shadeOpt) {
            layer.load(1, {
                time: (timeOut || 0) * 1000,
                shade: shadeOpt || [0.5],
                zIndex: layer.zIndex
            });
        },
        close: function () {
            layer.closeAll('loading');
        }
    },
    loadingBtn: { //设置按钮加载中、禁用状态（防止重复操作）
        createLabel: function (dom) {
            dom.wrapInner('<span class="cus-spinner-label"></span>');
        },
        createSpinner: function (dom) {
            var arr = [];
            arr.push('<div class="cus-spinner cus-spinner-fading-circle">');
            for (var i = 1; i <= 12; i++) {
                arr.push('<div class="cus-circle', i, ' cus-circle"></div>');
            }
            arr.push('</div>');
            dom.append(arr.join(''));
        },
        open: function (selector) {
            var _dom = $.type(selector) == 'string' ? $('#' + selector) : selector;
            _dom.addClass('cus-spinner-box').attr('data-loading', '').prop('disabled', true);
            _dom.children('.cus-spinner-label').length == 0 && this.createLabel(_dom);
            _dom.children('.cus-spinner').length == 0 && this.createSpinner(_dom);
        },
        close: function (selector) {
            var _dom = $.type(selector) == 'string' ? $('#' + selector) : selector;
            _dom.each(function () {
                var that_ = $(this);
                that_.removeAttr('data-loading').prop('disabled', function () {
                    return that_.is('[must_disabled]') || false;
                });
            });
        }
    },
    loadingOverlay: {
        open: function (selector) {
            var _dom = $.type(selector) == 'string' ? $('#' + selector) : selector;
            if (_dom.is(':button')) {
                COM_TOOLS.loadingBtn.open(_dom);
            } else {
                _dom.addClass('model-overlay');
            }
        },
        close: function (selector) {
            var _dom = $.type(selector) == 'string' ? $('#' + selector) : selector;
            if (_dom.is(':button')) {
                COM_TOOLS.loadingBtn.close(_dom);
            } else {
                _dom.removeClass('model-overlay');
            }
        }
    },
    customValid: { //自定义验证类
        /**
         * 自定义特殊字符验证
         * @param {String} str_ 需要校验的字段
         * @param {Array} zdy_ 自定义新的校验规则（默认不需要）
         */
        specialChars: function (str_, zdy_) {
            var reg_ = /[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\<\>\?]/g;
            if (zdy_ != undefined) {
                reg_ = new RegExp('[\\' + zdy_.join('\\') + ']', 'g');
            }
            return reg_.test(str_);
        }
    },
    /**
     * 数组排重
     * @param {Array} array 待排重数组
     * @return {Array} 排重后的数组
     */
    arrayUniqueFn: function (array) {
        var a = [],
            i, l, o = {};
        for (i = 0, l = array.length; i < l; i++) {
            if (o[array[i]] === undefined) {
                a.push(array[i]);
                o[array[i]] = true;
            }
        }
        return a;
    },
    /**
     * 数组去重插入数据
     * @param {Object} array 待处理数组
     * @param {Object} item 待插入的元素
     * @return {String} 插入成功返回当前数组长度，失败返回false
     */
    arrayUniquePushFn: function (array_, item) {
        return $.inArray(item, array_) === -1 && array_.push(item);
    },
    /**
     * 数组对象排序
     * @param {Array} array_ 待处理数组对象
     * @param {String} attr_ 排序依据的对象属性
     * @param {Number} sortby_ 1：升序；2：降序
     */
    arrayObjectSortBy: function (array_, attr_, sortby_) {
        sortby_ = sortby_ || 1;
        array_.sort(function (a, b) {
            a = a[attr_];
            b = b[attr_];
            if (a < b) {
                return sortby_ * -1;
            }
            if (a > b) {
                return sortby_ * 1;
            }
            return 0;
        });
    },

    /**
     * 解析对象型字符串，并尝试转换成对象
     * @param {String} str 需解析的字符串
     */
    parseOjects: function (str) {
        var d_ = {};
        str = $.trim(str);
        if (str) {
            if (str.substring(0, 1) != "{") {
                str = "{" + str + "}";
            }
            d_ = (new Function("return " + str))();
        }
        return d_;
    },
    /**
     * 解析对象型字符串，并尝试转换成数组
     * @param {String} str 需解析的字符串
     */
    parseArray: function (str) {
        var d_ = [];
        str = $.trim(str);
        if (str != '') {
            if (str.substring(0, 1) != "[") {
                str = "[" + str + "]";
            }
            d_ = (new Function("return " + str))();
        }
        return d_;
    },
    /**
     * 富文本编辑器
     * @param {String} id 组件初始化容器id
     * @param {String} filetype 可选，文件类别
     * @param {Object} opt 可选， 配置属性
     *  imageUploadUrl: 图片上传接口(拖拽)
     *  filebrowserImageUploadUrl：图片上传接口
     *  is_inline_init：初始化模式；true：inline; false：replace;
     *  fileUploadMaxSize: 上传文件的最大大小， 单位：KB； 默认 1200KB
     *  fileUploadType：允许上传的文件类型 ，默认["jpg", "jpeg", "png", "gif"]
     * @return {Object} 编辑器实例对象
     */
    docEditor: function (id, filetype, opt) {
        opt = opt || {};
        if (!(window.CKEDITOR && window.CKEDITOR.dom) || !$('#' + id).length) {
            return false;
        }
        if (typeof filetype == 'object') {
            opt = filetype;
            filetype = '';
        }
        var opt_ = $.extend({
            imageUploadUrl: COM_DEFAULT._fileServeOpt.fileUploadUrl, //图片(拖拽)
            filebrowserImageUploadUrl: COM_DEFAULT._fileServeOpt.fileUploadUrl, //图片(上传)，打开图片上传功能
            fileUploadMaxSize: COM_DEFAULT._fileServeOpt.defaultFileSize,
            imgUploadMaxSize: COM_DEFAULT._fileServeOpt.imgFileSize, //上传文件的最大大小（0：代表使用默认值）， 单位：KB； 默认 3072KB（富文本编辑器自定义组件中定义的）
            fileUploadType: COM_DEFAULT._fileServeOpt.fileType,
            imgUploadType: COM_DEFAULT._fileServeOpt.imgType,
        }, opt);

        opt_.imageUploadUrl = opt_.imageUploadUrl + '?type=1' + (filetype ? '&' + filetype : ''); // (拖拽)
        opt_.filebrowserImageUploadUrl = opt_.filebrowserImageUploadUrl + '?type=2' + (filetype ? '&' + filetype : ''); // (上传)

        var ck = CKEDITOR[opt.is_inline_init ? 'inline' : 'replace'](id, opt_);
        return ck;
    },
    /**
     * 构造并返回 select-option jq对象；
     * @param {Array} list jsonobject 至少包含 id,text对象；
     */
    sel_make_optionFn: function (list) {
        var $dom = $('<option value="">请选择</option>');
        $.each(list, function (i, n) {
            var c_ = $('<option value="' + n.id + '">' + n.text + '</option>');
            c_.data('data', n);
            $dom = $dom.add(c_);
        });
        return $dom;
    }
};;
///<jscompress sourcefile="ajax_fn.js" />
/**
 * 自定义 ajax,支持loading遮罩
 * @param {Object} ajaxOpt $.ajax原生配置属性;
 * @param {Number} shadeType 1:全屏loading遮罩；2:button loading遮罩; 3:模态遮罩，如果对象是button，则优先使用button遮罩（注意，可能存在z-index层级问题）;
 * @param {Object|String} shadeOpt 遮罩配置信息； shadeType=1时，默认[0.5,'#000']；shadeType=2 或 shadeType=3时，为button id 或 jQuery对象;
 */
COM_TOOLS.ajaxFn = function (ajaxOpt, shadeType, shadeOpt) {
    var _default = {
        beforeSend: function (XHR) {
            if (shadeType == 1) {
                COM_TOOLS.loadingShade.open(0, shadeOpt);
            } else if (shadeType == 2) {
                COM_TOOLS.loadingBtn.open(shadeOpt);
            } else if (shadeType == 3) {
                COM_TOOLS.loadingOverlay.open(shadeOpt);
            }
            $.type(ajaxOpt['beforeSend']) == 'function' && ajaxOpt['beforeSend'](XHR);
        },
        complete: function (XHR, textStatus) {
            setTimeout(function () { //延时解锁，等待关闭动画（dom-remove）执行完再解锁
                if (shadeType == 1) {
                    COM_TOOLS.loadingShade.close();
                } else if (shadeType == 2) {
                    COM_TOOLS.loadingBtn.close(shadeOpt);
                } else if (shadeType == 3) {
                    COM_TOOLS.loadingOverlay.close(shadeOpt);
                }
            }, 300);
            $.type(ajaxOpt['complete']) == 'function' && ajaxOpt['complete'](XHR, textStatus);
        }
    };
    var _aOpt = {
        dataType: "json",
        cache: false
    };
    $.extend(true, _aOpt, ajaxOpt, _default);
    return $.ajax(_aOpt);
};;
///<jscompress sourcefile="cusMultChoice_fn.js" />
/**
 * @description 自定义模拟多选
 * @param {String} id 目标id
 * @param {Function} btnfn 点击按钮所触发的操作
 * @param {Number} num 控制多选的选择数(-1 为不限制)
 * @param {String} id_1 隐藏域input所对应的id，如使用必须填写前一项num（无限为-1）
 * @example
 *  API: removeAll() 删除全部所选
 *  API: backfill() 数据回填
 *  API: addItem(text_, code)  添加选项
 *  API: getMultItem(type_) 获取所选选项的值(为空时输出id数组，为1是输出数组对象)
 */
COM_TOOLS.cus_mult_choice = function (id, btnfn, num, id_1, id_2) {
    var p_ = $('#' + id),
        t_ = p_.children('.cus-mult-choice'),
        hidenInp_1 = id_1 ? $('#' + id_1) : [],
        hidenInp_2 = id_2 ? $('#' + id_2) : [];
    //事件绑定
    p_.on('click', '.js-mult-remove', function () {
        $(this).closest('.mult-item').remove();
        hidenInp_1.length && hidenInp_1.val(obj_.setHiddenValue('code'));
        hidenInp_2.length && hidenInp_2.val(obj_.setHiddenValue('text'));
    }).on('click', '.cus-mult-btn', function () {
        btnfn && btnfn();
    });
    var obj_ = {
        addItem: function (id, text) {
            if ((num != '-1') && t_.find('span').length >= num) {
                COM_TOOLS.alert('最多添加' + num + '个');
                return false;
            }
            if (t_.children('span').is('[data-code=' + id + ']')) { //判断唯一
                return false;
            }
            t_.append('<span data-text="' + text + '" data-code="' + id + '" class="mult-item">' + text + ' <i class="glyphicon glyphicon-remove js-mult-remove"></i></span>');
            hidenInp_1.length && hidenInp_1.val(obj_.setHiddenValue('code')).trigger('focusout.validate');
            hidenInp_2.length && hidenInp_2.val(obj_.setHiddenValue('text'));
        },
        removeAll: function () {
            t_.html('');
            hidenInp_1.length && hidenInp_1.val('');
            hidenInp_2.length && hidenInp_2.val('');
        },
        backfill: function (id_str, name_str) {
            if ((id_str != null) && id_str.length) {
                var id_arr = id_str.split(',');
                var name_arr = name_str.split(',');
                var obj_arr = [];
                $.each(id_arr, function (i, n) {
                    obj_.addItem(n, name_arr[i]);
                });
            }
        },
        getMultItem: function (type_) { //获取选择的值
            var arr_ = [],
                type_ = type_ || 0;
            $.each(t_.find('span'), function (i, n) {
                arr_.push(type_ ? $(n).data() : $(n).data('code'));
            });
            return arr_;
        },
        setHiddenValue: function (param) {
            var arr = [];
            $.each(t_.find('span'), function (i, n) {
                arr.push($(n).data(param));
            });
            return arr.join(',');
        }
    }
    return obj_;
};;
///<jscompress sourcefile="datatable_fn.js" />
/**
 * 初始化数据表格（服务器模式和本地json-data数据模式）
 * @param {String} domid 数据表格ID
 * @param {Object} columns 数据表格列配置项
 * @param {String} url 数据接口地址（服务器模式）或json-data对象（本地模式）
 * @param {String} ajaxtype = [get|post] 请求类型，默认get；注：本地模式此参数等同于param:opt
 * @param {Object} data 发送给后台的额外数据,不可使用保留字(pageSize、start、draw);注：本地模式此参数忽略
 * @param {Object} opt 数据表格扩展配置对象；注：本地模式此参数忽略
 * @example opt
 *  jsInitComplete : fn(settings, json) 初始化结束后的回调函数 ;fn里的this指向的是datatable实例对象，等同于DT_.table；
 *  jsDrawCallback : fn(settings) 表格每次重绘回调函数;fn里的this指向的是datatable实例对象，等同于DT_.table；
 *  selectStyle : string 选中模式： 'mutil'为多选，默认'os'(操作系统风格选择);single:只能选择一个项目; api:禁止用户选择；
 *  jsTrDblclick ：fn（curTrData,curTrJqNode）  表格行(tr)双击回调函数
 *  other : object datatable原生配置项目
 * @return {Object} API对象
 * @example
 *  API:table datatable原生实例对象
 *  API:setAjaxData fn(d, noreload)  设置搜索数据并刷新表格； d:搜索数据;noreload:默认：false, 如果为true:则不刷新表格；注：本地模式此方法无实际作用；
 *  API:getAjaxData fn() 获取当前搜索数据；注：本地模式此方法无实际作用，返回空对象；
 *  API:getSelectRowsData fn() 获取选中行的指定列的数据
 */
COM_TOOLS.DT_init = function (domid, columns, url, ajaxtype, data, opt) {
    var _obj = {},
        _dopt = {},
        _isajax = $.type(url) == 'string';
    var _ajaxdata = $.type(data) == "object" ? data : {};
    if (_isajax) { //服务器模式
        _dopt = {
            ajax: {
                "url": url, //接口地址
                "type": ajaxtype || 'get',
                "dataSrc": function (dd) {
                    if (dd && dd.isFilterTag == 0) { //无权限,构造空数据
                        dd.recordsTotal = 0;
                        dd.recordsFiltered = 0;
                        return [];
                    }
                    return dd.data;
                },
                "data": function (d) {
                    return cus_dt_ajaxdata(d, _ajaxdata);
                }
            }
        }
    } else { //本地数据初始化方式
        _dopt = {
            data: url,
            serverSide: false,
            processing: false
        }
        opt = ajaxtype;
    }
    opt = $.type(opt) == "object" ? opt : {};
    opt['other'] = $.type(opt['other']) == "object" ? opt['other'] : {};

    var _table = $('#' + domid).DataTable($.extend(true, {
        columns: columns,
        initComplete: function (settings, json) {
            var _that = this.api();
            if (settings._select && settings._select.style == 'mutil') { //全选、反选
                $(settings.nTableWrapper).off('click.dtcus', '.cus-checkbox-all').on('click.dtcus', '.cus-checkbox-all', function () {
                    if ($(this).hasClass('cus-checked')) {
                        $(this).removeClass('cus-checked');
                        _that.rows().deselect();
                    } else {
                        $(this).addClass('cus-checked');
                        _that.rows().select();
                    }
                });
                _that.off('select.dt.dtcus deselect.dt.dtcus').on('select.dt.dtcus deselect.dt.dtcus', function (e, dt, type, indexes) { //全选、反选联动
                    if (dt) {
                        $(settings.nTableWrapper).find('.cus-checkbox-all').toggleClass('cus-checked', dt.rows({
                            selected: true
                        }).count() == dt.rows().count());
                    }
                });
            }
            if ($.isFunction(opt['jsTrDblclick'])) { //暂不支持对冻结列的双击操作
                var cto = null,
                    ex, ey;
                $(settings.nTBody).off('dblclick.dtcus touchstart.dtcus touchmove.dtcus touchend.dtcus', 'tr').on({
                    'dblclick.dtcus': function () {
                        opt['jsTrDblclick'](COM_TOOLS.DT_getRowsSourceData(_that, this)[0], $(this));
                    },
                    'touchstart.dtcus': function (e) {
                        if (!e.originalEvent || !e.originalEvent.changedTouches || !e.originalEvent.changedTouches[0]) {
                            return;
                        }
                        ex = e.originalEvent.changedTouches[0].clientX;
                        ey = e.originalEvent.changedTouches[0].clientY;
                        cto = setTimeout(function () {
                            $(e.currentTarget).trigger('dblclick.dtcus');
                        }, 750);
                    },
                    'touchmove.dtcus': function (e) {
                        if (cto && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] &&
                            (Math.abs(ex - e.originalEvent.changedTouches[0].clientX) > 50 || Math.abs(ey - e.originalEvent.changedTouches[0].clientY) > 50)) {
                            clearTimeout(cto);
                        }
                    },
                    'touchend.dtcus': function (e) {
                        if (cto) {
                            clearTimeout(cto);
                        }
                    }
                }, 'tr').off('dblclick.dtcus', '.select-checkbox, :input, .no-Sel-obj').on('dblclick.dtcus', '.select-checkbox, :input, .no-Sel-obj', function () {
                    return false;
                });
            }
            if ($.isFunction(opt['jsInitComplete'])) {
                opt['jsInitComplete'].call(_that, settings, json);
            }
        },
        drawCallback: function (settings) {
            if ($.isFunction(opt['jsDrawCallback'])) {
                opt['jsDrawCallback'].call(this.api(), settings);
            }
        },
        select: {
            style: opt['selectStyle'] || 'mutil',
            selector: 'td:not(td:has(:input))',
            info: false
        }
    }, _dopt, opt['other']));
    _obj.table = _table;
    /**
     * 设置搜索数据并刷新表格
     * @param {Object} d 搜索数据
     * @param {Function} callback function ( json )回调方法返回的是服务器返回的数据
     * @param {Object} noreload 默认：false, 如果为true:则不刷新表格
     */
    _obj.setAjaxData = function (d, callback, noreload) {
        if ($.type(d) == "object") {
            _ajaxdata = d;
            if (!noreload) {
                COM_TOOLS.DT_ajaxReload(_table, true, callback);
            }
        }
    };
    _obj.getAjaxData = function () { //获取当前搜索数据
        return _ajaxdata;
    };
    _obj.getSelectRowsData = function (name) { //获取选中行的指定列的数据
        return COM_TOOLS.DT_getSelectRowsSourceData(_table, name);
    };
    return _obj;
};
/**
 * @description datatable获取选中行的id数组(多选) 依赖 datatable 及 dt-select
 * @param {Object} dt (new datatable)实例对象
 * @return {Array} 选中节点ID数组
 */
COM_TOOLS.DT_getSelectRows = function (dt) {
    return COM_TOOLS.DT_getSelectRowsData(dt, 'itemid');
};
/**
 * @description datatable获取选中行的数据(多选) 依赖 datatable 及 dt-select
 * @param {Object} dt (new datatable)实例对象
 * @param {String} name 选填，需要获取的字段名称，为空返回整个data对象（全部绑定的数据）；
 * @return {Array} 选中行绑定的数据数组
 */
COM_TOOLS.DT_getSelectRowsData = function (dt, name) {
    var data_ = [];
    if ($.type(name) === "string") {
        dt.rows('.selected').nodes().to$().each(function () {
            data_.push($(this).data(name));
        });
    } else {
        dt.rows('.selected').nodes().to$().each(function () {
            data_.push($(this).data());
        });
    }
    return data_;
};
/**
 * @description datatable获取指定行的底层数据（服务器直接返回的数据ajaxJSON，及通过api.data实时设置的数据；非绑定数据）
 * @param {Object} dt (new datatable)实例对象
 * @param {String} name 选填，需要获取的字段名称，为空返回整个data对象（全部绑定的数据）；
 * @param {Boolean}  isall=[false|true] 可选，是否获取所有行的数据（忽略是否选中）；true:全部；false或缺省为 只计算选中行；
 * @return {Array} 数据数组
 */
COM_TOOLS.DT_getSelectRowsSourceData = function (dt, name, isall) {
    return COM_TOOLS.DT_getRowsSourceData(dt, (isall === true ? '' : '.selected'), name);
};
/**
 *
 * @param {Object} dt (new datatable)实例对象
 * @param {Object} selector 行选择器，指定需要获取哪些行的数据; 支持jQ-selector、node、索引(row.index)、function ( idx, data, node ) => return true
 * @param {Object} name 选填，需要获取的字段名称，为空返回整行数据；
 */
COM_TOOLS.DT_getRowsSourceData = function (dt, selector, name) {
    var data_ = [];
    if ($.type(name) === "string") {
        dt.rows(selector || '').every(function () {
            data_.push(this.data()[name]);
        });
    } else {
        dt.rows(selector || '').every(function () {
            data_.push(this.data());
        });
    }
    return data_;
};
/**
 * @description datatable 获取指定列的汇总和（必须数值型）
 * @param {Object} dt (new datatable)实例对象
 * @param {Array} selector DT列选择器，支持class(默认索引于表头最后一行，且唯一)、elementName:name、索引；
 * @param {Object} setFooter 是否在表格页脚输出结果
 */
COM_TOOLS.DT_getColumnSum = function (dt, selector, setFooter) {
    var sumObj = [];
    dt.columns(selector).every(function (index) {
        var sum = this.data().reduce(function (a, b) {
            return COM_TOOLS.fnFloatSum(a, b);
        }, 0);
        if (setFooter) {
            $(this.footer()).html(sum);
        }
        var o_ = {};
        o_[dt.column(index).dataSrc()] = sum;
        sumObj.push(o_);
    });
    return sumObj;
};
/**
 * @description datatable获取指定行中文本框（input:text）的数据(多选) 依赖 datatable 及 dt-select
 * @param {Object} dt (new datatable)实例对象
 * @param {Boolean}  isall=[false|true] 可选，是否获取所有行的数据（忽略是否选中）；true:全部；false或缺省为 只计算选中行；
 * @return {Array} 选中行中指定class="js-getval"的input值
 * @example [{"id":"xx","name1":xxx,"name2":xxx}]
 */
COM_TOOLS.DT_getSelectRowsInputData = function (dt, isall) {
    var inpObj = [];
    dt.rows((isall === true ? '' : '.selected')).nodes().to$().each(function () {
        var str_ = {};
        str_['id'] = $(this).data('itemid');
        $(this).find('.js-getval').each(function (i) {
            if ($(this).attr('name')) {
                str_[$(this).attr('name')] = $(this).val();
            }
        });
        inpObj.push(str_);
    });
    return inpObj;
};
/**
 * @description datatable 使选中行中的所需要的 TD 转换为 INPUT 实现行内编辑
 * @param {Object} dt (new datatable)实例对象
 * @param {Array} selector 为数组,例如['node1:name','node2:name']，其中node1/node2为对应数据的后台字段名称
 * PS：使用时需在 datatable 的初始化时的columns中手动维护一个 "name":"node1" 字段
 */
COM_TOOLS.DT_tdToinpEdit = function (dt, selector) {
    var o_ = dt.rows('.selected').nodes().to$();
    if (!o_.length) {
        COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noSelrows"]);
        return false;
    }
    dt.columns(selector).nodes().to$().each(function (i, n) {
        $(this).filter(function (s, n) {
            return $(this).parent().hasClass('selected');
        }).each(function (j, n) {
            if (!$(this).children().is('input.js-getval')) {
                var txt = $(this).text();
                var inp = $("<input name='" + selector[i].split(':')[0] + "' class='input-sm js-getval no-Sel-obj' type='text'>");
                inp.val(txt);
                $(this).html(inp);
            }
        });
    });
};
/**
 * @description datatable 选中行中的所需要的 INPUT 转换为 TD 并获取保存的数据对象
 * @param {Object} dt (new datatable)实例对象
 * @param {Array} selector DT列选择器，支持class、elementName:name、索引；例如['node1:name','node2:name']，其中node1/node2为对应数据的后台字段名称
 * @param {Boolean} param 可选，当 false 时只获取要保存的数据对象，不转换 TD
 * PS：使用时需在 datatable 的初始化时的columns中手动维护一个 "name":"node1" 字段
 */
COM_TOOLS.DT_inpTotdSave = function (dt, selector, param) {
    var data_ = '';
    if (!dt.rows('.selected').nodes().to$().find('input[name=' + selector[0].split(':')[0] + ']').length) {
        COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noSelrows"]);
        /*请选择要保存的行！*/
    } else {
        data_ = COM_TOOLS.DT_getSelectRowsInputData(dt);
        if (param != false) {
            dt.columns(selector).nodes().to$().each(function (i, n1) {
                $(this).filter(function (s, n2) {
                    return $(this).parent().hasClass('selected');
                }).each(function (j, n3) {
                    if ($(this).children().is('input.js-getval')) {
                        var txt = $(this).children().val();
                        dt.cell(n3).data(txt); //把数据重新提交给单元格
                    }
                });
            });
        }
    }
    return data_;
};
/**
 * @description datatable 计算指定行（默认为选中行）中 INPUT 的值并展示
 * @param {Object} dt (new datatable)实例对象
 * @param {Array} selector DT列选择器，支持class、elementName:name、索引；例如['node1:name']，其中node1为对应数据的name字段名称
 * @param {Boolean}  isall=[false|true] 可选，是否获取所有行的数据（忽略是否选中）；true:全部；false或缺省为 只计算选中行；
 */
COM_TOOLS.DT_getInputSum = function (dt, selector, isall) {
    var sum_ = 0;
    dt.columns(selector).nodes().to$().each(function (i, n) {
        $(this).filter(function (s, n) {
            return isall || $(this).parent().hasClass('selected');
        }).each(function (j, n) {
            if ($(this).children().is('input[type=text]')) {
                sum_ = COM_TOOLS.fnFloatSum(sum_, $(this).children().val());
            }
        });
    });
    return sum_;
};
/**
 * @description 获取当前分页页码；
 * @param {Object} dt (new datatable)实例对象
 * @param {Boolean} async 是否记录当前页码，多用于修改回显当前页；
 * @return {Number} pageindex
 */
COM_TOOLS.DT_getCurPageIndex = function (dt, async) {
    var in_ = dt.page() || 0;
    if (async) {
        COM_TOOLS.private_obj_.pageIndex = in_;
    }
    return in_;
};
/**
 * @description 跳转至指定的页面；
 * @param {Object} dt (new datatable)实例对象
 * @param {Number} index 分页下标，从0开始
 */
COM_TOOLS.DT_setCurPageIndex = function (dt, index) {
    var in_ = index || COM_TOOLS.private_obj_.pageIndex || 0;
    dt.page(parseInt(in_)).draw(false);
    COM_TOOLS.private_obj_.pageIndex = 0;
};
/**
 * @description 刷新数据；
 * @param {Object} dt (new datatable)实例对象
 * @param {Boolean} resetpage 是否重置分页信息(index:0) 默认true，修改数据场景下建议使用false
 * @param {Function} callback function ( json )回调方法返回的是服务器返回的数据
 */
COM_TOOLS.DT_ajaxReload = function (dt, resetpage, callback) {
    var p_ = {
        cb: null, //function ( json )回调方法返回的是服务器返回的数据
        rp: true //是否重置分页信息 默认true,设为false则保留当前分页信息
    }
    typeof (resetpage) == 'boolean' && (p_['rp'] = resetpage);
    typeof (callback) == 'function' && (p_['cb'] = callback);
    dt.ajax.reload(p_['cb'], p_['rp']);
};
/**
 * @description 取消表格全选按钮选中状态；
 * @param {Object} dt (new datatable)实例对象
 */
COM_TOOLS.DT_checkboxReset = function (dt) {
    $(dt.table().container()).find('.cus-checkbox-all').removeClass('cus-checked');
};
/**
 * 获取表格节点
 * @param {Object} dt (new datatable)实例对象
 * @param {String} nodename [body|footer|header|node|container] 节点名称；body:tbody; node:table; container:得到表格的容器 div，包括dt所有的控件
 * @return {Object} domNode 或 '';
 */
COM_TOOLS.DT_getNode = function (dt, nodename) {
    if (/body|footer|header|node|container/.test(nodename)) {
        return dt.table()[nodename]();
    }
    return ''
};;
///<jscompress sourcefile="eCharts_fn.js" />
/**
 * eChart组件数据类似转换工具类
 * 详见that_.initOpt
 */
COM_TOOLS.eChartsTools = function () {
    var that_ = {};

    function getData(ele, data, fopt, dopt) {
        var d_ = {
                dnames: [], //子数据项名称集合
                series: [], //数据项对象
                legends: [] //数据项名称集合
            },
            fopt = fopt || ele.data('js_fopt') || {},
            dopt = dopt || ele.data('js_dopt') || {},
            _ismake = true;
        $.each(data || [], function (i, n) {
            var _data = $.extend(true, {}, n, {})['data'];
            $.each(_data || [], function (i2, n2) {
                var _name = dopt[n2['name']] ? dopt[n2['name']] : n2['name'];
                _data[i2]['name'] = _name;
                if (_ismake) {
                    d_['dnames'].push(_name);
                }
            });
            _ismake = false;
            var _series = $.extend(true, {}, fopt[n['cname']], {}) || {};
            _series['data'] = _data;
            d_['series'].push(_series);
            d_['legends'].push(_series['name']);
        });
        return d_;
    }

    function getOpt(ele, type, data, fopt, dopt, opt) {
        var opt_ = {};
        var d_ = getData(ele, data, fopt, dopt);
        opt_['series'] = d_['series'];
        var type = type || ele.data('js_type');
        if (type == 'bar' || type == 'line') { //柱状或折线
            opt_['yAxis'] = {
                type: 'value'
            };
            opt_['xAxis'] = {
                data: d_['dnames']
            };
            opt_['tooltip'] = {
                trigger: 'axis'
            };
            opt_['legend'] = {
                data: d_['legends']
            };
        } else if (type == 'pie' || type == 'funnel') { //饼状或漏斗图
            opt_['tooltip'] = {
                trigger: 'item'
            };
            opt_['legend'] = {
                data: d_['dnames']
            };
        }
        return $.extend(true, opt_, (opt || ele.data('js_opt') || {}));
    };

    function initData(dom_, myChart, type, data, fopt, dopt, opt) {
        var opt_ = {};
        if ($.type(data) == 'array') {
            opt_ = getOpt(dom_, type, data, fopt, dopt, opt);
            myChart.setOption(opt_);
        } else if ($.type(data) == 'string') {
            myChart.showLoading();
            $.ajax({
                type: data.split('||')[1] || "get",
                url: data.split('||')[0],
                async: true,
                cache: false,
                dataType: 'json',
                success: function (d_) {
                    myChart.hideLoading();
                    opt_ = getOpt(dom_, type, d_, fopt, dopt, opt);
                    myChart.setOption(opt_);
                }
            });
        } else if ($.type(data) == 'object') {
            myChart.showLoading();
            $.ajax({
                type: data.type || "get",
                url: data.url,
                data: data.data || {},
                async: true,
                cache: false,
                dataType: 'json',
                success: function (d_) {
                    myChart.hideLoading();
                    opt_ = getOpt(dom_, type, d_, fopt, dopt, opt);
                    myChart.setOption(opt_);
                }
            });
        } else {
            console.log('error');
        }
    };
    /**
     * @param {String} ele 图表容器选择器：'#demo01'
     * @param {String} type 图表类型  bar:柱状；pie:饼状;funnel:漏斗图;gauge:仪表盘;line:折线图
     * @param {Object} data 图标数据 data([array])或url,默认get请求，如需使用post,写成url||'post'形式
     * @param {Object} fopt 数据模型配置
     * @param {Object} dopt 数据项配置
     * @param {Object} opt 图表配置
     */
    that_.initOpt = function (ele, type, data, fopt, dopt, opt) {
        var dom_ = $(ele);
        var myChart = echarts.init(dom_[0]);
        dom_.data({
            'js_type': type,
            'js_fopt': fopt,
            'js_dopt': dopt,
            'js_opt': opt
        });
        initData(dom_, myChart, type, data, fopt, dopt, opt);
        return myChart;
    };
    that_.updateData = function (ele, data) {
        var dom_ = $(ele);
        initData(dom_, echarts.getInstanceByDom(dom_[0]), false, data, false, false, false);
    };
    return that_;
}();;
///<jscompress sourcefile="infoTips_fn.js" />
/**
 * 信息详情气泡
 * @param {Object} selector 父选择器（dom中的已存在元素）  jQuery-selector;
 * @param {Object} target 子选择器  jQuery-selector;
 * @param {Object} callback 内容构造函数，返回当前操作对象(jquery-object:target子选择器)，需内部返回（return）内容；callback($this){reutn 需要展示的内容;}
 * @param {Object} opt 配置属性
 */
COM_TOOLS.infoTipsFn = function (selector, target, callback, opt) {
    var _defaults = {
        hideTime_: 300, //隐藏的延时时间 毫秒
        showTime_: 400, //显示的延时时间 毫秒
        html: true,
        imageZoom: false,
        placement: 'left', //显示位置 top | bottom | left | right | auto
        trigger: 'manual',
        container: 'body',
        maxHeight: '',
        //minHeight: '200px',
        maxWidth: '276px',
        height: '',
        title: '',
        content: function () { //注意title为空时，此方法会执行两次；
            var html_ = callback ? callback($(this)) : '';
            if (/<img[^>]*/.test(html_)) {
                _defaults['height'] = _defaults['maxHeight'] ? _defaults['maxHeight'] : $(window).height() * (/left|right/.test(_defaults['placement']) ? .5 : .4) + 'px';
            }
            return html_;
        }
    };
    $.extend(_defaults, (opt || {}));
    _defaults['template'] = '<div class="popover cus-popover-box" role="tooltip" style="max-width:' + (_defaults['maxWidth']) + ';' +
        (_defaults['imageZoom'] ? 'width:' + (_defaults['maxWidth']) + ';' : '') + '"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="' +
        (_defaults['maxHeight'] ? "max-height:" + _defaults['maxHeight'] + ";" : "") + '"></div></div>';
    _defaults['imageZoom'] && COM_TOOLS.requireJsFn(['jqueryZoom'], [], false); //加载图片缩放组件
    $(selector).on('mouseleave', target, function (e) {
        var _this = $(this);
        var _showTimer = _this.data('show_timer');
        if (_showTimer) {
            window.clearTimeout(_showTimer);
        }
        var _hideTimer = window.setTimeout(function () {
            _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
        }, _defaults['hideTime_']);
        _this.data('hide_timer', _hideTimer);
        return false;
    }).on('mouseenter', target, function (e) {
        var _this = $(this);
        var _hideTimer = _this.data('hide_timer');
        if (_hideTimer) {
            window.clearTimeout(_hideTimer);
        }
        if (!_this.hasClass('js-mouseove')) {
            var _showTimer = window.setTimeout(function () {
                _this.on('inserted.bs.popover', function () {
                    $('#' + _this.attr('aria-describedby')).children('.popover-content').css({
                        height: _defaults['height'],
                        'max-height': 'auto'
                    });
                }).on('shown.bs.popover', function () {
                    if (_defaults['imageZoom']) {
                        $('#' + _this.attr('aria-describedby')).find('img').wrap('<span class="img-zoom-box"></span>').css('display', 'block').parent().zoom();
                    }
                });
                var _thisPop = _this.addClass('js-mouseove').popover(_defaults).popover('show').attr('aria-describedby');
                $('#' + _thisPop).on('mouseenter', function (ee) {
                    var _hideTimer_ = _this.data('hide_timer');
                    if (_hideTimer_) {
                        window.clearTimeout(_hideTimer_);
                    }
                    return false;
                }).on('mouseleave', function (ee) {
                    _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
                    return false;
                });
            }, _defaults['showTime_']);
            _this.data('show_timer', _showTimer);
        }
        return false;
    });
};;
///<jscompress sourcefile="jstree_fn.js" />
/**
 * jstree 初始化方法
 * @param {Object} selector jquery选择器或对象
 * @param {Object} opt 配置属性， 详见下方 _dopt
 */
COM_TOOLS.jstree_init = function (selector, opt) {
    var $jstree = $.type(selector) == "string" ? $('#' + selector) : selector;
    if ($jstree.data('jstree_init')) { //如果存在 自定义jstree实例，则返回实例；
        return $jstree.data('jstree_init');
    }
    opt = $.type(opt) == "object" ? opt : {};
    var _obj = {},
        _param = {
            'core': {
                "dblclick_toggle": false //禁止双击，打开或关闭节点
            },
            "themes": {
                "icons": false, // 不显示节点图标
            }
        }, //jstree option
        _dopt = {
            'groupName': '', //数据分组名称； 不为空则启用缓存， 只对ajax-data 生效
            'url': false, //ajax url 或 json-array
            'ajaxData': false, //ajax-data => function(node){return { 'id' : node.id };}
            'ids': [], //选中的节点id
            'input_val_obj': $(), // $input_val jQuery对象
            'input_text_obj': $(), // $input_text jQuery对象
            'input_val_name': '', //如果 $input_val 不存在，且该值不为空，则创建 $input_val[name=input_val_name]
            'input_text_name': '', //如果 $input_text 不存在，且该值不为空，则创建 $input_text[name=input_text_name]
            'initCallback': function () {},
            'dataFilter': '', //ajax-数据过滤器
            'other': {}
        };
    $.extend(true, _dopt, opt);
    var $input_val, $input_text;
    if (_dopt.input_val_obj.length) { //如果有 $input_val 对象，则直接使用
        $input_val = _dopt.input_val_obj;
    } else {
        $input_val = $.type(selector) == "string" ? $('#' + selector + '_val') : $jstree.nextAll('input.jstree_init_val:hidden');
    }
    if (_dopt.input_text_obj.length) { //如果有 $input_text 对象，则直接使用
        $input_text = _dopt.input_text_obj;
    } else {
        $input_text = $.type(selector) == "string" ? $('#' + selector + '_text') : $jstree.nextAll('input.jstree_init_text:hidden');
    }

    if (!!_dopt.input_val_name && $input_val.length == 0) { //创建 $input_val[name=input_val_name]
        $input_val = $('<input type="hidden" name="' + _dopt.input_val_name + '" />');
        $jstree.after($input_val);
    }
    if (!!_dopt.input_text_name && $input_text.length == 0) {
        $input_text = $('<input type="hidden" name="' + _dopt.input_text_name + '" />');
        $jstree.after($input_text);
    }

    if ($.type(_dopt.url) == 'array') { //外部json-array 数据
        $.extend(true, _param, {
            'core': {
                'data': data
            }
        });
    } else if (_dopt.url && $.type(_dopt.url) == 'string') {
        $.extend(true, _param, {
            'core': {
                'data': {
                    'url': _dopt.url,
                    'data': _dopt.ajaxData,
                    'cache': false
                }
            }
        });
    }
    $.extend(true, _param, _dopt.other); //复写 jstree 原配置信息
    if ($.type(_param.core.data) == 'object' && _param.core.data.url) { //ajax模式
        if (
            _dopt.groupName &&
            COM_TOOLS.cache_obj._cus_jstree_cache[_dopt['groupName']] &&
            COM_TOOLS.cache_obj._cus_jstree_cache[_dopt['groupName']].length
        ) { //如果是ajax模式，且数据已缓存，则直接使用缓存数据
            $.extend(true, _param, {
                'core': {
                    'data': COM_TOOLS.cache_obj._cus_jstree_cache[_dopt['groupName']]
                }
            });
        } else {
            $.extend(true, _param, {
                'core': {
                    'data': {
                        'url': _param.core.data.url,
                        'data': _param.core.data.data,
                        'cache': false,
                        'dataFilter': function (data, type) {
                            COM_TOOLS._ajax_jumpToLogin(data);
                            if (_dopt.dataFilter && $.type(_dopt.dataFilter) == 'function') { //有过滤器，则应用
                                return _dopt.dataFilter(data, type);
                            } else {
                                if (data) {
                                    var d_ = jQuery.parseJSON(data);
                                    if (d_.isFilterTag == 0) { //无权限
                                        return '[]';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return data;
                                }
                            }
                        },
                        'success': function (res) {
                            !!_dopt['groupName'] && res && res.length && (COM_TOOLS.cache_obj._cus_jstree_cache[_dopt['groupName']] = res);
                        }
                    }
                }
            });
        }
    }

    var callbacks_ = $.Callbacks();

    if (!$.jstree.reference($jstree)) { //如果实例不存在，则初始化实例
        $jstree.jstree(_param).on("ready.jstree", function () { //jstree加载完
            var ref = $(this).jstree(true);
            var ids_ = [];
            if ($.type(_dopt.ids) == 'array' && _dopt.ids.length) { //查找配置项中的 选中节点ids
                ids_ = _dopt.ids;
            } else if ($input_val.length && $.trim($input_val.val()) != '') { //查找隐藏域中的 选中节点ids
                ids_ = $input_val.val().split(',');
            }
            if (ids_.length) {
                ref.select_node(ids_, true, false); //节点选中
            }
            $.type(_dopt.initCallback) == 'function' && _dopt.initCallback();
        }).on('changed.jstree', function (evt, data) { //节点选中状态改变事件监听
            var nodes_ = _obj.get_selected(true);
            var ids_ = [],
                texts_ = [];
            $.each(nodes_, function (i, n) {
                ids_.push(n.id);
                texts_.push(n.text);
            });
            if ($input_val.length) {
                $input_val.val(ids_.join(','));
            }
            if ($input_text.length) {
                $input_text.val(texts_.join(','));
            }
            callbacks_.fire(ids_, texts_, nodes_); //触发消息队列
        });
        $jstree.data('jstree_init', _obj);
    }
    _obj.jstree = $jstree.jstree(true); //获取api实例
    /**
     * 选中指定节点
     * @param {Array} id_arr 一个数组可以用来选择多个节点
     * @param {Boolean} supress_event 如果设置为"true"，1则不会触发changed.jstree事件
     * @param {Boolean} prevent_open 如果设置为"true"，则所选节点的父母将不会打开
     */
    _obj.select_node = function (id_arr, supress_event, prevent_open) {
        _obj.jstree.select_node(id_arr, supress_event, prevent_open);
    };
    /**
     * 获取所有选中的节点
     * @param {Object} full ，默认false, 只返回ID数组， 如果为 true,则返回节点数组
     */
    _obj.get_selected = function (full) {
        return _obj.jstree.get_selected(full);
    };
    /**
     * 销毁实例
     * @param {Boolean} keep_html ,默认 false；  如果未设置为“true”，容器将被清空，否则当前DOM元素将保持不变
     */
    _obj.destroy = function (keep_html) {
        _obj.jstree.destroy(keep_html);
        $jstree.removeData('jstree_init');
    };
    /**
     * 节点选择状态改变时触发的回调函数; 返回当前选中的所有节点数据  (ids_:array, texts_:array, nodes:array)
     * @param {Function} cb
     */
    _obj.changeCallback = function (cb) {
        $.type(cb) == 'function' && callbacks_.add(cb);
    };
    /**
     * 取消选择所有选定的节点
     * @param {Object} supress_event 如果设置为true，则不会触发changed.jstree事件
     */
    _obj.deselect_all = function (supress_event) {
        _obj.jstree.deselect_all(supress_event);
    };
    _obj.target = $jstree; //jstree 事件监听对象
    return _obj;
};
///<jscompress sourcefile="msgbox_fn.js" />
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
};;
///<jscompress sourcefile="requireJs_fn.js" />
/**
 * 动态加载JS\CSS并执行,并完成所加载组件的默认配置信息初始化(COM_TOOLS.initjSDefaultOpt)
 * 注意前置组件加载完成后不进行初始化，所有组件都加载完成的后才统一初始化;已显试加载的js，不好再次加载其js和css，即使其CSS没有被加载过；
 * 只以组件名称KEY作为排重依据，CSS动态加载时，会进行二次排重验证（在校验head内的，无论显试还是隐试）；
 * @param {Array} arr 需要加载的组件数组；
 * @param {Array} def 前置依赖的组件数组；
 * @param {Function} cb 加载完成后组件的初始化回调方法；
 */
COM_TOOLS.requireJsFn = function (arr, def, cb) {
    var _obj_ = {};
    _obj_.loadFile = function (u, callback) {
        if (COM_TOOLS['_jsFileList'][u]['js']) {
            COM_TOOLS.cache_obj['_jsfileArr'].push(u);
            $.ajax({
                type: "get",
                url: COM_TOOLS['_jsPath'] + COM_TOOLS['_jsFileList'][u]['js'],
                dataType: "script",
                cache: true,
                success: function () {
                    //COM_TOOLS.cache_obj['_jsfileArr'].push(u); //update 2019-7-8 控制器上移，不在判断是否加载成功；
                    callback && callback();
                },
                error: function () {
                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.com_msg.1102"]);
                    /*系统异常 请联系管理员*/
                }
            });
        }
        if (COM_TOOLS['_jsFileList'][u]['css']) {
            if (!_obj_.checkCssIsLoad(COM_TOOLS['_jsFileList'][u]['css'])) {
                var thatLink_ = $('#cus_app_link');
                if (thatLink_.length == 0) { //对历史版本兼容补丁
                    thatLink_ = $('head link[rel="stylesheet"]').filter(function () {
                        return $(this).attr('href').indexOf('css/style.css') != -1;
                    });
                }
                thatLink_.before($('<link rel="stylesheet" type="text/css" href="' + COM_TOOLS['_jsPath'].replace('/js/', '/css/') + COM_TOOLS['_jsFileList'][u]['css'] + '"/>'));
            }
        }
    };
    _obj_.checkCssIsLoad = function (p_) {
        return !!$('head link[rel="stylesheet"]').filter(function () {
            return p_.substring(p_.indexOf('css/')) == $(this).attr('href').substring($(this).attr('href').indexOf('css/'));
        }).length;
    };
    _obj_.forCheck = function (a_, c_) {
        for (var i = 0, l_ = a_.length; i < l_; i++) {
            if (COM_TOOLS['_jsFileList'][a_[i]] && $.inArray(a_[i], COM_TOOLS.cache_obj['_jsfileArr']) === -1) {
                c_ && c_(a_[i]);
            }
        }
    };
    _obj_.ready_check = function (a_) {
        for (var i2 = 0, l2_ = a_.length; i2 < l2_; i2++) {
            if (COM_TOOLS['_jsFileList'][a_[i2]] && $.inArray(a_[i2], COM_TOOLS.cache_obj['_jsfileArr']) === -1) {
                return false;
            }
        }
        return true;
    };
    _obj_.fn1 = function () {
        _obj_.forCheck(arr, function (u2) {
            _obj_.loadFile(u2, function () {
                if (_obj_.ready_check(arr)) {
                    cb && window.setTimeout(function () {
                        COM_TOOLS.initjSDefaultOpt(arr.concat(def) || 'ALL'); //初始化相关组件默认配置
                        cb(); //执行组件回调
                    }, 4);
                }
            });
        });
    };
    if (jQuery.type(def) === "array" && def.length > 0 && !_obj_.ready_check(def)) {
        _obj_.forCheck(def, function (u) {
            _obj_.loadFile(u, function () {
                if (_obj_.ready_check(def)) {
                    if (jQuery.type(arr) === "array" && arr.length > 0 && !_obj_.ready_check(arr)) {
                        _obj_.fn1();
                    } else {
                        cb && cb();
                    }
                }
            });
        });
    } else if (jQuery.type(arr) === "array" && arr.length > 0 && !_obj_.ready_check(arr)) {
        _obj_.fn1();
    } else {
        cb && cb();
    }
};;
///<jscompress sourcefile="select2_fn.js" />
/**
 * 插件select2初始化
 * @param {String} id domID
 * @param {String|Object} url ajax-url，如果为对象类型（object）则是本地html初始化，如果是数组类型（array）则是本地数据初始化，例如 select2_init('id',{})
 * @param {String} ajaxtype = [get|post] ajax请求类型 默认get
 * @param {Function} datafn 定义ajax发送到后台的数据
 * @example
 *  // term 实时数据检索模式下，为用户在搜索框中输入的值
 *  function(term){
 *     return {
 *      name1:'value1',name2:'value2',name3:term
 *     };
 *  }
 * @param {Object} opt 配置属性
 * @example
 *  {
 *     iscache:true, //是否本地缓存ajax数据（非实时检索模式）
 *     multiple:false, //是否多选，默认单选
 *     ispinyin:false, //是否启用拼音检索 默认：false
 *     initValue:'' //初始化默认值  暂不支持ajax远程实时数据搜索
 *     drawCallBack: function (async) {}, //数据加载且初始化完成,不包括远程实时数据检索模式; 可返回一个参数，表示是否使用了异步组件构造（非ajax异步）；
 *     other:{} //select2 原生配置属性
 *  }
 * @return  {Object} API对象
 * @example
 *  API:select2 select2原生实例对象
 *  API:setVal fn(array, triggerChange) 设置选中项；['value1','value2']； 如果第二个参数设置为 true 则不触发change事件(会触发change.select2事件，用于通知select2更新视图)；
 *                       但仍会触发validate校验；该行为与使用js修改select的值时不触发change事件的行为一致；
 *  API:getVal fn() 获取当前选中项的值；多选时为数组类型；
 *  API:updateOption fn(html) 修改select中的项目（node-options）,等同于 $('selector').html(html)，会触发validate校验；
 *  API:changeCallback fn(e) 选中项改变后的回调函数，即原生change事件;
 *  API:changeCallbackByitem fn(e.params.data, e) 当每一个option的选择状态发生改变时，都会调用次回调函数（例如修改多选时，会触发多次）；返回当前发生变化的option的数据；
 *  API:destroy fn() 销毁
 */
COM_TOOLS.select2_init = function (id, url, ajaxtype, datafn, opt) {
    var _obj = {};
    _obj.select2 = $("#" + id);

    if (_obj.select2.data('select2_init')) { //如果存在 自定义select2实例，则返回实例；
        return _obj.select2.data('select2_init');
    }

    var _param = {
        iscache: true, //设置为false,则为远程实时ajax检索模式；
        multiple: _obj.select2.prop('multiple') || false, //2018-5-15 修改默认值 为自动获取
        ispinyin: false,
        initValue: _obj.select2.attr('selectedvalue') || '', //初始化默认值  暂不支持ajax远程实时数据搜索
        drawCallBack: function () {}, //数据加载且初始化完成,不包括远程实时数据检索模式
        other: {}
    }
    var _ele_option = _obj.select2.data() || {}; //尝试从dom上获取配置熟悉
    //url => opt OR ajaxtype => opt
    opt = $.extend(true, {}, $.type(url) == "object" ? url : ($.type(url) == "array" && $.type(ajaxtype) == "object" ? ajaxtype : ($.type(opt) == "object" ? opt : {})));
    if (opt.hasOwnProperty('ispinyi')) { // 2018-5-24 历史兼容
        opt.ispinyin = opt.ispinyi;
        delete opt.ispinyi;
    }
    $.extend(true, _param, opt);

    if (_ele_option.opt_url) {
        url = _ele_option.opt_url;
        ajaxtype = '';
        datafn = '';
    }
    if (_ele_option.opt_ajaxtype) {
        ajaxtype = _ele_option.opt_ajaxtype;
    }
    if (_ele_option.opt_ajaxdata) {
        datafn = _ele_option.opt_ajaxdata;
    }

    var callbacks_change = $.Callbacks();
    var callbacks_itemChange = $.Callbacks();
    _obj.select2.on('change', function (e) { //注意change 事件对象中不包含 params
        $(this).trigger('focusout.validate').trigger('click.validate');
        callbacks_change.fire(e);
    }).on('select2:select select2:unselect', function (e) { //返回被选中或取消选中的元素数据
        callbacks_itemChange.fire(e.params.data, e);
    });
    /**
     * 设置选中项
     * @param {Array} 需要设置为选中状态的value值数组；
     * @param {Boolean} 设置为 true 则不触发change事件(会触发change.select2事件，用于通知select2更新视图)；但仍会触发validate校验；该行为与使用js修改select的值时不触发change事件的行为一致；
     */
    _obj.setVal = function (arr, triggerChange) {
        _obj.select2.val(arr).trigger('change');
        if (triggerChange) {
            _obj.select2.trigger('change.select2').trigger('focusout.validate').trigger('click.validate');
        } else {
            _obj.select2.trigger('change');
        }
    };
    /**
     * 获取当前选中项的value;多选时为数组类型；
     */
    _obj.getVal = function () {
        return _obj.select2.val();
    };
    /**
     * 获取当前选中项所绑定的所有数据；
     * @return {Array} 选中的数据对象，数组格式；
     */
    _obj.getSelectedData = function () {
        /*var arr_ = [];
        _obj.select2.find('option:selected').each(function () {
            arr_.push($(this).data('data'));
        });
        return arr_;*/
        return _obj.select2.select2('data') || [];
    };
    /**
     * 全量覆盖更新select下所有选项；
     * @param {Object} option 代码片段
     */
    _obj.updateOption = function (html) {
        _obj.select2.html(html).trigger('change.select2'); //注意这里必须是只通知select2进行更新，不应触发 dom的change事件
        _obj.select2.trigger('focusout.validate').trigger('click.validate');
    };
    _obj.changeCallback = function (cb) {
        $.type(cb) == 'function' && callbacks_change.add(cb);
    };
    _obj.changeCallbackByitem = function (cb) {
        $.type(cb) == 'function' && callbacks_itemChange.add(cb);
    };
    _obj.destroy = function () {
        _obj.select2.select2('destroy');
        _obj.select2.removeData('select2_init');
    }

    if (_param.ispinyin) {
        COM_TOOLS.requireJsFn(['cusPinYin'], [], function () {});
    }

    if ($.type(url) == "string" && $.trim(url) != '') {
        ajaxtype = ajaxtype || 'get';
        if (_param.iscache) { /*本地缓存数据*/
            $.ajax({
                type: ajaxtype,
                url: url,
                data: $.type(datafn) == 'function' ? datafn('', '') : ($.type(datafn) == 'object' ? datafn : {}),
                cache: false,
                dataType: 'json',
                success: function (dd) {
                    if (dd) {
                        if (_param.ispinyin) {
                            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                                _obj.select2.select2($.extend(true, {
                                    multiple: _param.multiple,
                                    data: dd.isFilterTag == 0 ? [] : dd.results,
                                    matcher: oldMatcher(thatMatcher_)
                                }, _param.other));
                                _param.initValue != '' && _obj.setVal(_param.initValue);
                                _param.drawCallBack(true);
                            });
                        } else {
                            _obj.select2.select2($.extend(true, {
                                multiple: _param.multiple,
                                data: dd.isFilterTag == 0 ? [] : dd.results
                            }, _param.other));
                            _param.initValue != '' && _obj.setVal(_param.initValue);
                            _param.drawCallBack();
                        }
                    }
                }
            });
        } else { /*远程检索数据*/
            var _remoteOption = {
                multiple: _param.multiple,
                ajax: {
                    url: url,
                    dataType: 'json',
                    cache: false,
                    delay: 250,
                    processResults: function (dd) { //返回结果
                        if (dd && dd.isFilterTag == 0) {
                            return {
                                "results": []
                            };
                        } else {
                            return dd;
                        }
                    },
                    data: function (params) {
                        if ($.type(datafn) == 'function') {
                            return datafn(params.term, params);
                        }
                        return {
                            q: params.term
                        };
                    }
                },
                minimumInputLength: 1, //最少需要输入一个字符才可查询
                placeholder: LOCAL_MESSAGE_DATA["platform.plugin.msg.enterSearch"] //请输入搜索内容
            };
            _obj.select2.select2($.extend(true, _remoteOption, _param.other));
        }
    } else if ($.type(url) == "array") { //本地jsondata 初始化
        if (_param.ispinyin) {
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                _obj.select2.select2($.extend(true, {
                    multiple: _param.multiple,
                    data: url,
                    matcher: oldMatcher(thatMatcher_)
                }, _param.other));
                _param.initValue != '' && _obj.setVal(_param.initValue);
                _param.drawCallBack(true);
            });
        } else {
            _obj.select2.select2($.extend(true, {
                multiple: _param.multiple,
                data: url
            }, _param.other));
            _param.initValue != '' && _obj.setVal(_param.initValue);
            _param.drawCallBack();
        }
    } else { //html 初始化
        if (_param.ispinyin) {
            $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
                _obj.select2.select2($.extend(true, {
                    multiple: _param.multiple,
                    matcher: oldMatcher(thatMatcher_)
                }, _param.other));
                _param.initValue != '' && _obj.setVal(_param.initValue);
                _param.drawCallBack(true);
            });
        } else {
            _obj.select2.select2($.extend(true, {
                multiple: _param.multiple
            }, _param.other));
            _param.initValue != '' && _obj.setVal(_param.initValue);
            _param.drawCallBack();
        }
    }

    function thatMatcher_(term, text) {
        if (text.toPinYin != undefined) {
            return text.toPinYin().indexOf(term.toUpperCase()) >= 0 ? true : text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
        }
        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
    }

    _obj.select2.data('select2_init', _obj);

    return _obj;
};;
///<jscompress sourcefile="tabPage_fn.js" />
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
};;
///<jscompress sourcefile="_a_.js" />
/* 视图工具 */
COM_TOOLS._view = {
    /**
     * @description 高级搜索弹窗
     * @param {String} id 触发这个弹窗按钮的id;
     */
    cusHighSearch: function (id) {
        $('#' + id).on('click', '.js-highsearch-btn', function () {
            var tObj_ = $(this);
            if (!tObj_.data('isload')) { //防止多次加载
                tObj_.siblings('.js-moreSearchBox').load(tObj_.data('itemurl'), function () {
                    tObj_.data('isload', true);
                });
            }
        }).find('.js-moreSearchBox').click(function () { //防止点击弹出框自动关闭
            return false;
        });
    },

    /**
     * 新手引导
     *
     */
    noviceGuide: '<div class="popover cus-step-popover-box" role="tooltip"> <div class="arrow"></div> <h3 class="popover-title"></h3> <div class="popover-content"></div>' +
        '<div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-default" data-role="prev">&laquo; ' + LOCAL_MESSAGE_DATA["platform.plugin.msg.prevStep"] +
        '</button> <button class="btn btn-sm btn-default" data-role="next">' + LOCAL_MESSAGE_DATA["platform.plugin.msg.nextStep"] + ' &raquo;</button>' +
        '<button class="btn btn-sm btn-default" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">' + LOCAL_MESSAGE_DATA["platform.plugin.msg.pause"] +
        '</button> </div> <button class="btn btn-sm btn-default" data-role="end">' + LOCAL_MESSAGE_DATA["platform.plugin.msg.end"] + '</button> </div> </div>',

    DT_colShowBar: function (that_, btnid) {
        var _btn = $('#' + btnid);
        if (_btn.length && !_btn.hasClass('dropdown-toggle') && !_btn.is('[data-toggle]')) {
            var wrap = $('<div class="btn-group md-dropdown-ll0328"></div>');
            _btn.addClass('dropdown-toggle').attr('data-toggle', dropdown);
        }
        /*var columns_ = [], str = [];
        that_.columns('.js-visible-column').every(function(index) {
            str.push('<li><label><input class="js-input" type="checkbox" value="',index,'">&nbsp;',
            $(this.header()).text(),'</label></li>')
        });
        $('.js-col-selbar').html(str.join('')).on('click',function(e){
            e.stopPropagation();
        }).find('.js-input').on('click',function(){
            console.log($(this).val())
            that_.column( $(this).val()).visible( !that_.column( $(this).val()).visible() );
        });*/
    },
    /* 
     * 动态生成密码输入框
     * 默认为 DOM 动态构造版，支持校验；
     * selector 为对应的 ID，isDynamicDom 为 false 时是非动态 DOM 构造
     */
    cusPWD: function (selector, isDynamicDom) {
        var $obj = $('#' + selector);
        if (!$obj.length) {
            return
        }
        if (isDynamicDom != false) {
            var temp = $('<div class="js-temp-html"></div>'); // 替换用的占位符
            $obj.before(temp);
            var $rep_html = $('<div class="input-group input-group-sm js-pwd-parent"> \
                <span class="js-replace-dom"></span> \
                <span class="input-group-btn"><button class="btn btn-primary js-pwd-btn" type="button"><i class="glyphicon glyphicon-eye-close"></i></button></span> \
                </div>');
            $obj.attr('type', 'password');
            $rep_html.find('.js-replace-dom').replaceWith($obj);
            temp.replaceWith($rep_html); // 注意
        }
        var $p = $obj.closest('.js-pwd-parent');
        $p.on('click.pwd', '.js-pwd-btn', function (e) {
            var $icon = $p.find('.glyphicon');
            if ($obj.is('[type=password]')) {
                $obj.attr('type', 'text')
                $icon.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open')
            } else {
                $obj.attr('type', 'password')
                $icon.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close')
            }
        });
    }
};;
///<jscompress sourcefile="cus_dropdown.js" />
/**
 * 自定义下拉菜单
 * @param {String} selector id或jQuery对象
 * @param {Object} opt 配置信息
 */
COM_TOOLS._view.cus_dropdown = function (selector, opt) {
    opt = opt || {};
    opt = $.extend(true, { //配置项
        placement: 'bottom', //默认展开位置，bottom 、 top
        container: 'body',
        autoPlace: 'auto', //自动定位
        pull: 'left', //对齐方向
        height: 'auto', //下拉框高度
        width: '', //下拉框宽度，默认为初始化元素的宽度
        autoDestroy: false, //下拉框收起后，是否销毁；
        maxWidth: 'none',
        maxHeight: parseInt(($(window).height() || 500) * .4),
        content: '',
        template: '<div class="cus-dropdown-plugin"><div class="drop-cbox"><div class="drop-cbox-overflow"><div class="drop-cbox-cont"></div></div></div></div>'
    }, opt);
    var _obj = {};
    var $ele = $.type(selector) == 'string' ? $('#' + selector) : (selector.selector ? selector : $()),
        $box = $(opt.template);
    if ($ele.length == 0) {
        console.error('未找到操作对象');
        return false;
    }
    if ($ele.data('cus_dropdown')) {
        return $ele.data('cus_dropdown');
    }
    _obj.show = function () {
        if ($ele.attr('cus-cus_dropdown')) {
            $ele.trigger('inserted.cus_dropdown');
            $box.show();
            $ele.trigger('shown.cus_dropdown');
            return false;
        }
        var placement = opt.placement;
        var uid = COM_TOOLS.get_UID('cus_dropdown');
        var pos = COM_TOOLS.getPosition($ele);

        $box.attr('id', uid).find('.drop-cbox-cont').html(opt.content);
        $ele.attr('cus-cus_dropdown', uid);
        $box.detach().css({
            top: 0,
            left: 0,
            height: opt.height || 'auto',
            width: opt.width || pos.width || 'auto',
            maxWidth: opt.maxWidth || 'none',
            display: 'block'
        }).addClass(placement);

        opt.container ? $box.appendTo(opt.container) : $box.insertAfter($ele);
        $ele.trigger('inserted.cus_dropdown');

        var actualWidth = $box.outerWidth();
        var actualHeight = $box.outerHeight();

        if (opt.autoPlace) {
            var orgPlacement = placement;
            var viewportDim = COM_TOOLS.getPosition($('body'));
            placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? placement.replace('bottom', 'top') :
                placement == 'top' && pos.top - actualHeight < viewportDim.top ? placement.replace('top', 'bottom') :
                placement;
            $box.removeClass(orgPlacement).addClass(placement);
        }

        var offset = {
            top: placement == 'top' ? pos.top - actualHeight : pos.top + pos.height,
            left: opt.pull == 'left' ? pos.left : pos.right - actualWidth
        }

        $box.css({
            top: Math.round(offset.top),
            left: Math.round(offset.left)
        });
        $ele.trigger('shown.cus_dropdown');
    };
    _obj.hide = function (autoDestroy, element) {
        if (autoDestroy) {
            (element ? $('#' + element.attr('cus-cus_dropdown')) : $box).detach();
            (element || $ele).removeAttr('cus-cus_dropdown').trigger('hidden.cus_dropdown');
        } else {
            (element ? $('#' + element.attr('cus-cus_dropdown')) : $box).hide();
        }
    };
    _obj.getdropbox = function () {
        return $box;
    };
    _obj.autoDestroy = opt.autoDestroy;
    $ele.data('cus_dropdown', _obj);

    $ele.on('click.cus_dropdown', function (e) {
        if ($box.is(':hidden')) {
            $(document).one('mouseup.cus_dropdown_api', function (ee) { //在点击事件 触发前，重置状态
                var $target = $(ee.target);
                if ($target.closest($ele).length || $target.closest($box).length) {
                    return false;
                }
                _obj.hide(opt.autoDestroy);
            });
            _obj.show();
        } else {
            $(document).off('mouseup.cus_dropdown_api');
            _obj.hide(opt.autoDestroy);
        }
    });
    $box.on('mouseup.cus_dropdown_api', function () {
        return false;
    });
    /*
    // 与上面 cus_dropdown_api事件处理形式一致；
    var events_had = $._data( $(document)[0], "events");
    var flag_es = false;
    if(events_had && events_had['click']){
        var es_ = events_had['click'];
        $.each(es_, function(i, n) {
            if(n.namespace == 'cus_dropdown_api'){
                flag_es = true;
                return false;
            }
        });
    }
    if(!flag_es){
        $(document).on('click.cus_dropdown_api', function(e){
            var $target = $(e.target);
            $('[cus-cus_dropdown]').each(function(){
                var that_ = $(this);
                if(that_.is($target)){return true;}
                _obj.hide(that_.data('cus_dropdown').autoDestroy,that_);
            });
            if($target.closest('[cus-cus_dropdown]').length || $target.closest('.cus-dropdown-plugin').length){
                return false;
            }
        });
    }*/
    return _obj;
};;
///<jscompress sourcefile="cusDropJstree.js" />
/**
 * @description jstree 树型下拉菜单
 * @param {String} id 必填， 触发对象的 id 或jquery对象;
 * @param {String} hide_id 必填，隐藏域对应的 id或jquery对象;
 * @param {Object} option 选填，配置信息;
 *
 */
COM_TOOLS._view.cus_drop_jstree = function (id, hide_id, opt) {
    opt = opt || {};
    opt = $.extend(true, { //配置项
        'wrapBoxId': '', //可选，input的包裹对象id，如果没有，则为input自己
        'hasSearch': true, //是否启用搜索功能
        'hasPinyin': false, //是否启用拼音检索
        'url': false, //jstree-ajax-url
        'data': false, //jstree-ajax-data
        'groupName': '', //数据分组名称； 不为空则启用缓存， 只对ajax-data 生效
        'jstree': {}, //映射为 jstree_init.option['other']
        'dropdown': { //下拉框组件配置项
            autoDestroy: true
        }
    }, opt);

    var $textObj = $.type(id) == 'string' ? $('#' + id) : (id.selector ? id : $());
    var $hideVal = $.type(hide_id) == 'string' ? $('#' + hide_id) : (hide_id.selector ? hide_id : $());
    if (!$textObj.length || !$hideVal.length) {
        console.error('未找到操作对象');
        return false;
    }
    var _obj = {};
    var $wrapBox = opt.wrapBoxId ? $.type(opt.wrapBoxId) == 'string' ? $('#' + opt.wrapBoxId) : (opt.wrapBoxId.selector ? opt.wrapBoxId : $textObj) : $textObj;
    if ($wrapBox.data('cus_drop_jstree')) {
        console.error('不能重复初始化');
        return $wrapBox.data('cus_drop_jstree');
    }
    if (opt.hasPinyin) { //加载拼音组件
        COM_TOOLS.requireJsFn(['cusPinYin']);
    }

    function thatMatcher_(term, text) {
        if (opt.hasPinyin && text.toPinYin != undefined) {
            return text.toPinYin().indexOf(term.toUpperCase()) >= 0 ? true : text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
        }
        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
    }

    var CUS_DROPDOWN_ = COM_TOOLS._view.cus_dropdown($wrapBox, $.extend(true, {}, opt.dropdown, { //内容不允许被修改
        content: (opt.hasSearch ? '<input class="jstree-searchbox form-control input-sm"/>' : '') + '<div class="js-dy-jstree"></div>',
    }));

    $wrapBox.on('shown.cus_dropdown', function () { //下拉菜单已显示

        var jstreeOpt = { //jstree 配置
            "checkbox": {
                "three_state": false //此属性选择是否级联,默认为true。
            },
            'core': {
                "dblclick_toggle": false, // 双击打开
                "themes": {
                    "icons": false, // 文件夹图标
                },
                'data': {
                    'url': opt.url || false,
                    'data': opt.data || false
                }
            },
            "search": {
                show_only_matches: true, //只显示搜索到的数据
                show_only_matches_children: true,
                search_callback: function (d, n) {
                    return thatMatcher_(d, n.text);
                }
            },
            'plugins': ['checkbox', 'search']
        };
        $.extend(true, jstreeOpt, opt['jstree']);

        var $dropBox = CUS_DROPDOWN_.getdropbox();
        /* 初始化jstree */
        var JSTREE_ = COM_TOOLS.jstree_init($dropBox.find('.js-dy-jstree'), {
            'groupName': opt['groupName'],
            'input_text_obj': $textObj,
            'input_val_obj': $hideVal,
            'other': jstreeOpt,
            'initCallback': function () {
                if (opt.hasSearch) {
                    var to_ = false;
                    var $seach_box = $dropBox.find('.jstree-searchbox');
                    $seach_box.keyup(function () {
                        if (to_) {
                            clearTimeout(to_);
                        }
                        to_ = setTimeout(function () {
                            var v = $.trim($seach_box.val());
                            JSTREE_.jstree.search(v);
                        }, 250);
                    });
                }
            }
        });
        _obj.jstree_api = JSTREE_; //jstree_init 方法实例对象
    });
    _obj.show = CUS_DROPDOWN_.show;
    _obj.hide = function () {
        CUS_DROPDOWN_.hide(true);
    }
    _obj.target = $wrapBox; //dropdown 事件监听对象
    $wrapBox.data('cus_drop_jstree', _obj);
    return _obj;
};;
///<jscompress sourcefile="cusFileUpload.js" />
/**
 * @description 自定义原生上传
 * @param {String} id 必填， 触发对象的 id;
 * @param {String} hide_id 选填，隐藏域对应的 id 及 name;
 * @param {Object} option 选填，配置信息;
 */
COM_TOOLS._view.cusFileUpload = function (id, hide_id, option) {
    var $obj = $('#' + id);
    if (!$obj.length) {
        return false;
    }
    if ($obj.data('cusFileUpload') == 'inited') { //防止重复初始化
        return false;
    }
    var btn_img = $obj.is('button') ? 'btn' : $obj.is('img') ? 'img' : false; // dom对象判断
    var _t_H = 0;
    var f_path = ''; // 回显路径

    option = option || {};
    if (typeof hide_id == 'object') {
        option = hide_id
    }

    // dom 动态构造
    if ($obj.hasClass('js-dy-creation')) {
        var t_id = $obj.attr('id');
        var temp = $('<div class="js-temp-html"></div>'); // 替换用的占位符
        $obj.before(temp);
        if (btn_img == 'btn') {
            $obj.addClass('js-judge-dom');
            if ($obj.data('fpath')) {
                f_path = $obj.data('fpath');
                option.isname = true;
            }
            var obj_html = '<span class="js-replace-dom"></span>';
        } else if (btn_img == 'img') {
            _t_H = $obj.attr('height');
            var default_src = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhERUVCNjBFMkNCMDExRTg4QjdEODkwOTJCMDAzRkZDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhERUVCNjBEMkNCMDExRTg4QjdEODkwOTJCMDAzRkZDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NEM3RjlCMkNBRTExRTg5MzZBQUVFNkE0NzM5RTk4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ2NEM3RjlDMkNBRTExRTg5MzZBQUVFNkE0NzM5RTk4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAKABGAwERAAIRAQMRAf/EAHAAAAEEAgMAAAAAAAAAAAAAAAAFBgcIAgMBBAkBAQAAAAAAAAAAAAAAAAAAAAAQAAIBBAEDAgQEBgMAAAAAAAECAwARBAUGITESQWFRcRMHIkJiMzJy0xSkFVUWFxEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A9FKAoNbTRI6xvKiyN1WMsAx+Q70GygKAoCgKAoCg7urwG2+21OnjlMD7XKTHGQACUUgs7C9xcIrW97UFtMPhvF8DX/6yHR4b4jL4zLNEsrS3Fi0juCzE+pJoK28647BxjkcuBgkjXZcCZeDCzFmiDMyPFc9Sqlbrf0NvSgaFAe1AUBQFAUGyKafGmx8vElMGXhypPiTgX8JIyGU29R0sR6jpQTxh/ejXHCDbDSZibNVs0OMY3hkb1KO7qQP5gD86CGd7vM7km3ytzsFWKbICRQYsZLJBBHfwjDEDyN2JJt1J+FqBHYsAAqNNI7LHFCnV5JHIVEUepZiAPegmXdfbKXX8HxMrHT+45Lqw2Zt/pC5yUcXmgWwuREP2/j42/MaCG1ZXVXQh0dQysOoIIuCPnQc0BQFAUCpptJtOQ5x1unxhk5Kx/VnZ28IoY+tmkcA+PkRZRa5PsCQCY6yxSzY2RC+NlYshiysWUeMkUi91Yeh7exHUdKCVvtRxc7PaPyTMjvr9M7RaxW7S5lrPJ7iEHxH6ifVaCyPf5UFS+f8AF/8Aq2/kGNH4abcmTJ1lh+GOS/lNj+3iT5L+k2H8NAy6AoCgzijE00ML5CYaTOEkzZFaRIVPeRkS7Nb4Dufh3oLFcZ5J9t+K6xNbrdsTc/Uy8uTGyDLkSkWaSVhELk+g7AWAAAoGrzyfgfK1TO13IU1e+jCxHOOJktHLBf8AEsqCL8RUElD3B6diRQPnUc1+3uj1mFqcDbGLDwIlihU4+SSQvdmP0urMepPqaBS/9K4T/wA1/jZP9Kga/MeTcE5VosvWPuxFlC0+tyji5J+jkx9Y3/a7flYeqkigrshZkRnX6bsoLx3vY+ouO9BnQf/Z";
            if ($obj.attr('src') && $obj.attr('src') != default_src) {
                f_path = $obj.attr('src');
            } else {
                $obj.attr('src', default_src);
            }

            var obj_html = '<div class="js-judge-dom show-mask">' +
                '<span class="js-replace-dom"></span>' +
                '<div class="cus-img-mask" style="line-height: ' + _t_H + 'px;"><span class="glyphicon glyphicon-open"></span></div>' +
                '</div>';
        }
        var inp_h_id = (typeof hide_id != 'object' && hide_id) || id + '_hide';
        var $rep_html = $('<div id="' + ('js_is' + btn_img + '_' + t_id) + '" class="cus-single-upload">' +
            '<div class="main-area ' + ('is-' + btn_img) + '">' +
            '<input id="' + inp_h_id + '" name="' + inp_h_id + '" ' + (option.required == true ? 'required' : '') + ' class="hide-inp-validate" value="' + f_path + '" type="text"/>' +
            '<input class="js-inp-files hidden" type="file"/>' +
            obj_html +
            '</div>' +
            '<span class="file-name"></span>' +
            '</div>');

        $rep_html.find('.js-replace-dom').replaceWith($obj);
        temp.replaceWith($rep_html); // 注意

        // 回显时 btn 显示名称
        if (btn_img == 'btn' && f_path && option.isname) {
            var f_name = '';
            if (/targetName/.test(f_path)) {
                f_name = f_path.split('targetName=')[f_path.split('targetName=').length - 1];
            } else {
                f_name = f_path.split('/')[f_path.split('/').length - 1];
            }
            $rep_html.find('.file-name').attr('title', f_name).html('<a href="' + f_path + '">' + f_name + '</a>');
        }
    } else {
        console.error('dom结构错误，缺少 js-dy-creation 的class。');
        return false;
    }

    $obj.data('cusFileUpload', 'inited'); //添加初始化锁
    var option_ = $.extend({
        apitype: 'H5',
        serve_url: COM_DEFAULT._fileServeOpt.fileUploadUrl, // 接口
        serve_name: 'upload', // 对应字段
        isname: false, // 文件名显示
        uptype: '',
        filetype: [], // 格式类型
        filesize: ((btn_img == 'btn' ? COM_DEFAULT._fileServeOpt.defaultFileSize : COM_DEFAULT._fileServeOpt.imgFileSize) || 5 * 1024), // 文件大小,单位：KB
    }, option);

    // 类型判断
    if (!option_.filetype.length) {
        option_.filetype = btn_img == 'btn' ?
            COM_DEFAULT._fileServeOpt.fileType :
            btn_img == 'img' ? COM_DEFAULT._fileServeOpt.imgType : [];
    }

    var $main_div = $rep_html.find('.main-area'),
        $judgeDom = $rep_html.find('.js-judge-dom');

    // createObjectURL 资源链接
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    $rep_html.off("click.jude-dom change.inp-files").on('click.jude-dom', '.js-judge-dom', function () {
        // 基础配置判断
        if (!option_.serve_url || !option_.serve_name) {
            COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.opt_lack'));
            return false;
        }
        // 清除提示标
        if ($main_div.find('.tip-icon').length) {
            $main_div.find('.tip-icon').remove();
        }
        return $rep_html.find('.js-inp-files').click();
    }).on('change.inp-files', '.js-inp-files', function () {
        var t_files = this.files[0];
        this.value = ''; // 清除

        if (t_files) {
            // 文件格式、大小
            var filesize = option_.filesize * 1024, // KB
                filetype = t_files.name.split('.')[(t_files.name.split('.').length - 1)];
            // 提示 icon
            var $i_obj = $('<i class="cus-progress-bar"></i>'),
                $icon_success = $('<span class="tip-icon success glyphicon glyphicon glyphicon-ok-circle"></span>'),
                $icon_error = $('<span class="tip-icon error glyphicon glyphicon-remove-circle"></span>');
            // 是否显示文件名
            option_.isname && $rep_html.find('.file-name').html('').html(t_files.name);

            // 错误判断
            if (filesize < t_files.size) {
                COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.size_exceed', option_.filesize));
                return false;
            } else if (!new RegExp('^(' + option_.filetype.join('|') + ')$', 'i').test(filetype)) {
                COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.type_err', option_.filetype.join('|')));
                return false;
            }

            var f_formData = new FormData();
            f_formData.append(option_.serve_name, t_files);
            // 上传的对应类型
            if (!$.isEmptyObject(option_.uptype)) {
                for (var k in option_.uptype) {
                    f_formData.append(k, option_.uptype[k]);
                }
            }
            // 回显图片
            if (btn_img == 'img') {
                $judgeDom.find('img').attr('src', getObjectURL(t_files));
            }

            $.ajax({
                type: "post",
                dataType: "json",
                url: option_.serve_url,
                data: f_formData,
                processData: false,
                contentType: false,
                cache: false,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr(); // 获取 JQ 中的 xhr 实例
                    xhr.upload.onprogress = function (event) {
                        if (event.lengthComputable) {
                            var percent = Math.floor(event.loaded / event.total * 100);

                            if (btn_img == 'btn') {
                                if (!$judgeDom.find('.cus-progress-bar').length) {
                                    COM_TOOLS.loadingBtn.open($judgeDom);
                                    $judgeDom.append($i_obj);
                                }
                                $i_obj.css('width', percent + '%');
                            } else if (btn_img == 'img') {
                                if (!$judgeDom.parent().find('.cus-progress-bar').length) {
                                    $i_obj.css('line-height', _t_H + 'px');
                                    $judgeDom.parent().append($i_obj);
                                }
                                $i_obj.text(percent + '%').css('width', percent + '%');
                            }
                        }
                    }
                    return xhr; // 需要返回 xhr 对象
                },
                complete: function () {
                    btn_img == 'btn' && COM_TOOLS.loadingBtn.close($judgeDom);
                    $i_obj.remove();
                },
                success: function (res) {
                    // res = {state: 1, patch: _url_} res = 'ERROR'
                    if (res.state == 1) {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_success']);
                        $main_div.append($icon_success);
                        $rep_html.find('.hide-inp-validate').val(res.path);
                        if (option_.required) {
                            $.validator && $rep_html.find('.hide-inp-validate').trigger('focusout.validate').trigger('click.validate');
                        }
                    } else if (res.state == 0) {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                        $main_div.append($icon_error);
                    }
                    option_.success && option_.success(res, $rep_html); // 完成时的回调，传递 data 及 $('#id')
                },
                error: function () {
                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                    $main_div.append($icon_error);
                }
            });
        }
    });
};;
///<jscompress sourcefile="cusPopover.js" />
/**
 * @description 生成一个带关闭按钮的popover弹窗
 * @param {String} id 触发这个弹窗按钮的id;
 * @param {Object} opt pop弹窗的配置项;
 * @param {Function} startcb 打开弹窗时执行的方法;
 * @param {Function} endcb 关闭弹窗时执行的方法;
 */
COM_TOOLS._view.cusPopover = function (id, opt, startcb, endcb) {
    var param_ = {
        container: 'body',
        placement: 'bottom',
        content: '',
        trigger: 'click',
        width: '',
        html: true,
        title: '<button type="btn" class="btn btn-warning btn-sm cus-pop-close" onclick="javascript:$(\'#' + id + '\').trigger(\'click\')"><i class="glyphicon glyphicon-chevron-up"></i></button>'
    };
    var tar_ = '',
        rep_ = '';
    if ($.type(opt) == "object") {
        tar_ = $(opt['content']);
        opt['content'] = tar_.html();
        $.extend(param_, opt);
    }
    $('#' + id).popover({
        html: param_['html'],
        container: param_['container'],
        placement: param_['placement'],
        content: param_['content'],
        trigger: param_['trigger'],
        title: param_['title'],
        template: '<div class="popover cus-popover-box2" role="tooltip"><div class="arrow"></div><h3 class="popover-title text-right"></h3><div class="popover-content"></div></div>',
    }).on('show.bs.popover', function () {
        $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        rep_ = $('<div>').hide().insertBefore(tar_);
        tar_.remove();
    }).on('shown.bs.popover', function () {
        (typeof startcb == 'function') && startcb(id);
    }).on('hidden.bs.popover', function () {
        $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        rep_.replaceWith(tar_);
        (typeof endcb == 'function') && endcb(id);
    }).on('inserted.bs.popover', function () {
        if (param_['width']) {
            $('#' + $(this).attr('aria-describedby')).css({
                'width': param_['width'],
                'max-width': 'none'
            });
        }
    });
};;
///<jscompress sourcefile="inputStatus.js" />
/**
 * @description 设置文本框的校验状态(不建议与tooltips混用，有样式兼容问题：tooltips会与icon争抢相邻兄弟节点，导致CSS选择器失效)
 * @param {Object} obj $(obj) or selector;
 * @param {String} status success:成功, warning：警告, error：失败, default：reset 默认;
 * @param {Boolean} noIcon 是否包含验证ICON，默认包含
 */
COM_TOOLS._view.setInputStatus = function (obj, status, noIcon) {
    if (obj) {
        obj = typeof (obj) === 'string' ? $(obj) : obj;
        if (obj.length > 0) {
            var p_ = obj.parent();
            var isInpGroup = p_.hasClass('input-group');
            var icon = isInpGroup ? p_.next('.form-control-feedback') : obj.next('.form-control-feedback');
            var offsetParent = isInpGroup ? p_.parent() : p_;
            offsetParent.removeClass('has-success has-warning has-error has-feedback');
            if (icon.length) {
                icon.remove();
            }
            var iconStr = '';
            switch (status) {
                case 'success':
                    offsetParent.addClass('has-feedback has-success');
                    iconStr = '<span class="glyphicon glyphicon-ok form-control-feedback "></span>';
                    break;
                case 'warning':
                    offsetParent.addClass('has-feedback has-warning');
                    iconStr = '<span class="glyphicon glyphicon-warning-sign form-control-feedback "></span>';
                    break;
                case 'error':
                    offsetParent.addClass('has-feedback has-error');
                    iconStr = '<span class="glyphicon glyphicon-remove form-control-feedback "></span>';
                    break;
                default:
                    iconStr = '';
                    break;
            }
            if (noIcon) {
                iconStr = '';
            }
            if (iconStr) {
                if (isInpGroup) {
                    var icon_ = $(iconStr);
                    var inpGroupControls = obj.nextAll('.input-group-btn, .input-group-addon');
                    if (inpGroupControls.length) {
                        var offsetPosition = 0;
                        $.each(inpGroupControls, function (index, inpGroupElement) {
                            offsetPosition += $(inpGroupElement).outerWidth();
                        })
                        icon_.css('right', offsetPosition + 15 + 'px');
                    }
                    /*if (p_.hasClass('input-group-sm') || p_.hasClass('input-group-lg')) {
                        obj.css('paddingRight', '42.5px');
                    }*/
                    p_.after(icon_);
                } else {
                    obj.after($(iconStr));
                }
            }
        }
    }
};;
///<jscompress sourcefile="tabScrollFn.js" />
/* 标签滚动 */
COM_TOOLS._view.tabScrollFn = {
    dom_: {
        ul_: $(),
        overBox_: $(),
    },
    sumWidth: function (ele) { //计算元素总宽度
        var width_ = 0;
        $(ele).each(function () {
            width_ += $(this).outerWidth();
        });
        return width_;
    },
    scrollTabLeft: function () { //往左按钮
        var marginLeftVal = Math.abs(parseInt(this.dom_.ul_.css('margin-left'))),
            visibleWidth = this.dom_.overBox_.width(),
            scrollVal = 0;
        if (this.dom_.ul_.width() < visibleWidth) { //内容宽度 小于 可视宽度
            return false;
        } else {
            var tabEle = this.dom_.ul_.find("li:first"),
                offsetVal = 0; //计算距离用的
            while ((offsetVal + $(tabEle).outerWidth()) <= marginLeftVal) { //离 mar 的距离，最近的那个 dom 元素
                offsetVal += $(tabEle).outerWidth();
                tabEle = $(tabEle).next(); //大于 marginLeftVal 的那个
            } //所以 tabElement 的最后结果是 >= marginLeftVal 的那个
            offsetVal = 0;
            if (this.sumWidth($(tabEle).prevAll()) > visibleWidth) { //滚动距离大于一页时
                while ((offsetVal + $(tabEle).outerWidth()) < (visibleWidth) && tabEle.length > 0) {
                    offsetVal += $(tabEle).outerWidth();
                    tabEle = $(tabEle).prev(); //
                } //所以 tabElement 的最后结果是 > visibleWidth 的那个
                scrollVal = this.sumWidth($(tabEle).prevAll()); ////找到临界值的那个 dom 并计算它之前的距离，所有会包含它本身
            }
        }
        this.dom_.ul_.animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    },
    scrollTabRight: function () { //往右按钮
        var marginLeftVal = Math.abs(parseInt(this.dom_.ul_.css('margin-left'))),
            visibleWidth = this.dom_.overBox_.width(),
            scrollVal = 0;
        if (this.dom_.ul_.width() < visibleWidth) {
            return false;
        } else {
            var tabEle = this.dom_.ul_.find("li:first"),
                offsetVal = 0;
            while ((offsetVal + $(tabEle).outerWidth()) <= marginLeftVal) { //离 mar 的距离，最近的那个 dom 元素
                offsetVal += $(tabEle).outerWidth();
                tabEle = $(tabEle).next();
            }
            if (offsetVal < (this.dom_.ul_.outerWidth() - visibleWidth)) { //防止最后一个dom元素已经显示出来，还继续滚动
                offsetVal = 0;
                while ((offsetVal + $(tabEle).outerWidth()) < (visibleWidth) && tabEle.length > 0) {
                    offsetVal += $(tabEle).outerWidth();
                    tabEle = $(tabEle).next();
                }
            }
            scrollVal = this.sumWidth($(tabEle).prevAll()); //找到临界值的那个 dom 并计算它之前的距离，所有会包含它本身
            if (scrollVal > 0) {
                this.dom_.ul_.animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        }
    },
    scrollToTab: function (ele) { //点击tab标签
        var marginLeftVal = this.sumWidth($(ele).prevAll()),
            marginRightVal = this.sumWidth($(ele).nextAll()),
            visibleWidth = this.dom_.overBox_.width(),
            scrollVal = 0;
        if (this.dom_.ul_.outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - ($(ele).outerWidth() + $(ele).next().outerWidth()))) { //靠右边
            if ((visibleWidth - $(ele).next().outerWidth()) > marginRightVal) {
                scrollVal = marginLeftVal; //注意这里
                var tabEle = ele;
                while ((scrollVal - $(tabEle).outerWidth()) >= (this.dom_.ul_.outerWidth() - visibleWidth) /* 被隐藏的部分距离 */ ) {
                    scrollVal -= $(tabEle).prev().outerWidth();
                    tabEle = $(tabEle).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - ($(ele).outerWidth() + $(ele).prev().outerWidth()))) { //靠左边,包括中间
            scrollVal = marginLeftVal - $(ele).prev().outerWidth();
        }
        this.dom_.ul_.animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    },
    init: function (selector) { //绑定及初始化
        var cont_ = $(selector),
            that = this;
        this.dom_ = {
            ul_: cont_.find('.tab-list-ul'),
            overBox_: cont_.find('.tab-list-overflow')
        }
        cont_.on('click', '.tab-list-ul li', function () {
            that.scrollToTab($(this));
        }).on('click', '.tab-left-btn', function () {
            that.scrollTabLeft();
        }).on('click', '.tab-right-btn', function () {
            that.scrollTabRight();
        });
    }
};;
///<jscompress sourcefile="_a_.js" />
/* 定制公共模块 */
COM_TOOLS._model = {};
;
///<jscompress sourcefile="_orgModel_.js" />
/**
 * 自定义组织架构组件,内部方法,无状态;
 * @param {Object} opt
 */
COM_TOOLS._model._orgModel_ = function (opt) {
    var obj = {};
    opt = $.type(opt) == "object" ? opt : {};
    var _option = {
        tree_url: COM_DEFAULT._orgTreeOpt.treeUrl, //组织树接口地址
        search_url: COM_DEFAULT._orgTreeOpt.searchUrl, //搜索接口地址
        type: '1', //1（默认）：组织与人员；2：组织；
        only_sel_people: false, //是否只可选择人员;仅"type==1"时有效;
        cb: null,
        max_num: -1 //最大选择数目, -1为无限制；
    };
    $.extend(true, _option, opt);
    /**
     * 打开弹窗，并渲染数据（如果有）；
     * @param {Array} selected_list  已选中的数据数组对象
     * @param {Function} yesCallBack(arr, sArr)  弹窗确定按钮回调函数，返回 ：arr（已选中的全部数据只包含ID与TYPE，用于存储数据库中）, sArr（内部沟通展示视图使用，包含中文）;
     */
    obj._openModel = function (selected_list, yesCallBack) {
        selected_list = selected_list || [];
        var UID_ = COM_TOOLS.get_UID('orgjtree_');
        var JSTREE;
        /* 组件容器 */
        var $wrapper = $('<div style="display: none;" class="cus-orgjtree-wrap" id="' + UID_ + '"><div class="select-treelist-xxw">' +
            '<div class="clearfix">' +
            '<div class="left-cont pull-left">' +
            '<div class="search-box-xxw form-inline">' +
            '<i class="glyphicon glyphicon-search icon1"></i>' +
            '<input type="text" class="form-control input-sm js-orgtree-searchbtn" placeholder="搜索：名称、拼音、邮箱">' +
            '<i class="glyphicon glyphicon-remove-circle icon2 js-delinp"></i>' +
            '</div>' +
            '<div class="tree-cont js-tree-cont-xxw">' +
            '<div class="js-orgtree-box"></div>' +
            '</div>' +
            '</div>' +
            '<div class="right-cont pull-left">' +
            '<div class="tit">已选部门、成员</div>' +
            '<div class="sel-boxpar-xxw">' +
            '<div class="sel-box-xxw"></div>' +
            '</div>' +
            '</div>' +
            '<div class="search-list-xxw">' +
            '<div class="search-cont"></div>' +
            '</div>' +
            '</div>' +
            '<div class="btn-box-xxw clearfix">' +
            '<div class="pull-left t-org-style">' +
            '<i class="glyphicon glyphicon-info-sign"></i> ' +
            '<span>内部组织（<i class="glyphicon glyphicon-folder-close"></i>）</span>' +
            '<span>外部组织（<i class="glyphicon glyphicon-folder-close this-outer-org"></i>）</span>' +
            '</div>' +
            '<div class="pull-right">' +
            '<button type="button" class="btn btn-success btn-sm js-submitbtn" style="margin-right: 20px;">确认</button>' +
            '<button type="button" class="btn btn-sm btn-default js-canelbtn">取消</button>' +
            '</div>' +
            '</div>' +
            '</div></div>');

        var $selBox = $wrapper.find('.sel-box-xxw'),
            $tree = $wrapper.find('.js-orgtree-box'),
            $search_inp = $wrapper.find('.js-orgtree-searchbtn'),
            $btn_yes = $wrapper.find('.js-submitbtn'),
            $btn_cancel = $wrapper.find('.js-canelbtn');

        cumCheckPwin(parent).$('body').append($wrapper);
        /* 注入demo后再初始化自定义滚动条组件 */
        /*$wrapper.find('.js-tree-cont-xxw, .sel-boxpar-xxw, .search-list-xxw').mCustomScrollbar({
            theme: "dark-3",
            axis: 'yx',
            scrollbarPosition: 'outside'
        });*/

        /* 生成右侧dom */
        function makeSelectedItem(itemdata) {
            // console.log('$$$-itemdata-', itemdata)
            var icon = itemdata.dtype == '1' ? 'glyphicon glyphicon-user' : 'glyphicon glyphicon-folder-close';
            return $('<div title="' + itemdata.path + '" data-id_="' + itemdata.id + '" class="item-xxw1121 ' +
                (itemdata.hasauth == '0' ? 'nohasauth' : (itemdata.dtype == '0' && itemdata.isexternal == '2' ? 'this-outer-org' : '')) + ' clearfix">' +
                '<span class="iconx"><i class="' + icon + '"></i></span>' +
                '<span class="name-xxw">' + itemdata.text + '</span>' +
                '<span class="pull-right del-node-xxw"><i class="glyphicon glyphicon-remove"></i></span>' +
                '</div>').data(itemdata);
        }
        /* 初始化组织树 */
        function _init_jsfn() {
            $tree.jstree({
                "checkbox": {
                    "visible": false,
                    "three_state": false //此属性选择是否级联,默认为true。
                },
                'core': {
                    'themes': {
                        dots: false
                    },
                    "dblclick_toggle": false,
                    "check_callback": true,
                    'data': {
                        'url': _option.tree_url,
                        'data': function (node) {
                            return {
                                'parentId': node.id,
                                'type': _option.type
                            };
                        },
                        'dataFilter': function (d) { //TODO 待补充数据边界
                            COM_TOOLS._ajax_jumpToLogin(d);
                            var d_arr = $.parseJSON(d);
                            $.each(d_arr, function (i, n) {
                                var o = {};
                                n.type = String(n.type);
                                n.dtype = n.type;
                                if (n.type == '0' && n.isexternal == '2') {
                                    n.type = '2';
                                }
                                o.disabled = n.hasauth == 0 ? true : false;
                                if (_option.only_sel_people === true && _option.type == '1' && n.type != '1') { //仅操作人员时,部门禁用
                                    o.disabled = true;
                                }
                                $.each(selected_list, function (j, m) {
                                    if (n.code === m.code) {
                                        o.selected = true;
                                        return false;
                                    }
                                });
                                n.state = o;
                            });
                            return JSON.stringify(d_arr);
                        }
                    }
                },
                'types': { /* 注意：里面的数据必须是字符串，而且接口返回的相关字段值，也必须是字符串类型; @ll */
                    '1': { //人员
                        icon: 'glyphicon glyphicon-user'
                    },
                    '0': { //部门
                        icon: 'glyphicon glyphicon-folder-close'
                    },
                    '2': { //外部部门
                        icon: 'glyphicon glyphicon-folder-close this-outer-org'
                    }
                },
                'plugins': ['checkbox', 'types', 'wholerow'] //search:搜索组件,checkbox:多选框
            }).on("ready.jstree", function () {
                JSTREE = $(this).jstree(true);
                if (JSTREE.get_node(0)) {
                    var str_id = JSTREE.get_node(0).children[0];
                    if (str_id) {
                        JSTREE.open_node(str_id); //打开节点
                    }
                }
            }).on('load_node.jstree', function (e, node) {}).on('changed.jstree', function (e, d) {
                // console.log('changed', d);
                var ref = $(this).jstree(true);
                if (d.action != "deselect_node" && d.action != "select_node") {
                    return;
                }
                var node_ = d.node;
                if (ref.is_selected(node_.id)) { //添加项
                    var o_ = {};
                    $.extend(true, o_, node_.original);
                    $selBox.append(makeSelectedItem(o_));
                    selected_list.push(o_);
                } else { //删除项
                    $selBox.find('.item-xxw1121[data-id_=' + node_.id + '] .del-node-xxw').trigger('click');
                }
            });
        }

        var layer_box = cumParentWinModal('设置范围', $wrapper, {
            'type': 1,
            'ismax': false,
            'area': ['640px', '530px'],
            'end': function () {
                $wrapper.remove()
            },
            'success': function (layero, ind_) {
                $search_inp.val('');
                $selBox.html('');
                if (!$tree.jstree(true)) {
                    _init_jsfn();
                }
                if (selected_list.length > 0) {
                    COM_TOOLS.ajaxFn({
                        url: COM_DEFAULT._orgTreeOpt.getDataUrl,
                        type: 'get',
                        data: {
                            param: JSON.stringify(selected_list)
                        },
                        success: function (d) {
                            // console.log('%%%%333--', d, selected_list)
                            if (d && d.code == 1) {
                                var data_ = d.data;
                                selected_list = data_; //全量覆盖，保障一致性，简单粗暴
                                $.each(data_, function (i, n) {
                                    n.dtype = n.type;
                                    $selBox.append(makeSelectedItem(n));
                                });
                            }
                        }
                    });
                }
            }
        });
        //右侧删除按钮
        $wrapper.on('click', '.del-node-xxw', function () {
            var $t = $(this).closest('.item-xxw1121');
            var id_ = $t.data('id_');
            var j_ = -1; //待删除对象在数组中的下标，-1时不执行删除操作
            $.each(selected_list, function (i, n) { //切记不能在循环里，删减数组对象；实时引用的！！！
                if (n.id == id_) {
                    j_ = i;
                    return false;
                }
            });
            if (j_ >= 0) {
                selected_list.splice(j_, 1);
            }
            $t.remove();
            if (JSTREE.get_node(id_)) {
                JSTREE.deselect_node(id_, true);
            }
        });
        $wrapper.on('click', '.js-search-item', function () {
            var $t = $(this),
                id_ = $t.data('id');
            if (!$selBox.find('.item-xxw1121[data-id_=' + id_ + ']').length > 0) {
                $selBox.append(makeSelectedItem($t.data() || {}));
                if (JSTREE.get_node(id_)) {
                    JSTREE.select_node(id_, true, false);
                }
            }
            $wrapper.find('.search-list-xxw').hide();
            $search_inp.val('');
        });
        $search_inp.keypress(function (e) {
            if (e.keyCode == 13) {
                var keyword_ = $.trim($(this).val());
                // console.log('gggggg', $.trim($(this).val()));
                if (keyword_.length >= 1) {
                    $.get(_option.search_url, {
                        'keyword': keyword_,
                        'type': _option.type
                    }, function (res) {
                        if (res) {
                            var str = '';
                            if (res.person && res.person.length > 0) {
                                str += '<div class="search-list-box">' +
                                    '<div class="tit">人员</div>' +
                                    '<div class="cont js-person">';
                                $.each(res.person, function (i, n) {
                                    str += '<p class="search-item clearfix js-search-item" title="' + n.path +
                                        '" data-code="' + n.code + '" data-path="' + n.path + '" data-isexternal="' + n.isexternal +
                                        '" data-dtype="' + n.type + '" data-text="' + n.text + '" data-id="' + n.id + '">' +
                                        '<span>' + n.text + '</span>' +
                                        '<span class="pull-right">' + n.department + '</span>' +
                                        '</p>';
                                });
                                str += '</div></div>';
                            }
                            if (res.department && res.department.length > 0) {
                                str += '<div class="search-list-box">' +
                                    '<div class="tit">部门</div>' +
                                    '<div class="cont">';
                                $.each(res.department, function (i, n) {
                                    str += '<p class="search-item clearfix js-search-item ' + (n.isexternal == '2' ? 'this-outer-org' : '') + '" title="' + n.path +
                                        '" data-code="' + n.code + '" data-path="' + n.path + '" data-isexternal="' + n.isexternal +
                                        '" data-dtype="' + n.type + '" data-text="' + n.text + '" data-id="' + n.id + '">' +
                                        '<i class="iconx  glyphicon glyphicon-folder-close"></i><span>' + n.text + '</span>' +
                                        '</p>';
                                });
                                str += '</div></div>';
                            }
                            if (str) {
                                $wrapper.find('.search-cont').html(str);
                            } else {
                                $wrapper.find('.search-cont').html('<div class="tit">无结果</div>');
                            }
                            $wrapper.find('.search-list-xxw').show();
                        }
                    });
                }
            }
        });
        $btn_yes.click(function () {
            var arr = [];
            var sArr = [];
            $selBox.find('.item-xxw1121').each(function (a, b) {
                var d_ = $(this).data();
                arr.push({
                    code: d_.code,
                    type: d_.dtype
                });
                sArr.push({
                    code: d_.code,
                    type: d_.dtype,
                    path: d_.path,
                    isexternal: d_.isexternal,
                    text: d_.text
                });
            });
            if (_option.max_num > 0 && arr.length > _option.max_num) {
                cumCheckPwin(parent).COM_TOOLS.alert('最多选择' + _option.max_num + '个');
                return false;
            }
            //确认按钮回调
            if ($.type(_option.cb) == 'function') {
                _option.cb(arr);
            }
            if ($.type(yesCallBack) == 'function') {
                yesCallBack(arr, sArr);
            }
            cumCloseWin(layer_box, false, parent);
        });
        $btn_cancel.click(function () {
            cumCloseWin(layer_box, false, parent);
        });
        $wrapper.find('.js-delinp').click(function () {
            $search_inp.val('');
            $wrapper.find('.search-list-xxw').hide();
        })
    }

    /**
     * 构造初始化列表展示容器；
     */
    obj._makeSelWrap = function () {
        return $('<div class="orgtree-selectedlist-box">' +
            '<ul class="orgtree-item-list clearfix"></ul>' +
            '</div>');
    }
    /**
     * @param {Array} dlist 构造视图的完整JSON数组对象，必须包含中文名称自动，否则请使用_getFormatData方法构建
     * @param {Object} $sel_wrap 初始化列表展示容器的JQ对象；
     */
    obj._updateSelItem = function (dlist, $sel_wrap) {
        if ($sel_wrap.length == 0) {
            return false;
        }
        var str = '';
        $.each(dlist, function (i, n) {
            str += '<li class="orgtree-item ' + (n.type == '0' && n.isexternal == '2' ? 'this-outer-org' : '') + '" data-code="' + n.code + '" data-type="' + n.type + '"' +
                (n.path ? 'title="' + n.path + '"' : '') + '>' +
                '<i class="the-icon glyphicon ' + (n.type == '1' ? 'glyphicon-user' : 'glyphicon-folder-close') + '"></i>' + n.text +
                '</li>';
        });
        $sel_wrap.find('.orgtree-item-list').html(str);
    };
    /**
     * 请问服务器，返回用于列表视图的完整数据（例如中文名称）
     * @param {Object} _data
     * @param {Object} _cb
     */
    obj._getFormatData = function (_data, _cb) {
        if (_data.length) {
            COM_TOOLS.ajaxFn({
                url: COM_DEFAULT._orgTreeOpt.getDataUrl,
                type: 'get',
                data: {
                    param: JSON.stringify(_data)
                },
                success: function (d) {
                    if (d && d.code == 1) {
                        _cb(d.data);
                    }
                }
            });
        }
    }
    /**
     * 构造选择结果框，并展示
     * @param {Object} $sel_dataInput JQ选择器；存储初始化数据的textare对象
     * @return 初始化列表展示容器的JQ对象
     */
    obj._initSelBox = function ($sel_dataInput) {
        var $wrap = $();
        if ($sel_dataInput.length) {
            $wrap = obj._makeSelWrap();
            $sel_dataInput.before($wrap).addClass('hidden');
            var data_ = JSON.parse($.trim($sel_dataInput.val()) || "[]");
            obj._getFormatData(data_, function (d) {
                obj._updateSelItem(d, $wrap);
            });
        }
        return $wrap;
    }
    return obj;
};;
///<jscompress sourcefile="orgModel.js" />
/**
 * 自定义组织架构组件
 * @param {String} editbtn_selector 必填 编辑按钮选择器，用于打开组件；
 * @param {String} data_selector 必填 存放数据的textarea 对象
 * @param {Object} opt 配置项
 */
COM_TOOLS._model.orgModel =  function (editbtn_selector, data_selector, opt) {
    var $sel_dataInput = $.type(data_selector) == 'string' ? $('#' + data_selector) : data_selector;
    /* 编辑按钮 */
    var $edit_btn = $.type(editbtn_selector) == 'string' ? $('#' + editbtn_selector) : editbtn_selector;
    if ($edit_btn.length == 0 || $sel_dataInput.length == 0 || $edit_btn.data('orgmodel')) {
        return false;
    }
    var obj = COM_TOOLS._model._orgModel_(opt);

    var $wrap = obj._initSelBox($sel_dataInput);
    $edit_btn.click(function () {
        obj._openModel(JSON.parse($.trim($sel_dataInput.val()) || "[]"), function (arr, sArr) {
            obj._updateSelItem(sArr, $wrap);
            $sel_dataInput.val(JSON.stringify(arr));
        });
    });
    $edit_btn.data('orgmodel', 'inited');
};;
///<jscompress sourcefile="msg_fn.js" />
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
};;
///<jscompress sourcefile="msg_fn2.js" />
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
};;
///<jscompress sourcefile="panel.js" />
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
};;
///<jscompress sourcefile="set_i18n_fn.js" />
/**
 * 国际化资源配置模块(旧)
 * @param {String} cboxid 目标初始化容器 选择器 '#id'
 * @param {String} formid 源数据form选择器  '#id'
 * @param {String} formbtn 源数据form提交按钮选择器，多个使用集合选择器
 */
COM_TOOLS._model.set_i18n_fn = function (cboxid, geturl, seturl) {
    if (!cboxid || !geturl || !seturl) {
        return false;
    }
    var tabBoxHtml_ = '<div class="js-cus-tabmodel-box" id="js_cus_tabmodel_box">' +
        '<div class="cus-tabmodel-box">' +
        '<div class="tab-list-box js-tab-list-box">' +
        '<button class="roll-nav roll-left tab-roll-btn tab-left-btn btn-primary"><i class="fa fa-backward"></i></button>' +
        '<div class="tab-list-overflow">' +
        '<div class="tab-list-bar">' +
        '<ul class="nav nav-tabs tab-list-ul pull-left js-create-tab" role="tablist"></ul>' +
        '</div>' +
        '</div>' +
        '<button class="roll-nav roll-right tab-roll-btn tab-right-btn btn-primary"><i class="fa fa-forward"></i></button>' +
        '</div>' +
        '<div class="cus-tabmodel-btns">' +
        '<button class="btn btn-primary btn-sm js-cus-btn-save js-helpmsg" type="button" data-helpmsg="platform.plugin.com_msg.tab_this" data-helpdata="' + TEDU_MESSAGE.get("platform.plugin.com_btn.save") + '">' +
        '<i class="glyphicon glyphicon-floppy-disk"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.save') + '</button>' +
        '<button class="btn btn-warning btn-sm js-cus-btn-refresh" type="button"><i class="glyphicon glyphicon-refresh"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.fresh') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="tab-content cus-tabmodel-contbox js-create-content"></div>' +
        '</div>';
    $('#' + cboxid).html(tabBoxHtml_);
    var tabModel_ = $('#js_cus_tabmodel_box'),
        tabBox_ = tabModel_.find('.js-create-tab'),
        contBOx_ = tabModel_.find('.js-create-content');

    function _init() {
        COM_TOOLS.ajaxFn({
            url: geturl,
            type: 'GET',
            success: function (d) {
                if (d && $.type(d) == 'array') {
                    $.each(d, function (i, n) {
                        _createTabHtml(i, n);
                    });
                    _checkInput();
                }
            }
        }, 2, tabModel_.find('.js-cus-btn-refresh'));
    }

    _init();

    function _createTabHtml(index, data) {
        var str_ = data['pid'].replace(/\./g, '_');
        var tab_ = '<li role="presentation" class="' + (index == 0 ? 'active' : '') + '"><a href="#js_tab_' + str_ + '" role="tab" data-toggle="tab">' + data['name'] + '</a></li>';
        var cont_ = '<div role="tabpanel" class="tab-pane ' + (index == 0 ? 'active' : '') + '" id="js_tab_' + str_ + '" data-pid="' + data['pid'] + '">' + _Backfill(data['child']) + '</div>';
        tabBox_.append(tab_);
        contBOx_.append(cont_);
    }

    function _Backfill(data) {
        if ($.type(data) == 'array' && data.length > 0) {
            var arr = [];
            arr.push('<div class="form-horizontal">');
            $.each(data, function (j, m) {
                arr.push('<div class="form-group" data-dcode="', m.code, '">');
                arr.push('<label class="col-sm-2 col-md-offset-2 control-label">', (m.required == '1' ? '<span class="text-danger">*</span> ' : ''), m.name, '</label>');
                arr.push('<div class="col-sm-5"><input class="form-control input-sm js-input-val" type="text" value="', m.value, '" ', (m.required == '1' ? 'required="required"' : ''), '/></div>');
                arr.push('</div>');
            });
            arr.push('</div>');
            return arr.join('');
        } else {
            return '';
        }
    }

    function _checkInput() {
        contBOx_.find('input.js-input-val[required]').on('blur', function () {
            if ($.trim($(this).val()) == '') {
                COM_TOOLS._view.setInputStatus($(this), 'error');
            } else {
                COM_TOOLS._view.setInputStatus($(this), '');
            }
        });
    }

    tabModel_.find('.js-cus-btn-save').click(function () {
        var _that = $(this);
        COM_TOOLS.confirm(TEDU_MESSAGE.get('platform.plugin.com_msg.tab_separate'), function (in_) {
            layer.close(in_);
            var curPane_ = tabModel_.find('.js-create-content .tab-pane.active');
            var pid_ = curPane_.data('pid') || '';
            var item_ = curPane_.find('.form-group');
            var arr = [],
                look_ = false;
            item_.each(function () {
                var this_ = $(this),
                    input_ = this_.find('input.js-input-val');
                if (input_.prop('required') && $.trim(input_.val()) == '') {
                    look_ = true;
                }
                arr.push({
                    'cCode': this_.data('dcode'),
                    'lCode': pid_,
                    'name': $.trim(input_.val())
                });
            });
            if (!look_) {
                COM_TOOLS.ajaxFn({
                    url: seturl,
                    type: 'POST',
                    data: {
                        data: JSON.stringify(arr)
                    },
                    success: function (d) {
                        if (d.code == '1') {
                            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.success'));
                        } else if (d.code == '-2') { //必须含有简体中文
                            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.china_notnull'));
                        } else {
                            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
                        }
                    }
                }, 2, _that);
            } else {
                COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
            }
        });
    }).end().find('.js-cus-btn-refresh').click(function () {
        tabBox_.html('');
        contBOx_.html('');
        _init();
    });
    COM_TOOLS._view.tabScrollFn.init('#js_cus_tabmodel_box .js-tab-list-box');
};;
///<jscompress sourcefile="set_i18n_fn2.js" />
/**
 * 国际化资源配置模块(新)
 * @param {String} cboxid 目标初始化容器 选择器 '#id'
 * @param {String} formid 源数据form选择器  '#id'
 * @param {String} formbtn 源数据form提交按钮选择器，多个使用集合选择器
 */
COM_TOOLS._model.set_i18n_fn2 = function (cboxid, formid, formbtn) {
    if (!cboxid || !formid || !formbtn) {
        return false;
    }
    var geturl = COM_DEFAULT._modelI18nOpt.geturl,
        seturl = COM_DEFAULT._modelI18nOpt.seturl;
    if (!geturl || !seturl) {
        return false;
    }
    var tabBoxHtml_ = '<div class="js-cus-tabmodel-box" id="js_cus_tabmodel_box">' +
        '<div class="cus-tabmodel-box">' +
        '<div class="tab-list-box js-tab-list-box">' +
        '<button class="roll-nav roll-left tab-roll-btn tab-left-btn btn-primary"><i class="glyphicon glyphicon-backward"></i></button>' +
        '<div class="tab-list-overflow">' +
        '<div class="tab-list-bar">' +
        '<ul class="nav nav-tabs tab-list-ul pull-left js-create-tab" role="tablist"></ul>' +
        '</div>' +
        '</div>' +
        '<button class="roll-nav roll-right tab-roll-btn tab-right-btn btn-primary"><i class="glyphicon glyphicon-forward"></i></button>' +
        '</div>' +
        '<div class="cus-tabmodel-btns">' +
        '<button class="btn btn-primary btn-sm js-cus-btn-save js-helpmsg" type="button" data-helpmsg="platform.plugin.help.save_i18n" style="display:none;" >' +
        '<i class="glyphicon glyphicon-floppy-disk"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.save') + '</button>&nbsp;' +
        '<button class="btn btn-warning btn-sm js-cus-btn-refresh" type="button"><i class="glyphicon glyphicon-refresh"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.fresh') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="tab-content cus-tabmodel-contbox js-create-content"></div>' +
        '</div>';
    $(cboxid).html(tabBoxHtml_);
    var tabModel_ = $('#js_cus_tabmodel_box'),
        tabBox_ = tabModel_.find('.js-create-tab'),
        contBOx_ = tabModel_.find('.js-create-content');
    var form_ = $(formid);
    var formSaveBtn_ = $(formbtn);

    function _init() {
        var arr = [];
        form_.find('[js-i18n-key]:not([js-i18n-key=""])').each(function () {
            var $this = $(this),
                _thisCode = $.trim($this.attr('js-i18n-key')),
                _thisNewCode = _thisCode,
                _thisLabel = $this.attr('js-i18n-label'),
                _thisFix = _thisCode.match(/\{([\w\.]+)\}/);
            if (_thisFix && _thisFix.length > 1) {
                var _target = form_.find('[name="' + _thisFix[1] + '"]');
                if (_target.length > 0) { //不能匹配的资源不能设置国际化信息
                    var value = $.trim(_target.val());
                    if (value) {
                        _thisNewCode = _thisCode.replace(new RegExp("\\{" + _thisFix[1] + "\\}"), function () {
                            return value;
                        });
                    }
                    arr.push({
                        code: _thisNewCode,
                        oldcode: _thisCode,
                        label: _thisLabel
                    });
                    /* 注入validate校验规则 */
                    if (form_.data('validator')) { //validate 已初始化
                        var rulesObj = _target.rules() || {};
                        if (!('required' in rulesObj)) { //如果当前没有 number校验规则，则添加
                            _target.rules("add", {
                                'required': true,
                                'ck-i18n-key': true
                            });
                        }
                    } else {
                        if (!(_target.attr('required'))) {
                            _target.attr({
                                'required': 'required',
                                'ck-i18n-key': true
                            });
                        }
                    }
                }
            }

            if (COM_DEFAULT._debug === true) {
                console.error('asd');
            }
        });
        COM_TOOLS.ajaxFn({
            url: geturl,
            type: 'GET',
            data: {
                'data': JSON.stringify(arr)
            },
            success: function (d) {
                if (d && $.type(d) == 'array') {
                    $.each(d, function (i, n) {
                        _createTabHtml(n); //创建tab item项目
                        _addEventListener(n); //为tab-item 添加事件处理
                    });
                    contBOx_.find('input.js-input-val[required]').off('blur.i18n.check').on('blur.i18n.check', function () {
                        _checkInput($(this));
                    });
                }
            }
        }, 2, tabModel_.find('.js-cus-btn-refresh').add(formSaveBtn_));
    }

    _init();

    function _createTabHtml(data) {
        var index_ = tabBox_.children('li').length;
        var str_ = data['pid'].replace(/\./g, '_').replace(/[\{\}]/g, '');
        var tab_ = '<li role="presentation" class="' + (index_ == 0 ? 'active' : '') + '"><a href="#js_tab_' + str_ + '" role="tab" data-toggle="tab">' + data['name'] + '</a></li>';
        var cont_ = '<div role="tabpanel" class="tab-pane ' + (index_ == 0 ? 'active' : '') + '" id="js_tab_' + str_ + '" data-pid="' + data['pid'] + '">' + _Backfill(data['child'], data['oldpid']) + '</div>';
        tabBox_.append(tab_);
        contBOx_.append(cont_);
    }

    function _toLowerCase_key(str) { //除占位符外，强制换成为小写
        str = String(str || '');
        return str.toLowerCase().replace(/\{([\w\.-]+)\}/i, (str.match(/\{([\w\.-]+)\}/) || [])[0] || '');
    }

    function _addEventListener(data) { //资源名称与默认翻译语言联动
        var oldpid_ = _toLowerCase_key(data.oldpid);
        var target_ = contBOx_.find('[js-i18n-target="' + oldpid_ + '_' + COM_DEFAULT._language + '"]');
        var isedit_ = target_.data('i18n_isedit');
        target_.off('blur.i18n.evt focus.i18n.evt').on('focus.i18n.evt', function () {
            target_.data('cur_value', $.trim(target_.val()));
        }).on('blur.i18n.evt', function () {
            target_.data('cur_value') != $.trim(target_.val()) && target_.data('user_changed', true);
        });
        var _thisFix = oldpid_.match(/\{([\w\.]+)\}/);
        var _thisSelect = '';
        if (_thisFix && _thisFix.length > 1) { //自己 关联 自己时 解除和默认语言翻译的联动
            _thisSelect = '[name]:not([name="' + _thisFix[1] + '"])';
        }
        /*form_.find('[js-i18n-key="' + oldpid_ + '"]' + _thisSelect).off('keyup.i18n.evt').on('keyup.i18n.evt', function() {
            !(isedit_ || target_.data('user_changed')) && target_.val($(this).val());
        });*/
        form_.find('[js-i18n-key]').filter(function () {
            var that_ = $(this);
            return _toLowerCase_key(that_.attr('js-i18n-key')) == oldpid_ && (_thisSelect ? that_.is(_thisSelect) : true);
        }).off('keyup.i18n.evt').on('keyup.i18n.evt', function () {
            !(isedit_ || target_.data('user_changed')) && target_.val($(this).val());
        });
    }

    function _Backfill(data, oldpid) {
        if ($.type(data) == 'array' && data.length > 0) {
            var arr = [];
            arr.push('<form class="form-horizontal" novalidate="novalidate" onsubmit="return false;">');
            $.each(data, function (j, m) {
                arr.push('<div class="form-group" data-dcode="', m.code, '">');
                arr.push('<label class="col-sm-2 col-md-offset-2 control-label">', (m.required == '1' ? '<span class="text-danger">*</span> ' : ''), m.name, '</label>');
                arr.push('<div class="col-sm-5"><input class="form-control input-sm js-input-val" type="text" value="', m.value, '" ',
                    (m.required == '1' ? 'required="required"' : ''), 'js-i18n-target="', _toLowerCase_key(oldpid), '_', m.code, '" data-i18n_isedit="', (!!m.value), '" /></div>');
                arr.push('</div>');
            });
            arr.push('</form>');
            return arr.join('');
        } else {
            return '';
        }
    }

    function _checkInput(input) { //控制输入框状态
        if ($.trim(input.val()) == '') {
            COM_TOOLS._view.setInputStatus(input, 'error');
            return true;
        } else {
            COM_TOOLS._view.setInputStatus(input, '');
            return false;
        }
    }

    function _checkSaveBtn(shown) { //控制资源翻译模块的保存按钮显隐
        if (shown) {
            tabModel_.find('.js-cus-btn-save').show();
        } else {
            tabModel_.find('.js-cus-btn-save').hide();
        }
    }

    function _saveFn(shadeType, shadeOpt, callback) { //保存
        var arr = [],
            look_ = false,
            otherSaveBtn_ = false;
        if (shadeType == 2) {
            otherSaveBtn_ = !shadeOpt.is('.js-cus-btn-save') || false;
        }
        if (otherSaveBtn_) { //如果是外部提交按钮,则禁用并隐藏，然后克隆一个无事件的按钮，添加tips提示信息
            var clone_ = shadeOpt.clone().removeAttr('id').addClass('disabled');
            clone_.insertBefore(shadeOpt);
            shadeOpt.attr('must_disabled', true).prop('disabled', true).hide();
            clone_.addClass('js-helpmsg').data('helpmsg', 'platform.plugin.help.save_i18n_only');
        }

        contBOx_.find('.tab-pane').each(function () {
            var curPane_ = $(this);
            var pid_ = String(curPane_.data('pid') || '');
            var item_ = curPane_.find('.form-group');

            var thisFix_ = pid_.match(/\{([\w\.]+)\}/);
            if (thisFix_ && thisFix_.length > 1) { //提交前，转化key中的占位符
                var _target_obj = form_.find('[name="' + thisFix_[1] + '"]');
                if (_target_obj.length > 0) {
                    var value = $.trim(_target_obj.val());
                    if (value) {
                        pid_ = pid_.replace(new RegExp("\\{" + thisFix_[1] + "\\}"), function () {
                            return value;
                        });
                    }
                    otherSaveBtn_ && _target_obj.prop('readonly', true);
                }
            }
            if (!look_) {
                item_.each(function () {
                    var this_ = $(this),
                        input_ = this_.find('input.js-input-val');
                    if (input_.prop('required')) {
                        look_ = _checkInput(input_);
                    }
                    if (look_) {
                        tabBox_.find('a[href="#' + this_.closest('.tab-pane').attr('id') + '"]').tab('show');
                        return false;
                    }
                    arr.push({
                        'cCode': this_.data('dcode'),
                        'lCode': pid_,
                        'name': $.trim(input_.val())
                    });
                });
            }

        });
        if (!look_) {
            COM_TOOLS.ajaxFn({
                url: seturl,
                type: 'POST',
                data: {
                    data: JSON.stringify(arr)
                },
                success: function (d) {
                    if (d.code == '1') { //成功
                        cumCheckPwin(parent).COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.success'));
                        $.type(callback) == 'function' ? callback() : cumParentCallValue(); //如果不设置回调函数，则默认关闭窗口
                    } else if (d.code == '-2') { //必须含有简体中文
                        COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.china_notnull'));
                    } else { //操作失败
                        COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
                    }
                    _checkSaveBtn(true);
                },
                error: function () {
                    _checkSaveBtn(true);
                    COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
                }
            }, shadeType, shadeOpt);
        } else {
            _checkSaveBtn(true);
            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
        }
    }

    tabModel_.find('.js-cus-btn-save').click(function () {
        _saveFn(2, $(this));
    }).end().find('.js-cus-btn-refresh').click(function () {
        tabBox_.html('');
        contBOx_.html('');
        _init();
    });
    COM_TOOLS._view.tabScrollFn.init('#js_cus_tabmodel_box .js-tab-list-box');
    return {
        save: function (callback) {
            _saveFn(2, formSaveBtn_, callback);
        }
    };
};;
///<jscompress sourcefile="defaultConfig.js" />
/*
 * 通用配置信息
 * 需要依赖COM_TOOLS
 */
var COM_DEFAULT = {
    /* --功能配置start-- */
    /*是否开启调试模式*/
    "_debug": false,
    /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
    "_customMenus": 6,
    /*控制主页tab标签打开个数,必须为数字*/
    "_tabSingle": 3,
    /* contextPath webxml项目包名、路径 */
    "_contextPath": "",
    /* 系统默认标签主页地址 */
    "_tabHomePage": "index_default.html", //废弃 2018-8-15
    /* 系统默认404页面地址 */
    "_404Page": "404.html",
    /* 系统默认帮助页面地址 */
    "_helpPage": "help.html",
    /* 当前版本默认语言 */
    "_language": "zh-CN", //禁止修改，改了也不生效！！！ O(∩_∩)O ！！！
    /* 是否开启帮助信息 */
    "_isOpenHelpMsg": {
        "helpBtn": true, //帮助按钮
        "helpMsgTips": true, //提示信息tips
        "helpMsgDefVal": true //提示信息text-placeholder
    },
    /* 公告信息 */
    "_isOpenNotice": {
        "geturl": "", //获取数据接口地址
        "seturl": "", //发送数据接口地址
        "infoPageUrl": "help.html", //详情页地址
        "infoListUrl": "", //消息列表页地址
        "isDisplay": false, //控制是否显示公告
        "delayTime": 5, //控制弹出时长 单位:s
        "requestTime": 300, //控制每次请求的时长 单位:s; 不能小于10；
        "isNew": true //是否采用新版系统消息 【A: 3.9.3,兼容旧版本】
    },
    /* 自定义模块——国际化模块 */
    "_modelI18nOpt": {
        "geturl": "", //获取数据接口地址
        "seturl": "" //发送数据接口地址
    },
    /*是否启用开关控制tab导航条显隐*/
    "_isOpenSwitch": true,
    /* --功能配置end-- */
    /* --组件配置start（谨慎修改）-- */
    /* 数据表格默认配置 */
    "_dataTableOpt": {
        "scrollX": true, //可选是否显示水平滚动条；默认false;
        "paging": true, //是否显示分页组件
        "pageLength": 11, //每页显示条数；
        "lengthChange": false, //是否允许用户改变表格每页显示的记录数，显示条数组件
        "ordering": false, //是否启用排序组件，优先级高于columns中的排序控制；
        "searching": false, //是否启用自带搜索组件;
        "serverSide": true, //服务器模式，排序、搜索、分页均在服务器端实现
        "processing": true //显示加载中，serverSide=true时生效
    },
    /* 日历默认配置 */
    "_dateTimePickerOpt": {
        "minView": 2, //只能选择到天
        //"format": "yyyy-mm-dd", //默认
        "todayBtn": true, //显示今日按钮
        "autoclose": true,
        "pickerPosition": "bottom-left",
        "clearBtn": true,
        "forceParse": false //当选择器关闭的时候，是否强制解析输入框中的值
    },
    /* 日历默认配置 */
    "_dateRangePickerOpt": {
        opens: 'left',
        singleDatePicker: true, //仅显示一个日历，而不是并排的两个；
        showDropdowns: false, //显示年份和月份选择列表
        minYear: new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getFullYear(), //最小年份，对应showDropdowns
        maxYear: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).getFullYear(), //最大年份，对应showDropdowns
        timePicker: false, // 设为true, 启用时间视图,但自动填写将无效;
        timePickerIncrement: 5, //分钟选择列表的增量(0~30)
        timePicker24Hour: true, //使用24小时而不是12小时
        autoUpdateInput: false, //指示日期范围选择器是否应<input>在初始化时以及所选日期更改时自动更新其附加元素的值。
        linkedCalendars: true //是否开启双表联动,
    },
    /* 树型组件默认配置 */
    "_jsTreeOpt": {
        "root": "0" //树形组件根节点ID，谨慎修改；注意历史数据的影响；
    },
    /* 文件服务相关配置 */
    "_fileServeOpt": {
        "fileUploadUrl": "", //文件上传接口
        "defaultFileSize": 40 * 1024, // 一般文件允许上传的大小，单位：kb
        "imgFileSize": 10 * 1024, // 图片文件允许上传的大小，单位：kb
        "fileType": ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf", "jpg", "jpeg", "png", "gif", "rar", "zip"], // 文件类型
        "imgType": ["jpg", "jpeg", "png", "gif"] // 支持预览的文件类型
    },
    /* 通讯录组件 */
    "_orgTreeOpt": {
        "treeUrl": "", //组织树接口地址
        "searchUrl": "", //搜索接口地址
        "getDataUrl": "" //根据id与id类型获取资源信息
    },
    /* 强制退出系统配置 */
    "_forcedExit": {
        "time": "-1", // -1：无限制；按本次登录持续时长执行,范围[1-24]，数值型，前后包含；按指定时间执行,格式 (01:05),24小时制字符串，凌晨1点05分；
        "ajaxForm": false //是否全局监听ajax请求是否会话超时,并强制跳转到登录页面;
    }
    /* --组件配置end-- */
};
;
///<jscompress sourcefile="init.js" />
/*
 * 全局初始化，放在最后执行；
 */
(function () {
    /* 应用外部配置信息 */
    if (window.cus_default_ && $.type(window.cus_default_) == 'object') {
        $.extend(true, COM_DEFAULT, window.cus_default_);
        if (COM_TOOLS.localStorageSupport()) {
            COM_TOOLS.save_toLocal('cus_default', window.cus_default_);
            //console.log('#save_toLocal-', window.cus_default_);
        }
    } else {
        if (COM_TOOLS.localStorageSupport()) {
            var opt_ = {},
                strOpt_ = COM_TOOLS.get_fromLocal('cus_default');
            //console.log('#get_fromLocal-', strOpt_);
            if (strOpt_) {
                try {
                    opt_ = $.parseJSON(strOpt_);
                } catch (e) {
                    console.error('修改默认配置参数出错！');
                }
                $.extend(true, COM_DEFAULT, opt_);
            }
        }
    }
    /* 全局监听会话状态,会话过期强制跳转到登录页(注意这里要配合登录页的防嵌套使用,否则请改成top.location形式) */
    $.ajaxSetup({
        dataFilter: function (data, type) {
            COM_TOOLS._ajax_jumpToLogin(data);
            return data;
        }
    });
})();

/* 初始化全局组件配置 */
COM_TOOLS.initjSDefaultOpt('ALL');

$(function () {
    /* 帮助按钮交互方法 */
    COM_DEFAULT._isOpenHelpMsg['helpBtn'] && $(document).on('click', '.js-helpbtn', function (e) {
        var this_ = $(this),
            selt = this_.data('helpbtn');
        if (this_.is('#js_cushelpbtn')) {
            selt = '#' + ($('#t_tabBox > li.active > a').data('itemid') || '');
        }
        if (selt) {
            this_.attr({
                'href': /^#\w+/.test(selt) ? COM_DEFAULT._helpPage + selt.replace(/^#{1}/, '#help_') : selt,
                'target': 'cushelppage'
            });
        } else {
            return false;
        }
        e.stopPropagation();
    });
    /* 自定义提示信息，使用方法 将需要添加提示信息的元素 class中 加入”js-helpmsg“，然后设置 data-helpmsg="msgkey"； msgkey = TEDU_MESSAGE[key]; */
    COM_DEFAULT._isOpenHelpMsg['helpMsgTips'] && $(document).delayPopover({
        selector: '.js-helpmsg[data-titlemsg="true"],.js-helpmsg:not(:text)',
        placement: 'auto',
        trigger: 'hover',
        html: true,
        container: 'body',
        content: function () {
            var param_ = $(this).data('helpdata');
            param_ = param_ ? param_.toString().split(',') : [];
            return TEDU_MESSAGE.get($(this).data('helpmsg'), param_);
        }
    });
    /* 初始化input 默认提示信息（defaultValueMsg） */
    COM_TOOLS.fnInitInputHelpVal();
});;
