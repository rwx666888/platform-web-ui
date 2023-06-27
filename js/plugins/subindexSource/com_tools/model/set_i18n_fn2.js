/**
 * 国际化资源配置模块(新)
 * @param {String} cboxid 目标初始化容器 选择器 '#id'
 * @param {String} formid 源数据form选择器  '#id'
 * @param {String} formbtn 源数据form提交按钮选择器，多个使用集合选择器
 */
COM_TOOLS._model.set_i18n_fn2 = function (cboxid, formid, formbtn) {
    if (!cboxid || !formid || !formbtn) {
        return false;
    }
    var geturl = COM_DEFAULT._modelI18nOpt.geturl,
        seturl = COM_DEFAULT._modelI18nOpt.seturl;
    if (!geturl || !seturl) {
        return false;
    }
    var tabBoxHtml_ = '<div class="js-cus-tabmodel-box" id="js_cus_tabmodel_box">' +
        '<div class="cus-tabmodel-box">' +
        '<div class="tab-list-box js-tab-list-box">' +
        '<button class="roll-nav roll-left tab-roll-btn tab-left-btn btn-primary"><i class="glyphicon glyphicon-backward"></i></button>' +
        '<div class="tab-list-overflow">' +
        '<div class="tab-list-bar">' +
        '<ul class="nav nav-tabs tab-list-ul pull-left js-create-tab" role="tablist"></ul>' +
        '</div>' +
        '</div>' +
        '<button class="roll-nav roll-right tab-roll-btn tab-right-btn btn-primary"><i class="glyphicon glyphicon-forward"></i></button>' +
        '</div>' +
        '<div class="cus-tabmodel-btns">' +
        '<button class="btn btn-primary btn-sm js-cus-btn-save js-helpmsg" type="button" data-helpmsg="platform.plugin.help.save_i18n" style="display:none;" >' +
        '<i class="glyphicon glyphicon-floppy-disk"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.save') + '</button>&nbsp;' +
        '<button class="btn btn-warning btn-sm js-cus-btn-refresh" type="button"><i class="glyphicon glyphicon-refresh"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.fresh') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="tab-content cus-tabmodel-contbox js-create-content"></div>' +
        '</div>';
    $(cboxid).html(tabBoxHtml_);
    var tabModel_ = $('#js_cus_tabmodel_box'),
        tabBox_ = tabModel_.find('.js-create-tab'),
        contBOx_ = tabModel_.find('.js-create-content');
    var form_ = $(formid);
    var formSaveBtn_ = $(formbtn);

    function _init() {
        var arr = [];
        form_.find('[js-i18n-key]:not([js-i18n-key=""])').each(function () {
            var $this = $(this),
                _thisCode = $.trim($this.attr('js-i18n-key')),
                _thisNewCode = _thisCode,
                _thisLabel = $this.attr('js-i18n-label'),
                _thisFix = _thisCode.match(/\{([\w\.]+)\}/);
            if (_thisFix && _thisFix.length > 1) {
                var _target = form_.find('[name="' + _thisFix[1] + '"]');
                if (_target.length > 0) { //不能匹配的资源不能设置国际化信息
                    var value = $.trim(_target.val());
                    if (value) {
                        _thisNewCode = _thisCode.replace(new RegExp("\\{" + _thisFix[1] + "\\}"), function () {
                            return value;
                        });
                    }
                    arr.push({
                        code: _thisNewCode,
                        oldcode: _thisCode,
                        label: _thisLabel
                    });
                    /* 注入validate校验规则 */
                    if (form_.data('validator')) { //validate 已初始化
                        var rulesObj = _target.rules() || {};
                        if (!('required' in rulesObj)) { //如果当前没有 number校验规则，则添加
                            _target.rules("add", {
                                'required': true,
                                'ck-i18n-key': true
                            });
                        }
                    } else {
                        if (!(_target.attr('required'))) {
                            _target.attr({
                                'required': 'required',
                                'ck-i18n-key': true
                            });
                        }
                    }
                }
            }

            if (COM_DEFAULT._debug === true) {
                console.error('asd');
            }
        });
        COM_TOOLS.ajaxFn({
            url: geturl,
            type: 'GET',
            data: {
                'data': JSON.stringify(arr)
            },
            success: function (d) {
                if (d && $.type(d) == 'array') {
                    $.each(d, function (i, n) {
                        _createTabHtml(n); //创建tab item项目
                        _addEventListener(n); //为tab-item 添加事件处理
                    });
                    contBOx_.find('input.js-input-val[required]').off('blur.i18n.check').on('blur.i18n.check', function () {
                        _checkInput($(this));
                    });
                }
            }
        }, 2, tabModel_.find('.js-cus-btn-refresh').add(formSaveBtn_));
    }

    _init();

    function _createTabHtml(data) {
        var index_ = tabBox_.children('li').length;
        var str_ = data['pid'].replace(/\./g, '_').replace(/[\{\}]/g, '');
        var tab_ = '<li role="presentation" class="' + (index_ == 0 ? 'active' : '') + '"><a href="#js_tab_' + str_ + '" role="tab" data-toggle="tab">' + data['name'] + '</a></li>';
        var cont_ = '<div role="tabpanel" class="tab-pane ' + (index_ == 0 ? 'active' : '') + '" id="js_tab_' + str_ + '" data-pid="' + data['pid'] + '">' + _Backfill(data['child'], data['oldpid']) + '</div>';
        tabBox_.append(tab_);
        contBOx_.append(cont_);
    }

    function _toLowerCase_key(str) { //除占位符外，强制换成为小写
        str = String(str || '');
        return str.toLowerCase().replace(/\{([\w\.-]+)\}/i, (str.match(/\{([\w\.-]+)\}/) || [])[0] || '');
    }

    function _addEventListener(data) { //资源名称与默认翻译语言联动
        var oldpid_ = _toLowerCase_key(data.oldpid);
        var target_ = contBOx_.find('[js-i18n-target="' + oldpid_ + '_' + COM_DEFAULT._language + '"]');
        var isedit_ = target_.data('i18n_isedit');
        target_.off('blur.i18n.evt focus.i18n.evt').on('focus.i18n.evt', function () {
            target_.data('cur_value', $.trim(target_.val()));
        }).on('blur.i18n.evt', function () {
            target_.data('cur_value') != $.trim(target_.val()) && target_.data('user_changed', true);
        });
        var _thisFix = oldpid_.match(/\{([\w\.]+)\}/);
        var _thisSelect = '';
        if (_thisFix && _thisFix.length > 1) { //自己 关联 自己时 解除和默认语言翻译的联动
            _thisSelect = '[name]:not([name="' + _thisFix[1] + '"])';
        }
        /*form_.find('[js-i18n-key="' + oldpid_ + '"]' + _thisSelect).off('keyup.i18n.evt').on('keyup.i18n.evt', function() {
            !(isedit_ || target_.data('user_changed')) && target_.val($(this).val());
        });*/
        form_.find('[js-i18n-key]').filter(function () {
            var that_ = $(this);
            return _toLowerCase_key(that_.attr('js-i18n-key')) == oldpid_ && (_thisSelect ? that_.is(_thisSelect) : true);
        }).off('keyup.i18n.evt').on('keyup.i18n.evt', function () {
            !(isedit_ || target_.data('user_changed')) && target_.val($(this).val());
        });
    }

    function _Backfill(data, oldpid) {
        if ($.type(data) == 'array' && data.length > 0) {
            var arr = [];
            arr.push('<form class="form-horizontal" novalidate="novalidate" onsubmit="return false;">');
            $.each(data, function (j, m) {
                arr.push('<div class="form-group" data-dcode="', m.code, '">');
                arr.push('<label class="col-sm-2 col-md-offset-2 control-label">', (m.required == '1' ? '<span class="text-danger">*</span> ' : ''), m.name, '</label>');
                arr.push('<div class="col-sm-5"><input class="form-control input-sm js-input-val" type="text" value="', m.value, '" ',
                    (m.required == '1' ? 'required="required"' : ''), 'js-i18n-target="', _toLowerCase_key(oldpid), '_', m.code, '" data-i18n_isedit="', (!!m.value), '" /></div>');
                arr.push('</div>');
            });
            arr.push('</form>');
            return arr.join('');
        } else {
            return '';
        }
    }

    function _checkInput(input) { //控制输入框状态
        if ($.trim(input.val()) == '') {
            COM_TOOLS._view.setInputStatus(input, 'error');
            return true;
        } else {
            COM_TOOLS._view.setInputStatus(input, '');
            return false;
        }
    }

    function _checkSaveBtn(shown) { //控制资源翻译模块的保存按钮显隐
        if (shown) {
            tabModel_.find('.js-cus-btn-save').show();
        } else {
            tabModel_.find('.js-cus-btn-save').hide();
        }
    }

    function _saveFn(shadeType, shadeOpt, callback) { //保存
        var arr = [],
            look_ = false,
            otherSaveBtn_ = false;
        if (shadeType == 2) {
            otherSaveBtn_ = !shadeOpt.is('.js-cus-btn-save') || false;
        }
        if (otherSaveBtn_) { //如果是外部提交按钮,则禁用并隐藏，然后克隆一个无事件的按钮，添加tips提示信息
            var clone_ = shadeOpt.clone().removeAttr('id').addClass('disabled');
            clone_.insertBefore(shadeOpt);
            shadeOpt.attr('must_disabled', true).prop('disabled', true).hide();
            clone_.addClass('js-helpmsg').data('helpmsg', 'platform.plugin.help.save_i18n_only');
        }

        contBOx_.find('.tab-pane').each(function () {
            var curPane_ = $(this);
            var pid_ = String(curPane_.data('pid') || '');
            var item_ = curPane_.find('.form-group');

            var thisFix_ = pid_.match(/\{([\w\.]+)\}/);
            if (thisFix_ && thisFix_.length > 1) { //提交前，转化key中的占位符
                var _target_obj = form_.find('[name="' + thisFix_[1] + '"]');
                if (_target_obj.length > 0) {
                    var value = $.trim(_target_obj.val());
                    if (value) {
                        pid_ = pid_.replace(new RegExp("\\{" + thisFix_[1] + "\\}"), function () {
                            return value;
                        });
                    }
                    otherSaveBtn_ && _target_obj.prop('readonly', true);
                }
            }
            if (!look_) {
                item_.each(function () {
                    var this_ = $(this),
                        input_ = this_.find('input.js-input-val');
                    if (input_.prop('required')) {
                        look_ = _checkInput(input_);
                    }
                    if (look_) {
                        tabBox_.find('a[href="#' + this_.closest('.tab-pane').attr('id') + '"]').tab('show');
                        return false;
                    }
                    arr.push({
                        'cCode': this_.data('dcode'),
                        'lCode': pid_,
                        'name': $.trim(input_.val())
                    });
                });
            }

        });
        if (!look_) {
            COM_TOOLS.ajaxFn({
                url: seturl,
                type: 'POST',
                data: {
                    data: JSON.stringify(arr)
                },
                success: function (d) {
                    if (d.code == '1') { //成功
                        cumCheckPwin(parent).COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.success'));
                        $.type(callback) == 'function' ? callback() : cumParentCallValue(); //如果不设置回调函数，则默认关闭窗口
                    } else if (d.code == '-2') { //必须含有简体中文
                        COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.china_notnull'));
                    } else { //操作失败
                        COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
                    }
                    _checkSaveBtn(true);
                },
                error: function () {
                    _checkSaveBtn(true);
                    COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
                }
            }, shadeType, shadeOpt);
        } else {
            _checkSaveBtn(true);
            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.i18n') + TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
        }
    }

    tabModel_.find('.js-cus-btn-save').click(function () {
        _saveFn(2, $(this));
    }).end().find('.js-cus-btn-refresh').click(function () {
        tabBox_.html('');
        contBOx_.html('');
        _init();
    });
    COM_TOOLS._view.tabScrollFn.init('#js_cus_tabmodel_box .js-tab-list-box');
    return {
        save: function (callback) {
            _saveFn(2, formSaveBtn_, callback);
        }
    };
};