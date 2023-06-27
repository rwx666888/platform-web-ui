/**
 * 自定义组织架构组件,内部方法,无状态;
 * @param {Object} opt
 */
COM_TOOLS._model._orgModel_ = function (opt) {
    var obj = {};
    opt = $.type(opt) == "object" ? opt : {};
    var _option = {
        tree_url: COM_DEFAULT._orgTreeOpt.treeUrl, //组织树接口地址
        search_url: COM_DEFAULT._orgTreeOpt.searchUrl, //搜索接口地址
        type: '1', //1（默认）：组织与人员；2：组织；
        only_sel_people: false, //是否只可选择人员;仅"type==1"时有效;
        cb: null,
        max_num: -1 //最大选择数目, -1为无限制；
    };
    $.extend(true, _option, opt);
    /**
     * 打开弹窗，并渲染数据（如果有）；
     * @param {Array} selected_list  已选中的数据数组对象
     * @param {Function} yesCallBack(arr, sArr)  弹窗确定按钮回调函数，返回 ：arr（已选中的全部数据只包含ID与TYPE，用于存储数据库中）, sArr（内部沟通展示视图使用，包含中文）;
     */
    obj._openModel = function (selected_list, yesCallBack) {
        selected_list = selected_list || [];
        var UID_ = COM_TOOLS.get_UID('orgjtree_');
        var JSTREE;
        /* 组件容器 */
        var $wrapper = $('<div style="display: none;" class="cus-orgjtree-wrap" id="' + UID_ + '"><div class="select-treelist-xxw">' +
            '<div class="clearfix">' +
            '<div class="left-cont pull-left">' +
            '<div class="search-box-xxw form-inline">' +
            '<i class="glyphicon glyphicon-search icon1"></i>' +
            '<input type="text" class="form-control input-sm js-orgtree-searchbtn" placeholder="搜索：名称、拼音、邮箱">' +
            '<i class="glyphicon glyphicon-remove-circle icon2 js-delinp"></i>' +
            '</div>' +
            '<div class="tree-cont js-tree-cont-xxw">' +
            '<div class="js-orgtree-box"></div>' +
            '</div>' +
            '</div>' +
            '<div class="right-cont pull-left">' +
            '<div class="tit">已选部门、成员</div>' +
            '<div class="sel-boxpar-xxw">' +
            '<div class="sel-box-xxw"></div>' +
            '</div>' +
            '</div>' +
            '<div class="search-list-xxw">' +
            '<div class="search-cont"></div>' +
            '</div>' +
            '</div>' +
            '<div class="btn-box-xxw clearfix">' +
            '<div class="pull-left t-org-style">' +
            '<i class="glyphicon glyphicon-info-sign"></i> ' +
            '<span>内部组织（<i class="glyphicon glyphicon-folder-close"></i>）</span>' +
            '<span>外部组织（<i class="glyphicon glyphicon-folder-close this-outer-org"></i>）</span>' +
            '</div>' +
            '<div class="pull-right">' +
            '<button type="button" class="btn btn-success btn-sm js-submitbtn" style="margin-right: 20px;">确认</button>' +
            '<button type="button" class="btn btn-sm btn-default js-canelbtn">取消</button>' +
            '</div>' +
            '</div>' +
            '</div></div>');

        var $selBox = $wrapper.find('.sel-box-xxw'),
            $tree = $wrapper.find('.js-orgtree-box'),
            $search_inp = $wrapper.find('.js-orgtree-searchbtn'),
            $btn_yes = $wrapper.find('.js-submitbtn'),
            $btn_cancel = $wrapper.find('.js-canelbtn');

        cumCheckPwin(parent).$('body').append($wrapper);
        /* 注入demo后再初始化自定义滚动条组件 */
        /*$wrapper.find('.js-tree-cont-xxw, .sel-boxpar-xxw, .search-list-xxw').mCustomScrollbar({
            theme: "dark-3",
            axis: 'yx',
            scrollbarPosition: 'outside'
        });*/

        /* 生成右侧dom */
        function makeSelectedItem(itemdata) {
            // console.log('$$$-itemdata-', itemdata)
            var icon = itemdata.dtype == '1' ? 'glyphicon glyphicon-user' : 'glyphicon glyphicon-folder-close';
            return $('<div title="' + itemdata.path + '" data-id_="' + itemdata.id + '" class="item-xxw1121 ' +
                (itemdata.hasauth == '0' ? 'nohasauth' : (itemdata.dtype == '0' && itemdata.isexternal == '2' ? 'this-outer-org' : '')) + ' clearfix">' +
                '<span class="iconx"><i class="' + icon + '"></i></span>' +
                '<span class="name-xxw">' + itemdata.text + '</span>' +
                '<span class="pull-right del-node-xxw"><i class="glyphicon glyphicon-remove"></i></span>' +
                '</div>').data(itemdata);
        }
        /* 初始化组织树 */
        function _init_jsfn() {
            $tree.jstree({
                "checkbox": {
                    "visible": false,
                    "three_state": false //此属性选择是否级联,默认为true。
                },
                'core': {
                    'themes': {
                        dots: false
                    },
                    "dblclick_toggle": false,
                    "check_callback": true,
                    'data': {
                        'url': _option.tree_url,
                        'data': function (node) {
                            return {
                                'parentId': node.id,
                                'type': _option.type
                            };
                        },
                        'dataFilter': function (d) { //TODO 待补充数据边界
                            COM_TOOLS._ajax_jumpToLogin(d);
                            var d_arr = $.parseJSON(d);
                            $.each(d_arr, function (i, n) {
                                var o = {};
                                n.type = String(n.type);
                                n.dtype = n.type;
                                if (n.type == '0' && n.isexternal == '2') {
                                    n.type = '2';
                                }
                                o.disabled = n.hasauth == 0 ? true : false;
                                if (_option.only_sel_people === true && _option.type == '1' && n.type != '1') { //仅操作人员时,部门禁用
                                    o.disabled = true;
                                }
                                $.each(selected_list, function (j, m) {
                                    if (n.code === m.code) {
                                        o.selected = true;
                                        return false;
                                    }
                                });
                                n.state = o;
                            });
                            return JSON.stringify(d_arr);
                        }
                    }
                },
                'types': { /* 注意：里面的数据必须是字符串，而且接口返回的相关字段值，也必须是字符串类型; @ll */
                    '1': { //人员
                        icon: 'glyphicon glyphicon-user'
                    },
                    '0': { //部门
                        icon: 'glyphicon glyphicon-folder-close'
                    },
                    '2': { //外部部门
                        icon: 'glyphicon glyphicon-folder-close this-outer-org'
                    }
                },
                'plugins': ['checkbox', 'types', 'wholerow'] //search:搜索组件,checkbox:多选框
            }).on("ready.jstree", function () {
                JSTREE = $(this).jstree(true);
                if (JSTREE.get_node(0)) {
                    var str_id = JSTREE.get_node(0).children[0];
                    if (str_id) {
                        JSTREE.open_node(str_id); //打开节点
                    }
                }
            }).on('load_node.jstree', function (e, node) {}).on('changed.jstree', function (e, d) {
                // console.log('changed', d);
                var ref = $(this).jstree(true);
                if (d.action != "deselect_node" && d.action != "select_node") {
                    return;
                }
                var node_ = d.node;
                if (ref.is_selected(node_.id)) { //添加项
                    var o_ = {};
                    $.extend(true, o_, node_.original);
                    $selBox.append(makeSelectedItem(o_));
                    selected_list.push(o_);
                } else { //删除项
                    $selBox.find('.item-xxw1121[data-id_=' + node_.id + '] .del-node-xxw').trigger('click');
                }
            });
        }

        var layer_box = cumParentWinModal('设置范围', $wrapper, {
            'type': 1,
            'ismax': false,
            'area': ['640px', '530px'],
            'end': function () {
                $wrapper.remove()
            },
            'success': function (layero, ind_) {
                $search_inp.val('');
                $selBox.html('');
                if (!$tree.jstree(true)) {
                    _init_jsfn();
                }
                if (selected_list.length > 0) {
                    COM_TOOLS.ajaxFn({
                        url: COM_DEFAULT._orgTreeOpt.getDataUrl,
                        type: 'get',
                        data: {
                            param: JSON.stringify(selected_list)
                        },
                        success: function (d) {
                            // console.log('%%%%333--', d, selected_list)
                            if (d && d.code == 1) {
                                var data_ = d.data;
                                selected_list = data_; //全量覆盖，保障一致性，简单粗暴
                                $.each(data_, function (i, n) {
                                    n.dtype = n.type;
                                    $selBox.append(makeSelectedItem(n));
                                });
                            }
                        }
                    });
                }
            }
        });
        //右侧删除按钮
        $wrapper.on('click', '.del-node-xxw', function () {
            var $t = $(this).closest('.item-xxw1121');
            var id_ = $t.data('id_');
            var j_ = -1; //待删除对象在数组中的下标，-1时不执行删除操作
            $.each(selected_list, function (i, n) { //切记不能在循环里，删减数组对象；实时引用的！！！
                if (n.id == id_) {
                    j_ = i;
                    return false;
                }
            });
            if (j_ >= 0) {
                selected_list.splice(j_, 1);
            }
            $t.remove();
            if (JSTREE.get_node(id_)) {
                JSTREE.deselect_node(id_, true);
            }
        });
        $wrapper.on('click', '.js-search-item', function () {
            var $t = $(this),
                id_ = $t.data('id');
            if (!$selBox.find('.item-xxw1121[data-id_=' + id_ + ']').length > 0) {
                $selBox.append(makeSelectedItem($t.data() || {}));
                if (JSTREE.get_node(id_)) {
                    JSTREE.select_node(id_, true, false);
                }
            }
            $wrapper.find('.search-list-xxw').hide();
            $search_inp.val('');
        });
        $search_inp.keypress(function (e) {
            if (e.keyCode == 13) {
                var keyword_ = $.trim($(this).val());
                // console.log('gggggg', $.trim($(this).val()));
                if (keyword_.length >= 1) {
                    $.get(_option.search_url, {
                        'keyword': keyword_,
                        'type': _option.type
                    }, function (res) {
                        if (res) {
                            var str = '';
                            if (res.person && res.person.length > 0) {
                                str += '<div class="search-list-box">' +
                                    '<div class="tit">人员</div>' +
                                    '<div class="cont js-person">';
                                $.each(res.person, function (i, n) {
                                    str += '<p class="search-item clearfix js-search-item" title="' + n.path +
                                        '" data-code="' + n.code + '" data-path="' + n.path + '" data-isexternal="' + n.isexternal +
                                        '" data-dtype="' + n.type + '" data-text="' + n.text + '" data-id="' + n.id + '">' +
                                        '<span>' + n.text + '</span>' +
                                        '<span class="pull-right">' + n.department + '</span>' +
                                        '</p>';
                                });
                                str += '</div></div>';
                            }
                            if (res.department && res.department.length > 0) {
                                str += '<div class="search-list-box">' +
                                    '<div class="tit">部门</div>' +
                                    '<div class="cont">';
                                $.each(res.department, function (i, n) {
                                    str += '<p class="search-item clearfix js-search-item ' + (n.isexternal == '2' ? 'this-outer-org' : '') + '" title="' + n.path +
                                        '" data-code="' + n.code + '" data-path="' + n.path + '" data-isexternal="' + n.isexternal +
                                        '" data-dtype="' + n.type + '" data-text="' + n.text + '" data-id="' + n.id + '">' +
                                        '<i class="iconx  glyphicon glyphicon-folder-close"></i><span>' + n.text + '</span>' +
                                        '</p>';
                                });
                                str += '</div></div>';
                            }
                            if (str) {
                                $wrapper.find('.search-cont').html(str);
                            } else {
                                $wrapper.find('.search-cont').html('<div class="tit">无结果</div>');
                            }
                            $wrapper.find('.search-list-xxw').show();
                        }
                    });
                }
            }
        });
        $btn_yes.click(function () {
            var arr = [];
            var sArr = [];
            $selBox.find('.item-xxw1121').each(function (a, b) {
                var d_ = $(this).data();
                arr.push({
                    code: d_.code,
                    type: d_.dtype
                });
                sArr.push({
                    code: d_.code,
                    type: d_.dtype,
                    path: d_.path,
                    isexternal: d_.isexternal,
                    text: d_.text
                });
            });
            if (_option.max_num > 0 && arr.length > _option.max_num) {
                cumCheckPwin(parent).COM_TOOLS.alert('最多选择' + _option.max_num + '个');
                return false;
            }
            //确认按钮回调
            if ($.type(_option.cb) == 'function') {
                _option.cb(arr);
            }
            if ($.type(yesCallBack) == 'function') {
                yesCallBack(arr, sArr);
            }
            cumCloseWin(layer_box, false, parent);
        });
        $btn_cancel.click(function () {
            cumCloseWin(layer_box, false, parent);
        });
        $wrapper.find('.js-delinp').click(function () {
            $search_inp.val('');
            $wrapper.find('.search-list-xxw').hide();
        })
    }

    /**
     * 构造初始化列表展示容器；
     */
    obj._makeSelWrap = function () {
        return $('<div class="orgtree-selectedlist-box">' +
            '<ul class="orgtree-item-list clearfix"></ul>' +
            '</div>');
    }
    /**
     * @param {Array} dlist 构造视图的完整JSON数组对象，必须包含中文名称自动，否则请使用_getFormatData方法构建
     * @param {Object} $sel_wrap 初始化列表展示容器的JQ对象；
     */
    obj._updateSelItem = function (dlist, $sel_wrap) {
        if ($sel_wrap.length == 0) {
            return false;
        }
        var str = '';
        $.each(dlist, function (i, n) {
            str += '<li class="orgtree-item ' + (n.type == '0' && n.isexternal == '2' ? 'this-outer-org' : '') + '" data-code="' + n.code + '" data-type="' + n.type + '"' +
                (n.path ? 'title="' + n.path + '"' : '') + '>' +
                '<i class="the-icon glyphicon ' + (n.type == '1' ? 'glyphicon-user' : 'glyphicon-folder-close') + '"></i>' + n.text +
                '</li>';
        });
        $sel_wrap.find('.orgtree-item-list').html(str);
    };
    /**
     * 请问服务器，返回用于列表视图的完整数据（例如中文名称）
     * @param {Object} _data
     * @param {Object} _cb
     */
    obj._getFormatData = function (_data, _cb) {
        if (_data.length) {
            COM_TOOLS.ajaxFn({
                url: COM_DEFAULT._orgTreeOpt.getDataUrl,
                type: 'get',
                data: {
                    param: JSON.stringify(_data)
                },
                success: function (d) {
                    if (d && d.code == 1) {
                        _cb(d.data);
                    }
                }
            });
        }
    }
    /**
     * 构造选择结果框，并展示
     * @param {Object} $sel_dataInput JQ选择器；存储初始化数据的textare对象
     * @return 初始化列表展示容器的JQ对象
     */
    obj._initSelBox = function ($sel_dataInput) {
        var $wrap = $();
        if ($sel_dataInput.length) {
            $wrap = obj._makeSelWrap();
            $sel_dataInput.before($wrap).addClass('hidden');
            var data_ = JSON.parse($.trim($sel_dataInput.val()) || "[]");
            obj._getFormatData(data_, function (d) {
                obj._updateSelItem(d, $wrap);
            });
        }
        return $wrap;
    }
    return obj;
};