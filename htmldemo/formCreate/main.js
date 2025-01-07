/* 美化插件配置项 */
var BEAUFLY_OPTION = {
    "indent_size": "2",
    "indent_char": " ",
    "max_preserve_newlines": "-1",
    "preserve_newlines": false,
    "keep_array_indentation": false,
    "break_chained_methods": false,
    "indent_scripts": "normal",
    "brace_style": "collapse",
    "space_before_conditional": true,
    "unescape_strings": false,
    "jslint_happy": false,
    "end_with_newline": false,
    "wrap_line_length": "0",
    "indent_inner_html": false,
    "comma_first": false,
    "e4x": false,
    "indent_empty_lines": false
};
/* 数据库字段 */
var DB_CONFIGDATE = [{
    column_defaultvalue: "",
    column_desc: "主键",
    column_iskey: "true",
    column_length: "4",
    column_name: "id",
    column_notupdate: "true",
    column_type: "int",
    column_readonly: "true"
}];

var _COM_OPT_ = {
    footerjsp : '<%@ include file="../../../common/jsp/footer.jsp"%>'
}

/* 注册过滤器 */
//字符串转数组
template.defaults.imports.to_split = function(str){return str.split(',');};

//数据字典模块数据源
var _DIST_SOURCE_ = [];

var _DBCOM_ = {}; //全局配置
var _HASJAVACODE_ = true; //是否包含java代码；例如 shiro；
/* 消息框配置 */
toastr.options = {
    "closeButton": true,
    "preventDuplicates": true,
    "positionClass": "toast-top-right",
};

function make_db_tatle() {
    $('#db_configbox').html(template.render($('#db_codebox').html(), DB_CONFIGDATE));
}
make_db_tatle();

function get_db_configdata() { //获取数据库配置数据
    var data_ = [];
    $('#db_configbox tr').each(function () {
        var d_ = COM_TOOLS.serializeObject($(this).find('.js-item-ele'));
        if (d_.column_name != '') {
            d_.column_name_uni = toCamel(d_.column_name);
            var haved_ = false;
            $.each(data_, function (i, n) {
                if (d_.column_name_uni.toLowerCase() == n.column_name_uni.toLowerCase()) {
                    haved_ = true;
                    return false;
                }
            });
            if (haved_) { //存在重复列
                toastr.warning('名称为' + d_.column_name + '的列已存在，自动忽略！', '存在重复列');
            } else {
                data_.push(d_);
            }
        }
    });
    DB_CONFIGDATE = data_;
    return data_;
}

function get_page_configdata() { //获取页面配置数据
    var data_ = [];
    $('#page_configbox tr').each(function () {
        var d_ = COM_TOOLS.serializeObject($(this).find('.js-item-ele'));
        if (d_.label_name != '') {
            d_.valid_opt_ = $(this).data('validopt') || {};
            d_.plugin_ext_opt_ = $(this).data('plug_opt') || {}; //字典类“表单元素的类型”由配置项控制,所以冗余配置项信息
            data_.push(d_);
        } else {
            toastr.warning('名称为' + d_.column_name + '的列label名称无效！', 'label无效');
        }
    });
    return data_;
}

function get_page_config_jscode() {
    var data_ = [];
    $('#page_configbox tr').each(function () {
        var status_ = $(this).find('.js-item-plubtn option:selected').data('used_opt');
        if (status_) {
            var d_ = $(this).data('plug_opt') || {};
            var this_p_ = $.trim($(this).find('.js-item-plubtn').val());
            var is_inform = $(this).find('[name="inform"]').is(':checked');
            if (this_p_ && is_inform) {
                d_.id = 'ele_md_' + $(this).data('column_name'); //组件ID
                d_.column_name = $(this).data('column_name'); //列名
                data_.push({
                    t: this_p_, //组件名称
                    d: d_ //组件配置信息
                });
            }
        }
    });
    return data_;
}
/* 构造表单页代码 */
function get_sfpage_htmlStr() {
    var curd_ = get_page_configdata();
    var d_ = $.map(curd_, function (n) {
        return n.inform == 'true' ? n : null;
    });
    if (!d_.length) {
        COM_TOOLS.alert('无可显示的表单元素！');
        return false;
    }

    var js_code_arr = [];
    var js_d_ = get_page_config_jscode(); //获取组件配置
    if (js_d_.length) {
        $.each(js_d_, function (i, n) {
            if ($('#plugincode_js_' + n.t).length) {
                js_code_arr.push(beautifier.js(template.render($('#plugincode_js_' + n.t).html(), n.d || {})));
            }
        });
    }
    console.log('----', d_, '--------', js_code_arr.join(''));
    return beautifier.html(template.render($('#formpage_codebox').html(), {
        columnlen: $('[name="page_columns"]:checked').val(),
        list: d_,
        jscodestr: js_code_arr.join('')
    }), BEAUFLY_OPTION).replace(/shiro:haspermission/g, 'shiro:hasPermission');
}
/* 构造list页代码 */
function get_listpage_htmlStr() {
    var curd_ = get_page_configdata();
    var d_ = $.map(curd_, function (n) { //列表
        return n.iflist == 'true' ? n : null;
    });
    var sd_ = $.map(curd_, function (n) { //查询条件
        return n.insearch == 'true' ? n : null;
    });
    if (!d_.length) {
        COM_TOOLS.alert('无可显示的列表元素！');
        return false;
    }
    return beautifier.html(template.render($('#listpage_codebox').html(), {
        columnlist: d_,
        searchlist: sd_
    }), BEAUFLY_OPTION).replace(/shiro:haspermission/g, 'shiro:hasPermission');
}

/* 构造详情页代码 */
function get_infopage_htmlStr() {
    var curd_ = get_page_configdata();
    var d_ = $.map(curd_, function (n) {
        return n.inform == 'true' ? n : null;
    });
    if (!d_.length) {
        COM_TOOLS.alert('无可显示的表单元素！');
        return false;
    }
    return beautifier.html(template.render($('#infopage_codebox').html(), {
        columnlen: $('[name="page_columns"]:checked').val(),
        list: d_
    }), BEAUFLY_OPTION).replace(/shiro:haspermission/g, 'shiro:hasPermission');
}

function get_dbCom() { //获取并修改全局配置信息
    var dbCom_ = COM_TOOLS.serializeObject('#db_com_form');
    if (!dbCom_.tabName) {
        toastr.warning('数据库表名不能为空！', '数据库全局配置');
        return false;
    } else if (!dbCom_.className) {
        toastr.warning('名类名不能为空！', '数据库全局配置');
        return false;
    }
    _DBCOM_ = dbCom_;
    return dbCom_;
}

function toCamel(str) { //下划线转小驼峰
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + $2.toUpperCase();
    });
}

$(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        if ($(e.target).is('[href="#page_option"]')) {
            var d_ = get_db_configdata();
            if (!d_.length) {
                COM_TOOLS.alert('无有效数据库属性配置信息！');
                return false;
            }
            $.each(d_, function (i, n) { //将列名改为小驼峰，以用于构造页面元素，及参数
                n.column_name = n.column_name_uni;
            });
            $('#page_configbox').html(template.render($('#page_codebox').html(), d_));
        }
        if ($(e.relatedTarget).is('[href="#page_option"]')) {
            return confirm("该操作会导致当前所有配置信息重置，是否继续？");
        }
    });
    $('#js-btn-additem').click(function () {
        get_db_configdata();
        DB_CONFIGDATE.push({});
        make_db_tatle();
    });
    $('#js-btn-delitem').click(function () {
        if (DB_CONFIGDATE.length == 0) {
            return false;
        }
        $('#db_configbox .js-item-checkedbox:checked').each(function (i, n) {
            var index_ = $(this).closest('tr').index();
            index_ !== -1 && DB_CONFIGDATE.splice(index_ - i, 1);
        });
        make_db_tatle();
    });
    /* 预览表单页面 */
    $('#js-btn-sfpage-form').click(function () {
        var dbCom_ = get_dbCom();
        if (!dbCom_) {
            return false;
        }
        _HASJAVACODE_ = false;
        var html_ = get_sfpage_htmlStr();
        console.log('预览', html_);
        html_ && cumParentWinModal('预览', new URL('scanfpage.html', window.location).href , {
            success: function (a, b, c) {
                c.init_pageFn({
                    htmlcode: html_
                });
            }
        });
    });

    $('#page_configbox').on('click', '.js-item-serbtn', function () {
        var $this = $(this);
        var $sel_ = $this.closest('tr').find('.js-item-sertype');
        $sel_.prop('disabled', !$this.is(':checked'));
    }).on('change', '.js-item-plubtn', function () {
        var $this = $(this);
        var $tr = $this.closest('tr');
        $tr.removeData('plug_opt');
    }).on('click', '.js-plugopt-btn', function () {
        $('#modal_plugin_valid_cont').html('');
        $('#modal_plugin_opt_cont').html('');
        $('#modal_plugin_tabs a[href="#tt_valodate"]').tab('show');
        $('#modal_plugin_tabs a[href="#tt_pluopt"]').parent().hide();
        var $tr = $(this).closest('tr');
        var cur_col_name = $tr.data('column_name');
        var status_ = $tr.find('.js-item-plubtn option:selected').data('used_opt'); //是否应用配置管理
        //获取validate 配置信息
        var valid_opt = $tr.data('validopt');
        $('#modal_plugin_valid_cont').html(template.render($('#template_form_valid').html(), valid_opt || {}));
        var this_modal = $.trim($tr.find('.js-item-plubtn').val());
        if (this_modal && status_ && $('#template_' + this_modal + '_opt').length) {
            $('#modal_plugin_opt_cont').html(template.render($('#template_' + this_modal + '_opt').html(), $.extend(true, {'ele_id_': cur_col_name}, ($tr.data('plug_opt') || {})) ));
            $('#modal_plugin_tabs a[href="#tt_pluopt"]').parent().show();
        }
        $('#modal_plugin_opt').data('t_curtr', $tr);
        $('#modal_plugin_opt').modal('show');
    });

    $("#db_configbox").sortable({
        handle: ".js-sort-btn",
        update: function (event, ui) {
            get_db_configdata();
            make_db_tatle();
        }
    });
    /* 配置属性窗口-保存按钮 */
    $('#modal_plugin_opt_savebtn').click(function () {
        var $modal = $('#modal_plugin_opt');
        var $tr = $('#modal_plugin_opt').data('t_curtr');
        $tr.data('plug_opt', COM_TOOLS.serializeObject('#modal_plugin_opt_cont')); //组件配置信息
        $tr.data('validopt', COM_TOOLS.serializeObject('#modal_plugin_valid_cont')); //表单验证信息
        $modal.modal('hide');
    });
    /* 配置属性窗口-重置并关闭窗口按钮 */
    $('#modal_plugin_opt_resetbtn').click(function () {
        var $modal = $('#modal_plugin_opt');
        var $tr = $('#modal_plugin_opt').data('t_curtr');
        $tr.removeData('plug_opt');
        $tr.data('validopt', COM_TOOLS.parseOjects($tr.attr('data-validopt'))); //表单验证信息
    });

    /* 提交数据 */
    $('#sendtomakebtn').click(function () {
        var dbCom_ = get_dbCom();
        if (!dbCom_) {
            return false;
        }
        _HASJAVACODE_ = true;
        COM_TOOLS.ajaxFn({
            contentType: 'application/json',
            type: 'post',
            url: '/a',
            data: JSON.stringify({
                dbCom: dbCom_,
                dbOpt: get_db_configdata(),
                pageOpt: get_page_configdata(),
                formPageStr: get_sfpage_htmlStr(),
                listPageStr: get_listpage_htmlStr(),
                infoPageStr: get_infopage_htmlStr()
            }),
            success: function (dd) {

            }
        }, 3, $(this));

    });

    /* 加密 */
    (new Function(function (p, a, c, k, e, d) {
        e = function (c) {
            return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
        };
        if (!''.replace(/^/, String)) {
            while (c--) d[e(c)] = k[c] || e(c);
            k = [function (e) {
                return d[e]
            }];
            e = function () {
                return '\\w+'
            };
            c = 1;
        };
        while (c--)
            if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
        return p;
    }('0.1(\'2\');', 3, 3, 'console|log|\u005e\u005f\u005e\u0020\u8001\u9648\u6b20\u6211\u4e00\u7bb1\u51b0\u6dc7\u6dcb\u0021\u0020\u0020\u005e\u005f\u005e'.split('|'), 0, {})))();

    new ClipboardJS('#sendtomakebtn_local', {
        text: function (trigger) {
            var dbCom_ = get_dbCom();
            if (!dbCom_) {
                return false;
            }
            _HASJAVACODE_ = false;
            return '\n\n<!-- 表单页 start -->\n\n' + get_sfpage_htmlStr() + '\n\n<!-- 表单页 end -->\n\n' +
                '\n\n<!-- 列表页 start -->\n\n' + get_listpage_htmlStr() + '\n\n<!-- 列表页 end -->\n\n' +
                '\n\n<!-- 详情页 start -->\n\n' + get_infopage_htmlStr() + '\n\n<!-- 详情页 end -->\n\n';
        }
    });

});