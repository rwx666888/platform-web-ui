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
};