/*
 * 多文件上传功能
 * 2018-03-27 @ccj
 * 使用的 webupload 进行二次封装开发
 * 支持动态DOM结构替换
 * 支持 webupload 默认 opt
 */
function cus_mult_upload(id, hide_id, opt){
    if(!$('#'+ id).length) return;
    var $obj = $('#'+ id); // 目标对象
    opt = opt || {};
    if(typeof hide_id == 'object'){opt = hide_id}
    
    // dom结构动态替换
    if($obj.hasClass('js-dy-creation')){
        var t_id = $obj.attr('id');
        var temp = $('<div class="js-temp-html"></div>'); // 替换用的占位符
        $obj.addClass('js-judge-dom').before( temp );
        
        var hide_inp = (typeof hide_id != 'object' && hide_id) || id + '_hide';
        var $rep_html = $('<div id="'+ ('js_cusmult_'+ t_id) +'" class="cus-mult-files">'
                    +'<input class="js-inp-files hidden" multiple="multiple" type="file"/>'
                    +'<input id="'+ hide_inp +'" name="'+ hide_inp +'" '+ (opt.required == true ? 'required' : '') +' class="hide-inp-validate js-hide-inp" type="text"/>'
                    +'<span class="js-replace-dom"></span>'
                +'</div>');
        $rep_html.find('.js-replace-dom').replaceWith($obj);
        temp.replaceWith($rep_html);
    }else{
        console.error('dom结构错误，缺少 js-dy-creation 的class。');
        return false;
    }
    
    // 选择文件,入队
    $rep_html.on('click.jude-dom', '.js-judge-dom', function(){
        return $(this).closest('.cus-mult-files').find('.js-inp-files').trigger('click');
    }).on('change.inp-files', '.js-inp-files', function(evt){
        var t_files = this.files;
        if(t_files.length){
            $uploader.addFiles(t_files); // 入队
        }
        this.value = ''; // 清除
    });
    
    var baseOpt = $.extend({
        fileVal: 'upload',
        server: COM_DEFAULT._fileServeOpt.fileUploadUrl,
        accept: {
            extensions: COM_DEFAULT._fileServeOpt.fileType.join(','),
        },
        fileSizeLimit: 10 * 1024 * 1024,    // 10 M
    }, opt );
    
    opt.fileSizeLimit && ( baseOpt.fileSizeLimit = ( opt.fileSizeLimit * 1024 * 1024 ) ); // 设置文件总大小限制
    baseOpt['pick'] = 'undefined';
    baseOpt['addBtn'] = 'undefined';
    baseOpt['fileNumLimit'] = 10;
    
    var UP_TOOLS = {
        addFileDom: function(files){ // 文件列表dom渲染
            var html = '';
            for(var i = 0, len = files.length; i < len; i++){
                html +='<li class="li-file" id="'+ files[i].id +'">'
                        +'<p class="delete pull-right"><span class="glyphicon glyphicon-trash"></span></p>'
                        +'<p class="name" title="'+ files[i].name +'">'+ files[i].name +'</p>'
                        +'<div class="pro"><span class="pro-bar"></span></div></li>';
            }
            return html;
        },
        showType: function(html){ // 构造弹窗内容
            var main_html = '<div class="cus-multiple-upload">'
                    +'<div class="content-area">'
                        +'<ul class="file-list clearfix">'+ html +'</ul>'
                    +'</div>'
                    +'<div class="footer-area clearfix">'
                        +'<div class="info-tip">提示:</div>'
                        +'<div class="btns pull-right">'
                            +'<button  class="btn btn-sm js-add-more">继续添加</button>'
                            +'<button class="btn btn-sm btn-info js-upload">开始上传</button>'
                        +'</div>'
                    +'</div>'
                +'</div>';
            
            cumCurWinModal('多文件上传', main_html, self, {
                "area": ['48%', '50%'],
                "type": 1,
                "success": function(layero, ind_){
                    $layero = layero;
                    $fileUl = layero.find('.file-list');
                    $infotip = layero.find('.info-tip');
                    err_num = 0;
                    
                    layero.on('click', '.js-add-more', function(){ // 继续添加
                        return $rep_html.closest('.cus-mult-files').find('.js-inp-files').trigger('click');
                    }).on('click', '.js-upload', function(){
                        $uploader.upload();
                        is_uploading = true; // 切换上传状态
                        $(this).attr('disabled', true).siblings('.js-add-more').attr('disabled', true);
                    }).on('click', '.delete', function(){
                        var t_ = $(this).closest('.li-file');
                        //is_uploading && $uploader.cancelFile( t_.attr('id') ); // 文件状态为已取消, 同时将中断文件传输
                        $uploader.removeFile( t_.attr('id'), true );
                        t_.remove();
                    });
                },
                "cancel": function(index){
                    if(is_uploading){
                        COM_TOOLS.alert('上传还未结束是否关闭弹窗', {
                            time: 0,
                            btn: ['确定', '取消'],
                            btn1: function(index_a){
                                layer.close(index);
                                layer.close(index_a);
                                
                                $layero = []; // 清除数据
                                $uploader.reset();
                            }, btn2: function(index_a){
                                layer.close(index_a);
                            }
                        });
                        return false;
                    }
                    err_num = 0;
                    $layero = []; // 清除数据
                    $uploader.reset();
                }
            });
        },
        updateStatus: function(file, param){ // 隐藏删除按钮
            var $t = $fileUl.find('#'+ file['id']);
            switch (param){
            	case 'success':
            	    $t.addClass('success');
            		break;
            	case 'error':
            	    $t.addClass('error');
                    break;
            }
            $t.find('.delete').hide();
        },
        infoTips: function(){ // 信息及状态提示
            var text = '',
                state = $uploader.getStats(),
                fail_file = $uploader.getFiles('error');
            
            text = '成功上传<span class="text-info">&nbsp;'+ (err_num ? 0 : state.successNum ) +'&nbsp;</span>文件，<span class="text-danger">&nbsp;'+ (err_num || state.uploadFailNum) +'&nbsp;</span>个文件失败';
            $infotip.html('提示：'+ text);
            
            $fileUl.find('.delete').hide(); // 隐藏 删除 按钮
        }
    };
    
    // 公共变量
    var $uploader = WebUploader.create( baseOpt ), // 初始化web实例
        is_uploading = false;
    
    var $layero = [],
        $fileUl = [], // 文件ul dom
        $infotip, // 信息提示
        $inp_h = $rep_html.find('.js-hide-inp'),
        err_num = 0;
    
    $uploader.on('filesQueued', function(files){ // 加入队列
        var addhtml = UP_TOOLS.addFileDom(files);
        
        if(!$layero.length){
            UP_TOOLS.showType(addhtml);
        }else if($fileUl.length){
            $fileUl.append(addhtml);
        }else{
            console.error('文件列表 dom 渲染错误');
        }
    }).on('uploadProgress', function( file, percentage ){
        var $li = $fileUl.find('#'+ file.id),
        $percent = $li.find('.pro-bar');
        $percent.css( 'width', percentage * 100 + '%' );
    }).on('error', function( code ){
        switch ( code ){
        	case 'Q_EXCEED_NUM_LIMIT':
        	    COM_TOOLS.alert('文件数量超过10个');
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
    }).on('uploadSuccess', function( file, res ){
        if(res.state == 1){
            UP_TOOLS.updateStatus(file, 'success');
            var arr = $inp_h.val().split(',');
            arr[0] == '' && arr.pop(); // 第一个去空
            arr.push(res.path);
            $inp_h.val(arr.join(','));
        }else if(res._raw == 'ERROR'){
            err_num++;
            UP_TOOLS.updateStatus(file, 'error');
        }
        // 成功回调
        baseOpt.success && baseOpt.success(file, res);
    }).on('uploadError', function( file, res){
        UP_TOOLS.updateStatus(file, 'error');
    }).on('uploadFinished', function(){
        UP_TOOLS.infoTips();
        is_uploading = false;
    });
    
    return $uploader;
}

