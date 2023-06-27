/* 
 * 2018-08-10 cj
 * 显示 PDF 链接 及 iframe
 */
(function () {
    function dyHtmlDom(editor, config, el_) {
        // html template
        var html_ = '<div id="js_ck_cushtmldom" class="container-fluid" style="margin-top:20px;">' +
            '<div class="form-horizontal cus-form-format">' +
            (!(el_ && el_.length) ? '<div class="form-group"><label class="control-label col-sm-3">选择:</label>' +
                '<div class="col-sm-9"><div class="input-group input-group-sm">' +
                '<input class="js-inp-file hidden" type="file"/>' +
                '<input class="form-control input-sm js-inp-info" readonly="true" type="text"/>' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-primary js-btn-add" type="button"><i class="glyphicon glyphicon-search"></i></button>' +
                '</span></div></div></div>' : '') +
            '<div class="form-group"><label class="control-label col-sm-3">&nbsp;</label>' +
            '<div class="col-sm-9"><input type="checkbox" style="height:auto; vertical-align:top;" class="input-sm js-el-iframe"/>&nbsp;是否显示PDF文件内容</div></div>' +
            '<div class="form-group"><label class="control-label col-sm-3">宽度:</label>' +
            '<div class="col-sm-3"><input type="text" class="form-control input-sm js-el-w" value="100%" disabled/></div>' +
            '<label class="control-label col-sm-3">高度:</label>' +
            '<div class="col-sm-3"><input type="text" class="form-control input-sm js-el-h" value="700" disabled/></div></div>' +
            '</div>' +
            '<div class="clearfix" style="margin-top: 10px;">' +
            '<button class="btn btn-sm btn-primary pull-right js-btn-enter" ' + (!(el_ && el_.length) ? 'disabled="disabled' : '') + '" type="button">确认</button>' +
            '<button style="margin-right: 10px;" class="btn btn-sm btn-danger js-btn-cancel pull-right" type="button">取消</button>' +
            '</div>' +
            '</div>';

        cumCurWinModal('上传文件', '', self, {
            other: {
                content: html_,
                closeBtn: false,
                move: false
            },
            area: ['446px', '250px'],
            type: 1,
            success: function (lay, idx) {
                var el_lay = $(lay).find('#js_ck_cushtmldom');
                var res_obj = {};
                var el_file = el_lay.find('.js-inp-file'),
                    el_filename = el_lay.find('.js-inp-info'),
                    el_w = el_lay.find('.js-el-w'),
                    el_h = el_lay.find('.js-el-h'),
                    el_check = el_lay.find('.js-el-iframe');

                // 处理
                if (el_lay.length && el_ && el_.length) {
                    el_w.val(el_.attr('width'));
                    el_h.val(el_.attr('height'));
                }

                // res_obj = { url:'https://www.jianshu.com/p/35123b048e5e'};
                // el_lay.find('.js-btn-enter').removeAttr('disabled');

                el_lay.on('change.show_pdf', '.js-el-iframe',function (evt) {
                    var t_ = $(this);
                    if (!t_.is(':checked')) {
                        el_w.attr('disabled', true)
                        el_h.attr('disabled', true)
                    } else {
                        el_w.removeAttr('disabled')
                        el_h.removeAttr('disabled')
                    }
                }).on('click.ck-add', '.js-btn-add', function (event) {
                    event.preventDefault();
                    el_file.trigger('click');
                }).on('change.ck-inp', '.js-inp-file', function (event) {
                    event.preventDefault();
                    var t_files = this.files[0];
                    this.value = ''; // 清除

                    var filesize = (editor.config.fileUploadMaxSize || 3 * 1024) * 1024, // KB
                        filetype_arr = editor.config.fileUploadType || ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf", "rar", "zip"], // 文件类型
                        filetype = t_files.name.split('.')[(t_files.name.split('.').length - 1)];
                        
                    if (t_files) {
                        // 错误判断
                        if (filesize < t_files.size) {
                            COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.size_exceed', Math.ceil(filesize / 1024)));
                            return false;
                        } else if (!new RegExp('^(' + filetype_arr.join('|') + ')$', 'i').test(filetype)) {
                            COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.type_err', filetype_arr.join('|')));
                            return false;
                        }
                        // 文件名
                        el_filename.val(t_files.name);
                        // 非PDF文件判断
                        if (!/^(pdf)$/.test(filetype)) {
                            el_check.attr('disabled', true).prop('checked', false).trigger('change.show_pdf');
                        } else {
                            el_check.removeAttr('disabled');
                        }

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
                            success: function (res) {
                                if (!$.isEmptyObject(res)) {
                                    res_obj = res;
                                    el_lay.find('.js-btn-enter').removeAttr('disabled');
                                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_success']);
                                } else {
                                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                                }
                            }
                        })
                        .fail(function () {
                            COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                        });
                    } else {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                    }
                }).on('click.ck-enter', '.js-btn-enter', function (event) {
                    event.preventDefault();
                    if (!$.isEmptyObject(res_obj) || (el_ && el_.length)) {
                        var i_w = $.trim(el_w.val()),
                            i_h = $.trim(el_h.val());

                        if (el_ && el_.length) {
                            res_obj.url = el_.attr('src');
                        }

                        var a_html = '<p><a href="' + res_obj.url + '" target="_blank">' + el_filename.val() +'</a></p>\n\r';
                        editor.insertHtml(a_html);
                        if (el_check.is(':checked')) {
                            var r_html = '<iframe frameborder="0" width="' + i_w + '" height="' + i_h + '" src="' + res_obj.url + '"></iframe>';
                            var d_node = new CKEDITOR.dom.element('iframe');
                            var fake_img = editor.createFakeElement(d_node, 'cke_cus_pdf', 'iframe', true);
                            /* fake_img.setAttributes({
                                src: res_obj.url,
                                width: i_w,
                                height: i_h,
                                frameborder: 0
                            }); */
                            fake_img.data('cke-realelement', encodeURIComponent(r_html));
                            editor.insertElement(fake_img);
                        }
                        layer.close(idx);
                    } else {
                        COM_TOOLS.alert('请先选择');
                    }
                }).on('click.ck-cancel', '.js-btn-cancel', function (event) {
                    event.preventDefault();
                    layer.close(idx);
                });
            }
        });
    }

    CKEDITOR.plugins.add('cusfileupload', {
        requires: 'fakeobjects',
        icons: 'cusfileupload',
        onLoad: function () {
            CKEDITOR.addCss('img.cke_cus_pdf' +
                '{' +
                'background-image: url(' + CKEDITOR.getUrl(this.path + 'images/placeholder.png') + ');' +
                'background-position: center center;' +
                'background-repeat: no-repeat;' +
                'border: 1px solid #dddd;' +
                'margin-right: 10px;' +
                'width: 80px !important;' +
                'height: 60px !important;' +
                '}'
            );
        },
        init: function (editor) {
            var config_ = editor.config;

            editor.addCommand('cusfileupload', {
                allowedContent: 'iframe[align,longdesc,frameborder,height,name,scrolling,src,title,width]',
                exec: function (editor) {
                    // 方法调用
                    dyHtmlDom(editor, config_);
                }
            });

            editor.ui.addButton && editor.ui.addButton('Cusfileupload', {
                label: '上传附件',
                command: 'cusfileupload',
                toolbar: 'insert,65'
            });
        }
    });
})()