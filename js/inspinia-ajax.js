/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.4
 *	Last modified time :2017-09-13
 */

// Full height of sidebar
function fix_height() {
	if ($("body").hasClass('css-height100') || $("body").hasClass('css-flex')) {
        return false;
    }
    //var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    //$(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    //$('#mainPiframe:visible').height('auto').height($('#mainPiframe').contents().height());
    //$('#welPiframe:visible').height('auto').height($('#welPiframe').contents().height());

    var navbarHeigh = $('nav.navbar-default').height();
    var wrapperHeigh = $('#page-wrapper').height();

    if (navbarHeigh > wrapperHeigh) {
        $('#page-wrapper').css("min-height", navbarHeigh + "px");
    }

    if (navbarHeigh < wrapperHeigh) {
        $('#page-wrapper').css("min-height", $(window).height() + "px");
    }

}
/* 获取按钮权限 */
function getPermission(){
	$.ajax({
		type:"get",
		url:"",
		cache:false,
		dataType:'json',
		success:function(d){
			if(d && d.result==1){
				if(COM_TOOLS.sessionStorageSupport()){
	    			COM_TOOLS.save_toSession('TEDU-checkbtn',JSON.stringify(d['crmCodes']));
	    			COM_TOOLS.check_Abtn();
		    	}else{
					COM_TOOLS.alert(TEDU_MESSAGE.get('checkWinVer'));
				}
			}else{
				COM_TOOLS.alert(TEDU_MESSAGE.get('noGetPermission'));
			}			
		},
		error:function(){
			COM_TOOLS.alert(TEDU_MESSAGE.get('networkError'));
		}
	});
}

$(document).ready(function () {
    // Add body-small class if window less than 768px
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
    $('#side-menu ul').filter(function(index) {
        return !$(this).children('li').length;
    }).siblings('a').children('span:last').remove().end().next().remove();
    // MetsiMenu
    $('#side-menu').metisMenu();
    // Minimalize menu
    $('.navbar-minimalize').click(function () {
        $("body").toggleClass("mini-navbar");
        var iBtn = $('.navbar-minimalize.btn i');
        if(iBtn.hasClass('tedu-icon38')){
            iBtn.removeClass('tedu-icon38').addClass('tedu-icon39');
        }else{
            iBtn.removeClass('tedu-icon39').addClass('tedu-icon38');
        }
        SmoothlyMenu();
        setTimeout(function(){$(window).trigger('resize');},500); //关键:ajax布局组件兼容，延时不能小于400ms; @LL
        return false;
    });
    //fix_height();
    $(window).bind("load resize", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });
	$('#side-menu .item .nav li a').filter(function(index) {
		var this_ = $(this);
		return !this_.next().is('ul.nav') || (this_.next().is('ul.nav') && this_.is('[href!="#"]'));
	}).click(function(e){
		e.preventDefault();
        setCustomMenu($(this));
		var  p = $(this).parent('li');
		p.addClass('active').siblings('li').removeClass('active');
	});
	/*$('#cumBopbarMenu').on('click','li > a',function(){
		var t_ = $(this);
		$('#t_tabBox a[href="#t_subpage"]').tab('show').text(t_.data('original-title')).parent().removeClass('hidden');
		t_.blur();
	});*/
	$('#t_tabBox a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		fix_height();
		var t = $(e.target);
		if(t.attr('href')=='#t_home' && $('#t_home').is(':empty')){
			loadMenuPage($('#t_home'),COM_TOOLS._tabHomePage,'index-default');
		}
		t.data('itemid') && $.hash().set('pathid',t.data('itemid')).location();
	});
	var curUrlPath = $.hash().get('pathid') || 'index-default';
	if(curUrlPath){
		var cli_ = $('#side-menu .item .nav li[data-itemid="'+curUrlPath+'"] > a');
		if(cli_.length>0){
			cli_.closest('li.item').children('a').trigger('click');
			cli_.trigger('click');
		}else{
			$('#t_tabBox a[href="#t_home"]').tab('show');
			loadMenuPage($('#t_home'),COM_TOOLS._tabHomePage,'index-default');
		}
	}
	/* 获取按钮权限 */
	COM_TOOLS._isCheckBtn && getPermission();
});


// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
    //setTimeout(function(){$(window).trigger('resize');},500);
});

// For demo purpose - animation css script
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
    }
}

function loadMenuPage(obj,url_,hash_,cb,isIframe){//ajax-loadpage hash
	if(hash_!='undefined'){$('#t_tabBox a[href="#'+(obj.prop('id'))+'"]').data('itemid',hash_);}
	Pace.restart();
	COM_TOOLS.private_obj_={};
	if(isIframe==true){
		var hei_ = Math.floor($(window).height()-$('#main_page_tapbox').offset().top-20);
		obj.html('<iframe class="js-iframe-comwin" width="100%" style="min-height:100%" height="'+hei_+'" frameborder="0" scrolling="auto" src="'+url_+'" name="mainPiframe" id="mainPiframe" allowtransparency="yes"></iframe>');
		if(hash_!='undefined'){
			$.hash().set('pathid',hash_).location();
		}
		if(typeof(cb)=== "function"){cb();} //注意这里没有监听iframe-load
	}else{
		obj.load(url_,function(response,status,xhr){ //status : ["success", "notmodified"], "error", "timeout" 或 "parsererror"
			if(hash_!='undefined'){
				$.hash().set('pathid',hash_).location();
			}
			if(typeof(cb)=== "function"){cb();}
			if(status !="success" && status !="notmodified"){
				obj.load(COM_TOOLS._404Page);
			}
		});
	}
}
function setCustomMenu(t){ //右侧跳转
    var url_ = t.attr('href');
    var tab_ = t.attr('target');
    var itemId_ = t.parent('li').data('itemid');
    if (tab_ == "_blank") {
        window.open(url_,'_blank');
    }else if(url_ != "#"){
        var tit_ = $.trim(t.children('span').text());
        loadMenuPage($('#t_subpage'),url_,itemId_,function(){
            $('#t_tabBox a[href="#t_subpage"]').tab('show').text(tit_).parent().removeClass('hidden');
        },tab_=='#iframeWindow');
    }
}

$(function () {
    $('.custem_select_mod > .dropdown-menu a').click(function () {
        var t = $(this);
        var p = t.closest('.custem_select_mod');
        var b = p.find('.cus_selval');
        b.text($.trim(t.text())).data('itemval', t.data('itemval'));
    });
    $('.custem_select_mod').each(function(i, n){
    	$(this).find('a:eq(0)').trigger('click');
    });
    if(COM_TOOLS._customMenus>0){
        $('.shortcut-menu-open').removeClass('shortcut-menu-open');    //显示自定义区域
        function dataFun() {    //获取左侧数据,本地模拟数据使用
            var data_ = [];
            $('#side-menu>li').filter(function () {
                return !$(this).hasClass('logo_box');
            }).each(function () {
                var t_ = $(this);
                var a_ = t_.children('a');
                data_.push({
                    id: 'm_' + t_.data('itemid'),
                    parent: '0',
                    text: $.trim(a_.text()),
                    a_attr: {url_: a_.attr('href'),itemid:t_.data('itemid')},
                    icon: a_.children('i').first().attr('class')
                });
                if (a_.next('ul').length > 0) {
                    var ul_ = a_.next('ul');
                    ul_.children('li').each(function () {
                        var t_2 = $(this);
                        var a_2 = t_2.children('a');
                        data_.push({
                            id: 'm_' + t_2.data('itemid'),
                            parent: 'm_' + t_.data('itemid'),
                            text: $.trim(a_2.text()),
                            a_attr: {url_: a_2.attr('href'),itemid:t_2.data('itemid')},
                            icon: a_2.children('i').first().attr('class')
                        });
                        if (a_2.next('ul').length > 0) {
                            var ul_2 = a_2.next('ul');
                            ul_2.children('li').each(function () {
                                var t_3 = $(this);
                                var a_3 = t_3.children('a');
                                data_.push({
                                    id: 'm_' + t_3.data('itemid'),
                                    parent: 'm_' + t_2.data('itemid'),
                                    text: $.trim(a_3.text()),
                                    a_attr: {url_: a_3.attr('href'),itemid:t_3.data('itemid')},
                                    icon: a_3.children('i').first().attr('class')
                                });
                            })
                        }
                    })
                }
            });
            console.log(data_);
            return data_;
        }
        var color_i_ = 0;//根据下标定义颜色
        /*自定义滚动条*/
        $('#carousel-bianji .btn-box-shortcut').mCustomScrollbar({theme:"dark-3"});
        $('.tree-menu-box').mCustomScrollbar({theme:"dark-3"});
        /*初始化jstree*/
        $.jstree.defaults.core.themes.dots = false;//不显示连接线
        $('#tree_box_menu').jstree({
            "checkbox": {
                "three_state": false//此属性选择是否级联,默认为true。
            },
            'core': {
                'data': dataFun()
            },
            'plugins': ['checkbox','search']//search:搜索组件,checkbox:多选框
        }).on("changed.jstree",function(e, d){
            var ref = $(this).jstree(true);
            if(d.action == "deselect_all"){return;}
            var colorA = ['btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger'];    //默认样式
            var node_ = d.node.id;
            var n_text = ref.get_text(node_);
            var url_ = d.node.a_attr.url_,
                tit_ = $.trim(ref.get_text(node_)),
                id_ = d.node.a_attr.itemid,
                icon_ = d.node.icon;
            if (ref.is_selected(node_)) {
                if($('#carousel-bianji>.btn-box-shortcut #mCSB_1_container button.cuschecked').length>(COM_TOOLS._customMenus-1)){
                    ref.deselect_node(node_);
                    COM_TOOLS.alert('最多选'+COM_TOOLS._customMenus+'个');
                    return false;
                }
                var color_btnc = (colorA[(color_i_% 5)]);
                $('#carousel-bianji>.btn-box-shortcut #mCSB_1_container').append('<div class="col-xs-4 text-center">' +
                    '<button data-color_="'+color_btnc+'" data-icon_="'+icon_+'" data-itemurl="'+url_+'" data-itemid="'+id_+'" type="button" class="btn btn-circle btn-lg cuschecked '+color_btnc+'">' +
                    '<em><i class="glyphicon glyphicon-minus"></i></em>' +
                    '<i class="'+icon_+'"></i></button><p>'+tit_+'</p>' +
                    '</div>');
                color_i_++;
            }else {
                $('#carousel-bianji button[data-itemid='+id_+']').parent().remove();
            }
        }).on('ready.jstree',function(){
            var ref_menuTree =$(this).jstree(true);
            /*初始化默认选择*/
            var id_list_arr = [1,2];
            var id_tree_arr = [];
            $.each(id_list_arr,function(i,n){
                id_tree_arr.push('m_'+n);
            });
            ref_menuTree.select_node(id_tree_arr,false,false);
            $('#save_shortcut_menu').trigger('click');
        });
        /*jstree搜索*/
        $('#menu_search_input,#menu_search_btn').keypress(function(){
            $('#tree_box_menu').jstree(true).search($(this).val());
        });
        $('#menu_search_btn').click(function(){
            $('#tree_box_menu').jstree(true).search($('#menu_search_input').val());
        });
        /*删除选中菜单项*/
        $('#carousel-bianji').on('click','.btn-box-shortcut button',function(){
            var id_ = $(this).data('itemid');
            var ref = $('#tree_box_menu').jstree(true);
            $(this).parent().remove();
            ref.uncheck_node('m_'+id_);
        }).on('click', '#r_shortcut_menu', function(){ /*删除全部*/
            var ref = $('#tree_box_menu').jstree(true);
            $('#carousel-bianji .btn-box-shortcut #mCSB_1_container').html("");
            ref.deselect_all();
            color_i_=0;
        }).on('click', '#save_shortcut_menu', function(){ /*点击保存*/
            var str_ = '';
            $('#carousel-bianji .btn-box-shortcut #mCSB_1_container button').each(function(){
                var id_ = $(this).data('itemid'),icon_ = $(this).data('icon_'),tit_ = $(this).next().text(),color_ = $(this).data('color_');
                str_ += '<li data-itemid="'+id_+'"><a class="btn '+color_+'" data-toggle="tooltip" data-placement="bottom" data-original-title="'+tit_+'"><i class="'+icon_+'"></i></a></li>'
            });
            $('#cumBopbarMenu').html(str_);
            $('#cumBopbarMenu>li>a').tooltip();  //pop提示框
            layer.close(cur_lay_ind);
        });
        /*打开弹框*/
        var modal = $('#index_cus_menus'), cur_lay_ind = 0;
        $('#customMenu_btn').click(function(){
            console.log('modal', modal)
            cur_lay_ind = cumParentWinModal('自定义菜单设置', modal, {'type': 1, 'area': ['770px', '430px']});
        });
        /*点击保存后的菜项*/
        $('#cumBopbarMenu').on('click','li>a',function(){
            var itemid = $(this).parent().data('itemid');
            //单独触发a标签无效，通过内部冒泡实现
            $('#side-menu li[data-itemid='+itemid+']>a span').trigger('click');
        });
    }
});