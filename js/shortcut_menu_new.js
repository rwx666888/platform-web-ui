$(function () {
	if(COM_TOOLS._customMenu){
        $('.shortcut-menu-open').show();
        var color_i_ = 0;//根据下标定义颜色
        var colorA = ['btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger'];
		/*自定义滚动条*/
        $('#carousel-bianji .btn-box-shortcut').mCustomScrollbar({theme: "dark-3"});
        $('.com-menu-box .com-ul-box').mCustomScrollbar({theme: "minimal-dark"});
		/*获取右侧选中的id*/
        function menuIdFun() {
            var arr = [];
            $('#carousel-bianji>.btn-box-shortcut button.cuschecked').each(function () {
                arr.push($(this).data('itemid'));
            });
            return arr;
        }
		/*获取已选中的id*/
        function menuBarid(){
            var arr = [];
            $('#cumBopbarMenu li').each(function () {
                arr.push($(this).data('itemid'));
            });
            return arr;
        }
		/*渲染一级菜单*/
        function newListFun(){
            var menuId = menuBarid();
            var str_first = '';
            $('#side-menu>li').filter(function () {
                return !$(this).hasClass('logo_box');
            }).each(function () {
                var t_ = $(this),
                    a_ = t_.children('a'),
                    url_ = t_.data('itemurl'),
                    text_ = $.trim(a_.text()),
                    id_ = t_.data('itemid'),
                    icon_ = a_.children('i').first().attr('class');
                if ($.inArray(id_, menuId) !== -1) {
                    str_first += '<li data-itemid="' + id_ + '"><div>' +
                        '<p title="'+text_+'" class="cur-yes"><i class="' + icon_ + '"></i> <span class="nav-label">' + text_ + '</span></p>' +
                        '<span class="cur-ok"><i class="glyphicon glyphicon-ok"></i></span>' +
                        '</div></li>';
                } else {
                    str_first += '<li data-itemid="' + id_ + '"><div>' +
                        '<p title="'+text_+'"><i class="' + icon_ + '"></i> <span class="nav-label">' + text_ + '</span></p>' +
                        '<span><i class="glyphicon glyphicon-plus"></i></span>' +
                        '</div></li>';
                }
            });
            $('#parent_list').html(str_first);
        }
		/*鼠标移动到菜单项显示县级菜单*/
        $('.com-menu-box').on('mouseenter', 'ul>li', function () {
            if ($(this).hasClass('cur-ok')) {
                return;
            }
            $(this).closest('ul').find('li').removeClass('cur-ok');
            $(this).addClass('cur-ok');
            var menuId2 = menuIdFun();
            var id_ = $(this).data('itemid'),
                li_ = $('#side-menu li[data-itemid=' + id_ + ']'),
                ul_ = li_.children('ul'),
                p_ul = $(this).closest('ul');
            var str_ = '';
            if (ul_.children('li').length > 0) {
                ul_.children('li').each(function () {
                    var t_ = $(this),
                        a_ = t_.children('a'),
                        url_ = t_.data('itemurl'),
                        text_ = $.trim(a_.text()),
                        id_ = t_.data('itemid'),
                        icon_ = a_.children('i').first().attr('class');
                    if ($.inArray(id_, menuId2) !== -1) {
                        str_ += '<li data-itemid="' + id_ + '"><div>' +
                            '<p title="'+text_+'" class="cur-yes"><i class="' + icon_ + '"></i> <span class="nav-label">' + text_ + '</span></p>' +
                            '<span class="cur-ok"><i class="glyphicon glyphicon-ok"></i></span>' +
                            '</div></li>';
                    } else {
                        str_ += '<li data-itemid="' + id_ + '"><div>' +
                            '<p title="'+text_+'"><i class="' + icon_ + '"></i> <span class="nav-label">' + text_ + '</span></p>' +
                            '<span><i class="glyphicon glyphicon-plus"></i></span>' +
                            '</div></li>';
                    }
                });
            }
            if (p_ul.attr('id') == 'parent_list') {
                $('#son_list').html(str_);
            } else if (p_ul.attr('id') == 'son_list') {
                $('#grandson_list').html(str_);
            }
        });
		/*点击+号*/
        $('.com-menu-box').on('click', 'ul>li>div>span', function () {
            var color_btnc = (colorA[(color_i_ % 5)]);
            var t_ = $(this),
                id_ = t_.closest('li').data('itemid'),
                li_ = $('#side-menu li[data-itemid=' + id_ + ']'),
                a_ = li_.children('a'),
                url_ = li_.data('itemurl'),
                text_ = $.trim(a_.text()),
                icon_ = a_.children('i').first().attr('class');
            if (!t_.children('i').hasClass('glyphicon-ok')) {
                $('#carousel-bianji>.btn-box-shortcut #mCSB_1_container').append('<div class="col-xs-6 text-center">' +
                    '<button data-color_="' + color_btnc + '" data-icon_="' + icon_ + '"data-itemid="' + id_ + '" type="button" class="btn btn-circle cuschecked ' + color_btnc + '">' +
                    '<em><i class="glyphicon glyphicon-minus"></i></em>' +
                    '<i class="' + icon_ + '"></i></button><p>' + text_ + '</p>' +
                    '</div>');
                t_.addClass('cur-ok').children('i').attr('class', 'glyphicon glyphicon-ok').end().prev().addClass('cur-yes');
                color_i_++
            }
        });
		/*删除选中菜单项*/
        $('#carousel-bianji').on('click', '.btn-box-shortcut button', function () {
            var id_ = $(this).data('itemid');
            $(this).parent().remove();
            $('.com-menu-box li[data-itemid=' + id_ + ']>div>span').removeClass('cur-ok').children('i').attr('class', 'glyphicon glyphicon-plus').end().prev().removeClass('cur-yes');
            color_i_--;
        });
		/*删除全部*/
        $('#r_shortcut_menu').click(function () {
            $('#carousel-bianji .btn-box-shortcut #mCSB_1_container').html("");
            $('.com-menu-box li>div>span').removeClass('cur-ok').children('i').attr('class', 'glyphicon glyphicon-plus').end().prev().removeClass('cur-yes');
            color_i_ = 0;
        });
		/*保存按钮点击*/
        $('#save_shortcut_menu').click(function () {
            var str_ = '';
            $('#carousel-bianji .btn-box-shortcut #mCSB_1_container button').each(function () {
                var id_ = $(this).data('itemid'), icon_ = $(this).data('icon_'), tit_ = $(this).next().text(), color_ = $(this).data('color_');
                str_ += '<li data-itemid="' + id_ + '"><a class="btn ' + color_ + '" data-toggle="tooltip" data-placement="bottom" data-original-title="' + tit_ + '"><i class="' + icon_ + '"></i></a></li>'
            });
            $('#cumBopbarMenu').html(str_);
            $('#cumBopbarMenu>li>a').tooltip();
            layer.close(layer.index);
        });
		/*取消按钮点击*/
        $('#cancel_shortcut_menu').click(function(){
            layer.close(layer.index);
        });
		/*打开自定义菜单*/
        var modal = $('#carousel-example-1');
        $('#customMenu_btn').click(function () {
            $('.com-menu-box ul').html('');
            var ids_ = menuBarid();
            var str_bar = '';
            $.each(ids_,function(i,n){
                var color_btnc = (colorA[(color_i_ % 5)]);
                var t_ = $('#side-menu li[data-itemid=' + n + ']'),
                    a_ = t_.children('a'),
                    url_ = t_.data('itemurl'),
                    text_ = $.trim(a_.text()),
                    id_ = t_.data('itemid'),
                    icon_ = a_.children('i').first().attr('class');
                str_bar += '<div class="col-xs-6 text-center">' +
                    '<button data-color_="' + color_btnc + '" data-icon_="' + icon_ + '"data-itemid="' + id_ + '" type="button" class="btn btn-circle cuschecked ' + color_btnc + '">' +
                    '<em><i class="glyphicon glyphicon-minus"></i></em>' +
                    '<i class="' + icon_ + '"></i></button><p>' + text_ + '</p>' +
                    '</div>';
                color_i_++;
            });
            $('#carousel-bianji>.btn-box-shortcut #mCSB_1_container').html(str_bar);
            newListFun();
			/*打开弹框*/
            layer.open({
                area: ['830px', '500px'],
                type: 1,
                scrollbar: false,
                title: '自定义菜单设置',
                content: modal,
                cancel:function () {
                    // $('#r_shortcut_menu').trigger('click')
                }
            });
        });
		/*自定义菜单点击*/
        $('#cumBopbarMenu').on('click', 'li>a', function () {
            var itemid = $(this).parent().data('itemid');
            $('#side-menu li[data-itemid=' + itemid + ']>a').trigger('click');
        });
	}
});