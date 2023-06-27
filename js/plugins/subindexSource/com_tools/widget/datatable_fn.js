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
};