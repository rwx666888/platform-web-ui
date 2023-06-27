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
};