/**
 * 2018-06-11 @ccj
 * 自定义头像上传
 * 使用 layer 作为弹窗
 */

(function() {
    // createObjectURL 资源链接
    function getObjectURL(file) {
        var url = null;
        if(window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if(window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if(window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    // 除法计算
    function Div(arg1, arg2) {
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    }
    // 已有的 img 对象
    function cusimgbox(editor, config, el_img) {
        // html template
        var html2_ = '<div id="js_ck_cusimage" class="container-fluid" style="margin-top:20px;">' +
            '<div class="form-horizontal cus-form-format">' +
            (!(el_img && el_img.length) ? '<div class="form-group"><label class="control-label col-sm-3">选择图片:</label>' +
                '<div class="col-sm-9"><div class="input-group input-group-sm">' +
                '<input class="js-inp-file hidden" type="file"/>' +
                '<input class="form-control input-sm js-inp-info" readonly="true" type="text"/>' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-primary js-btn-add" type="button"><i class="glyphicon glyphicon-search"></i></button>' +
                '</span></div></div></div>' : '') +
            '<div class="form-group"><label class="control-label col-sm-3">Title:</label>' +
            '<div class="col-sm-9"><input type="text" class="form-control input-sm js-img-title"/></div></div>' +
            '<div class="form-group"><label class="control-label col-sm-3">Alt:</label>' +
            '<div class="col-sm-9"><input type="text" class="form-control input-sm js-img-alt"/></div></div>' +
            '<div class="form-group"><label class="control-label col-sm-3">宽度:</label>' +
            '<div class="col-sm-3"><input type="text" class="form-control input-sm js-img-w"/></div>' +
            '<label class="control-label col-sm-3">高度:</label>' +
            '<div class="col-sm-3"><input type="text" class="form-control input-sm js-img-h"/></div></div>' +
            '</div>' +
            '<div class="clearfix" style="margin-top: 10px;">' +
            '<button class="btn btn-sm btn-primary pull-right js-btn-enter" ' + (!(el_img && el_img.length) ? 'disabled="disabled' : '') + '" type="button">确认</button>' +
            '<button style="margin-right: 10px;" class="btn btn-sm btn-danger js-btn-cancel pull-right" type="button">取消</button>' +
            '</div>' +
            '</div>';

        cumCurWinModal('自定义上传图片', '', self, {
            other: {
                content: html2_,
                closeBtn: false,
                move: false
            },
            area: ['400px', '250px'],
            type: 1,
            success: function(lay, idx) {
                var el_lay = $(lay).find('#js_ck_cusimage');
                var res_obj = {};
                var el_file = el_lay.find('.js-inp-file'),
                    el_title = el_lay.find('.js-img-title'),
                    el_alt = el_lay.find('.js-img-alt'),
                    el_w = el_lay.find('.js-img-w'),
                    el_h = el_lay.find('.js-img-h');

                // 处理
                if(el_lay.length && el_img && el_img.length) {
                    el_title.val(el_img.attr('title'));
                    el_alt.val(el_img.attr('alt'));
                    el_w.val(el_img.attr('width'));
                    el_h.val(el_img.attr('height'));
                }

                el_lay.on('click.ck-add', '.js-btn-add', function(event) {
                    event.preventDefault();
                    el_file.trigger('click');
                }).on('change.ck-inp', '.js-inp-file', function(event) {
                    event.preventDefault();
                    var t_files = this.files[0];
                    this.value = ''; // 清除

                    var filesize = (editor.config.imgUploadMaxSize || 3 * 1024) * 1024, // KB
                        filetype_arr = editor.config.imgUploadType || ["jpg", "jpeg", "png"],
                        filetype = t_files.name.split('.')[(t_files.name.split('.').length - 1)];

                    if(t_files) {
                        // 错误判断
                        if(filesize < t_files.size) {
                            COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.size_exceed', Math.ceil(filesize / 1024)));
                            return false;
                        } else if(!new RegExp('^(' + filetype_arr.join('|') + ')$', 'i').test(filetype)) {
                            COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.type_err', filetype_arr.join('|')));
                            return false;
                        }

                        // 文件名
                        el_lay.find('.js-inp-info').val(t_files.name);
                        // 初始化大小
                        var el_img = new Image();
                        el_img.src = getObjectURL(t_files);
                        el_img.onload = function () {
                            // 等比例压缩
                            var imgMaxWidth = (editor.config.imgMaxWidth || 1000);
                            var actual_w = el_img.width;
                            var actual_h = el_img.height;
                            var actual_scale = Div(el_img.width, el_img.height);
                            if (actual_w > imgMaxWidth) {
                                actual_w = imgMaxWidth;
                                actual_h = Div(actual_w, actual_scale).toFixed(0);
                            }
                            el_lay.find('.js-img-w').val(actual_w || 'auto');
                            el_lay.find('.js-img-h').val(actual_h || 'auto');
                        };

                        var f_formData = new FormData();
                        f_formData.append('upload', t_files);

                        $.ajax({
                                type: "post",
                                dataType: "json",
                                url: config.imageUploadUrl,
                                data: f_formData,
                                processData: false,
                                contentType: false,
                                cache: false,
                                success: function(res) {
                                    if(!$.isEmptyObject(res)) {
                                        res_obj = res;
                                        el_lay.find('.js-btn-enter').removeAttr('disabled');
                                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_success']);
                                    } else {
                                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                                    }
                                }
                            })
                            .fail(function() {
                                COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                            });
                    } else {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                    }
                }).on('click.ck-enter', '.js-btn-enter', function(event) {
                    event.preventDefault();
                    if(!$.isEmptyObject(res_obj) || (el_img && el_img.length)) {
                        var i_title = $.trim(el_title.val()),
                            i_alt = $.trim(el_alt.val()),
                            i_w = $.trim(el_w.val()),
                            i_h = $.trim(el_h.val());

                        if(el_img && el_img.length) {
                            res_obj.url = el_img.attr('src');
                        }

                        //editor.insertHtml('<img class="cus-ck-img" width="' + w_ + '" height="' + h_ + '" src="' + res_obj.url + '"/>');
                        editor.insertHtml('<img title="' + i_title + '" alt="' + i_alt + '" width="' + i_w + '" height="' + i_h + '" src="' + res_obj.url + '"/>');
                        layer.close(idx);
                    } else {
                        COM_TOOLS.alert('请先选择图片');
                    }
                }).on('click.ck-cancel', '.js-btn-cancel', function(event) {
                    event.preventDefault();
                    layer.close(idx);
                });
            }
        });
    }

    CKEDITOR.plugins.add('cusimage', {
        requires: 'widget', // 注意这里如果需要其他 组件 或 元素 关联，之前的 images 的问题估计是这
        icons: 'cusimage', // 名字必须和组件名一样，不然显示不了
        hidpi: true,
        init: function(editor) {
            var config_ = editor.config;
            editor.addCommand('cusimage', {
                exec: function(editor) {
                    cusimgbox(editor, config_);
                },
                allowedContent: 'img(*)[width, height, src]', // 注意这里如果需要其他 组件 或 元素 关联，之前的 images 的问题估计是这
                //requiredContent: 'img[width, height, src]'
            });

            editor.ui.addButton && editor.ui.addButton('Cusimage', {
                label: '自定义图片上传',
                command: 'cusimage',
                toolbar: 'insert,55'
            });
            // 后期增加双夹，打开修改属性
            editor.on('doubleclick', function(evt) {
                var ele = evt.data.element;
                if(ele.is('img') && !ele.data('cke-realelement') && !ele.isReadOnly()) {
                    var el_img = $(ele.$);
                    cusimgbox(editor, config_, el_img);
                }
            });
        }
    });
})();