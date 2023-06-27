/**
 * 国际化资源配置模块(旧)
 * @param {String} cboxid 目标初始化容器 选择器 '#id'
 * @param {String} formid 源数据form选择器  '#id'
 * @param {String} formbtn 源数据form提交按钮选择器，多个使用集合选择器
 */
COM_TOOLS._model.set_i18n_fn = function (cboxid, geturl, seturl) {
    if (!cboxid || !geturl || !seturl) {
        return false;
    }
    var tabBoxHtml_ = '<div class="js-cus-tabmodel-box" id="js_cus_tabmodel_box">' +
        '<div class="cus-tabmodel-box">' +
        '<div class="tab-list-box js-tab-list-box">' +
        '<button class="roll-nav roll-left tab-roll-btn tab-left-btn btn-primary"><i class="fa fa-backward"></i></button>' +
        '<div class="tab-list-overflow">' +
        '<div class="tab-list-bar">' +
        '<ul class="nav nav-tabs tab-list-ul pull-left js-create-tab" role="tablist"></ul>' +
        '</div>' +
        '</div>' +
        '<button class="roll-nav roll-right tab-roll-btn tab-right-btn btn-primary"><i class="fa fa-forward"></i></button>' +
        '</div>' +
        '<div class="cus-tabmodel-btns">' +
        '<button class="btn btn-primary btn-sm js-cus-btn-save js-helpmsg" type="button" data-helpmsg="platform.plugin.com_msg.tab_this" data-helpdata="' + TEDU_MESSAGE.get("platform.plugin.com_btn.save") + '">' +
        '<i class="glyphicon glyphicon-floppy-disk"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.save') + '</button>' +
        '<button class="btn btn-warning btn-sm js-cus-btn-refresh" type="button"><i class="glyphicon glyphicon-refresh"></i> ' + TEDU_MESSAGE.get('platform.plugin.com_btn.fresh') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="tab-content cus-tabmodel-contbox js-create-content"></div>' +
        '</div>';
    $('#' + cboxid).html(tabBoxHtml_);
    var tabModel_ = $('#js_cus_tabmodel_box'),
        tabBox_ = tabModel_.find('.js-create-tab'),
        contBOx_ = tabModel_.find('.js-create-content');

    function _init() {
        COM_TOOLS.ajaxFn({
            url: geturl,
            type: 'GET',
            success: function (d) {
                if (d && $.type(d) == 'array') {
                    $.each(d, function (i, n) {
                        _createTabHtml(i, n);
                    });
                    _checkInput();
                }
            }
        }, 2, tabModel_.find('.js-cus-btn-refresh'));
    }

    _init();

    function _createTabHtml(index, data) {
        var str_ = data['pid'].replace(/\./g, '_');
        var tab_ = '<li role="presentation" class="' + (index == 0 ? 'active' : '') + '"><a href="#js_tab_' + str_ + '" role="tab" data-toggle="tab">' + data['name'] + '</a></li>';
        var cont_ = '<div role="tabpanel" class="tab-pane ' + (index == 0 ? 'active' : '') + '" id="js_tab_' + str_ + '" data-pid="' + data['pid'] + '">' + _Backfill(data['child']) + '</div>';
        tabBox_.append(tab_);
        contBOx_.append(cont_);
    }

    function _Backfill(data) {
        if ($.type(data) == 'array' && data.length > 0) {
            var arr = [];
            arr.push('<div class="form-horizontal">');
            $.each(data, function (j, m) {
                arr.push('<div class="form-group" data-dcode="', m.code, '">');
                arr.push('<label class="col-sm-2 col-md-offset-2 control-label">', (m.required == '1' ? '<span class="text-danger">*</span> ' : ''), m.name, '</label>');
                arr.push('<div class="col-sm-5"><input class="form-control input-sm js-input-val" type="text" value="', m.value, '" ', (m.required == '1' ? 'required="required"' : ''), '/></div>');
                arr.push('</div>');
            });
            arr.push('</div>');
            return arr.join('');
        } else {
            return '';
        }
    }

    function _checkInput() {
        contBOx_.find('input.js-input-val[required]').on('blur', function () {
            if ($.trim($(this).val()) == '') {
                COM_TOOLS._view.setInputStatus($(this), 'error');
            } else {
                COM_TOOLS._view.setInputStatus($(this), '');
            }
        });
    }

    tabModel_.find('.js-cus-btn-save').click(function () {
        var _that = $(this);
        COM_TOOLS.confirm(TEDU_MESSAGE.get('platform.plugin.com_msg.tab_separate'), function (in_) {
            layer.close(in_);
            var curPane_ = tabModel_.find('.js-create-content .tab-pane.active');
            var pid_ = curPane_.data('pid') || '';
            var item_ = curPane_.find('.form-group');
            var arr = [],
                look_ = false;
            item_.each(function () {
                var this_ = $(this),
                    input_ = this_.find('input.js-input-val');
                if (input_.prop('required') && $.trim(input_.val()) == '') {
                    look_ = true;
                }
                arr.push({
                    'cCode': this_.data('dcode'),
                    'lCode': pid_,
                    'name': $.trim(input_.val())
                });
            });
            if (!look_) {
                COM_TOOLS.ajaxFn({
                    url: seturl,
                    type: 'POST',
                    data: {
                        data: JSON.stringify(arr)
                    },
                    success: function (d) {
                        if (d.code == '1') {
                            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.success'));
                        } else if (d.code == '-2') { //必须含有简体中文
                            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.china_notnull'));
                        } else {
                            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
                        }
                    }
                }, 2, _that);
            } else {
                COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.defeated'));
            }
        });
    }).end().find('.js-cus-btn-refresh').click(function () {
        tabBox_.html('');
        contBOx_.html('');
        _init();
    });
    COM_TOOLS._view.tabScrollFn.init('#js_cus_tabmodel_box .js-tab-list-box');
};