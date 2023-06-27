/*jstree样式自定义菜单*/
/*构造数据*/
$(function () {
	if(COM_TOOLS._customMenu){
        $('.shortcut-menu-open').show();    //显示自定义区域
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
				if($('#carousel-bianji>.btn-box-shortcut #mCSB_1_container button.cuschecked').length>8){
					ref.deselect_node(node_);
					COM_TOOLS.alert('最多选9个')
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
			var id_list_arr = [666,777];
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
		var modal = $('#carousel-example-1'), cur_lay_ind = 0;
		$('#customMenu_btn').click(function(){
		    cur_lay_ind = cumParentWinModal('自定义菜单设置', modal, {'type': 1, 'area': ['770px', '430px']});
		});
		/*点击保存后的菜项*/
		$('#cumBopbarMenu').on('click','li>a',function(){
			var itemid = $(this).parent().data('itemid');
			$('#side-menu li[data-itemid='+itemid+']>a').trigger('click');
		});
	}
});