/* 视图工具 */
COM_TOOLS._view = {
    /**
     * @description 高级搜索弹窗
     * @param {String} id 触发这个弹窗按钮的id;
     */
    cusHighSearch: function (id) {
        $('#' + id).on('click', '.js-highsearch-btn', function () {
            var tObj_ = $(this);
            if (!tObj_.data('isload')) { //防止多次加载
                tObj_.siblings('.js-moreSearchBox').load(tObj_.data('itemurl'), function () {
                    tObj_.data('isload', true);
                });
            }
        }).find('.js-moreSearchBox').click(function () { //防止点击弹出框自动关闭
            return false;
        });
    },

    /**
     * 新手引导
     *
     */
    noviceGuide: '<div class="popover cus-step-popover-box" role="tooltip"> <div class="arrow"></div> <h3 class="popover-title"></h3> <div class="popover-content"></div>' +
        '<div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-default" data-role="prev">&laquo; ' + LOCAL_MESSAGE_DATA["platform.plugin.msg.prevStep"] +
        '</button> <button class="btn btn-sm btn-default" data-role="next">' + LOCAL_MESSAGE_DATA["platform.plugin.msg.nextStep"] + ' &raquo;</button>' +
        '<button class="btn btn-sm btn-default" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">' + LOCAL_MESSAGE_DATA["platform.plugin.msg.pause"] +
        '</button> </div> <button class="btn btn-sm btn-default" data-role="end">' + LOCAL_MESSAGE_DATA["platform.plugin.msg.end"] + '</button> </div> </div>',

    DT_colShowBar: function (that_, btnid) {
        var _btn = $('#' + btnid);
        if (_btn.length && !_btn.hasClass('dropdown-toggle') && !_btn.is('[data-toggle]')) {
            var wrap = $('<div class="btn-group md-dropdown-ll0328"></div>');
            _btn.addClass('dropdown-toggle').attr('data-toggle', dropdown);
        }
        /*var columns_ = [], str = [];
        that_.columns('.js-visible-column').every(function(index) {
            str.push('<li><label><input class="js-input" type="checkbox" value="',index,'">&nbsp;',
            $(this.header()).text(),'</label></li>')
        });
        $('.js-col-selbar').html(str.join('')).on('click',function(e){
            e.stopPropagation();
        }).find('.js-input').on('click',function(){
            console.log($(this).val())
            that_.column( $(this).val()).visible( !that_.column( $(this).val()).visible() );
        });*/
    },
    /* 
     * 动态生成密码输入框
     * 默认为 DOM 动态构造版，支持校验；
     * selector 为对应的 ID，isDynamicDom 为 false 时是非动态 DOM 构造
     */
    cusPWD: function (selector, isDynamicDom) {
        var $obj = $('#' + selector);
        if (!$obj.length) {
            return
        }
        if (isDynamicDom != false) {
            var temp = $('<div class="js-temp-html"></div>'); // 替换用的占位符
            $obj.before(temp);
            var $rep_html = $('<div class="input-group input-group-sm js-pwd-parent"> \
                <span class="js-replace-dom"></span> \
                <span class="input-group-btn"><button class="btn btn-primary js-pwd-btn" type="button"><i class="glyphicon glyphicon-eye-close"></i></button></span> \
                </div>');
            $obj.attr('type', 'password');
            $rep_html.find('.js-replace-dom').replaceWith($obj);
            temp.replaceWith($rep_html); // 注意
        }
        var $p = $obj.closest('.js-pwd-parent');
        $p.on('click.pwd', '.js-pwd-btn', function (e) {
            var $icon = $p.find('.glyphicon');
            if ($obj.is('[type=password]')) {
                $obj.attr('type', 'text')
                $icon.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open')
            } else {
                $obj.attr('type', 'password')
                $icon.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close')
            }
        });
    }
};