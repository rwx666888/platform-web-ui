/*
 * Last modified time :2017-09-29
 */
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
    var partOBJ_ = partOBJ || window;
    var param = {
        /* ['90%', '80%'] or ['500px', '300px'] */
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
         *  "btnStyleArr": []// 自定义弹窗按钮组样式类 默认：无； ['class01','class02']
         * }
         */
        "other": {},
        /* 弹窗成功后的回调  function(layero,ind_){}*/
        "success": null
    }
    if(typeof opt !== "undefined") {
        $.extend(param, opt);
    }
    if(param['type'] == 2) {
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
        zIndex: partOBJ_.layer.zIndex,
        success: function(layero, ind_) {
            //partOBJ_.layer.setTop(layero);
            if(param['type'] == 2) {
                var iWin_ = partOBJ_[layero.find('iframe')[0]['name']]; //返回目标window对象,window.fun()
                if(param['callid']) {
                    iWin_.cum_ModalValobj = param['callid'];
                }
                if(!$.isEmptyObject(param['callback']) && $.type(param['callback']) == 'object') {
                    if(!param['callid']) { //对历史代码的兼容补丁
                        iWin_.cum_ModalValobj = 'no_nodeid';
                    }
                    iWin_.COM_TOOLS.cache_obj._ptWinFnNames = param['callback'];
                }
                if(window.name && (window.name != 'welPiframe' && window.name.indexOf('mainPiframe') != 0)) {
                    var index = partOBJ_.layer.getFrameIndex(window.name); //触发新弹窗的“弹窗页面索引”
                    if(index) {
                        iWin_.cum_Modalindex_ = index;
                    }
                } else {
                    iWin_.cum_Modalindex_ = -1;
                }
            }
            $.isFunction(param['success']) && param['success'](layero, ind_);
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
    var index = parent.layer.getFrameIndex(window.name);
    if(typeof(cb) === "function") {
        cb();
    }
    cumCloseWin(index, noTriEnd_, parent);
}
/**
 * @description 关闭指定的弹窗
 * @param {Number} index 需关闭的弹窗的index
 * @param {Boolean} noTriEnd_ 是否阻止触发END回调方法；true
 */
function cumCloseWin(index, noTriEnd_, partOBJ) {
    (partOBJ || window).layer.close(index, noTriEnd_);
}
/**
 * @description 获取并返回上一个目标弹窗的 window对象(只限在弹窗中打开的新弹窗中调用)
 * @param {Object} 窗口对象 parent || top || window(self)
 */
function cumGetParentWinGlobel(partOBJ) {
    if(cum_Modalindex_ > 0) {
        return(partOBJ || parent).window["layui-layer-iframe" + cum_Modalindex_];
    } else if((partOBJ || parent) == top && top.$('.js-iframe-comwin').length > 0) {
        return top.window[top.$('.js-iframe-comwin:visible').attr('name')];
    } else {
        return(partOBJ || parent);
    }
}
/**
 * @description 获取并返回上一个目标弹窗的 body对象(只限在弹窗中打开的新弹窗中调用)
 * @param {Object} 窗口对象 parent || top || window(self)
 */
function cumGetParentBodyGlobel(partOBJ) {
    if(cum_Modalindex_ > 0) {
        return(partOBJ || parent).layer.getChildFrame('body', cum_Modalindex_);
    } else if((partOBJ || parent) == top && top.$('.js-iframe-comwin').length > 0) {
        return top.window[top.$('.js-iframe-comwin:visible').attr('name')].document.body;
    } else {
        return(partOBJ || parent).document.body;
    }
}

/**
 * 重构 dataTable ajax-data
 * @param d dataTable原数据对象
 * @param p（obj=>{name:value,name1:value1}） 用户自定义的数据对象, p中不能包含DT 的保留字段 draw、pageSize、start等，将被DT覆盖处理；
 */
function cus_dt_ajaxdata(d, p) {
    var cd_ = {};
    cd_["draw"] = d.draw;
    cd_["pageSize"] = d.length;
    cd_["start"] = d.start;
    if(!$.isEmptyObject(p)) {
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
    $.each(objs, function(i, obj) {
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
        success: function(data, status) {
            if(data.result == 1) {
                select_add(selectId, data[listName], optionValue, optionText);
            } else {
                COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noData"]);
            }
        },
        error: function() {
            COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.networkError"]);
        }
    });
}

$(function() {
    COM_TOOLS._isOpenHelpMsg['helpBtn'] && $(document).on('click', '.js-helpbtn', function(e) {
        var this_ = $(this),
            selt = this_.data('helpbtn');
        if(this_.is('[id="js_cushelpbtn"]')) {
            selt = '#' + ($.hash().get('pathid') || '');
        }
        if(selt) {
            this_.attr({
                'href': selt.substr(0, 1) == '#' ? COM_TOOLS['_helpPage'] + selt : selt,
                'target': 'cushelppage'
            });
        } else {
            return false;
        }
        e.stopPropagation();
    });
    //自定义提示信息，使用方法 将需要添加提示信息的元素 class中 加入”js-helpmsg“，然后设置 data-helpmsg="msgkey"； msgkey = TEDU_MESSAGE[key];
    COM_TOOLS._isOpenHelpMsg['helpMsgTips'] && $(document).popover({
        selector: '.js-helpmsg[data-titlemsg="true"],.js-helpmsg:not(:text)',
        placement: 'auto',
        trigger: 'hover',
        container: 'body',
        content: function() {
            var param_ = $(this).data('helpdata');
            param_ = param_ ? param_.toString().split(',') : [];
            return TEDU_MESSAGE.get($(this).data('helpmsg'), param_);
        }
    });
});

/* 消息组件 */
var TEDU_MESSAGE = function() {
    var _obj = {};
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
            return LOCAL_MESSAGE_DATA[key] ? (_obj.format(LOCAL_MESSAGE_DATA[key], params) || '') : '';
        }
        return '';
    };
    return _obj;
}();

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
                        return LOCAL_MESSAGE_DATA[_lang_ + "errorLoading"]
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
                }
            }), {
                define: e.define,
                require: e.require
            }
        }
    },
    _datetimepicker: function() {
        var _lang_ = "platform.plugin.datetimepicker.";
        return {
            "zh-CN": {
                days: [LOCAL_MESSAGE_DATA[_lang_ + "sunday"], LOCAL_MESSAGE_DATA[_lang_ + "monday"], LOCAL_MESSAGE_DATA[_lang_ + "tuesday"], LOCAL_MESSAGE_DATA[_lang_ + "wednesday"], LOCAL_MESSAGE_DATA[_lang_ + "thursday"], LOCAL_MESSAGE_DATA[_lang_ + "friday"], LOCAL_MESSAGE_DATA[_lang_ + "saturday"], LOCAL_MESSAGE_DATA[_lang_ + "sunday"]],
                daysShort: [LOCAL_MESSAGE_DATA[_lang_ + "sun"], LOCAL_MESSAGE_DATA[_lang_ + "mon"], LOCAL_MESSAGE_DATA[_lang_ + "tue"], LOCAL_MESSAGE_DATA[_lang_ + "wed"], LOCAL_MESSAGE_DATA[_lang_ + "thu"], LOCAL_MESSAGE_DATA[_lang_ + "fri"], LOCAL_MESSAGE_DATA[_lang_ + "sat"], LOCAL_MESSAGE_DATA[_lang_ + "sun"]],
                daysMin: [LOCAL_MESSAGE_DATA[_lang_ + "s"], LOCAL_MESSAGE_DATA[_lang_ + "m"], LOCAL_MESSAGE_DATA[_lang_ + "t"], LOCAL_MESSAGE_DATA[_lang_ + "w"], LOCAL_MESSAGE_DATA[_lang_ + "th"], LOCAL_MESSAGE_DATA[_lang_ + "f"], LOCAL_MESSAGE_DATA[_lang_ + "sa"], LOCAL_MESSAGE_DATA[_lang_ + "s"]],
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

/* 自定义插件 */
var CUS_PLUGINS = {
    _DT_: { //datatable插件
        "pager.simple_numbers_no_totalpage": function(page, pages) { //分页插件，无总页数
            var numbers = [];
            var buttons = $.fn.DataTable.ext.pager.numbers_length;
            var half = Math.floor(buttons / 2);
            var _range = function(len, start) {
                var end;
                if(typeof start === "undefined") {
                    start = 0;
                    end = len;
                } else {
                    end = start;
                    start = len;
                }
                var out = [];
                for(var i = start; i < end; i++) {
                    out.push(i);
                }
                return out;
            };
            if(pages <= buttons) {
                numbers = _range(0, pages);
            } else if(page <= half) {
                numbers = _range(0, buttons - 1);
                numbers.push('ellipsis');
            } else if(page >= pages - 1 - half) {
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
            return ['previous', numbers, 'next'];
        },
        init: function() {
            $.fn.DataTable.ext.pager['simple_numbers_no_totalpage'] = this['pager.simple_numbers_no_totalpage'];
        }
    },
    _VALID_: { // 自定义表单验证插件validation与tooltip
        applyTooltipOptions: function(element, tipsOpt) { //获取 tooltip 配置信息
            var defaults = $.fn.tooltip.Constructor.DEFAULTS;
            var options = { /* tooltip 配置属性 */
                animation: element.data('animation') || defaults.animation,
                html: element.data('html') || defaults.html,
                placement: element.data('placement') || defaults.placement,
                selector: element.data('selector') || defaults.selector,
                trigger: $.trim('manual ' + (element.data('trigger') || '')),
                delay: element.data('delay') || defaults.delay,
                container: element.data('container') || defaults.container,
                template: '<div class="tooltip cus-tooltip-error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            };
            /* 初始化validator 时 使用额外属性 tooltip_options对指定元素（elementName）添加 tooltip配置 */
            if(tipsOpt && tipsOpt[element.attr('name')]) {
                $.extend(options, tipsOpt[element.attr('name')]);
            }
            return options;
        },
        init: function() {
            var _this = this;
            $.validator.setDefaults({
                normalizer: function(value) {
                    return $.trim(value);
                },
                success: function(label, element) {
                    $(element).tooltip('destroy');
                    //console.log('success',element)
                },
                errorPlacement: function(error, element) {
                    var _ele = $(element),
                        _opt = _this.applyTooltipOptions(_ele, this['tooltip_options']);
                    _opt['title'] = _opt['html'] ? error.html() : error.text();
                    if(_ele.data('bs.tooltip') !== undefined) {
                        _ele.data('bs.tooltip').options.title = _opt['title'];
                    } else {
                        _ele.tooltip(_opt);
                    }
                    //_ele.attr('data-original-title',error.text());
                    _ele.tooltip('show');
                    //console.log('errorPlacement',element)
                },
                //unhighlight:function(element, errorClass, validClass){console.log('unhighlight',element)},
                //highlight:function(element, errorClass, validClass){console.log('highlight',element)}
            });
        }
    }
};

/* 通用工具及配置 start 2016-12-06 lianglei */
var COM_TOOLS = {
    /* ### option start ### */
    /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
    _customMenus: 6,
    /*控制主页tab标签打开个数，最少两个,必须为数字*/
    _tabSingle: 3,
    /* contentPath webxml项目包名、路径 */
    _webPath: '/',
    /* 系统默认标签主页地址 */
    _tabHomePage: 'index_default.html',
    /* 系统默认404页面地址 */
    _404Page: '404page.html',
    /* 系统默认帮助页面地址 */
    _helpPage: 'help.html',
    /* 当前版本默认语言 */
    _language: 'zh-CN',
    /* 按钮鉴权 鉴权：true; 不鉴权：false */
    _isCheckBtn: false,
    /* 是否开启帮助信息 */
    _isOpenHelpMsg: {
        helpBtn: true, //帮助按钮
        helpMsgTips: true, //提示信息tips
        helpMsgDefVal: true //提示信息text-placeholder
    },
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
            js: 'plugins/validate/jquery.validate.min.js',
            css: ''
        },
        //validator_tooltip:'plugins/validate/jquery-validate.bootstrap-tooltip.min.js',
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
        }
    },
    initjSDefaultOpt: function(jsArr, noInitInp) {
        if(!jsArr) {
            return false;
        }
        /* 数据表格datatable默认配置信息（不建议修改） */
        (jsArr == 'ALL' || $.inArray('DTmain', jsArr) !== -1) && $.fn.dataTable && (CUS_PLUGINS['_DT_'].init(), $.extend($.fn.dataTable.defaults, {
            scrollX: true, //可选是否显示水平滚动条；默认false;
            paging: true, //是否显示分页组件
            pageLength: 11, //每页显示条数；
            lengthChange: false, //是否允许用户改变表格每页显示的记录数，显示条数组件
            ordering: false, //是否启用排序组件，优先级高于columns中的排序控制；
            searching: false, //是否启用自带搜索组件;
            serverSide: true, //服务器模式，排序、搜索、分页均在服务器端实现
            processing: true, //显示加载中，serverSide=true时生效
            language: TEDU_LANGUAGE['_dataTable'][COM_TOOLS['_language']],
            fnPreDrawCallback: function(settings) { //表格重绘后取消全选框选中状态
                $(settings.nTHead).find('.cus-checkbox-all').removeClass('cus-checked');
            }
        }));
        /*修改jstree默认跟节点id,必须为字符串类型*/
        (jsArr == 'ALL' || $.inArray('jstree', jsArr) !== -1) && $.jstree && (COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'jstree'), $.jstree.root = "0");
        /*修改validate中文*/
        (jsArr == 'ALL' || $.inArray('validator', jsArr) !== -1) && $.validator && (CUS_PLUGINS['_VALID_'].init(), $.extend($.validator.messages, TEDU_LANGUAGE['_validate']()[COM_TOOLS['_language']]), COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'validator'));
        /*修改datetimepicker默认配置*/
        (jsArr == 'ALL' || $.inArray('datetimepicker', jsArr) !== -1) && $.fn.datetimepicker && (COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'datetimepicker'), $.fn.datetimepicker.dates['cus-lang'] = TEDU_LANGUAGE['_datetimepicker'][COM_TOOLS['_language']], $.fn.datetimepicker.defaults = {
            language: 'cus-lang', //语言，禁止修改
            minView: 2, //只能选择到天
            //format: "yyyy-mm-dd",	//默认
            todayBtn: true, //显示今日按钮
            autoclose: true,
            pickerPosition: 'bottom-left',
            clearBtn: true,
            forceParse: false //当选择器关闭的时候，是否强制解析输入框中的值
        });
        /*修改select2中文*/
        (jsArr == 'ALL' || $.inArray('select2', jsArr) !== -1) && $.fn.select2 && (TEDU_LANGUAGE['_select2'](), $.fn.select2.defaults.set('language', COM_TOOLS['_language']), $.fn.select2.defaults.set('width', 'style'), COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'select2'));
        /*初始化input 默认提示信息（defaultValueMsg）*/
        !noInitInp && COM_TOOLS.fnInitInputHelpVal();
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
        _ptWinFnList: {}
    },
    /* 项目当前文件（JS）目录路径 http://domain/contentPath/js/ */
    _jsPath: function() {
        var e = document.scripts,
            t = e[e.length - 1],
            i = t.src;
        return i.substring(0, i.lastIndexOf("/") + 1);
    }(),
    /* 检验是否支持本地持久化存储 */
    localStorageSupport: function() {
        return(('localStorage' in window) && window['localStorage'] !== null)
    },
    /* 存储持久化数据至本地 */
    save_toLocal: function(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    },
    /* 获取本地指定的持久化数据 */
    get_fromLocal: function(key) {
        return localStorage.getItem(key);
    },
    /* 检验是否支持本地session存储 */
    sessionStorageSupport: function() {
        return(('sessionStorage' in window) && window['sessionStorage'] !== null)
    },
    /* 存储session至本地 */
    save_toSession: function(key, obj) {
        sessionStorage.setItem(key, JSON.stringify(obj));
    },
    /* 获取本地指定数据 的session数据 */
    get_fromSession: function(key) {
        return sessionStorage.getItem(key);
    },
    /*获取URL参数值*/
    requestParam: function(strName) {
        var strHref = location.search;
        var intPos = strHref.indexOf('?');
        if(intPos === -1) {
            return '';
        }
        var strRight = strHref.substr(intPos + 1);
        var arrTmp = strRight.split('&');
        for(var i = 0; i < arrTmp.length; i++) {
            var arrTemp = arrTmp[i].split('=');
            if(arrTemp[0].toUpperCase() == strName.toUpperCase()) {
                if(i === arrTmp.length - 1) {
                    var sIndex = arrTemp[1].indexOf('#');
                    if(sIndex !== -1) {
                        arrTemp[1] = arrTemp[1].substring(0, sIndex);
                    }
                }
                return arrTemp[1];
            }
        }
        return '';
    },
    /* 表单元素序列化为 object 可用于dt-ajax 提交 */
    serializeObject: function(form) {
        var o = {},
            f_ = $(form).serializeArray();
        $.each(f_, function(i, n) {
            if(o[n['name']]) {
                o[n['name']] = o[n['name']] + "," + $.trim(n['value']);
            } else {
                o[n['name']] = $.trim(n['value']);
            }
        });
        return o;
    },
    /*获取随机数 @param len 随机数位数*/
    get_random_fun: function(len) {
        var s_ = '';
        for(var i = 0; i < len; i++) {
            s_ += Math.floor(Math.random() * 10);
        }
        return s_;
    },
    /* 校验是否是休息日  return 是：true 
     * @param sday_:日期 2016-10-10
     * 依赖组件 moment.js，工作日优先原则（同一日期即是休息日又是工作日，判定为工作日）
     * */
    is_playerDay: function(sday_) {
        var cday_ = moment(sday_).day();
        return((cday_ == 0 || cday_ == 6 || $.inArray(sday_, COM_TOOLS._data.PLAYDAYS_) != -1) && $.inArray(sday_, COM_TOOLS._data.WEEKDAYS_) == -1)
    },
    /**
     * 检验时间  ,获取下一个工作日
     * @param sday_待检测的时间 
     * return YYYY-MM-DD
     * 依赖组件 moment.js
     * */
    get_nextWeekDay: function(sday_) {
        if(COM_TOOLS.is_playerDay(sday_)) {
            sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD');
            return arguments.callee(sday_);
        } else {
            return moment(sday_).format('YYYY-MM-DD');
        }
    },
    /**
     * 初始化数据表格（服务器模式）
     * @param {String} domid 数据表格ID
     * @param {Object} columns 数据表格列配置项
     * @param {String} url 数据接口地址
     * @param {String} ajaxtype = [get|post] 请求类型，默认get
     * @param {Object} data 发送给后台的额外数据,不可使用保留字(pageSize、start、draw);
     * @param {Object} opt 数据表格扩展配置对象
     * @example opt
     *  jsInitComplete : fn(settings, json) 初始化结束后的回调函数 
     *  jsDrawCallback : fn(settings) 表格每次重绘回调函数
     *  selectStyle : string 选中模式： 'mutil'为多选，默认'os'(操作系统风格选择);single:只能选择一个项目; API:禁止用户选择；
     *  jsTrDblclick ：fn（curTrData,curTrJqNode）  表格行(tr)双击回调函数
     *  other : object datatable原生配置项目
     * @return {Object} 实例对象
     * @example 
     *  API:table datatable原生实例对象
     *  API:setAjaxData fn(d, noreload)  设置搜索数据并刷新表格； d:搜索数据;noreload:默认：false, 如果为true:则不刷新表格
     *  API:getAjaxData fn() 获取当前搜索数据
     *  API:getSelectRowsData fn() 获取选中行的指定列的数据
     */
    DT_init: function(domid, columns, url, ajaxtype, data, opt) {
        var _obj = {};
        var _ajaxdata = $.type(data) == "object" ? data : {};
        opt = $.type(opt) == "object" ? opt : {};
        opt['other'] = $.type(opt['other']) == "object" ? opt['other'] : {};
        var _table = $('#' + domid).DataTable($.extend(true, {
            columns: columns,
            initComplete: function(settings, json) {
                var _that = this.api();
                if(settings._select && settings._select.style == 'mutil') { //全选、反选
                    $(settings.nTHead).on('click', '.cus-checkbox-all', function() {
                        if($(this).hasClass('cus-checked')) {
                            $(this).removeClass('cus-checked');
                            _that.rows().deselect();
                        } else {
                            $(this).addClass('cus-checked');
                            _that.rows().select();
                        }
                    });
                    _that.on('select.dt deselect.dt', function(e, dt, type, indexes) { //全选、反选联动
                        $(settings.nTHead).find('.cus-checkbox-all').toggleClass('cus-checked', dt.rows({
                            selected: true
                        }).count() == dt.rows().count());
                    });
                }
                if($.isFunction(opt['jsTrDblclick'])) {
                    $(settings.nTBody).on('dblclick', 'tr', function() {
                        opt['jsTrDblclick'](COM_TOOLS.DT_getRowsSourceData(_that, this)[0], $(this));
                    }).on('dblclick', '.select-checkbox', function() {
                        return false;
                    });
                }
                if($.isFunction(opt['jsInitComplete'])) {
                    opt['jsInitComplete'](settings, json);
                }
            },
            drawCallback: function(settings) {
                //TODO 根据场景判断是否需要调用自适应高度控件
                //resizeIframeHeight();
                if($.isFunction(opt['jsDrawCallback'])) {
                    opt['jsDrawCallback'](settings);
                }
            },
            select: {
                style: opt['selectStyle'] || 'mutil',
                info: false
            },
            ajax: {
                "url": url, //接口地址
                "type": ajaxtype || 'get',
                "dataSrc": function(dd) {
                    if(dd && dd.isFilterTag == 0) { //无权限,构造空数据
                        dd.recordsTotal = 0;
                        dd.recordsFiltered = 0;
                        return [];
                    }
                    return dd.data;
                },
                "data": function(d) {
                    return cus_dt_ajaxdata(d, _ajaxdata);
                }
            },
        }, opt['other']));
        _obj.table = _table;
        /**
         * 设置搜索数据并刷新表格
         * @param {Object} d 搜索数据
         * @param {Object} noreload 默认：false, 如果为true:则不刷新表格
         */
        _obj.setAjaxData = function(d, noreload) {
            if($.type(d) == "object") {
                _ajaxdata = d;
                if(!noreload) {
                    COM_TOOLS.DT_ajaxReload(_table);
                }
            }
        };
        _obj.getAjaxData = function() { //获取当前搜索数据
            return _ajaxdata;
        };
        _obj.getSelectRowsData = function(name) { //获取选中行的指定列的数据
            return COM_TOOLS.DT_getSelectRowsSourceData(_table, name);
        };
        return _obj;
    },
    /** 
     * @description datatable获取选中行的id数组(多选) 依赖 datatable 及 dt-select
     * @param {Object} dt (new datatable)实例对象
     * @return {Array} 选中节点ID数组
     * */
    DT_getSelectRows: function(dt) {
        return COM_TOOLS.DT_getSelectRowsData(dt, 'itemid');
    },
    /** 
     * @description datatable获取选中行的数据(多选) 依赖 datatable 及 dt-select
     * @param {Object} dt (new datatable)实例对象
     * @param {String} name 选填，需要获取的字段名称，为空返回整个data对象（全部绑定的数据）； 
     * @return {Array} 选中行绑定的数据数组
     * */
    DT_getSelectRowsData: function(dt, name) {
        var data_ = [];
        if($.type(name) === "string") {
            dt.rows('.selected').nodes().to$().each(function() {
                data_.push($(this).data(name));
            });
        } else {
            dt.rows('.selected').nodes().to$().each(function() {
                data_.push($(this).data());
            });
        }
        return data_;
    },
    /** 
     * @description datatable获取指定行的底层数据（服务器直接返回的数据ajaxJSON，及通过api.data实时设置的数据；非绑定数据）
     * @param {Object} dt (new datatable)实例对象
     * @param {String} name 选填，需要获取的字段名称，为空返回整个data对象（全部绑定的数据）； 
     * @param {Boolean}	isall=[false|true] 可选，是否获取所有行的数据（忽略是否选中）；true:全部；false或缺省为 只计算选中行；
     * @return {Array} 数据数组
     * */
    DT_getSelectRowsSourceData: function(dt, name, isall) {
        /*var data_ = [];
        if($.type(name) === "string") {
            dt.rows((isall === true ? '' : '.selected')).every(function() {
                data_.push(this.data()[name]);
            });
        } else {
            dt.rows((isall === true ? '' : '.selected')).every(function() {
                data_.push(this.data());
            });
        }
        return data_;*/
        return COM_TOOLS.DT_getRowsSourceData(dt, (isall === true ? '' : '.selected'), name);
    },
    /**
     * 
     * @param {Object} dt (new datatable)实例对象
     * @param {Object} selector 行选择器，指定需要获取哪些行的数据
     * @param {Object} name 选填，需要获取的字段名称，为空返回整行数据； 
     */
    DT_getRowsSourceData: function(dt, selector, name) {
        var data_ = [];
        if($.type(name) === "string") {
            dt.rows(selector || '').every(function() {
                data_.push(this.data()[name]);
            });
        } else {
            dt.rows(selector || '').every(function() {
                data_.push(this.data());
            });
        }
        return data_;
    },
    /**
     * @description datatable 获取指定列的汇总和（必须数值型）
     * @param {Object} dt (new datatable)实例对象
     * @param {Array} selector DT列选择器，支持class、elementName:name、索引；
     * @param {Object} setFooter 是否在表格页脚输出结果
     */
    DT_getColumnSum: function(dt, selector, setFooter) {
        var sumObj = [];
        dt.columns(selector).every(function(index) {
            var sum = this.data().reduce(function(a, b) {
                return COM_TOOLS.fnFloatSum(a, b);
            }, 0);
            if(setFooter) {
                $(this.footer()).html(sum);
            }
            var o_ = {};
            o_[dt.column(index).dataSrc()] = sum;
            sumObj.push(o_);
        });
        return sumObj;
    },
    /**
     * @description datatable获取指定行中文本框（input:text）的数据(多选) 依赖 datatable 及 dt-select
     * @param {Object} dt (new datatable)实例对象
     * @param {Boolean}	isall=[false|true] 可选，是否获取所有行的数据（忽略是否选中）；true:全部；false或缺省为 只计算选中行；
     * @return {Array} 选中行中指定class="js-getval"的input值
     * @example [{"id":"xx","name1":xxx,"name2":xxx}]
     * */
    DT_getSelectRowsInputData: function(dt, isall) {
        var inpObj = [];
        dt.rows((isall === true ? '' : '.selected')).nodes().to$().each(function() {
            var str_ = {};
            str_['id'] = $(this).data('itemid');
            $(this).find('.js-getval').each(function(i) {
                if($(this).attr('name')) {
                    str_[$(this).attr('name')] = $(this).val();
                }
            });
            inpObj.push(str_);
        });
        return inpObj;
    },
    /**
     * @description datatable 使选中行中的所需要的 TD 转换为 INPUT 实现行内编辑
     * @param {Object} dt (new datatable)实例对象
     * @param {Array} selector 为数组,例如['node1:name','node2:name']，其中node1/node2为对应数据的后台字段名称
     * PS：使用时需在 datatable 的初始化时的columns中手动维护一个 "name":"node1" 字段
     * */
    DT_tdToinpEdit: function(dt, selector) {
        var o_ = dt.rows('.selected').nodes().to$();
        if(!o_.length) {
            COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noSelrows"]);
            return false;
        }
        dt.columns(selector).nodes().to$().each(function(i, n) {
            $(this).filter(function(s, n) {
                return $(this).parent().hasClass('selected');
            }).each(function(j, n) {
                if(!$(this).children().is('input.js-getval')) {
                    var txt = $(this).text();
                    var inp = $("<input name='" + selector[i].split(':')[0] + "' class='input-sm js-getval no-Sel-obj' type='text'>");
                    inp.val(txt);
                    $(this).html(inp);
                }
            });
        });
    },
    /**
     * @description datatable 选中行中的所需要的 INPUT 转换为 TD 并获取保存的数据对象
     * @param {Object} dt (new datatable)实例对象
     * @param {Array} selector DT列选择器，支持class、elementName:name、索引；例如['node1:name','node2:name']，其中node1/node2为对应数据的后台字段名称
     * @param {Boolean} param 可选，当 false 时只获取要保存的数据对象，不转换 TD
     * PS：使用时需在 datatable 的初始化时的columns中手动维护一个 "name":"node1" 字段
     * */
    DT_inpTotdSave: function(dt, selector, param) {
        var data_ = '';
        if(!dt.rows('.selected').nodes().to$().find('input[name=' + selector[0].split(':')[0] + ']').length) {
            COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noSelrows"]); /*请选择要保存的行！*/
        } else {
            data_ = COM_TOOLS.DT_getSelectRowsInputData(dt);
            if(param != false) {
                dt.columns(selector).nodes().to$().each(function(i, n1) {
                    $(this).filter(function(s, n2) {
                        return $(this).parent().hasClass('selected');
                    }).each(function(j, n3) {
                        if($(this).children().is('input.js-getval')) {
                            var txt = $(this).children().val();
                            dt.cell(n3).data(txt); //把数据重新提交给单元格
                        }
                    });
                });
            }
        }
        return data_;
    },
    /**
     * @description datatable 计算指定行（默认为选中行）中 INPUT 的值并展示
     * @param {Object} dt (new datatable)实例对象
     * @param {Array} selector DT列选择器，支持class、elementName:name、索引；例如['node1:name']，其中node1为对应数据的name字段名称
     * @param {Boolean}	isall=[false|true] 可选，是否获取所有行的数据（忽略是否选中）；true:全部；false或缺省为 只计算选中行；
     * */
    DT_getInputSum: function(dt, selector, isall) {
        var sum_ = 0;
        dt.columns(selector).nodes().to$().each(function(i, n) {
            $(this).filter(function(s, n) {
                return isall || $(this).parent().hasClass('selected');
            }).each(function(j, n) {
                if($(this).children().is('input[type=text]')) {
                    sum_ = COM_TOOLS.fnFloatSum(sum_, $(this).children().val());
                }
            });
        });
        return sum_;
    },
    /**
     * @description 获取当前分页页码；
     * @param {Object} dt (new datatable)实例对象
     * @param {Boolean} async 是否记录当前页码，多用于修改回显当前页；
     * @return {Number} pageindex
     * */
    DT_getCurPageIndex: function(dt, async) {
        var in_ = dt.page() || 0;
        if(async) {
            COM_TOOLS.private_obj_.pageIndex = in_;
        }
        return in_;
    },
    /**
     * @description 跳转至指定的页面；
     * @param {Object} dt (new datatable)实例对象
     * @param {Number} index 分页下标，从0开始
     */
    DT_setCurPageIndex: function(dt, index) {
        var in_ = index || COM_TOOLS.private_obj_.pageIndex || 0;
        dt.page(parseInt(in_)).draw(false);
        COM_TOOLS.private_obj_.pageIndex = 0;
    },
    /**
     * @description 刷新数据；
     * @param {Object} dt (new datatable)实例对象
     * @param {Boolean} resetpage 是否重置分页信息(index:0) 默认true，修改数据场景下建议使用false
     * @param {Function} callback function ( json )回调方法返回的是服务器返回的数据
     */
    DT_ajaxReload: function(dt, resetpage, callback) {
        var p_ = {
            cb: null, //function ( json )回调方法返回的是服务器返回的数据
            rp: true //是否重置分页信息 默认true,设为false则保留当前分页信息
        }
        typeof(resetpage) == 'boolean' && (p_['rp'] = resetpage);
        typeof(callback) == 'function' && (p_['cb'] = callback);
        dt.ajax.reload(p_['cb'], p_['rp']);
    },
    /**
     * @description 取消表格全选按钮选中状态；
     * @param {Object} dt (new datatable)实例对象
     */
    DT_checkboxReset: function(dt) {
        $(dt.table().container()).find('.cus-checkbox-all').removeClass('cus-checked');
    },
    /**
     * 插件select2初始化
     * @param {String} id domID
     * @param {String|Object} url ajax-url，如果为对象类型（object）则是本地html初始化，例如 select2_init('id',{})
     * @param {String} ajaxtype = [get|post] ajax请求类型 默认get
     * @param {Function} datafn ajax发送到后台的数据 
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
     *     ispinyi:false, //是否启用拼音检索 默认：false
     *     other:{} //select2 原生配置属性
     *  }
     */
    select2_init: function(id, url, ajaxtype, datafn, opt) {
        opt = $.type(opt) == "object" ? opt : {};
        var _param = {
            iscache: true,
            multiple: false,
            ispinyi: false,
            other: {}
        }
        opt = $.type(url) == "object" ? url : opt; //url => opt
        $.extend(true, _param, opt);
        var _obj = {};
        _obj.select2 = $("#" + id);
        var matcherObj = {};
        if($.type(url) == "string") {
            ajaxtype = ajaxtype || 'get';
            if(_param.iscache) { /*本地缓存数据*/
                $.ajax({
                    type: ajaxtype,
                    url: url,
                    data: $.type(datafn) == 'function' ? datafn('', '') : {},
                    dataType: 'json',
                    success: function(dd) {
                        if(dd) {
                            if(_param.ispinyi) {
                                $.fn.select2.amd.require(['select2/compat/matcher'], function(oldMatcher) {
                                    _obj.select2.select2($.extend(true, {
                                        multiple: _param.multiple,
                                        data: dd.isFilterTag == 0 ? [] : dd.results,
                                        matcher: oldMatcher(thatMatcher_)
                                    }, _param.other));
                                });
                            } else {
                                _obj.select2.select2($.extend(true, {
                                    multiple: _param.multiple,
                                    data: dd.isFilterTag == 0 ? [] : dd.results
                                }, _param.other));
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
                        delay: 250,
                        processResults: function(dd) { //返回结果
                            if(dd && dd.isFilterTag == 0) {
                                return {
                                    "results": []
                                };
                            } else {
                                return dd;
                            }
                        },
                        data: function(params) {
                            if($.type(datafn) == 'function') {
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
        } else {
            if(_param.ispinyi) {
                $.fn.select2.amd.require(['select2/compat/matcher'], function(oldMatcher) {
                    _obj.select2.select2($.extend(true, {
                        multiple: _param.multiple,
                        matcher: oldMatcher(thatMatcher_)
                    }, _param.other));
                });
            } else {
                _obj.select2.select2($.extend(true, {
                    multiple: _param.multiple
                }, _param.other));
            }
        }
        var callbacks_ = $.Callbacks();
        _obj.select2.on('select2:select select2:unselect', function(e) {
            $(this).trigger('focusout.validate');
            callbacks_.fire(e.params.data.id, e.params.data.text, e.params.data);
        });
        _obj.setVal = function(arr) {
            _obj.select2.val(arr).trigger('change.select2');
        };
        _obj.getVal = function() {
            return _obj.select2.val();
        };
        _obj.updateOption = function(html) {
            _obj.select2.html(html).trigger('change.select2');
        };
        _obj.changeCallback = function(cb) {
            $.type(cb) == 'function' && callbacks_.add(cb);
        };

        if(_param.ispinyi) {
            COM_TOOLS.requireJsFn(['cusPinYin'], [], function() {});
        }

        function thatMatcher_(term, text) {
            if(text.toPinYin != undefined) {
                return text.toPinYin().indexOf(term.toUpperCase()) >= 0 ? true : text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
            }
            return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
        }
        return _obj;
    },
    /**
     * @description 弹出消息
     * @param {String} title 文字信息
     * @param {Object} opt
     * @example
     * {
     *	time: 6000, //6s后自动关闭   ;默认关闭时间，毫秒数； 0：不自动关闭（慎用）
     *	btn: ['按钮1', '按钮2'],
     *	btn1:function(index){
     *	  alert(1);
     *	  layer.close(index);
     *	},
     *	btn2:function(index){
     *	  alert(2);
     *	},
     *	shade:0.3 //背景蒙版,透明度
     * }
     * @constructor
     */
    alert: function(title, opt) {
        return layer.msg(title || '', $.extend({
            zIndex: layer.zIndex
        }, opt));
    },
    /**
     * @description 询问框,另外它不是和系统的confirm一样阻塞，所以你需要把交互的语句放在回调中；
     * @param {String} title
     * @param {Object} opt 个性化属性 btnStyleArr：用于设置按钮样式，同bootstrap按钮样式
     * @param {Function} yes 确认按钮回调方法  返回当前索引，需执行layer.close(index);关闭
     * @param {Function} cancel 取消按钮回调方法
     * @example
     * COM_TOOLS.confirm('AAA',{
     * btnStyleArr:['btn-info','btn-danger','btn-primary'],
     * btn:['btnName1','btnName2','btnName3']
     * })
     */
    confirm: function(title, opt, yes, cancel) {
        var l_ = "function" == typeof opt;
        return l_ && (cancel = yes, yes = opt),
            layer.confirm(title || '', $.extend({
                zIndex: layer.zIndex,
                btn: [LOCAL_MESSAGE_DATA["platform.plugin.com_btn.confirm"], LOCAL_MESSAGE_DATA["platform.plugin.com_btn.cancel"]]
            }, (l_ ? {} : opt)), yes, cancel);
    },
    /**
     * @description 货币型格式化
     * @param {Number} number 待处理的数字
     * @param {Number} places 小数位数
     * @param {String} symbol 货币标识
     * @param {String} thousand 千分位
     * @param {String} decimal 小数点
     */
    formatMoney: function(number, places, symbol, thousand, decimal) {
        number = number || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "￥";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },
    check_Abtn: function() {
        if(!COM_TOOLS._isCheckBtn) {
            return false;
        }
        var btnA = $('.js-checkcode');
        if(COM_TOOLS.sessionStorageSupport()) {
            var arr = COM_TOOLS.get_fromSession('TEDU-checkbtn');
            if(arr) {
                arr = $.parseJSON(arr);
                btnA.each(function(i, n) {
                    var c_ = $(n).data('checkcode');
                    if(c_ && $.inArray(c_, arr) !== -1) {
                        $(n).show();
                    } else {
                        $(n).hide();
                    }
                });
            } else {
                COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.noGetPermission"]);
            }
        } else {
            COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.msg.checkWinVer"]);
        }
    },
    /**
     * 动态加载JS\CSS并执行,并完成所加载组件的默认配置信息初始化(COM_TOOLS.initjSDefaultOpt)
     * 注意前置组件加载完成后不进行初始化，所有组件都加载完成的后才统一初始化;已显试加载的js，不好再次加载其js和css，即使其CSS没有被加载过；
     * 只以组件名称KEY作为排重依据，CSS动态加载时，会进行二次排重验证（在校验head内的，无论显试还是隐试）；
     * @param {Array} arr 需要加载的组件数组；
     * @param {Array} def 前置依赖的组件数组；
     * @param {Function} cb 加载完成后组件的初始化回调方法；
     * */
    requireJsFn: function(arr, def, cb) {
        var _obj_ = {};
        _obj_.loadFile = function(u, callback) {
            if(COM_TOOLS['_jsFileList'][u]['js']) {
                $.ajax({
                    type: "get",
                    url: COM_TOOLS['_jsPath'] + COM_TOOLS['_jsFileList'][u]['js'],
                    dataType: "script",
                    cache: true,
                    success: function() {
                        COM_TOOLS.cache_obj['_jsfileArr'].push(u);
                        callback && callback();
                    },
                    error: function() {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.com_msg.1102"]); /*系统异常 请联系管理员*/
                    }
                });
            }
            if(COM_TOOLS['_jsFileList'][u]['css']) {
                if(!_obj_.checkCssIsLoad(COM_TOOLS['_jsFileList'][u]['css'])) {
                    var thatLink_ = $('head link[rel="stylesheet"]').filter(function() {
                        return jQuery.inArray($(this).attr('href').substring($(this).attr('href').indexOf('css/')), ['css/style-ajax.css', 'css/style.css']) !== -1;
                    });
                    thatLink_.before($('<link rel="stylesheet" type="text/css" href="' + COM_TOOLS['_jsPath'].replace('/js/', '/css/') + COM_TOOLS['_jsFileList'][u]['css'] + '"/>'));
                }
            }
        };
        _obj_.checkCssIsLoad = function(p_) {
            return !!$('head link[rel="stylesheet"]').filter(function() {
                return p_.substring(p_.indexOf('css/')) == $(this).attr('href').substring($(this).attr('href').indexOf('css/'));
            }).length;
        };
        _obj_.forCheck = function(a_, c_) {
            for(var i = 0, l_ = a_.length; i < l_; i++) {
                if(COM_TOOLS['_jsFileList'][a_[i]] && $.inArray(a_[i], COM_TOOLS.cache_obj['_jsfileArr']) === -1) {
                    c_ && c_(a_[i]);
                }
            }
        };
        _obj_.ready_check = function(a_) {
            for(var i2 = 0, l2_ = a_.length; i2 < l2_; i2++) {
                if(COM_TOOLS['_jsFileList'][a_[i2]] && $.inArray(a_[i2], COM_TOOLS.cache_obj['_jsfileArr']) === -1) {
                    return false;
                }
            }
            return true;
        };
        _obj_.fn1 = function() {
            _obj_.forCheck(arr, function(u2) {
                _obj_.loadFile(u2, function() {
                    if(_obj_.ready_check(arr)) {
                        cb && window.setTimeout(function() {
                            COM_TOOLS.initjSDefaultOpt(arr.concat(def) || 'ALL', true); //初始化相关组件默认配置
                            cb(); //执行组件回调
                        }, 4);
                    }
                });
            });
        };
        if(jQuery.type(def) === "array" && def.length > 0 && !_obj_.ready_check(def)) {
            _obj_.forCheck(def, function(u) {
                _obj_.loadFile(u, function() {
                    if(_obj_.ready_check(def)) {
                        if(jQuery.type(arr) === "array" && arr.length > 0 && !_obj_.ready_check(arr)) {
                            _obj_.fn1();
                        } else {
                            cb && cb();
                        }
                    }
                });
            });
        } else if(jQuery.type(arr) === "array" && arr.length > 0 && !_obj_.ready_check(arr)) {
            _obj_.fn1();
        } else {
            cb && cb();
        }
    },
    /**
     * ajax 加载tab标签页；
     * @param {String} id //tab标签Id;
     * @param {Function} startcb 点击标签时触发的方法；
     * @param {Function} endcb 标签页面加载完成后触发的方法（全局）；
     * <dom> data-itemurl : 标签页地址url;
     * <dom> data-itemcallback : 各标签页加载完成后的回调（单个）;
     */
    fnTabPage: function(id, startcb, endcb) {
        if(jQuery.type(id) === "string") {
            $('#' + id + ' a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                var t_ = $(e.target),
                    cont_ = t_.attr('aria-controls'),
                    url_ = t_.data('itemurl'),
                    cbox_ = $('#' + cont_),
                    cb_ = t_.data('itemcallback');
                if(url_) {
                    if(cbox_.length > 0 && (t_.is('[data-isreload=true]') || $.trim(cbox_.html()).length < 10)) {
                        COM_TOOLS.private_obj_._curTabPageid = cont_;
                        startcb && startcb();
                        cbox_.load(url_, function() {
                            cb_ && COM_TOOLS.private_obj_[cb_]();
                            endcb && endcb();
                            COM_TOOLS.fnInitInputHelpVal();
                        });
                    }
                } else {
                    cb_ && COM_TOOLS.private_obj_[cb_]();
                }
                $(window).trigger('resize');
            });
        }
    },
    /**
     * JS加法运算方法，纠正浮点运算错误
     */
    fnFloatSum: function(arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch(e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch(e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        return(arg1 * m + arg2 * m) / m;
    },
    /**
     * 初始化input[text]框默认提示信息；placeholder; 只应用于异步load进来的input元素；
     * 用法（详见手册），class="js-helpmsg", data-helpmsg="msgkey"
     * @param {Number} time 延时时间：默认 300ms，
     */
    fnInitInputHelpVal: function(time) {
        COM_TOOLS._isOpenHelpMsg['helpMsgDefVal'] && window.setTimeout(function() { //延时处理的、不需要立即渲染的事件；placeholder
            $('.js-helpmsg:text[data-titlemsg!="true"][placeholder!=""]').attr('placeholder', function(index, attr) {
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
    callParentWinFn: function(fnName, data) {
        if(fnName) {
            if(COM_TOOLS.cache_obj._ptWinFnNames[fnName]) {
                var p_ = cumGetParentWinGlobel();
                if(p_.COM_TOOLS.private_obj_[COM_TOOLS.cache_obj._ptWinFnNames[fnName]]) {
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
    callParentWinCacheFn: function(fnName, data) {
        if(fnName) {
            if(COM_TOOLS.cache_obj._ptWinFnNames[fnName]) {
                if($.type(COM_TOOLS.cache_obj._ptWinFnNames[fnName]) == 'function') {
                    COM_TOOLS.cache_obj._ptWinFnNames[fnName](data);
                } else {
                    var p_ = cumGetParentWinGlobel();
                    if(p_.COM_TOOLS.cache_obj._ptWinFnList[COM_TOOLS.cache_obj._ptWinFnNames[fnName]]) {
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
    setCacheFnForChildWin: function(obj) {
        if(!$.isEmptyObject(obj)) {
            COM_TOOLS.cache_obj._ptWinFnList = obj;
        } else {
            COM_TOOLS.cache_obj._ptWinFnList = {};
        }
    },
    /**
     * eChart组件数据类似转换工具类
     * 详见that_.initOpt
     */
    eChartsTools: function() {
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
            $.each(data || [], function(i, n) {
                var _data = $.extend(true, {}, n, {})['data'];
                $.each(_data || [], function(i2, n2) {
                    var _name = dopt[n2['name']] ? dopt[n2['name']] : n2['name'];
                    _data[i2]['name'] = _name;
                    if(_ismake) {
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
            if(type == 'bar') { //柱状		
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
            } else if(type == 'pie' || type == 'funnel') { //饼状或漏斗图
                opt_['tooltip'] = {
                    trigger: 'item'
                };
                opt_['legend'] = {
                    data: d_['dnames']
                };
            } else if(type == 'line') { //折线
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
            }
            return $.extend(true, opt_, (opt || ele.data('js_opt') || {}));
        };

        function initData(dom_, myChart, type, data, fopt, dopt, opt) {
            var opt_ = {};
            if($.type(data) == 'array') {
                opt_ = getOpt(dom_, type, data, fopt, dopt, opt);
                myChart.setOption(opt_);
            } else if($.type(data) == 'string') {
                myChart.showLoading();
                $.ajax({
                    type: data.split('||')[1] || "get",
                    url: data.split('||')[0],
                    async: true,
                    dataType: 'json',
                    success: function(d_) {
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
        that_.initOpt = function(ele, type, data, fopt, dopt, opt) {
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
        that_.updateData = function(ele, data) {
            var dom_ = $(ele);
            initData(dom_, echarts.getInstanceByDom(dom_[0]), false, data, false, false, false);
        };
        return that_;
    }(),
    /**
     * 信息详情气泡
     * @param {Object} selector 父选择器（dom中的已存在元素）  jQuery-selector;
     * @param {Object} target 子选择器  jQuery-selector;
     * @param {Object} callback 内容构造函数，返回当前操作对象(jquery-object:target子选择器)，需内部返回（return）内容；callback($this){reutn 需要展示的内容;}
     * @param {Object} opt 配置属性
     */
    infoTipsFn: function(selector, target, callback, opt) {
        var _defaults = {
            hideTime_: 300, //隐藏的延时时间 毫秒
            showTime_: 400, //显示的延时时间 毫秒
            html: true,
            imageZoom: false,
            placement: 'left', //显示位置 top | bottom | left | right | auto
            trigger: 'manual',
            container: 'body',
            maxHeight: '',
            minHeight: '200px',
            maxWidth: '276px',
            title: '',
            content: function() { //注意title为空时，此方法会执行两次；
                return callback ? callback($(this)) : '';
            }
        };
        $.extend(_defaults, (opt || {}));
        _defaults['template'] = '<div class="popover cus-popover-box" role="tooltip" style="max-width:' + (_defaults['maxWidth']) + ';' + (_defaults['imageZoom'] ? 'width:' + (_defaults['maxWidth']) + ';' : '') + '"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" style="' +
            (_defaults['maxHeight'] ? "max-height:" + _defaults['maxHeight'] + ";" : "") + (_defaults['imageZoom'] ? 'min-height:' + (_defaults['minHeight']) + ';' : '') + '"></div></div>';
        _defaults['imageZoom'] && COM_TOOLS.requireJsFn(['jqueryZoom'], [], false); //加载图片缩放组件
        $(selector).on('mouseleave', target, function(e) {
            var _this = $(this);
            var _showTimer = _this.data('show_timer');
            if(_showTimer) {
                window.clearTimeout(_showTimer);
            }
            var _hideTimer = window.setTimeout(function() {
                _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
            }, _defaults['hideTime_']);
            _this.data('hide_timer', _hideTimer);
            return false;
        }).on('mouseenter', target, function(e) {
            var _this = $(this);
            var _hideTimer = _this.data('hide_timer');
            if(_hideTimer) {
                window.clearTimeout(_hideTimer);
            }
            if(!_this.hasClass('js-mouseove')) {
                var _showTimer = window.setTimeout(function() {
                    var _thisPop = _this.addClass('js-mouseove').popover(_defaults).popover('show').attr('aria-describedby');
                    $('#' + _thisPop).on('mouseenter', function(ee) {
                        var _hideTimer_ = $('[aria-describedby="' + _thisPop + '"]').data('hide_timer');
                        if(_hideTimer_) {
                            window.clearTimeout(_hideTimer_);
                        }
                        return false;
                    }).on('mouseleave', function(ee) {
                        _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
                        return false;
                    });
                    _this.on('shown.bs.popover', function() {
                        if(_defaults['imageZoom']) {
                            $('#' + _thisPop).find('img').wrap('<span class="img-zoom-box"></span>').css('display', 'block').parent().zoom();
                        }
                    });
                }, _defaults['showTime_']);
                _this.data('show_timer', _showTimer);
            }
            return false;
        });
    },
    loadingShade: { //加载中遮罩
        /**
         * @param {Object} timeOut 主动销毁时间 单位秒，默认不过期
         * @param {Object} shadeOpt 遮罩背景 颜色及透明度，默认[0.5,'#000']
         */
        open: function(timeOut, shadeOpt) {
            layer.load(1, {
                time: (timeOut || 0) * 1000,
                shade: shadeOpt || [0.5],
                zIndex: layer.zIndex
            });
        },
        close: function() {
            layer.closeAll('loading');
        }
    },
    customValid: { //自定义验证类
        /**
         * 自定义特殊字符验证
         * @param {String} str_ 需要校验的字段
         * @param {Array} zdy_ 自定义新的校验规则（默认不需要）
         */
        specialChars: function(str_, zdy_) {
            var reg_ = /[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\<\>\?]/g;
            if(zdy_ != undefined) {
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
    arrayUniqueFn: function(array) {
        var a = [],
            i, j, l, o = {};
        for(i = 0, l = array.length; i < l; i++) {
            if(o[array[i]] === undefined) {
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
    arrayUniquePushFn: function(array_, item) {
        return $.inArray(item, array_) === -1 && array_.push(item);
    },
    /**
     * 数组对象排序
     * @param {Array} array_ 待处理数组对象
     * @param {String} attr_ 排序依据的对象属性
     * @param {Number} sortby_ 1：升序；2：降序
     */
    arrayObjectSortBy: function(array_, attr_, sortby_) {
        sortby_ = sortby_ || 1;
        array_.sort(function(a, b) {
            a = a[attr_];
            b = b[attr_];
            if(a < b) {
                return sortby_ * -1;
            }
            if(a > b) {
                return sortby_ * 1;
            }
            return 0;
        });
    },
    _view: { //视图工具
        /**
         * @description 设置文本框的校验状态(不建议与tooltips混用，有样式兼容问题：tooltips会与icon争抢相邻兄弟节点，导致CSS选择器失效)
         * @param {Object} obj $(obj) or selector;
         * @param {String} status success:成功, warning：警告, error：失败, default：reset 默认;
         */
        setInputStatus: function(obj, status) {
            if(obj) {
                obj = typeof(obj) === 'string' ? $(obj) : obj;
                if(obj.length > 0) {
                    var p_ = obj.parent();
                    var isInpGroup = p_.hasClass('input-group');
                    var icon = isInpGroup ? p_.next('.form-control-feedback') : obj.next('.form-control-feedback');
                    var offsetParent = isInpGroup ? p_.parent() : p_;
                    offsetParent.removeClass('has-success has-warning has-error has-feedback');
                    if(icon.length) {
                        icon.remove();
                    }
                    var iconStr = '';
                    switch(status) {
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
                    if(iconStr) {
                        if(isInpGroup) {
                            var icon_ = $(iconStr);
                            var inpGroupControls = obj.nextAll('.input-group-btn, .input-group-addon');
                            if(inpGroupControls.length) {
                                var offsetPosition = 0;
                                $.each(inpGroupControls, function(index, inpGroupElement) {
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
        },
        /**
         * @description 生成一个带关闭按钮的popover弹窗
         * @param {String} id 触发这个弹窗按钮的id;
         * @param {Object} opt pop弹窗的配置项;
         * @param {Function} startcb 打开弹窗时执行的方法;
         * @param {Function} endcb 关闭弹窗时执行的方法;
         */
        cusPopover: function(id, opt, startcb, endcb) {
            var param_ = {
                container: 'body',
                placement: 'bottom',
                content: '',
                trigger: 'click'
            };
            var tar_ = '',
                rep_ = '';
            if($.type(opt) == "object") {
                tar_ = $(opt['content']);
                opt['content'] = tar_.html();
                $.extend(param_, opt);
            };
            $('#' + id).popover({
                html: true,
                container: param_['container'],
                placement: param_['placement'],
                content: param_['content'],
                trigger: param_['trigger'],
                title: '<button type="btn" class="btn btn-warning btn-sm cus-pop-close" onclick="javascript:$(\'#' + id + '\').trigger(\'click\')"><i class="glyphicon glyphicon-chevron-up"></i></button>',
                template: '<div class="tooltip cus-popover" role="tooltip"><h3 class="popover-title text-right"></h3><div class="popover-content"></div></div>',
            }).on('show.bs.popover', function() {
                $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                rep_ = $('<div>').hide().insertBefore(tar_);
                tar_.remove();
            }).on('shown.bs.popover', function() {
                (typeof startcb == 'function') && startcb(id);
            }).on('hidden.bs.popover', function() {
                $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                rep_.replaceWith(tar_);
                (typeof endcb == 'function') && endcb(id);
            });
        },
        /**
         * @description 高级搜索弹窗
         * @param {String} id 触发这个弹窗按钮的id;
         */
        cusHighSearch: function(id) {
            $('#' + id).on('click', '.js-highsearch-btn', function() {
                var tObj_ = $(this);
                if(!tObj_.data('isload')) { //防止多次加载
                    tObj_.siblings('.js-moreSearchBox').load(tObj_.data('itemurl'), function() {
                        tObj_.data('isload', true);
                    });
                }
            }).on('click', '.js-moreSearchBox', function() { //防止点击弹出框自动关闭
                return false;
            });
        },
        /*
        * 新手引导
        * */
        noviceGuide:'<div class="popover cus-step-popover-box" role="tooltip"> <div class="arrow"></div> <h3 class="popover-title"></h3> <div class="popover-content"></div>'+
        '<div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-default" data-role="prev">&laquo; '+LOCAL_MESSAGE_DATA["platform.plugin.msg.prevStep"]+'</button> <button class="btn btn-sm btn-default" data-role="next">'+LOCAL_MESSAGE_DATA["platform.plugin.msg.nextStep"]+' &raquo;</button>' +
        '<button class="btn btn-sm btn-default" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">'+LOCAL_MESSAGE_DATA["platform.plugin.msg.pause"]+'</button> </div> <button class="btn btn-sm btn-default" data-role="end">'+LOCAL_MESSAGE_DATA["platform.plugin.msg.end"]+'</button> </div> </div>'
    }
};
/*通用工具及配置 end*/
COM_TOOLS.initjSDefaultOpt('ALL');
self != top && COM_TOOLS.check_Abtn();