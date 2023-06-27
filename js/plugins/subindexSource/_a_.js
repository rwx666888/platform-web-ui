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

