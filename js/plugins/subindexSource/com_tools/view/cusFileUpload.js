/**
 * @description 自定义原生上传
 * @param {String} id 必填， 触发对象的 id;
 * @param {String} hide_id 选填，隐藏域对应的 id 及 name;
 * @param {Object} option 选填，配置信息;
 */
COM_TOOLS._view.cusFileUpload = function (id, hide_id, option) {
    var $obj = $('#' + id);
    if (!$obj.length) {
        return false;
    }
    if ($obj.data('cusFileUpload') == 'inited') { //防止重复初始化
        return false;
    }
    var btn_img = $obj.is('button') ? 'btn' : $obj.is('img') ? 'img' : false; // dom对象判断
    var _t_H = 0;
    var f_path = ''; // 回显路径

    option = option || {};
    if (typeof hide_id == 'object') {
        option = hide_id
    }

    // dom 动态构造
    if ($obj.hasClass('js-dy-creation')) {
        var t_id = $obj.attr('id');
        var temp = $('<div class="js-temp-html"></div>'); // 替换用的占位符
        $obj.before(temp);
        if (btn_img == 'btn') {
            $obj.addClass('js-judge-dom');
            if ($obj.data('fpath')) {
                f_path = $obj.data('fpath');
                option.isname = true;
            }
            var obj_html = '<span class="js-replace-dom"></span>';
        } else if (btn_img == 'img') {
            _t_H = $obj.attr('height');
            var default_src = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhERUVCNjBFMkNCMDExRTg4QjdEODkwOTJCMDAzRkZDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhERUVCNjBEMkNCMDExRTg4QjdEODkwOTJCMDAzRkZDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NEM3RjlCMkNBRTExRTg5MzZBQUVFNkE0NzM5RTk4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ2NEM3RjlDMkNBRTExRTg5MzZBQUVFNkE0NzM5RTk4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAKABGAwERAAIRAQMRAf/EAHAAAAEEAgMAAAAAAAAAAAAAAAAFBgcIAgMBBAkBAQAAAAAAAAAAAAAAAAAAAAAQAAIBBAEDAgQEBgMAAAAAAAECAwARBAUGITESQWFRcRMHIkJiMzJy0xSkFVUWFxEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A9FKAoNbTRI6xvKiyN1WMsAx+Q70GygKAoCgKAoCg7urwG2+21OnjlMD7XKTHGQACUUgs7C9xcIrW97UFtMPhvF8DX/6yHR4b4jL4zLNEsrS3Fi0juCzE+pJoK28647BxjkcuBgkjXZcCZeDCzFmiDMyPFc9Sqlbrf0NvSgaFAe1AUBQFAUGyKafGmx8vElMGXhypPiTgX8JIyGU29R0sR6jpQTxh/ejXHCDbDSZibNVs0OMY3hkb1KO7qQP5gD86CGd7vM7km3ytzsFWKbICRQYsZLJBBHfwjDEDyN2JJt1J+FqBHYsAAqNNI7LHFCnV5JHIVEUepZiAPegmXdfbKXX8HxMrHT+45Lqw2Zt/pC5yUcXmgWwuREP2/j42/MaCG1ZXVXQh0dQysOoIIuCPnQc0BQFAUCpptJtOQ5x1unxhk5Kx/VnZ28IoY+tmkcA+PkRZRa5PsCQCY6yxSzY2RC+NlYshiysWUeMkUi91Yeh7exHUdKCVvtRxc7PaPyTMjvr9M7RaxW7S5lrPJ7iEHxH6ifVaCyPf5UFS+f8AF/8Aq2/kGNH4abcmTJ1lh+GOS/lNj+3iT5L+k2H8NAy6AoCgzijE00ML5CYaTOEkzZFaRIVPeRkS7Nb4Dufh3oLFcZ5J9t+K6xNbrdsTc/Uy8uTGyDLkSkWaSVhELk+g7AWAAAoGrzyfgfK1TO13IU1e+jCxHOOJktHLBf8AEsqCL8RUElD3B6diRQPnUc1+3uj1mFqcDbGLDwIlihU4+SSQvdmP0urMepPqaBS/9K4T/wA1/jZP9Kga/MeTcE5VosvWPuxFlC0+tyji5J+jkx9Y3/a7flYeqkigrshZkRnX6bsoLx3vY+ouO9BnQf/Z";
            if ($obj.attr('src') && $obj.attr('src') != default_src) {
                f_path = $obj.attr('src');
            } else {
                $obj.attr('src', default_src);
            }

            var obj_html = '<div class="js-judge-dom show-mask">' +
                '<span class="js-replace-dom"></span>' +
                '<div class="cus-img-mask" style="line-height: ' + _t_H + 'px;"><span class="glyphicon glyphicon-open"></span></div>' +
                '</div>';
        }
        var inp_h_id = (typeof hide_id != 'object' && hide_id) || id + '_hide';
        var $rep_html = $('<div id="' + ('js_is' + btn_img + '_' + t_id) + '" class="cus-single-upload">' +
            '<div class="main-area ' + ('is-' + btn_img) + '">' +
            '<input id="' + inp_h_id + '" name="' + inp_h_id + '" ' + (option.required == true ? 'required' : '') + ' class="hide-inp-validate" value="' + f_path + '" type="text"/>' +
            '<input class="js-inp-files hidden" type="file"/>' +
            obj_html +
            '</div>' +
            '<span class="file-name"></span>' +
            '</div>');

        $rep_html.find('.js-replace-dom').replaceWith($obj);
        temp.replaceWith($rep_html); // 注意

        // 回显时 btn 显示名称
        if (btn_img == 'btn' && f_path && option.isname) {
            var f_name = '';
            if (/targetName/.test(f_path)) {
                f_name = f_path.split('targetName=')[f_path.split('targetName=').length - 1];
            } else {
                f_name = f_path.split('/')[f_path.split('/').length - 1];
            }
            $rep_html.find('.file-name').attr('title', f_name).html('<a href="' + f_path + '">' + f_name + '</a>');
        }
    } else {
        console.error('dom结构错误，缺少 js-dy-creation 的class。');
        return false;
    }

    $obj.data('cusFileUpload', 'inited'); //添加初始化锁
    var option_ = $.extend({
        apitype: 'H5',
        serve_url: COM_DEFAULT._fileServeOpt.fileUploadUrl, // 接口
        serve_name: 'upload', // 对应字段
        isname: false, // 文件名显示
        uptype: '',
        filetype: [], // 格式类型
        filesize: ((btn_img == 'btn' ? COM_DEFAULT._fileServeOpt.defaultFileSize : COM_DEFAULT._fileServeOpt.imgFileSize) || 5 * 1024), // 文件大小,单位：KB
    }, option);

    // 类型判断
    if (!option_.filetype.length) {
        option_.filetype = btn_img == 'btn' ?
            COM_DEFAULT._fileServeOpt.fileType :
            btn_img == 'img' ? COM_DEFAULT._fileServeOpt.imgType : [];
    }

    var $main_div = $rep_html.find('.main-area'),
        $judgeDom = $rep_html.find('.js-judge-dom');

    // createObjectURL 资源链接
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    $rep_html.off("click.jude-dom change.inp-files").on('click.jude-dom', '.js-judge-dom', function () {
        // 基础配置判断
        if (!option_.serve_url || !option_.serve_name) {
            COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.opt_lack'));
            return false;
        }
        // 清除提示标
        if ($main_div.find('.tip-icon').length) {
            $main_div.find('.tip-icon').remove();
        }
        return $rep_html.find('.js-inp-files').click();
    }).on('change.inp-files', '.js-inp-files', function () {
        var t_files = this.files[0];
        this.value = ''; // 清除

        if (t_files) {
            // 文件格式、大小
            var filesize = option_.filesize * 1024, // KB
                filetype = t_files.name.split('.')[(t_files.name.split('.').length - 1)];
            // 提示 icon
            var $i_obj = $('<i class="cus-progress-bar"></i>'),
                $icon_success = $('<span class="tip-icon success glyphicon glyphicon glyphicon-ok-circle"></span>'),
                $icon_error = $('<span class="tip-icon error glyphicon glyphicon-remove-circle"></span>');
            // 是否显示文件名
            option_.isname && $rep_html.find('.file-name').html('').html(t_files.name);

            // 错误判断
            if (filesize < t_files.size) {
                COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.size_exceed', option_.filesize));
                return false;
            } else if (!new RegExp('^(' + option_.filetype.join('|') + ')$', 'i').test(filetype)) {
                COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.type_err', option_.filetype.join('|')));
                return false;
            }

            var f_formData = new FormData();
            f_formData.append(option_.serve_name, t_files);
            // 上传的对应类型
            if (!$.isEmptyObject(option_.uptype)) {
                for (var k in option_.uptype) {
                    f_formData.append(k, option_.uptype[k]);
                }
            }
            // 回显图片
            if (btn_img == 'img') {
                $judgeDom.find('img').attr('src', getObjectURL(t_files));
            }

            $.ajax({
                type: "post",
                dataType: "json",
                url: option_.serve_url,
                data: f_formData,
                processData: false,
                contentType: false,
                cache: false,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr(); // 获取 JQ 中的 xhr 实例
                    xhr.upload.onprogress = function (event) {
                        if (event.lengthComputable) {
                            var percent = Math.floor(event.loaded / event.total * 100);

                            if (btn_img == 'btn') {
                                if (!$judgeDom.find('.cus-progress-bar').length) {
                                    COM_TOOLS.loadingBtn.open($judgeDom);
                                    $judgeDom.append($i_obj);
                                }
                                $i_obj.css('width', percent + '%');
                            } else if (btn_img == 'img') {
                                if (!$judgeDom.parent().find('.cus-progress-bar').length) {
                                    $i_obj.css('line-height', _t_H + 'px');
                                    $judgeDom.parent().append($i_obj);
                                }
                                $i_obj.text(percent + '%').css('width', percent + '%');
                            }
                        }
                    }
                    return xhr; // 需要返回 xhr 对象
                },
                complete: function () {
                    btn_img == 'btn' && COM_TOOLS.loadingBtn.close($judgeDom);
                    $i_obj.remove();
                },
                success: function (res) {
                    // res = {state: 1, patch: _url_} res = 'ERROR'
                    if (res.state == 1) {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_success']);
                        $main_div.append($icon_success);
                        $rep_html.find('.hide-inp-validate').val(res.path);
                        if (option_.required) {
                            $.validator && $rep_html.find('.hide-inp-validate').trigger('focusout.validate').trigger('click.validate');
                        }
                    } else if (res.state == 0) {
                        COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                        $main_div.append($icon_error);
                    }
                    option_.success && option_.success(res, $rep_html); // 完成时的回调，传递 data 及 $('#id')
                },
                error: function () {
                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                    $main_div.append($icon_error);
                }
            });
        }
    });
};