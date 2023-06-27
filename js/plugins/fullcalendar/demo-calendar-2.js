/* tools fun start */
var cus_TOOLS_data={
	/* 当前日期操作时间 yyyy-MM-dd*/
	cur_sdate_:'', 
	/* 特例事件对象 自习等非正课事件 */
	arr_sp_arr:[],
	/* 结课时间 */
	endClass_day:'2016-12-15',
	/*获取随机数*/
	get_random_fun:function(len){
		var s_='';
		for(var i=0; i<len; i++){
			s_+=Math.floor(Math.random()*10);
		}
		return s_;
	},
	/*获取当前时间及后面的 数据*/
	get_curAndAfter_data:function(cdata){ 
		return $.grep( EVENTS_arr_, function(n,i){
		  	return n['eStartday'] >= cdata;
		});
	},
	/*获取当前时间前面的数据*/
	get_brief_data:function(cdata){
		return $.grep( EVENTS_arr_, function(n,i){
		  	return n['eStartday'] >= cdata;
		}, true);
	},
	/*获取指定的数据*/
	get_search_data:function(k,v,t){
		return $.grep( EVENTS_arr_, function(n,i){
		  	return n[k] == v;
		},(t||false));
	},
	/*获取指定的数据 自定义 
	 * @param checkfun(n,i){//TODU; return true||false;}
	 * */
	get_searchHi_data:function(checkfun,t){
		return $.grep( EVENTS_arr_, checkfun,(t||false));
	},
	/*获取参数在数组中的位置，从0开始计数(如果没有找到则返回 -1 )*/
	arr_getindex_fun:function(item){
		return $.inArray(item, EVENTS_arr_);
	},
	/*新增数据*/
	set_addData_fun:function(obj){
		EVENTS_arr_.push(obj);
	},
	/*按天删除数据*/
	del_data_byday:function(day){
		EVENTS_arr_ = cus_TOOLS_data.get_search_data('eStartday',day,true);
	},
	/* 删除匹配检索条件的数据 */
	del_data_bySearch:function(checkfun,t){
		EVENTS_arr_ = cus_TOOLS_data.get_searchHi_data(checkfun,t);
	},
	/* 建立data obj */
	set_data_obj:function(obj){
		return {
			eId: (new Date()).getTime()+'#'+(obj['zixi']?'class00':obj['cId'])+'#'+obj['eTime']+cus_TOOLS_data.get_random_fun(6), //模拟事件ID，来源于后台：唯一
			eStartday:obj['sday'], //
			eTea:obj['eType']==2?'':obj['eTea'],
			eType:obj['eType'],
			eTime:obj['eTime'],
			ePoi:obj['eType']==2?0:obj['ePoi'],
			cId:obj['zixi']?'class00':obj['cId'],
			eDesc:obj['eDesc'],
			eStatus:0,
			eTeaN:obj['eType']==2?'':(obj['eTeaN'] || TEACHER_obj_[obj['eTea']]),
			cName:obj['eType']==2?'':(obj['cName'] || CLASS_obj_[obj['cId']]['cTitle'])
		}
	},
	/* 更新数据源 
	 * @param arr nextdata;
	 * @param opt nextdata[0].start 开始时间
	 * */
	update_dataSource_fun:function(arr,opt){
		if(arr.length==0){ return false;}
		var arr_obj ={},
			arr_obj_k =[];
		$.each(arr, function(i,n) { //提取待更新的天，转为json对象和数组
			if(n['eStartday'] in arr_obj){
				arr_obj[n['eStartday']].push(n);
			}else{
				arr_obj[n['eStartday']]=[n];
				arr_obj_k.push(n['eStartday']);
			}						
		});
		//console.log('特例事件对象',cus_TOOLS_data.arr_sp_arr);
		arr_obj_k.sort(); //排序
		var sday_=opt;
		$.each(arr_obj_k, function(k,v) { //遍历待更新的天			
			if($.inArray(v,cus_TOOLS_data.arr_sp_arr)==-1){//不含有特殊情况的天
				sday_ = cus_TOOLS_data.get_curWeekDay(sday_,cus_TOOLS_data.arr_sp_arr);
				$.each(arr_obj[v], function(k2,v2) { //遍历每天的事件
					var id_ = v2['eId'];
					$.each(EVENTS_arr_, function(j,m) {
						if(id_==m['eId']){
							EVENTS_arr_[j]['eStartday']=sday_;
							return false;
						}
					});
				});		
				sday_ = $.fullCalendar.moment(sday_).add(1, 'days').format('YYYY-MM-DD');
			}			
		});
		
		arr_obj = null;
		arr_obj_k = null;
	},
	/* 校验是否是休息日 是：true 
	 * @param sday_:日期 2016-10-10
	 * */
	is_playerDay:function(sday_){
		var cday_ = $.fullCalendar.moment(sday_).day();
		return ((cday_==0 || cday_==6 || $.inArray(sday_,PLAYDAYS_)!=-1) && $.inArray(sday_,WEEKDAYS_)==-1 && $.inArray(sday_,WEEKDAYS_PRIVATE_)==-1)
	},
	/* 检验时间  ,获取下一个工作日
	 * @param sday_待检测的时间 
	 * @param s_arr（可选）待过滤的数组*/
	get_curWeekDay:function(sday_,s_arr_){
		var cday_ = $.fullCalendar.moment(sday_).day();
		if((cday_==0 || cday_==6 || $.inArray(sday_,PLAYDAYS_)!=-1 || (s_arr_ && $.inArray(sday_,s_arr_)!=-1)) && $.inArray(sday_,WEEKDAYS_)==-1 && ((s_arr_ && $.inArray(sday_,s_arr_)!=-1) || $.inArray(sday_,WEEKDAYS_PRIVATE_)==-1)){
			/* 休息日及含有自习的日期 */
			sday_ = $.fullCalendar.moment(sday_).add(1, 'days').format('YYYY-MM-DD');
			return arguments.callee(sday_,s_arr_);
		}else{
			return sday_;
		}
	},
	set_data_byid:function(id_,obj){ //根据id修改事件
		$.each(EVENTS_arr_, function(j,m) {
			if(id_==m['eId']){
				$.extend(EVENTS_arr_[j],obj);
				return false;
			}
		});
	},
	/* 检验是否支持本地存储 */
	localStorageSupport:function () {
    	return (('localStorage' in window) && window['localStorage'] !== null)
	},
	/* 存储至本地 */
	save_toLocal:function(key,obj){
		localStorage.setItem(key,JSON.stringify(obj));
	},
	/* 获取本地存储指定数据 */
	get_fromLocal:function(key){
		return localStorage.getItem(key);
	}
}
/* tools fun end */

/* calendar tool fun start */
var calendar =null;

function refetch_ca_draw(){ //重新获取数据并刷新视图
	init_data_fun();
	calendar.fullCalendar('refetchEvents');
	calender_plu_tool.save_cal_dataTolocal();
}


function creat_ca_event_fun(){/*创建整天课程*/
	var sda_ = cus_TOOLS_data.cur_sdate_;
	var val_= calender_plu_tool.input_classType.val();
	if(val_==3){ //结课
		calender_plu_tool.set_end_class(sda_);
		$('#calendar_win_cty_val').parent().siblings('.form-group').show();
	}else if(val_==2){ //自习
		if(cus_TOOLS_data.is_playerDay(sda_)){
			layer.msg('错误： 休息日不允许新建自习！',{zIndex:layer.zIndex});
			return false;
		}else{
			calender_plu_tool.add_ca_event(sda_,'','',1,2,'','','',true);
			$('#calendar_win_cty_val').parent().siblings('.form-group').show();
		}
	}else if(val_==1){//正课
		var cId_= calender_plu_tool.input_class.val(),
			tea_ = calender_plu_tool.input_tea.val(),
			daynum_ = $.trim(calender_plu_tool.input_daynum.val()),
			desc_ = $.trim(calender_plu_tool.input_desc.val());
		if(!$.trim(cId_)||!$.trim(tea_)||!$.trim(daynum_)){
			layer.msg('错误： 请选择阶段、讲师、天数',{zIndex:layer.zIndex});
			return false;
		}	
		calender_plu_tool.add_ca_event(sda_,cId_,tea_,daynum_,1,desc_);
	}
	calender_plu_tool.close_cal_win();
}

var calender_plu_tool={
	input_class: $('#calendar_win_name_val'),
	input_classType: $('#calendar_win_cty_val'),
	input_tea:$('#calendar_win_tea_val'),
	input_daynum:$('#calendar_win_day_val'),
	input_desc:$('#calendar_win_desc_val'),
	check_cur_day:function(sda_){
		if(!sda_){
			layer.msg('错误：没有获取当前操作的日期！',{zIndex:layer.zIndex});
			return false;
		}else{
			return true;
		}
	},
	set_end_class:function(sda_){//结课
		if(calender_plu_tool.check_cur_day(sda_)){
			var endCO_ = $('#endclass_iconobj').length>0?$('#endclass_iconobj'):$('<span id="endclass_iconobj">结课</span>');
			$('.fc-content-skeleton thead td[data-date="'+sda_+'"]').append(endCO_);
			cus_TOOLS_data.endClass_day=sda_;
			calender_plu_tool.save_cal_dataTolocal();
		}
	},
	/** 
	 * @description 添加事件
	 * @param sda_ 当前操作天;
	 * @param ci_ 阶段下标; 
	 * @param tea_:讲师; 
	 * @param daynum_:天数; 
	 * @param classtype_:类型 ：正课:1 、自习:2; 
	 * @param desc_ : 备注
	 * */
	add_ca_event:function(sda_,ci_,tea_,daynum_,classtype_,desc_,teaN_,cname_,iszixi_){
		var classtype_ = classtype_|| 1,
			desc_ = desc_ || '',
			daynum_ = daynum_ || 1,
			iszixi_ = iszixi_ || false;
		if(!calender_plu_tool.check_cur_day(sda_)){
			return false;
		}
		if(classtype_==1 && (!$.trim(ci_)||!$.trim(tea_))){
			layer.msg('错误： 请选择阶段、讲师',{zIndex:layer.zIndex});
			return false;
		}
		if(classtype_==1 && !TEACHER_obj_[tea_]){
			layer.msg('错误： 请核查所选讲师数据状态是否正常！',{zIndex:layer.zIndex});
			return false;
		}
		if(cus_TOOLS_data.is_playerDay(sda_) && $.inArray(sda_,WEEKDAYS_PRIVATE_)==-1){
			WEEKDAYS_PRIVATE_.push(sda_);
		}
		var old_event = cus_TOOLS_data.get_curAndAfter_data(sda_); //获取当前日期及后面的数据
		var sday_ =sda_;
		for(var i=0,len=parseInt(daynum_); i<len; i++){
			sday_ = cus_TOOLS_data.get_curWeekDay(sday_,cus_TOOLS_data.arr_sp_arr);
			/*上午*/
			cus_TOOLS_data.set_addData_fun(cus_TOOLS_data.set_data_obj({sday:sday_,eTea:tea_,eType:classtype_,eTime:1,ePoi:0.5,cId:ci_,eDesc:desc_,eTeaN:teaN_,cName:cname_,zixi:iszixi_}));
			/*下午*/
			cus_TOOLS_data.set_addData_fun(cus_TOOLS_data.set_data_obj({sday:sday_,eTea:tea_,eType:classtype_,eTime:2,ePoi:0.5,cId:ci_,eDesc:desc_,eTeaN:teaN_,cName:cname_,zixi:iszixi_}));
			/*晚上*/
			cus_TOOLS_data.set_addData_fun(cus_TOOLS_data.set_data_obj({sday:sday_,eTea:tea_,eType:2,eTime:3,ePoi:0,cId:ci_,eDesc:desc_,eTeaN:teaN_,cName:cname_,zixi:iszixi_}));
			sday_ = $.fullCalendar.moment(sday_).add(1, 'days').format('YYYY-MM-DD');
		}
		cus_TOOLS_data.update_dataSource_fun(old_event,sday_);
		refetch_ca_draw();
	},
	/**
	 * @description 将休息日设置为工作日，并重拍（前移）后面的课程
	 * @param {String} sda_ 当前操作天;
	 */
	set_to_weekday: function(sda_){
		if(cus_TOOLS_data.is_playerDay(sda_) && $.inArray(sda_,WEEKDAYS_PRIVATE_)==-1){
			WEEKDAYS_PRIVATE_.push(sda_);
			var old_event = cus_TOOLS_data.get_curAndAfter_data(sda_); //获取当前日期及后面的数据
			cus_TOOLS_data.update_dataSource_fun(old_event,sda_);
			refetch_ca_draw();
		}else{
			COM_TOOLS.alert('当前操作日期非休息日，不能执行此操作!');
		}
	},
	/**
	 * @description 删除整天事件
	 * @param {String} sda_ 当前操作天;
	 */
	del_ca_event: function(sda_){
		layer.confirm('确认删除', function(layin_){
			if(!calender_plu_tool.check_cur_day(sda_)){
				return false;
			}
			var del_arr_ = cus_TOOLS_data.get_search_data('eStartday',sda_);
			if(del_arr_.length==0){ 
				layer.msg('错误：无操作数据！',{zIndex:layer.zIndex});
				return false;
			}
			/* 删除课程 */
			cus_TOOLS_data.del_data_byday(sda_);//删除数据
			if($.inArray(sda_,WEEKDAYS_PRIVATE_)==-1){//不是休息日补课
				var old_event = cus_TOOLS_data.get_curAndAfter_data(sda_); //获取当前日期及后面的数据(删除当前数据后的剩余数据)
				if($.inArray(sda_,cus_TOOLS_data.arr_sp_arr)!=-1){
					cus_TOOLS_data.arr_sp_arr = $.grep( cus_TOOLS_data.arr_sp_arr, function(n2,i2){
				  		return n2 != sda_;
					});
				}
				cus_TOOLS_data.update_dataSource_fun(old_event,sda_);		
			}else{//删除私有变量
				WEEKDAYS_PRIVATE_ = $.grep( WEEKDAYS_PRIVATE_, function(n,i){
			  		return n != sda_;
				});
			}
			refetch_ca_draw();
			layer.close(layin_);
		});
	},
	close_cal_win:function(){
		layer.close($('#calendar_win').data('win_ind'));
	},
	save_cal_dataTolocal:function(){
		try{
			if(cus_TOOLS_data.localStorageSupport()){
				var str = {vcode:1,EVENTS_arr_:EVENTS_arr_,WEEKDAYS_PRIVATE_:WEEKDAYS_PRIVATE_,endClass_day:cus_TOOLS_data.endClass_day};
				cus_TOOLS_data.save_toLocal('calender_obj_',str);
			}else{
				layer.msg('浏览器版本低不支持本地存储',{zIndex:layer.zIndex});
			}
		}catch(e){
			layer.msg('本地存储异常，请提交当前数据后，手动从服务器更新数据！',{time:4000,zIndex:layer.zIndex});
		}
	}
}


function edit_ca_event_winf(cEvent){ //修改单个事件弹窗
	var win_ =$('#jsevent_win_edit');
	$('#jsevent_win_name_val').val(cEvent['cId']);
	$('#jsevent_win_tea_val').val(cEvent['eTea']);
	$('#jsevent_win_poi_val').val(cEvent['ePoi']);
	$('#jsevent_win_cty_val').val(cEvent['eType']);
	$('#jsevent_win_desc_val').val(cEvent['eDesc']);
	win_.data('edata',{eId:cEvent['eId'],eTime:cEvent['eTime'],eType:cEvent['eType']});
	/*if(cEvent['eType']==1){
		$('#jsevent_win_name_val').parent().hide();
	}else{
		$('#jsevent_win_name_val').parent().show();
	}*/
	var ind_ = cumCurWinModal('事件',win_,'',{type:1,area:['300px','auto'],end:function(){
		//$('#jsevent_win_name_val').parent().hide();
	}});
	win_.data('win_ind',ind_);
}
function edit_ca_event(){ //修改单个事件
	var cid_ = $('#jsevent_win_name_val option:selected').val(),
		tea_ = $('#jsevent_win_tea_val').val(),
		poi_ = $.trim($('#jsevent_win_poi_val').val()),
		type_ = $('#jsevent_win_cty_val').val(),
		desc_ = $('#jsevent_win_desc_val').val();
	if(!cid_ || cid_=='class00'){ //初始全天自习的情况
		if(type_==1){
			layer.msg('错误： 全天自习暂不支持直接修改为正课，请删除后，重新添加！',{zIndex:layer.zIndex});
			return false;
		}
	}
	if(type_==1 &&(!poi_ || !tea_)){
		layer.msg('错误： 请选择讲师、课时！',{zIndex:layer.zIndex});
		return false;
	}
	var id_ = $('#jsevent_win_edit').data('edata')['eId'];
	if(!id_){
		layer.msg('参数错误！',{zIndex:layer.zIndex});
		return false;
	}
	cus_TOOLS_data.set_data_byid(id_,{
		//cId:cid_, //阶段不可修改
		eTea:(type_==2?'':tea_),
		ePoi:(type_==2?0:poi_),
		eType:type_,
		eDesc:desc_,
		eStatus:0,
		eTeaN:type_==2?'':TEACHER_obj_[tea_],
		//cName:CLASS_obj_[cid_]['cTitle'] //阶段不可修改
	});
	layer.close($('#jsevent_win_edit').data('win_ind'));
	refetch_ca_draw();
}

function calendar_init_fun(){
	var calendar_ = $('#calendar').fullCalendar({
		customButtons: {
	        cusBtnSave: {
	            text: '提交至服务器',
	            click: function() {
	                alert('保存');
	            }
	        },
	        cusBtnUpdate: {
	            text: '从服务器更新覆盖本地',
	            click: function() {
	                alert('更新');
	                localStorage.removeItem('calender_obj_');
	            }
	        }
	    },
		header: {
			left: 'prev,next today cusBtnSave cusBtnUpdate',
			center: 'title',
			right: 'month'
		},
		events:function(start, end, timezone, callback) {
			$.each(EVENTS_arr_, function(i,n) {
				var cobj_ = CLASS_obj_[n['cId']];				
				EVENTS_arr_[i]['title']=((n['eType']==2)?'自习':((TEACHER_obj_[n['eTea']]?TEACHER_obj_[n['eTea']]:n['eTeaN'])+'-'+cobj_['cTitle']))+'-'+(1+$.inArray(n['eStartday'],cobj_['child']));
				EVENTS_arr_[i]['start']=(n['eStartday']+((n['eTime']=='1')?'T09':((n['eTime']=='2')?'T14':'T19')));
				EVENTS_arr_[i]['className']=cobj_['className']+((n['eType']==2 && n['eTime']==3)?' cus-wanzixi-bg':'')+(n['eStatus']==1?' cus-shenhe-bg':''); 
			});
			var start_ = start.format('YYYY-MM-DD'),
				end_ = end.format('YYYY-MM-DD');
			var t_ = cus_TOOLS_data.get_searchHi_data(function(n,i){
				return (start_<=n['eStartday'] && n['eStartday']<=end_)
			});
			callback(t_);
		},
		timeFormat:'a',
		eventRender: function(cEvent, element) {
	        element.tooltip({
	        	title:'讲师：'+(TEACHER_obj_[cEvent['eTea']]?TEACHER_obj_[cEvent['eTea']]:cEvent['eTeaN'])+'<br/>阶段：'+CLASS_obj_[cEvent['cId']]['cTitle']+'<br/>备注：'+cEvent['eDesc'],
	        	html:true,
	        	placement:'right',
	        	container:'body'
	        });
		},
		dayClick: function(date, jsEvent, view) {			
			if(!date.format('YYYY-MM-DD')){
				layer.msg('操作参数错误！请联系管理员！',{zIndex:layer.zIndex}); 
				return false; 
			}
			var sda_ = date.format('YYYY-MM-DD');
			if(sda_ < $.fullCalendar.moment().format('YYYY-MM-DD')){
				// 修改日期小于当前日期
				cus_TOOLS_data.cur_sdate_ ='';
				layer.msg('修改日期不能小于当前日期！',{zIndex:layer.zIndex});
				return false;
			}			
			cus_TOOLS_data.cur_sdate_ = sda_;
			var e_tar_ = $(jsEvent.target);
			if(e_tar_.hasClass('cus-label-xs')){ //删除按钮
				calender_plu_tool.del_ca_event(sda_);
			}else if(e_tar_.hasClass('js-label-xs-creat')){//创建
				var win_ =$('#calendar_win');
				var ind_ = cumCurWinModal('课程',win_,'',{type:1,area:['96%','96%'],end:function(){
					//$('#calendar_win form')[0].reset();
					calender_plu_tool.input_class.find('option:first').prop('selected',true);
					calender_plu_tool.input_classType.find('option:first').prop('selected',true);
					calender_plu_tool.input_tea.find('option:first').prop('selected',true);
					calender_plu_tool.input_daynum.val('');
					calender_plu_tool.input_desc.val('');
				},success:function(){
					/*var win_table_ = $('#cus_form_scanfbox');
					var ajax_str_th=['<th>班级</th>'],
					ajax_str_td=[],
					ajax_start_ = $.fullCalendar.moment(sda_).add(-5, 'days').format('YYYY-MM-DD'),
					ajax_end_ = $.fullCalendar.moment(sda_).add(5, 'days').format('YYYY-MM-DD');
					win_table_.html('<p class="text-center p-lg">加载中。。。</p>');
					$.getJSON('url',{},function(D){
						if(D && D.result==1){
							var DD = D.data;
							var ajax_str_td_s = true;
							for(var Di=0, Dil=DD.length; Di<Dil; Di++){
								var D_ww = DD[Di]['timeTableWeek'],
								Dil2=D_ww.length;
								if(Dil2>0){
									ajax_str_td_s && ajax_str_td.push('<tr><td>',DD[Di]['seriesClassName'],'</td>');
									for(var Di2=0; Di2<Dil2; Di2++){
										ajax_str_th.push('<th>2016-12-07</th>');
										ajax_str_td.push('<td data-itemtid="',D_ww[Di2][''],'">张三<br/>',D_ww[Di2][''],'</td>');
									}
									ajax_str_td.push('</tr>');
									ajax_str_td_s = false;
								}								
							}
							win_table_.html('<table class="table table-bordered table-condensed table-striped"><thead><tr>'
							+ajax_str_th.join('')
							+'</tr></thead><tbody>'
							+ajax_str_td.join('')
							+'</tbody></table>');
						}else{
							win_table_.html('<p class="text-center p-lg">数据加载失败。。。</p>');
						}
					});*/					
				}});
				win_.data('win_ind',ind_);
				
			}else if(e_tar_.hasClass('js-label-xs-addone')){//延长一天
				var old_a = cus_TOOLS_data.get_search_data('eStartday',sda_);
				if(old_a.length>0){//获取当前点击天所在阶段
					var cId_= old_a[0]['cId'];
					if(!cId_){
						layer.msg('错误： 阶段内部参数错误！请联系管理员',{zIndex:layer.zIndex});
						return false;
					}
					var tea_ = old_a[0]['eTea'] || CLASS_obj_[cId_]['tId'];
					calender_plu_tool.add_ca_event(sda_,cId_,tea_,1,1,'',old_a[0]['eTeaN'],'');
				}else{
					layer.msg('获取当前操作阶段参数错误！请联系管理员',{zIndex:layer.zIndex});
				}
			}else if(e_tar_.hasClass('js-label-xs-btnwd')){//改为工作日并前移
				calender_plu_tool.set_to_weekday(sda_);
			}else if(e_tar_.hasClass('js-label-xs-other')){//其它
				//TODO
			}
		},
		eventClick: function(cEvent, jsEvent, view) {
			//$(jsEvent.target).popover({content:'asdasd',container:'body'}).popover('show');
			if(cEvent['eStartday'] < $.fullCalendar.moment().format('YYYY-MM-DD')){
				//修改日期小于当前日期
				cus_TOOLS_data.cur_sdate_ ='';
				layer.msg('修改日期不能小于当前日期！',{zIndex:layer.zIndex});
			}else{
				edit_ca_event_winf(cEvent);
			}			
		},
		eventAfterRender: function(cEvent, element, view){
			/*单事件渲染完成*/			
		},
		eventAfterAllRender: function(view){
			/*所有事件渲染完成*/
			console.log('########ALL:',(new Date()).getTime()-ALL_time_);				
		},
		dayRender:function(date,cell){
			var sday_ = date.format();
			if(cus_TOOLS_data.is_playerDay(sday_)){
				cell.addClass("cus-playerday-bg");
			}
		},
		viewRender:function(view, element){
			/* 按钮组 */
			$('.fc-content-skeleton thead td').append('<i class="js-label-xs-creat fa fa-plus-circle" title="插入阶段"></i><i class="cus-label-xs fa fa-times-circle" title="删除当前天"></i><i class="js-label-xs-addone fa fa-arrow-circle-right" title="当前阶段延长一天"></i><i class="js-label-xs-btnwd fa fa-arrow-circle-down" title="设置为工作日并前移后续课程"></i>');
			/* 周审核按钮 */
			var html_=[];
			$('.fc-day-grid .fc-row').each(function(){
				var this_ = $(this);
				var child_ = this_.find('.fc-bg td');
				html_.push('<button class="js-week-btn-statue btn btn-sm btn-info" data-start="',(child_.first().data('date')),'" data-end="',(child_.last().data('date')),'" style="top:',(this_.position()['top']+20),'px;">周课表发布</button>')
			});
			$('.fc-view').append(html_.join(''));
			/* 结课 */
			if(cus_TOOLS_data['endClass_day']){
				$('.fc-content-skeleton thead td[data-date="'+cus_TOOLS_data['endClass_day']+'"]').append('<span id="endclass_iconobj">结课</span>');
			}	
		}
	});
	return calendar_;
}
/* calendar tool fun end */