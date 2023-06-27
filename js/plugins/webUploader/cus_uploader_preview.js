/*
 * 多文件上传功能 扩展支持：上传成功后预览、删除
 * 2018-09-13 @lty
 * 使用的 webupload 进行二次封装开发
 * 支持动态DOM结构替换
 * 支持 webupload 默认 opt
 */
function mult_upload_preview(id, opt) {
    var $input = $('#' + id); // 目标对象
    if(!$input.length) {
        return false;
    }
    if($input.data('mult_upload_preview')) {
        return false;
    }
    opt = opt || {};
    opt.file_type = opt.file_type == 'file' ? 'file' : 'image'; //上传类型 : file:文件; image:图片（默认）; 
    opt.max_num = opt.max_num || 10;

    var $wrap = $('<div class="md2018091101lty">' +
        '<ul class="md-pics-list clearfix ' + (opt.file_type == 'file' ? 'upload-file-style' : '') + '">' +
        '<li class="js-continue-add">' +
        '<div class="js-add-pic"><input class="js-inp-files" multiple="multiple" type="file"></div>' +
        '</li></ul></div>');

    var hasFileName = false; //是否含有文件名；
    var fileNames = ($input.data('file_names') && (hasFileName = true, $input.data('file_names').split('|'))) || []; //文件名数组；
    var $addFileBtn = $wrap.find(".js-continue-add");
    $input.addClass('js-hide-inp').after($wrap);
    $input.appendTo($wrap);

    var UP_TOOLS = {
        addFileDom: function(item) { // 文件列表dom渲染
            $addFileBtn.before('<li class="js-file-item" data-path="' + item.path + '" data-file_name="' + item.fileName + '">' +
                '<div class="table-box">' +
                '<div class="table-cell" '+ (opt.file_type == 'file' ? 'style="height: auto;"' : '') +'>' +
                (opt.file_type == 'file' ? ('<span title="' + item.fileName + '">' + item.fileName + '</span>') : ('<img src="' + item.path + '"   alt="">')) +
                '<p class="js-delete-img text-danger"><i class="glyphicon glyphicon-remove-sign"></i></p>' +
                '</div>' +
                '</div>' +
                '</li>');
        },
        infoTips: function() { // 信息及状态提示
            var text = '',
                state = $uploader.getStats(); //获取文件统计信息
            text = '成功上传<span class="text-info">&nbsp;' + (err_num ? 0 : state.successNum) + '&nbsp;</span>文件，<span class="text-danger">&nbsp;' + (err_num || state.uploadFailNum) + '&nbsp;</span>个文件失败';
            COM_TOOLS.alert(text);
        },
        updataHiddenVal: function() {
            var files_arr = [];
            var files_NameArr = [];
            $wrap.find('.js-file-item').each(function() {
                var $this = $(this);
                if($this.data('path')) {
                    files_arr.push($this.data('path'));
                    files_NameArr.push($this.data('file_name'));
                }
            });
            $input.val(files_arr.join(','));
            $input.data('file_names', files_NameArr.join('|'));
        },
        init: function() {
            var val_ = $.trim($input.val());
            if(val_) {
                var picArr_ = val_.split(',');
                $.each(picArr_, function(i, n) {
                    UP_TOOLS.addFileDom({
                        path: n,
                        fileName: fileNames[i] || ''
                    });
                });
            }
        }
    };

    UP_TOOLS.init();

    var $inputFile = $wrap.find('.js-inp-files'); //file控件

    // 选择文件,入队
    $inputFile.on('change.inp-files', function(evt) {
        $(this).prop('disabled', true);
        var t_files = this.files,
            t_files_len = t_files.length,
            val_ = $.trim($input.val()),
            picArr_len = 0;
        if(val_) {
            picArr_len = val_.split(',').length;
        }
        if(t_files_len) {
            if((picArr_len + t_files_len) > opt.max_num || t_files_len > opt.max_num) {
                COM_TOOLS.alert('最多能上传' + opt.max_num + '个文件');
                $inputFile.prop('disabled', false);
                this.value = ''; // 清除
                return false;
            }
            $uploader.addFiles(t_files); // 入队
        }
        this.value = ''; // 清除
    });
    var baseOpt = $.extend({
        auto: true, //选择文件后 自动上传
        fileVal: 'upload',
        server: COM_DEFAULT._fileServeOpt.fileUploadUrl, //服务器路径
        accept: {
            extensions: COM_DEFAULT._fileServeOpt.fileType.join(','), //选择上传类型
        },
        fileSizeLimit: 10 * 1024 * 1024, //验证文件总大小是否超出限制, 超出则不允许加入队列： 10 M
        fileNumLimit: 10 //单次文件上传个数
    }, opt);

    // 公共变量
    var $uploader = WebUploader.create(baseOpt); // 初始化web实例

    var err_num = 0;

    $uploader.on('filesQueued', function(files) { // 加入队列
        //console.log('文件加入队列');
    }).on('uploadProgress', function(file, percentage) {
        //console.log('文件上传中');
    }).on('error', function(code) {
        switch(code) {
            case 'Q_EXCEED_NUM_LIMIT':
                COM_TOOLS.alert('文件数量超过' + opt.max_num + '个');
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.size_exceed']);
                break;
            case 'Q_TYPE_DENIED':
                COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.type_err']);
                break;
            case 'F_DUPLICATE':
                COM_TOOLS.alert('文件重复');
                break;
        }
        $inputFile.prop('disabled', false);
    }).on('uploadSuccess', function(file, res) {
        //console.log(res, '文件上传成功');
        if(res.state == 1) {
            //上传成功后预览图片
            UP_TOOLS.addFileDom(res); //显示预览的图片
        } else if(res._raw == 'ERROR') {
            err_num++;
        }
        // 成功回调
        baseOpt.success && baseOpt.success(file, res);
    }).on('uploadError', function(file, res) {
        //console.log('文件上传失败');
    }).on('uploadFinished', function() {
        //UP_TOOLS.infoTips();
        //console.log('ok');
        // $uploader.reset();
        UP_TOOLS.updataHiddenVal();
        $inputFile.prop('disabled', false);
    });
    //删除图片
    $wrap.on('click', '.js-delete-img', function() {
        $(this).closest('li').remove();
        UP_TOOLS.updataHiddenVal();
    });
    $input.data('mult_upload_preview', true);
    return $uploader;
}