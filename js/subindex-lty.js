/*
 * Last modified time :2018-01-24
 */
var cum_Modalindex_ = 0; //记录弹窗索引
var cum_ModalValobj = null; //记录弹窗透传数据对象
var time_stamp={
	"layer_stamp":"lay_interval",
	"select_stamp":"sel_interval",
	"datatable_stamp":"data_interval"
};
var cus_fn_time= function(stamp_lx,url,data) {
	    var _obj = {};
	    _obj.start_time = function() {
	       var time_begin=new Date().getTime();
	       return time_begin;
	    }
	    _obj.end_time = function(begin_time,stamp_lx,url,data) {
	        var end_time=new Date().getTime(),
	        	time_inter=end_time-begin_time,
	        	cus_obj={},cus_arr=[];
	            cus_obj.time_interval=time_inter;
	            cus_obj.url=url;
	            if(data){cus_obj.prams=data};
//	            var al_data=COM_TOOLS.get_fromSession(time_stamp[stamp_lx]);
//	            if(al_data){
//	            	cus_arr=JSON.parse(al_data);
//	            }
	            cus_arr.push(cus_obj);
	            return cus_obj;
	        	//COM_TOOLS.save_toSession(time_stamp[stamp_lx],cus_arr);
	    };
	    return _obj;
}();
var worker=new Worker("http://127.0.0.1:8020/platform-ui-local/js/add_xc.js");


	



/**
 * @description 打开弹窗
 * @param {String} tit 弹窗名称
 * @param {String} url frame地址OR ([$('demo')|| html ]&& type==1)
 * @param {Object} partOBJ = [parent|top|self] 窗口对象 parent || top || window(self)
 * @param {Object} opt opt = {}配置属性
 */
function cumCurWinModal(tit, url, partOBJ, opt) {
	if(COM_DEFAULT._isOpenTimeInterval){
		var begin_time=cus_fn_time.start_time();
	}
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
         *  "btnStyleArr": []// 自定义弹窗按钮组样式类 默认：无； ['btn-info','btn-danger']
         * }
         */
        "other": {},
        /* 弹窗成功后的回调  function(layero,ind_){}*/
        "success": null
    }
    if(typeof opt !== "undefined") {
        $.extend(param, opt);
    }
    var this_area_ = param['area']; //当宽、高溢出窗口大小后，设置为100%；
    if(this_area_[0] && this_area_[0].toLowerCase().indexOf('px') > 0 && parseInt(this_area_[0]) > partOBJ_.$(window).width()) {
        this_area_[0] = '100%';
    }
    if(this_area_[1] && this_area_[1].toLowerCase().indexOf('px') > 0 && parseInt(this_area_[1]) > partOBJ_.$(window).height()) {
        this_area_[1] = '100%';
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
        //isOutAnim: false, //关闭动画（timeout=》200MS）
        zIndex: partOBJ_.layer.zIndex,
        success: function(layero, ind_) {
            //partOBJ_.layer.setTop(layero);
            if(param['type'] == 2) {
            	if(COM_DEFAULT._isOpenTimeInterval){
            		var cus_data=cus_fn_time.end_time(begin_time,"layer_stamp",url);
            		var cus_arr=[];
            		cus_arr[0]=cus_data;
            		cus_arr[1]=time_stamp["layer_stamp"];
	          		worker.postMessage(cus_arr);
            	}
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
/* 用于mainPiframe窗口组件渲染完成后，回调修改mainPiframe高度 ；此方法只能用于 iframe右侧框架页面mainPiframe中*/
function resizeIframeHeight() { //废弃 2017-10-17
    //parent.$('#mainPiframe').height('auto').height($(document).height());
}

function intValidateOption() {}
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
    COM_DEFAULT._isOpenHelpMsg['helpBtn'] && $(document).on('click', '.js-helpbtn', function(e) {
        var this_ = $(this),
            selt = this_.data('helpbtn');
        if(this_.is('[id="js_cushelpbtn"]')) {
            selt = '#' + ($('#t_tabBox > li.active > a').data('itemid') || '');
        }
        if(selt) {
            this_.attr({
                'href': selt.substr(0, 1) == '#' ? COM_TOOLS['_helpPage'] + selt.replace(/^#{1}/,'#help_') : selt,
                'target': 'cushelppage'
            });
        } else {
            return false;
        }
        e.stopPropagation();
    });
    //自定义提示信息，使用方法 将需要添加提示信息的元素 class中 加入”js-helpmsg“，然后设置 data-helpmsg="msgkey"； msgkey = TEDU_MESSAGE[key];
    COM_DEFAULT._isOpenHelpMsg['helpMsgTips'] && $(document).popover({
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
            if(tipsOpt && tipsOpt['_all_']) {
                $.extend(options, tipsOpt['_all_']);
            }
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
                },
                errorPlacement: function(error, element) {
                    var _ele = $(element),
                        _opt = _this.applyTooltipOptions(_ele, this.settings['tooltip_options']);
                    _opt['title'] = _opt['html'] ? error.html() : error.text();
                    if(_ele.data('bs.tooltip') !== undefined) {
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
    }
};

/* 通用工具 start 2016-12-06 lianglei */

var COM_TOOLS = {
    version: '3.1.4', //年index|月index|本月内版本index
    /* 当前版本默认语言（！！ 禁止修改 ！！） */
    _language: 'zh-CN',
    /* ### option start ### */
    /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
    _customMenus: 6, //弃用 ：2018-1-18
    /*控制主页tab标签打开个数,必须为数字*/
    _tabSingle: 3, //弃用 ：2018-1-18
    /* contentPath webxml项目包名、路径 */
    _webPath: '/', //弃用 ：2018-1-18
    /* 系统默认标签主页地址 */
    _tabHomePage: 'index_default.html', //弃用 ：2018-1-18
    /* 系统默认404页面地址 */
    _404Page: '404.html', //弃用 ：2018-1-18
    /* 系统默认帮助页面地址 */
    _helpPage: 'help.html', //弃用 ：2018-1-18
    /* 是否开启帮助信息 */
    _isOpenHelpMsg: { //弃用 ：2018-1-18
        helpBtn: true, //帮助按钮
        helpMsgTips: true, //提示信息tips
        helpMsgDefVal: true //提示信息text-placeholder
    },
    _isOpenNotice: { //弃用 ：2018-1-18
        isDisplay: true, //控制是否显示公告
        delayTime: 5, //控制弹出时长 单位:s
        requestTime: 300 //控制每次请求的时长 单位:s
    },
    /*是否启用开关控制tab导航条显隐*/
    _isOpenSwitch: true, //弃用 ：2018-1-18
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
    initjSDefaultOpt: function(jsArr, noInitInp) {
        if(!jsArr) {
            return false;
        }
        /* 数据表格datatable默认配置信息（不建议修改） */
        (jsArr == 'ALL' || $.inArray('DTmain', jsArr) !== -1) && $.fn.dataTable && (CUS_PLUGINS['_DT_'].init(),
            $.extend($.fn.dataTable.defaults, COM_DEFAULT._dataTableOpt, {
                language: TEDU_LANGUAGE['_dataTable'][COM_TOOLS['_language']],
                fnPreDrawCallback: function(settings) { //表格重绘后取消全选框选中状态
                    $(settings.nTableWrapper).find('.cus-checkbox-all').removeClass('cus-checked');
                }
            }),
            $.fn.dataTable.ext.errMode = function(settings, techNote, message) {
                var msg = '数据表格错误: ' + (settings ? 'table id=' + settings.sTableId + ' - ' : '');
                if(techNote) {
                    switch(techNote) {
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
                if(window.console && console.error) {
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
        /*修改select2中文*/
        (jsArr == 'ALL' || $.inArray('select2', jsArr) !== -1) && $.fn.select2 && (TEDU_LANGUAGE['_select2'](), $.fn.select2.defaults.set('language', COM_TOOLS['_language']),
            $.fn.select2.defaults.set('width', 'style'), COM_TOOLS.arrayUniquePushFn(COM_TOOLS['cache_obj']['_jsfileArr'], 'select2'));
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
        var jsPath = document.currentScript ? document.currentScript.src : function() {
            var js = document.scripts,
                last = js.length - 1,
                src;
            for(var i = last; i > 0; i--) {
                if(js[i].readyState === 'interactive') {
                    src = js[i].src;
                    break;
                }
            }
            return src || js[last].src;
        }();
        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }(),
    /* 检验是否支持本地持久化存储 */
    localStorageSupport: function() {
        return(('localStorage' in window) && window['localStorage'] !== null)
    },
    /* 存储持久化数据至本地 */
    save_toLocal: function(key, obj) {
        localStorage.setItem(key, (typeof obj == 'object' ? JSON.stringify(obj) : obj));
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
        sessionStorage.setItem(key, (typeof obj == 'object' ? JSON.stringify(obj) : obj));
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
    DT_init: function(domid, columns, url, ajaxtype, data, opt) {
    	var begin_time=0;  
        var _obj = {},
            _dopt = {},
            _isajax = $.type(url) == 'string';
        var _ajaxdata = $.type(data) == "object" ? data : {};
        if(_isajax) { //服务器模式
            _dopt = {
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
		
        var _table = $('#' + domid).on("preXhr.dt",function(e,settings,data){
        	if(COM_DEFAULT._isOpenTimeInterval){
        		begin_time=cus_fn_time.start_time();
        	}
        }).DataTable($.extend(true, {
            columns: columns,
            initComplete: function(settings, json) {
                var _that = this.api();
                if(settings._select && settings._select.style == 'mutil') { //全选、反选
                    $(settings.nTableWrapper).off('click.dtcus', '.cus-checkbox-all').on('click.dtcus', '.cus-checkbox-all', function() {
                        if($(this).hasClass('cus-checked')) {
                            $(this).removeClass('cus-checked');
                            _that.rows().deselect();
                        } else {
                            $(this).addClass('cus-checked');
                            _that.rows().select();
                        }
                    });
                    _that.off('select.dt.dtcus deselect.dt.dtcus').on('select.dt.dtcus deselect.dt.dtcus', function(e, dt, type, indexes) { //全选、反选联动
                        if(dt) {
                            $(settings.nTableWrapper).find('.cus-checkbox-all').toggleClass('cus-checked', dt.rows({
                                selected: true
                            }).count() == dt.rows().count());
                        }
                    });
                }
                if($.isFunction(opt['jsTrDblclick'])) {
                    var cto = null,
                        ex, ey;
                    $(settings.nTBody).off('dblclick.dtcus touchstart.dtcus touchmove.dtcus touchend.dtcus', 'tr').on({
                        'dblclick.dtcus': function() {
                            opt['jsTrDblclick'](COM_TOOLS.DT_getRowsSourceData(_that, this)[0], $(this));
                        },
                        'touchstart.dtcus': function(e) {
                            if(!e.originalEvent || !e.originalEvent.changedTouches || !e.originalEvent.changedTouches[0]) {
                                return;
                            }
                            ex = e.originalEvent.changedTouches[0].clientX;
                            ey = e.originalEvent.changedTouches[0].clientY;
                            cto = setTimeout(function() {
                                $(e.currentTarget).trigger('dblclick.dtcus');
                            }, 750);
                        },
                        'touchmove.dtcus': function(e) {
                            if(cto && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] &&
                                (Math.abs(ex - e.originalEvent.changedTouches[0].clientX) > 50 || Math.abs(ey - e.originalEvent.changedTouches[0].clientY) > 50)) {
                                clearTimeout(cto);
                            }
                        },
                        'touchend.dtcus': function(e) {
                            if(cto) {
                                clearTimeout(cto);
                            }
                        }
                    }, 'tr').off('dblclick.dtcus', '.select-checkbox, :input, .no-Sel-obj').on('dblclick.dtcus', '.select-checkbox, :input, .no-Sel-obj', function() {
                        return false;
                    });
                }
                if($.isFunction(opt['jsInitComplete'])) {
                    opt['jsInitComplete'].call(_that, settings, json);
                }
            },
            drawCallback: function(settings) {
                if($.isFunction(opt['jsDrawCallback'])) {
                    opt['jsDrawCallback'].call(this.api(), settings);
                }
            },
            select: {
                style: opt['selectStyle'] || 'mutil',
                selector: 'td:not(td:has(:input))',
                info: false
            }
        }, _dopt, opt['other'])).on('xhr.dt',function( e, settings, json, xhr ){
        	if(COM_DEFAULT._isOpenTimeInterval){
        		cus_fn_time.end_time(begin_time,"datatable_stamp",url,data);
        	}
        });
        
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
        return COM_TOOLS.DT_getRowsSourceData(dt, (isall === true ? '' : '.selected'), name);
    },
    /**
     * 
     * @param {Object} dt (new datatable)实例对象
     * @param {Object} selector 行选择器，指定需要获取哪些行的数据; 支持jQ-selector、node、索引(row.index)、function ( idx, data, node ) => return true
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
     * 获取表格节点
     * @param {Object} dt (new datatable)实例对象
     * @param {String} nodename [body|footer|header|node|container] 节点名称；body:tbody; node:table; container:得到表格的容器 div，包括dt所有的控件
     * @return {Object} domNode 或 '';
     */
    DT_getNode: function(dt, nodename) {
        if(/body|footer|header|node|container/.test(nodename)) {
            return dt.table()[nodename]();
        }
        return ''
    },
    /**
     * 插件select2初始化
     * @param {String} id domID
     * @param {String|Object} url ajax-url，如果为对象类型（object）则是本地html初始化，例如 select2_init('id',{})
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
     *     ispinyi:false, //是否启用拼音检索 默认：false
     *     other:{} //select2 原生配置属性
     *  }
     * @return  {Object} API对象
     * @example
     *  API:select2 select2原生实例对象
     *  API:setVal fn(array) 设置选中项；['value1','value2']
     *  API:getVal fn() 获取当前选中项的值；
     *  API:updateOption fn(html) 修改select中的项目（node-options）,等同于 $([]).html(html)
     *  API:changeCallback fn(value, text, data) 选中项改变后的回调函数;
     */
    select2_init: function(id, url, ajaxtype, datafn, opt) {
    	var begin_time=0; 
        opt = $.type(opt) == "object" ? opt : {};
        var _param = {
            iscache: true,
            multiple: false,
            ispinyi: false,
            initValue: '', //初始化默认值  不支持ajax远程数据搜索
            drawCallBack: function() {}, //数据加载且初始化完成,不包括远程数据检索模式
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
                    beforeSend:function(){
                    	if(COM_DEFAULT._isOpenTimeInterval){
                    		begin_time=cus_fn_time.start_time();
                    	}
                    },
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
                            _param.initValue != '' && _obj.setVal(_param.initValue);
                            _param.drawCallBack();
                        }
                    },
                    complete:function(){
                    	if(COM_DEFAULT._isOpenTimeInterval){
                    		var data=$.type(datafn) == 'function' ? datafn('', '') : {};
                    		cus_fn_time.end_time(begin_time,"select_stamp",url,data);
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
                        },
                        beforeSend:function(){
                        	if(COM_DEFAULT._isOpenTimeInterval){
                    			begin_time=cus_fn_time.start_time();
                        	}
                    	},
                        complete:function(){
                        	if(COM_DEFAULT._isOpenTimeInterval){
                        		var data=$.type(datafn) == 'function' ? datafn('', '') : {};
                    			cus_fn_time.end_time(begin_time,"select_stamp",url,data);
                    		}
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
            _param.initValue != '' && _obj.setVal(_param.initValue);
            _param.drawCallBack();
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
     * @param {Object} opt 配置信息，选填
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
     *  btnAlign: 'r', //按钮排列方式 默认右对齐;左对齐:'l';居中对齐:'c'
     *	shade:0.3, //背景蒙版,透明度
     *  shadeClose:false //是否点击遮罩关闭 
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
    confirm: function(title, opt, yes, cancel) {
        var l_ = "function" == typeof opt;
        return l_ && (cancel = yes, yes = opt),
            layer.confirm(title || '', $.extend({
                zIndex: layer.zIndex,
                btn: [LOCAL_MESSAGE_DATA["platform.plugin.com_btn.confirm"], LOCAL_MESSAGE_DATA["platform.plugin.com_btn.cancel"]],
                title: LOCAL_MESSAGE_DATA["platform.plugin.com_label.message"]
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
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
            (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
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
                    var thatLink_ = $('#cus_app_link');
                    if(thatLink_.length == 0) { //对历史版本兼容补丁
                        thatLink_ = $('head link[rel="stylesheet"]').filter(function() {
                            return $(this).attr('href').indexOf('css/style.css') != -1;
                        });
                    }
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
     * @return {Object} API => reloadOneTab : 刷新指定标签下数据;
     */
    fnTabPage: function(id, startcb, endcb) {
        var obj = {};
        if(jQuery.type(id) === "string") {
            var tabB_ = $('#' + id);
            if(!tabB_.data('inited')) {
                tabB_.data('inited', true);
                var tabA_ = tabB_.find('a[data-toggle="tab"]').on('shown.bs.tab', function(e, edata) {
                    var t_ = $(e.target),
                        cont_ = t_.attr('aria-controls'),
                        url_ = $.trim(t_.data('itemurl')),
                        cbox_ = $('#' + cont_),
                        cb_ = t_.data('itemcallback');
                    if(url_) {
                        if(cbox_.length > 0 && (t_.is('[data-isreload=true]') || edata == 'API' || $.trim(cbox_.html()).length < 10)) {
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
                $.trim(tabA_.eq(0).data('itemurl')) && tabA_.eq(0).trigger('shown.bs.tab', ['API']);
            }
            obj.reloadOneTab = function(href) { //刷新指定标签下数据； href => href="[href]"
                if(href) {
                    var thatA_ = $('#' + id + ' a[data-toggle="tab"][href="' + href + '"]');
                    $.trim(thatA_.data('itemurl')) && thatA_.trigger('shown.bs.tab', ['API']);
                }
            };
        }
        return obj;
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
        COM_DEFAULT._isOpenHelpMsg['helpMsgDefVal'] && window.setTimeout(function() { //延时处理的、不需要立即渲染的事件；placeholder
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
            if(type == 'bar' || type == 'line') { //柱状或折线	
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
            //minHeight: '200px',
            maxWidth: '276px',
            height: '',
            title: '',
            content: function() { //注意title为空时，此方法会执行两次；
                var html_ = callback ? callback($(this)) : '';
                if(/<img[^>]*/.test(html_)) {
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
                    _this.on('inserted.bs.popover', function() {
                        $('#' + _this.attr('aria-describedby')).children('.popover-content').css({
                            height: _defaults['height'],
                            'max-height': 'auto'
                        });
                    }).on('shown.bs.popover', function() {
                        if(_defaults['imageZoom']) {
                            $('#' + _this.attr('aria-describedby')).find('img').wrap('<span class="img-zoom-box"></span>').css('display', 'block').parent().zoom();
                        }
                    });
                    var _thisPop = _this.addClass('js-mouseove').popover(_defaults).popover('show').attr('aria-describedby');
                    $('#' + _thisPop).on('mouseenter', function(ee) {
                        var _hideTimer_ = _this.data('hide_timer');
                        if(_hideTimer_) {
                            window.clearTimeout(_hideTimer_);
                        }
                        return false;
                    }).on('mouseleave', function(ee) {
                        _this.popover('destroy').removeClass('js-mouseove').off('shown.bs.popover');
                        return false;
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
    loadingBtn: { //设置按钮加载中、禁用状态（防止重复操作）
        createLabel: function(dom) {
            dom.wrapInner('<span class="cus-spinner-label"></span>');
        },
        createSpinner: function(dom) {
            var arr = [];
            arr.push('<div class="cus-spinner cus-spinner-fading-circle">');
            for(var i = 1; i <= 12; i++) {
                arr.push('<div class="cus-circle', i, ' cus-circle"></div>');
            }
            arr.push('</div>');
            dom.append(arr.join(''));
        },
        open: function(selector) {
            var _dom = $.type(selector) == 'string' ? $('#' + selector) : selector;
            _dom.addClass('cus-spinner-box').attr('data-loading', '').prop('disabled', true);
            _dom.children('.cus-spinner-label').length == 0 && this.createLabel(_dom);
            _dom.children('.cus-spinner').length == 0 && this.createSpinner(_dom);
        },
        close: function(selector) {
            var _dom = $.type(selector) == 'string' ? $('#' + selector) : selector;
            _dom.removeAttr('data-loading').prop('disabled', false);
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
    cus_mult_choice: function(id, btnfn, num, id_1, id_2) {
        var p_ = $('#' + id),
            t_ = p_.children('.cus-mult-choice'),
            hidenInp_1 = id_1 ? $('#' + id_1) : [],
            hidenInp_2 = id_2 ? $('#' + id_2) : [];
        //事件绑定    
        p_.on('click', '.js-mult-remove', function() {
            $(this).closest('.mult-item').remove();
            hidenInp_1.length && hidenInp_1.val(obj_.setHiddenValue('code'));
            hidenInp_2.length && hidenInp_2.val(obj_.setHiddenValue('text'));
        }).on('click', '.cus-mult-btn', function() {
            btnfn && btnfn();
        });
        var obj_ = {
            addItem: function(id, text) {
                if((num != '-1') && t_.find('span').length >= num) {
                    COM_TOOLS.alert('最多添加' + num + '个');
                    return false;
                }
                if(t_.children('span').is('[data-code=' + id + ']')) { //判断唯一
                    return false;
                }
                t_.append('<span data-text="' + text + '" data-code="' + id + '" class="mult-item">' + text + ' <i class="glyphicon glyphicon-remove js-mult-remove"></i></span>');
                hidenInp_1.length && hidenInp_1.val(obj_.setHiddenValue('code')).trigger('focusout.validate');
                hidenInp_2.length && hidenInp_2.val(obj_.setHiddenValue('text'));
            },
            removeAll: function() {
                t_.html('');
                hidenInp_1.length && hidenInp_1.val('');
                hidenInp_2.length && hidenInp_2.val('');
            },
            backfill: function(id_str, name_str) {
                if((id_str != null) && id_str.length) {
                    var id_arr = id_str.split(',');
                    var name_arr = name_str.split(',');
                    var obj_arr = [];
                    $.each(id_arr, function(i, n) {
                        obj_.addItem(n, name_arr[i]);
                    });
                }
            },
            getMultItem: function(type_) { //获取选择的值
                var arr_ = [],
                    type_ = type_ || 0;
                $.each(t_.find('span'), function(i, n) {
                    arr_.push(type_ ? $(n).data() : $(n).data('code'));
                });
                return arr_;
            },
            setHiddenValue: function(param) {
                var arr = [];
                $.each(t_.find('span'), function(i, n) {
                    arr.push($(n).data(param));
                });
                return arr.join(',');
            }
        }
        return obj_;
    },
    /**
     * 解析对象型字符串，并尝试转换成对象
     * @param {String} str 需解析的字符串
     */
    parseOjects: function(str) {
        var d_ = {};
        str = $.trim(str);
        if(str) {
            if(str.substring(0, 1) != "{") {
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
    parseArray: function(str) {
        var d_ = [];
        str = $.trim(str);
        if(str != '') {
            if(str.substring(0, 1) != "[") {
                str = "[" + str + "]";
            }
            d_ = (new Function("return " + str))();
        }
        return d_;
    },
    /**
     * 自定义 ajax,支持loading遮罩
     * @param {Object} ajaxOpt $.ajax原生配置属性;
     * @param {Number} shadeType 1:全屏loading遮罩；2:button loading遮罩;
     * @param {Object|String} shadeOpt 遮罩配置信息； shadeType=1时，默认[0.5,'#000']；shadeType=2时，为button id 或 jQuery对象;
     */
    ajaxFn: function(ajaxOpt, shadeType, shadeOpt) {
        var _default = {
            beforeSend: function(XHR) {
                if(shadeType == 1) {
                    COM_TOOLS.loadingShade.open(0, shadeOpt);
                } else if(shadeType == 2) {
                    COM_TOOLS.loadingBtn.open(shadeOpt);
                }
                $.type(ajaxOpt['beforeSend']) == 'function' && ajaxOpt['beforeSend'](XHR);
            },
            complete: function(XHR, textStatus) {
                setTimeout(function() { //延时解锁，等待关闭动画（dom-remove）执行完再解锁
                    if(shadeType == 1) {
                        COM_TOOLS.loadingShade.close();
                    } else if(shadeType == 2) {
                        COM_TOOLS.loadingBtn.close(shadeOpt);
                    }
                }, 300);
                $.type(ajaxOpt['complete']) == 'function' && ajaxOpt['complete'](XHR, textStatus);
            }
        };
        var _aOpt = {
            dataType: "json"
        };
        $.extend(true, _aOpt, ajaxOpt, _default);
        return $.ajax(_aOpt);
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
                trigger: 'click',
                width: '',
                html: true,
                title: '<button type="btn" class="btn btn-warning btn-sm cus-pop-close" onclick="javascript:$(\'#' + id + '\').trigger(\'click\')"><i class="glyphicon glyphicon-chevron-up"></i></button>'
            };
            var tar_ = '',
                rep_ = '';
            if($.type(opt) == "object") {
                tar_ = $(opt['content']);
                opt['content'] = tar_.html();
                $.extend(param_, opt);
            };
            $('#' + id).popover({
                html: param_['html'],
                container: param_['container'],
                placement: param_['placement'],
                content: param_['content'],
                trigger: param_['trigger'],
                title: param_['title'],
                template: '<div class="popover cus-popover-box2" role="tooltip"><div class="arrow"></div><h3 class="popover-title text-right"></h3><div class="popover-content"></div></div>',
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
            }).on('inserted.bs.popover', function() {
                if(param_['width']) {
                    $('#' + $(this).attr('aria-describedby')).css({
                        'width': param_['width'],
                        'max-width': 'none'
                    });
                }
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
            }).find('.js-moreSearchBox').click(function() { //防止点击弹出框自动关闭
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
        /* 标签滚动 */
        tabScrollFn: {
            dom_: {
                ul_: $([]),
                overBox_: $([]),
            },
            sumWidth: function(ele) { //计算元素总宽度
                var width_ = 0;
                $(ele).each(function() {
                    width_ += $(this).outerWidth();
                });
                return width_;
            },
            scrollTabLeft: function() { //往左按钮
                var marginLeftVal = Math.abs(parseInt(this.dom_.ul_.css('margin-left'))),
                    visibleWidth = this.dom_.overBox_.width(),
                    scrollVal = 0;
                if(this.dom_.ul_.width() < visibleWidth) { //内容宽度 小于 可视宽度
                    return false;
                } else {
                    var tabEle = this.dom_.ul_.find("li:first"),
                        offsetVal = 0; //计算距离用的
                    while((offsetVal + $(tabEle).outerWidth()) <= marginLeftVal) { //离 mar 的距离，最近的那个 dom 元素
                        offsetVal += $(tabEle).outerWidth();
                        tabEle = $(tabEle).next(); //大于 marginLeftVal 的那个
                    } //所以 tabElement 的最后结果是 >= marginLeftVal 的那个
                    offsetVal = 0;
                    if(this.sumWidth($(tabEle).prevAll()) > visibleWidth) { //滚动距离大于一页时
                        while((offsetVal + $(tabEle).outerWidth()) < (visibleWidth) && tabEle.length > 0) {
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
            scrollTabRight: function() { //往右按钮
                var marginLeftVal = Math.abs(parseInt(this.dom_.ul_.css('margin-left'))),
                    visibleWidth = this.dom_.overBox_.width(),
                    scrollVal = 0;
                if(this.dom_.ul_.width() < visibleWidth) {
                    return false;
                } else {
                    var tabEle = this.dom_.ul_.find("li:first"),
                        offsetVal = 0;
                    while((offsetVal + $(tabEle).outerWidth()) <= marginLeftVal) { //离 mar 的距离，最近的那个 dom 元素
                        offsetVal += $(tabEle).outerWidth();
                        tabEle = $(tabEle).next();
                    }
                    if(offsetVal < (this.dom_.ul_.outerWidth() - visibleWidth)) { //防止最后一个dom元素已经显示出来，还继续滚动
                        offsetVal = 0;
                        while((offsetVal + $(tabEle).outerWidth()) < (visibleWidth) && tabEle.length > 0) {
                            offsetVal += $(tabEle).outerWidth();
                            tabEle = $(tabEle).next();
                        }
                    }
                    scrollVal = this.sumWidth($(tabEle).prevAll()); //找到临界值的那个 dom 并计算它之前的距离，所有会包含它本身
                    if(scrollVal > 0) {
                        this.dom_.ul_.animate({
                            marginLeft: 0 - scrollVal + 'px'
                        }, "fast");
                    }
                }
            },
            scrollToTab: function(ele) { //点击tab标签
                var marginLeftVal = this.sumWidth($(ele).prevAll()),
                    marginRightVal = this.sumWidth($(ele).nextAll()),
                    visibleWidth = this.dom_.overBox_.width(),
                    scrollVal = 0;
                if(this.dom_.ul_.outerWidth() < visibleWidth) {
                    scrollVal = 0;
                } else if(marginRightVal <= (visibleWidth - ($(ele).outerWidth() + $(ele).next().outerWidth()))) { //靠右边
                    if((visibleWidth - $(ele).next().outerWidth()) > marginRightVal) {
                        scrollVal = marginLeftVal; //注意这里
                        var tabEle = ele;
                        while((scrollVal - $(tabEle).outerWidth()) >= (this.dom_.ul_.outerWidth() - visibleWidth) /* 被隐藏的部分距离 */ ) {
                            scrollVal -= $(tabEle).prev().outerWidth();
                            tabEle = $(tabEle).prev();
                        }
                    }
                } else if(marginLeftVal > (visibleWidth - ($(ele).outerWidth() + $(ele).prev().outerWidth()))) { //靠左边,包括中间
                    scrollVal = marginLeftVal - $(ele).prev().outerWidth();
                }
                this.dom_.ul_.animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            },
            init: function(selector) { //绑定及初始化
                var cont_ = $(selector),
                    that = this;
                this.dom_ = {
                    ul_: cont_.find('.tab-list-ul'),
                    overBox_: cont_.find('.tab-list-overflow')
                }
                cont_.on('click', '.tab-list-ul li', function() {
                    that.scrollToTab($(this));
                }).on('click', '.tab-left-btn', function() {
                    that.scrollTabLeft();
                }).on('click', '.tab-right-btn', function() {
                    that.scrollTabRight();
                });
            }
        }
    },
    /* 定制公共模块 */
    _model: {
        set_i18n_fn: function(cboxid, geturl, seturl) {
            if(!cboxid || !geturl || !seturl) {
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
                    success: function(d) {
                        if(d && $.type(d) == 'array') {
                            $.each(d, function(i, n) {
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
                if($.type(data) == 'array' && data.length > 0) {
                    var arr = [];
                    arr.push('<div class="form-horizontal">');
                    $.each(data, function(j, m) {
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
                contBOx_.find('input.js-input-val[required]').on('blur', function() {
                    if($.trim($(this).val()) == '') {
                        COM_TOOLS._view.setInputStatus($(this), 'error');
                    } else {
                        COM_TOOLS._view.setInputStatus($(this), '');
                    }
                });
            }

            tabModel_.find('.js-cus-btn-save').click(function() {
                var _that = $(this);
                COM_TOOLS.confirm(TEDU_MESSAGE.get('platform.plugin.com_msg.tab_separate'), function(in_) {
                    layer.close(in_);
                    var curPane_ = tabModel_.find('.js-create-content .tab-pane.active');
                    var pid_ = curPane_.data('pid') || '';
                    var item_ = curPane_.find('.form-group');
                    var arr = [],
                        look_ = false;
                    item_.each(function() {
                        var this_ = $(this),
                            input_ = this_.find('input.js-input-val');
                        if(input_.prop('required') && $.trim(input_.val()) == '') {
                            look_ = true;
                        }
                        arr.push({
                            'cCode': this_.data('dcode'),
                            'lCode': pid_,
                            'name': $.trim(input_.val())
                        });
                    });
                    if(!look_) {
                        COM_TOOLS.ajaxFn({
                            url: seturl,
                            type: 'POST',
                            data: {
                                data: JSON.stringify(arr)
                            },
                            success: function(d) {
                                if(d.code == '1') {
                                    COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.success'));
                                } else if(d.code == '-2') { //必须含有简体中文
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
            }).end().find('.js-cus-btn-refresh').click(function() {
                tabBox_.html('');
                contBOx_.html('');
                _init();
            });
            COM_TOOLS._view.tabScrollFn.init('#js_cus_tabmodel_box .js-tab-list-box');
        },
        /**
         * 系统消息弹窗
         * @param {Object} data 数据对象
         * @param {Object} opt 弹窗配置
         */
        msg_fn: function(data, opt) {
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
            if(data.type == '1') {
                def['other']['skin'] += 'layui-skin-warning';
            } else {
                def['other']['skin'] += 'layui-skin-primary';
            }
            content_.push('<h3>', data.title, '</h3>');
            content_.push('<div class="ind-msg-cont">', data.msg, '</div>');
            cumCurWinModal(TEDU_MESSAGE.get('platform.plugin.com_msg.message_notice'), content_.join(''), top, def);
        }
    }
};
/* 通用工具 end */
/* 通用配置start */
var COM_DEFAULT = {
    /* --功能配置start-- */
    /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
    "_customMenus": 6,
    /*控制主页tab标签打开个数,必须为数字*/
    "_tabSingle": 3,
    /* contentPath webxml项目包名、路径 */
    "_webPath": "/",
    /* 系统默认标签主页地址 */
    "_tabHomePage": "index_default.html",
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
    "_isOpenNotice": {
        "geturl": "",
        "seturl": "",
        "isDisplay": false, //控制是否显示公告
        "delayTime": 5, //控制弹出时长 单位:s
        "requestTime": 300 //控制每次请求的时长 单位:s; 不能小于10；
    },
    /*是否启用开关控制tab导航条显隐*/
    "_isOpenSwitch": true,
    /*是否开启请求监听*/
    "_isOpenTimeInterval": true,
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
    /* 数型组件默认配置 */
    "_jsTreeOpt": {
        "root": "0" //树形组件根节点ID，谨慎修改；
    }
    /* --组件配置end-- */
};
(function() {
    if(window.cus_default_ && $.type(window.cus_default_) == 'object') {
        $.extend(true, COM_DEFAULT, window.cus_default_);
        if(COM_TOOLS.localStorageSupport()) {
            COM_TOOLS.save_toLocal('cus_default', window.cus_default_);
            console.log('#save_toLocal-', window.cus_default_);
        }
    } else {
        if(COM_TOOLS.localStorageSupport()) {
            var opt_ = {},
                strOpt_ = COM_TOOLS.get_fromLocal('cus_default');
            console.log('#get_fromLocal-', strOpt_);
            if(strOpt_) {
                try {
                    opt_ = $.parseJSON(strOpt_);
                } catch(e) {
                    console.error('修改默认配置参数出错！');
                }
                $.extend(true, COM_DEFAULT, opt_);
            }
        }
    }
})();
/* 通用配置end */

COM_TOOLS.initjSDefaultOpt('ALL');
//self != top && COM_TOOLS.check_Abtn(); //未使用