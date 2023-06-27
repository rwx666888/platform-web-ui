//自定义图片上传方法
function cus_file_upload(id, filetype, opt){
    (typeof filetype == 'object') && (opt = filetype);
    // 当domReady的时候开始初始化
    var $wrap = $('#'+ id),
    // 图片容器
    $queue = $wrap.find('.file-list'),
    // 状态栏，包括进度和控制按钮
    $statusBar = $wrap.find('.status-bar'),
    // 文件总体选择信息。
    $info = $statusBar.find('.total-info'),
    // 上传按钮
    $upload = $wrap.find('.uploadBtn'),
    // 没选择文件之前的内容。
    $placeHolder = $wrap.find('.default-info'),
    // modal 弹窗 id
    $modal = '';
    //$progress = $statusBar.find( '.progress' ).hide(),
    // 添加的文件数量
    fileCount = 0,
    // 添加的文件总大小
    fileSize = 0,
    // 可能有pedding, ready, uploading, confirm, done.
    _curstate = 'pedding',
    // 所有文件的进度信息，key为file id
    //percentages = {},
    //base64支持检测
    _isSupportBase64 = (function(){
        var data = new Image();
        var support = true;
        data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        data.onload = data.onerror = function() {
            if( this.width != 1 || this.height != 1 ) {
                support = false;
            }
        }
        return support;
    } )()
    
    if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {
        _isSupportFlash = (function(){
            var version;
            try {
                version = navigator.plugins[ 'Shockwave Flash' ];
                version = version.description;
            } catch ( ex ) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                            .GetVariable('$version');
                } catch ( ex2 ) {
                    version = '0.0';
                }
            }
            version = version.match( /\d+/g );
            return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
        })();
        // flash 安装了但是版本过低。
        if (_isSupportFlash) {
            console.log( '您的flash版本有误');
        // 压根就没有安转。
        } else {
            console.log( '您未安装flash插件');
        }
        return;
    } else if (!WebUploader.Uploader.support()) {
        console.log( 'Web Uploader 不支持您的浏览器！');
        return;
    }
    
    var IMG_TOOLS = {
        addImgFile: function(file){   //添加文件并预览
            var $li = $( '<li class="li-img" id="' + file.id + '">' +
            '<p class="title">' + file.name + '</p>' +
            '<p class="imgWrap"></p>'+
            '<p class="progress-cont"><span class="pro-bar"></span></p>' +
            '</li>' ),
            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
            $prgress = $li.find('.pro-bar'),
            $wrap = $li.find('.imgWrap'),
            $info = $('<p class="error"></p>'),
            showError = function( code ) {
                switch( code ) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;
                    case 'interrupt':
                        text = '上传暂停';
                        break;
                    default:
                        text = '上传失败，请重试';
                        break;
                }
                $info.text( text ).appendTo( $li );
            };
            if ( file.getStatus() === 'invalid' ) {
                showError( file.statusText );
            } else {
                $wrap.text( '预览中' );
                $uploader.makeThumb( file, function( error, src ) {
                    var img;
                    if ( error ) {
                        $wrap.text( '不能预览' );
                        return;
                    }
                    if( _isSupportBase64 ) {
                        img = $('<img src="'+src+'">');
                        $wrap.empty().append( img );
                    } else {
                        console.log('您的浏览器不支持base64');
                    }
                });
                //percentages[ file.id ] = [ file.size, 0 ];
                file.rotation = 0;
            }
            file.on('statuschange', function( cur, prev ) {
                if ( prev === 'progress' ) {
                    $prgress.hide().width(0);
                } else if ( prev === 'queued' ) {
                    $li.off( 'mouseenter mouseleave' );
                    $btns.remove();
                }
                // 成功
                if ( cur === 'error' || cur === 'invalid' ) {
                    showError( file.statusText );
                    //percentages[ file.id ][ 1 ] = 1;
                } else if ( cur === 'interrupt' ) {
                    showError( 'interrupt' );
                } else if ( cur === 'queued' || cur === 'progress') {
                    $info.remove();
                    $prgress.css('display', 'block');
                    //percentages[ file.id ][ 1 ] = 0;
                } else if ( cur === 'complete' ) {
                    $prgress.hide().width(0);
                    $li.append( '<span class="success"></span>' );
                }
                $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
            });
            $li.on( 'mouseenter', function() {
                $btns.stop().animate({height: 30});
            }).on( 'mouseleave', function() {
                $btns.stop().animate({height: 0});
            });
            $btns.on( 'click', 'span', function() {
                var classType = $(this).attr('class'), deg;
                switch ( classType ) {
                    case 'cancel':
                        $uploader.removeFile( file );
                        return;
                    case 'rotateRight':
                        file.rotation += 90;
                        break;
                    case 'rotateLeft':
                        file.rotation -= 90;
                        break;
                }
                //旋转
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            });
            $li.appendTo( $queue );
        },
        addDocFile: function(file){
            var $li = $('<li class="li-file" id="' + file.id + '">'+
                        '<span class="btn-close"></span>'+
                        '<p class="title-file">'+ file.name +'</p>'+
                        '<div class="file-info">'+
                            '<div class="pro"><span class="pro-bar"></span></div>'+
                            '<div class="error"></div>'+
                        '</div></li>'),
            $btn = $li.find('.btn-close'),
            $prgress = $li.find('.pro'),
            $err = $li.find('.error'),
            showError = function(code){
                switch(code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;
                    case 'interrupt':
                        text = '上传暂停';
                        break;
                    default:
                        text = '上传失败，请重试';
                        break;
                }
                $err.text(text);
            };
            file.on('statuschange', function( cur, prev ) {
                if ( prev === 'progress' ) {
                    $prgress.hide();
                }
                // 成功
                if ( cur === 'error' || cur === 'invalid' ) {
                    showError( file.statusText );
                    //percentages[ file.id ][ 1 ] = 1;
                } else if ( cur === 'interrupt' ) {
                    showError( 'interrupt' );
                } else if ( cur === 'queued' || cur === 'progress') {
                    //$err.remove();
                    $prgress.show();
                    //percentages[ file.id ][ 1 ] = 0;
                }
            });
            $btn.on('click', function(){
                $uploader.removeFile(file);
            });
            $li.appendTo($queue);
        },
        removeFile: function(file){ //摧毁预览
            var $li = $('#'+file.id);
            //delete percentages[ file.id ];
            //IMG_TOOLS.updateTotalProgress();
            $li.off().find('.file-panel').off().end().remove();
        },
        updateTotalProgress: function(){
            var loaded = 0, total = 0, spans = $progress.children(), percent;
            $.each( percentages, function( k, v ) {
                total += v[ 0 ];
                loaded += v[ 0 ] * v[ 1 ];
            } );
            percent = total ? loaded / total : 0;
            spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
            spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
            IMG_TOOLS.updateStatus();
        },
        updateStatus: function(){
            var text = '', stats_;
            console.log('state-', _curstate);
            if ( _curstate === 'ready' ) {
                text = '选中'+ fileCount +'个文件，共'+ WebUploader.formatSize( fileSize ) +'。';
            } else if ( _curstate === 'confirm' ) {
                console.log('~enter~');
                stats_ = $uploader.getStats();
                console.log('o_stats', stats_);
                if (stats_.uploadFailNum) {
                    text = '已成功上传'+ stats_.successNum +'个文件，'+
                        stats_.uploadFailNum +'个文件上传失败。<a class="js-retry" href="#">重新上传</a>';
                }
                console.log('jc--', text);
            } else {
                stats_ = $uploader.getStats();
                text = '共' + fileCount + '个文件（' +
                    WebUploader.formatSize( fileSize )  +
                    '），已上传' + stats_.successNum + '个文件';
                if ( stats_.uploadFailNum ) {
                    text += '，失败' + stats_.uploadFailNum + '个文件';
                }
            }
            console.log('text', text);
            $info.html( text );
        },
        setState: function(val){
            var file, stats_;
            if ( val === _curstate ) {
                return;
            }
            $upload.removeClass( 'state-' + _curstate );
            $upload.addClass( 'state-' + val );
            _curstate = val;
            switch ( _curstate ) {
                case 'pedding':
                    $placeHolder.removeClass( 'element-invisible' );
                    $queue.hide();
                    $statusBar.addClass( 'element-invisible' );
                    $uploader.refresh();
                    break;
                case 'ready':
                    $placeHolder.addClass( 'element-invisible' );
                    $(baseOpt.addBtn.id).removeClass( 'element-invisible');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    $uploader.refresh();
                    break;
                case 'uploading':
                    $(baseOpt.addBtn.id).addClass( 'element-invisible' );
                    //$progress.show();
                    $upload.text('暂停上传');
                    break;
                case 'paused':
                    //$progress.show();
                    $upload.text('继续上传');
                    break;
                case 'confirm':
                    //$progress.hide();
                    $(baseOpt.addBtn.id).removeClass( 'element-invisible' );
                    $upload.text('开始上传');
                    stats_ = $uploader.getStats();
                    if ( stats_.successNum && !stats_.uploadFailNum ) {
                        IMG_TOOLS.setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats_ = $uploader.getStats();
                    if ( stats_.successNum ) {
                        alert( '上传成功' );
                    } else {
                        // 没有成功的图片，重设
                        _curstate = 'done';
                        location.reload();
                    }
                    break;
            }
        },
        showType: function(type){
            $modal = $(baseOpt.modalId);
            switch (type){
            	case 'concise':
            	    console.log('mtype-', type);
            	    $modal.modal('show').off('hide.bs.modal').on('hide.bs.modal', function(){
                        console.log(关闭);
                        $uploader.reset();  //清空队列
                        $(this).find('.file-list').html('');
                    });
            		break;
            	case 'complex':
            	    console.log('mtype-', type);
            	    $modal.modal('show').off('hide.bs.modal').on('hide.bs.modal', function(){
                        $uploader.destroy();  //清空队列
                        $(this).find('.cus-ele-hide').removeClass('cus-ele-hide')
                        .end().find('.file-list').html('')
                        .end().find('.status-bar').hide();
                    });
                    break;
            }
        }
    };
    
    //webuploader 实例化
    var baseOpt = $.extend({
        /*pick: {
            id: '#js_filePicker',
            label: '选择文件'
        },
        addBtn: {
            id: '#js_filePicker_m',
            label: '继续添加'
        },
        dnd: '#js_dndArea',
        paste: '#js_uploader',
        server: '../../server/fileupload.php', //上传地址
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image'
        },*/
        swf: 'Uploader.swf', //flash文件路径
        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
        disableGlobalDnd: true,
        fileNumLimit: 30,
        fileSizeLimit: 100 * 1024 * 1024,    // 100 M
        fileSingleSizeLimit: 10 * 1024 * 1024,    // 10 M
        unAllowed: 'text/plain;application/javascript'
    }, opt);
    // webuploader 实例
    var $uploader = WebUploader.create(baseOpt);
    // 添加“添加文件”的按钮，
    baseOpt.addBtn && $uploader.addButton(baseOpt.addBtn);
    //事件绑定
    $uploader.on('dndAccept', function(items){   //拖拽时不接受 js, txt 文件
        var denied = false,
        // 修改js类型
        unAllowed = baseOpt.unAllowed;
        for (var i = 0, len = items.length; i < len; i++ ) {
            if ( ~unAllowed.indexOf( items[ i ].type ) ) {
                denied = true;
                break;
            }
        }
        return !denied;
    }).on('uploadProgress', function(file, percentage){
        var $li = $('#'+file.id),
        $percent = $li.find('.pro-bar');
        $percent.css( 'width', percentage * 100 + '%' );
        //percentages[ file.id ][ 1 ] = percentage;
        //IMG_TOOLS.updateTotalProgress();
    }).on('fileQueued', function(file){
        (baseOpt.modalId && fileCount == 0) && IMG_TOOLS.showType(baseOpt.modalType);
        
        fileCount++;
        fileSize += file.size;
        if ( fileCount === 1 ) {
            $placeHolder.addClass( 'cus-ele-hide' );
            $statusBar.show();
        }
        filetype == 'file' ? IMG_TOOLS.addDocFile(file) : IMG_TOOLS.addImgFile(file);
        
        IMG_TOOLS.setState('ready');
        //IMG_TOOLS.updateTotalProgress();
        IMG_TOOLS.updateStatus();
        
        (baseOpt.callback && fileCount == 1) && baseOpt.callback();
    }).on('fileDequeued', function(file){
        fileCount--;
        fileSize -= file.size;
        if ( !fileCount ) {
            IMG_TOOLS.setState( 'pedding' );
        }
        IMG_TOOLS.removeFile( file );
        //IMG_TOOLS.updateTotalProgress();
        IMG_TOOLS.updateStatus();
    }).on('all', function(type){
        console.log(type);
        switch( type ) {
            case 'uploadFinished':
                IMG_TOOLS.setState('confirm');
                IMG_TOOLS.updateStatus();
                console.log('~~~');
                break;
            case 'uploadSuccess':
                //TODO
                break;
            case 'startUpload':
                IMG_TOOLS.setState('uploading');
                break;
            case 'stopUpload':
                IMG_TOOLS.setState('paused');
                break;
            case 'uploadComplete':
                //IMG_TOOLS.updateStatus();
            case 'reset':
                fileCount = 0;
                fileSize = 0;
                break;
        }
        //IMG_TOOLS.updateStatus();
    }).on('error', function(code){
        console.log('Error: ' + code);
    });
    
    $upload.on('click', function() {
        if ( $(this).hasClass( 'disabled' ) ) {
            return false;
        }
        if ( _curstate === 'ready' ) {
            $uploader.upload();
        } else if ( _curstate === 'paused' ) {
            $uploader.upload();
        } else if ( _curstate === 'uploading' ) {
            $uploader.stop();
        }
    });
    $info.on( 'click', '.js-retry', function() {
        $uploader.retry();
    });
    $upload.addClass('state-' + _curstate);
    //IMG_TOOLS.updateTotalProgress();
    return $uploader;
}

