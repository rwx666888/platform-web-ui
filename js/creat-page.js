// 
//  creat-page.js
//  <project>
//  
//  Created by lianglei on 2017-06-18.
//  Copyright 2017 lianglei. All rights reserved.
// 

function getPageCodeFn() {
    var createBox = $('#js_creat_hide_box');
    createBox.html($('#js_creat_box').html());
    createBox.find('.js-md-title, .js-btn-box').remove();
    createBox.find('.js-col-box .js-col-box .js-col-box .js-col-box .js-model-item').each(function(i, n) {
        makeHtmlDom(n);
    });
    createBox.find('.js-col-box .js-col-box .js-col-box .js-model-item').each(function(i, n) {
        makeHtmlDom(n);
    });
    createBox.find('.js-col-box .js-col-box .js-model-item').each(function(i, n) {
        makeHtmlDom(n);
    });
    createBox.find('.js-col-box .js-model-item').each(function(i, n) {
        makeHtmlDom(n);
    });
    createBox.find('.js-model-item').each(function(i, n) {
        makeHtmlDom(n);
    });
    console.log(createBox.html());
    console.log($.htmlClean(createBox.html(), {
        format: true,
        allowedAttributes: [["id"], ["class"], ["data-toggle"], ["data-target"], ["data-parent"], ["role"], ["data-dismiss"], ["aria-labelledby"], ["aria-hidden"], ["data-slide-to"], ["data-slide"]]
    }));
}

function makeHtmlDom(obj) {
    $(obj).parent().append($(obj).children().html()).end().remove();
}

function makeJsPluginsIds(obj) {
    var that_ = $(obj);
}

/**
 * 组件格式化控制器
 * @param {Object} obj
 */
function formatThatPlugin(obj) {
    var _thatJsPlug = obj.data('that_jsplug');
    if(_thatJsPlug) {
        if(_thatJsPlug == 'formele') {
            DOM_FNTOOL.formatFormEle(obj); //代码格式化
            DOM_FNTOOL.initJsFn(obj); //组件初始化
            return;
        }
    }
}

$(function() {
    /* 区块排序 */
    $("#js_creat_box, #js_creat_box .js-ent-col").sortable({
        connectWith: "#js_creat_box, #js_creat_box .js-ent-col",
        opacity: 0.4,
        handle: ".js-btnbar-move",
        stop: function(e, u) {}
    });
    /* 区块拖拽 */
    $("#accordion .js-md-col").draggable({
        connectToSortable: "#js_creat_box",
        helper: "clone",
        appendTo: "#cus-creat-page",
        handle: ".js-btnbar-move",
        forceHelperSiz: true,
        containment: 'window',
        drag: function(e, u) {
            //u.helper.width(360);
        },
        stop: function(e, u) {
            if(u.helper.hasClass('js-md-col-nmform')) { //一般表单和内联表单
                $("#js_creat_box .js-ent-col-nmform").sortable({
                    handle:".js-btnbar-move",
                    opacity: 0.4,
                    connectWith: "#js_creat_box .js-ent-col-nmform",
                    /*start:function(e,u){
                    	console.log(u.item.closest('form'))
                    	if(u.item.closest('form').hasClass('form-horizontal')){
                    		u.item.data('formtype','form-horizontal');
                    	}else{
                    		u.item.data('formtype','form-normal');
                    	}
                    },*/
                    stop: function(e, u) {
                        console.log(2);
                        formatThatPlugin(u.item);
                    }
                });
            } else { //一般区块
                $("#js_creat_box .js-ent-col").sortable({
                    handle:".js-btnbar-move",
                    opacity: 0.4,
                    connectWith: "#js_creat_box, #js_creat_box .js-ent-col"
                });
                if(u.helper.hasClass('js-md-col-tabs')) { //tabs框架
                    var obj_ = $('#js_creat_box [mdata-itemid="' + u.helper.attr('mdata-itemid') + '"]');
                    DOM_FNTOOL.addATabEle(obj_);
                    obj_.attr('mdata-itemid', 'tab_' + DOM_FNTOOL.getModelRandomId());
                }
            }
        }
    });
    /* 内容模块拖拽 */
    $("#accordion .js-md-mod").draggable({
        connectToSortable: "#js_creat_box .js-ent-col",
        helper: "clone",
        appendTo: "#cus-creat-page",
        handle: ".js-btnbar-move",
        forceHelperSiz: true,
        containment: 'window',
        drag: function(e, u) {

        },
        stop: function(e, u) {}
    });
    /* 拖拽表单逻辑行 .form-group */
    $("#accordion .js-md-col-formgp").draggable({
        connectToSortable: "#js_creat_box",
        helper: "clone",
        appendTo: "#cus-creat-page",
        handle: ".js-btnbar-move",
        forceHelperSiz: true,
        containment: 'window',
        drag: function(e, u) {
            //u.helper.width(360)
        },
        stop: function() {
            $("#js_creat_box .js-ent-col-formgp").sortable({ //初始化新区块
                handle:".js-btnbar-move",
                opacity: 0.4,
                connectWith: "#js_creat_box .js-ent-col-formgp",
                stop: function(e, u) {
                    formatThatPlugin(u.item);
                }
            });
        }
    });
    /* 拖拽表单元素 */
    $("#accordion .js-md-mod-formele").draggable({
        connectToSortable: "#js_creat_box .js-ent-col-formgp, #js_creat_box .js-ent-col-nmform",
        helper: "clone",
        appendTo: "#cus-creat-page",
        handle: ".js-btnbar-move",
        forceHelperSiz: true,
        containment: 'window',
        stop: function(e, u) {
            console.log(3);
            if(u.helper.hasClass('js-md-plug-init')) { //加载组件及初始化
                var obj_ = $('#js_creat_box [mdata-itemid="' + u.helper.attr('mdata-itemid') + '"]');
                obj_.attr('mdata-itemid', 'mitem_' + DOM_FNTOOL.getModelRandomId());
            }
        }
    });
    $("#js_creat_box").on('click', '.js-close-btn-tabs', function() { //删除标签
        DOM_FNTOOL.delATabEle($(this));
    }).on('click', '.js-evt-btn-addtab', function() { //添加标签
        DOM_FNTOOL.addATabEle($(this).closest('.js-model-item'));
    });
    $('#js-left-box').mCustomScrollbar({
        theme: "minimal-dark"
    });
});

var DOM_FNTOOL = {
    /**
     * 格式化form元素
     * @param {Object} obj 拖拽对象
     */
    formatFormEle: function(obj) {
        var form_ = obj.closest('form');
        var s_html_ = obj.find('.js-code-hide-box').html();
        var s_box_ = obj.find('.js-code-source-box');
        if(s_box_.length==0){
            s_box_ = $('<div class="js-code-source-box"></div>');
            obj.append(s_box_);
        }
        if(form_.hasClass('form-horizontal')) {
            var formCol_ = obj.parent('.form-group');
            var div_ = $('<div></dib>');
            var colSize = (formCol_.data('colsize') || '2,3').split(',');
            div_.html(s_html_);
            obj.addClass('col-sm-' + 12 / Math.floor(12 / (parseInt(colSize[0]) + parseInt(colSize[1]))));
            div_.find('label:not([class])').addClass('control-label col-sm-' + colSize[0]).nextAll().wrapAll('<div class="col-sm-' + colSize[1] + '"></div>');
           // s_box_.html(div_.html());
            console.log('sss',div_.html());
            console.log('222',div_.attr('mdata-itemid'));
            div_.attr('mdata-itemid','fghgh');
            console.log('222sss',div_.html());
            obj.find('.js-code-box').html(div_.html());
            div_.remove();
            div_ = null;
            return;
        }
        //s_box_.html('<div class="form-group">' + s_html_ + '</div>');
        obj.find('.js-code-box').html('<div class="form-group">' + s_html_ + '</div>');
        return;
    },
    /**
     * 添加一个标签
     * @param {Object} obj 拖拽对象
     */
    addATabEle: function(obj) {
        var tabBox_ = obj.find('.nav-tabs'),
            isfrist = !tabBox_.children('li').length,
            id_ = 'mid_' + DOM_FNTOOL.getModelRandomId(),
            tab_ = $('<li class="' + (isfrist ? 'active' : '') + '"><a href="#' + id_ + '" data-toggle="tab">' + id_ + '</a><i class="js-close-btn-tabs text-danger glyphicon glyphicon-remove-circle"></i></li>'),
            cont_ = $('<div class="tab-pane js-col-box js-ent-col ' + (isfrist ? 'active' : '') + '" id="' + id_ + '">' + id_ + '</div>');
        tabBox_.append(tab_).next('.tab-content').append(cont_);
        cont_.sortable({
            handle:".js-btnbar-move",
            opacity: 0.4,
            connectWith: "#js_creat_box, #js_creat_box .js-ent-col"
        });
    },
    /**
     * 删除一个标签
     * @param {Object} obj 拖拽对象
     */
    delATabEle: function(obj) {
        var tab_ = obj.parent('li'),
            cont_ = $(tab_.children('a').attr('href'));
        if(tab_.hasClass('active')) {
            var siblings_ = tab_.siblings('li');
            if(!siblings_.length) {
                // TODO 删除整个标签框架模块
            } else {
                siblings_.eq(0).children('a').trigger('click');
            }
        }
        tab_.remove();
        cont_.remove();
    },
    initJsFn: function(obj) {
        var _thatJsInit = obj.data('that_jsinit');
        var _thatOpt = this.parseOptions(obj.data('that_plugopt')) || {};
        //var _itemId = obj.attr('mdata-itemid');
        if(_thatJsInit) {
            var id_ = 'mid_' + DOM_FNTOOL.getModelRandomId();
            if(_thatJsInit == 'select2') {
                obj.find('.js-code-box select.form-control').attr('id', id_);
                COM_TOOLS.requireJsFn(['select2'], [], function() {
                    $('#' + id_).select2(_thatOpt);
                });
                return;
            }
            if(_thatJsInit == 'datetimepicker') {
                obj.find('.js-code-box .input-group.date').attr('id', id_);
                COM_TOOLS.requireJsFn(['datetimepicker'], [], function() {
                    $('#' + id_).datetimepicker(_thatOpt);
                });
                return;
            }
            if(_thatJsInit == 'icheck') {
                obj.find('.i-checks > input').attr('name', 'name_' + id_.split('_')[1]).addClass('jsclass-' + id_.split('_')[1]);
                COM_TOOLS.requireJsFn(['icheck'], [], function() {
                    $('.' + 'jsclass-' + id_.split('_')[1]).iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'
                    });
                });
                return;
            }
            if(_thatJsInit == 'jstree') {
                return;
            }
        }
    },
    parseOptions: function(str) {
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
    getModelRandomId: function() {
        return String((new Date()).getTime()) + String(COM_TOOLS.get_random_fun(2));
    }
}