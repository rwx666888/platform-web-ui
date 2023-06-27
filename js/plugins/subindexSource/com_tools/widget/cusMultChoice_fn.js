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
COM_TOOLS.cus_mult_choice = function (id, btnfn, num, id_1, id_2) {
    var p_ = $('#' + id),
        t_ = p_.children('.cus-mult-choice'),
        hidenInp_1 = id_1 ? $('#' + id_1) : [],
        hidenInp_2 = id_2 ? $('#' + id_2) : [];
    //事件绑定
    p_.on('click', '.js-mult-remove', function () {
        $(this).closest('.mult-item').remove();
        hidenInp_1.length && hidenInp_1.val(obj_.setHiddenValue('code'));
        hidenInp_2.length && hidenInp_2.val(obj_.setHiddenValue('text'));
    }).on('click', '.cus-mult-btn', function () {
        btnfn && btnfn();
    });
    var obj_ = {
        addItem: function (id, text) {
            if ((num != '-1') && t_.find('span').length >= num) {
                COM_TOOLS.alert('最多添加' + num + '个');
                return false;
            }
            if (t_.children('span').is('[data-code=' + id + ']')) { //判断唯一
                return false;
            }
            t_.append('<span data-text="' + text + '" data-code="' + id + '" class="mult-item">' + text + ' <i class="glyphicon glyphicon-remove js-mult-remove"></i></span>');
            hidenInp_1.length && hidenInp_1.val(obj_.setHiddenValue('code')).trigger('focusout.validate');
            hidenInp_2.length && hidenInp_2.val(obj_.setHiddenValue('text'));
        },
        removeAll: function () {
            t_.html('');
            hidenInp_1.length && hidenInp_1.val('');
            hidenInp_2.length && hidenInp_2.val('');
        },
        backfill: function (id_str, name_str) {
            if ((id_str != null) && id_str.length) {
                var id_arr = id_str.split(',');
                var name_arr = name_str.split(',');
                var obj_arr = [];
                $.each(id_arr, function (i, n) {
                    obj_.addItem(n, name_arr[i]);
                });
            }
        },
        getMultItem: function (type_) { //获取选择的值
            var arr_ = [],
                type_ = type_ || 0;
            $.each(t_.find('span'), function (i, n) {
                arr_.push(type_ ? $(n).data() : $(n).data('code'));
            });
            return arr_;
        },
        setHiddenValue: function (param) {
            var arr = [];
            $.each(t_.find('span'), function (i, n) {
                arr.push($(n).data(param));
            });
            return arr.join(',');
        }
    }
    return obj_;
};