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
}