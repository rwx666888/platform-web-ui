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
};