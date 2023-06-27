/* tools fun start */
var cus_TOOLS_data = {
    /* 当前日期操作时间 yyyy-MM-dd*/
    cur_sdate_: '',
    /* 特例事件对象 自习等非正课事件 */
    arr_sp_arr: [],
    /* 结课时间 */
    endClass_day: '',
    /*获取当前时间及后面的 数据*/
    get_curAndAfter_data: function(cdata) {
        return $.grep(EVENTS_arr_, function(n, i) {
            return n['eStartday'] >= cdata;
        });
    },
    /*获取当前时间前面的数据*/
    get_brief_data: function(cdata) {
        return $.grep(EVENTS_arr_, function(n, i) {
            return n['eStartday'] >= cdata;
        }, true);
    },
    /*获取指定的数据*/
    get_search_data: function(k, v, t) {
        return $.grep(EVENTS_arr_, function(n, i) {
            return n[k] == v;
        }, (t || false));
    },
    /*获取指定的数据 自定义
     * @param checkfun(n,i){//TODU; return true||false;}
     * */
    get_searchHi_data: function(checkfun, t) {
        return $.grep(EVENTS_arr_, checkfun, (t || false));
    },
    /*新增数据*/
    set_addData_fun: function(obj) {
        EVENTS_arr_.push(obj);
    },
    /*按天删除数据*/
    del_data_byday: function(day) {
        EVENTS_arr_ = cus_TOOLS_data.get_search_data('eStartday', day, true);
    },
    /* 删除匹配检索条件的数据 */
    del_data_bySearch: function(checkfun, t) {
        EVENTS_arr_ = cus_TOOLS_data.get_searchHi_data(checkfun, t);
    },
    /* 建立data obj */
    set_data_obj: function(obj, param) {
        return {
            eId: moment(obj['sday'] + 'T' + obj['eStartTime']).valueOf() + '-' + COM_TOOLS.get_random_fun(6), //模拟事件ID，来源于后台：唯一
            headMaster: CLASS_obj_['headMaster'],
            orgCore: CLASS_obj_['orgCore'],
            actualNumber: CLASS_obj_['actualNumber'],
            cName: CLASS_obj_['cName'],
            ccName: CLASS_obj_['ccName'],
            eStartday: obj['sday'], //课程日期 yyyy-MM-dd
            eTea: obj['eTea'], //讲师ID
            eTeaN: obj['eTeaN'], //讲师姓名
            eTime: obj['eTime'], //时间类型   1：上午； 2：下午； 3：晚上
            eStartTime: obj['eStartTime'], //开始时间
            eEndTime: obj['eEndTime'], //结束时间
            eDesc: obj['eDesc'], //备注
            ePoi: function() { //课时数
                var a = obj['eStartTime'].split(':'),
                    b = obj['eEndTime'].split(':');
                return b[0]-a[0]+(b[1]-a[1])/60;
            }(),
            estate: (param ? 2 : 0)
        }
    },
    /* 更新数据源
     * @param arr nextdata;
     * @param opt nextdata[0].start 开始时间
     * */
    update_dataSource_fun: function(arr, opt) {},
    /* 校验是否是休息日 是：true
     * @param sday_:日期 2016-10-10
     * */
    is_playerDay: function(sday_) {
        return($.inArray(sday_, PLAYDAYS_) != -1 && $.inArray(sday_, WEEKDAYS_) == -1)
    },
    /* 检验时间  ,获取下一个工作日
     * @param sday_待检测的时间
     * @param s_arr（可选）待过滤的数组*/
    get_curWeekDay: function(sday_, cType_) {
        if($.inArray(sday_, PLAYDAYS_) != -1 && $.inArray(sday_, WEEKDAYS_) == -1) {
            /* 休息日 */
            if(cType_ == CL_DEFAULE_CONFIG.cType.d1) {
                sday_ = moment(sday_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
            } else {
                sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
            }
            return arguments.callee(sday_);
        } else {
            return sday_;
        }
    },
    set_data_byid: function(id_, obj) { //根据id修改事件
        $.each(EVENTS_arr_, function(j, m) {
            if(id_ == m['eId']) {
                $.extend(EVENTS_arr_[j], obj);
                return false;
            }
        });
    },
    get_class_curTotal:function(){
        var num_ = 0;
        $.each(EVENTS_arr_, function(j, m) {
            if(m['ePoi']) {
                num_ += m['ePoi'];
            }else{
                COM_TOOLS.alert('元数据，课程时长信息有误！');
                num_ = 0;
                return false;
            }
        });
        return num_;
    },
    check_class_total: function(){
        return this.get_class_curTotal() === CLASS_obj_.cTimeAll;
    },
    /**
     * @param {String} sday_ 开始时间
     * @param {Number} daynum_ 天数
     * @param {Number} cType_ 课程类型
     * @return {Boolean} 是否存在冲突； 存在：true; 不存在：false;
     */
    check_data_byEvent: function(sday_, daynum_, cType_, cArray_){
        var hasLock_ = false;
        for(var i = 0, len = parseInt(daynum_); i < len; i++) {
            sday_ = cus_TOOLS_data.get_curWeekDay(sday_, cType_);
            $.each(cArray_, function(mi, mn) {
                if(cus_TOOLS_data.get_searchHi_data(function(n, i) {
                        return(sday_ == n['eStartday'] && n['eTime'] == mn['eTime'])
                    }).length > 0) {
                    hasLock_ = true;
                }
            });
            if(cType_ == CL_DEFAULE_CONFIG.cType.d1) {
                sday_ = moment(sday_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
            } else {
                sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
            }
        }
        return hasLock_;
    },
    /**
     * 删除指定的课时数
     * @param {Number} num_ 待删除的课时总数
     */
    del_dataSource_fun:function(arr, num_, param){
        if(num_ <= 0){
            if(num_ < 0){
                COM_TOOLS.alert('发生内部错误！');
            }
            return false;
        }
        var lastEvent = EVENTS_arr_[EVENTS_arr_.length-1];
        var a_ = num_ - lastEvent['ePoi'];
        if(a_ >= 0){
            EVENTS_arr_.splice(-1, 1);
            arguments.callee('', a_);
        }else{
            lastEvent['eEndTime'] = moment(lastEvent['eStartday']+'T'+lastEvent['eStartTime']).add(-a_, 'hours').format('HH:mm');
            lastEvent['ePoi'] = -a_;
            lastEvent['estate'] = 2;
        }
    }
}
/* tools fun end */

/*  */
var cus_FN_cj = {
    init_classData_fn: function(obj){
        var tar_= $('#calendar_win_child_box'); this.copyHtml_ = tar_.html();
        $('#add_class_time').click(function(){
            if(tar_.find('.calendar-class-time').length >= 3){COM_TOOLS.alert('最多添加三条记录'); return false;}
            if(tar_.find('.js-sel-day-time:last').val() == '-1' || tar_.find('.js-t-start:last').val() == '' || tar_.find('.js-t-end:last').val() == ''){
                COM_TOOLS.alert('请填写已有记录数据'); return false;
            }
            tar_.append(cus_FN_cj.copyHtml_).find('.js-re-class-time:last').show();
            cus_FN_cj.disSelectOpt(tar_);
        });
        this.bindSelect('#calendar_win_child_box');
        tar_.on('click', '.js-re-class-time', function(){
            $(this).closest('.calendar-class-time').remove();
            cus_FN_cj.disSelectOpt(tar_);
        });
    },
    bindSelect: function(obj){
        $(obj).off().on('change', '.js-sel-day-time', function(e){
            var t_ = $(this), p_ = t_.closest('.calendar-class-time');
            if(t_.val() != '-1'){
                cus_FN_cj.initSelectOpt(p_, t_.val());
            }else{
                t_.val(t_.data('last'));
                COM_TOOLS.alert('拒绝修改'); return false;
            }
            t_.data('last', t_.val());
            cus_FN_cj.disSelectOpt(obj);
        });
    },
    initSelectOpt: function(obj, dt){
        var s, e, arr=[];
        dt== 1 ? (s=8, e=12) : dt== 2 ? (s=12, e=18) : (s=18, e=22);
        for(var i=s; i<e; i++){
            arr.push('<option value='+(i<10 ? '0'+i : i)+':00>'+(i<10 ? '0'+i : i)+':00</option>');
            if(i+1<=e) arr.push('<option value='+(i<10 ? '0'+i : i)+':30>'+(i<10 ? '0'+i : i)+':30</option>');
        }
        $(obj).find('.js-t-start').html(arr.join('')).off().on('change', function(){
            var s2= Number($(this).val().split(':')[0]), arr2=[], eTime_ = 0;
            for(var i2=s2; i2<=e; i2++){
                arr2.push('<option value='+(i2<10 ? '0'+i2 : i2)+':00>'+(i2<10 ? '0'+i2 : i2)+':00</option>');
                if(i2+1<=e) arr2.push('<option value='+(i2<10 ? '0'+i2 : i2)+':30>'+(i2<10 ? '0'+i2 : i2)+':30</option>');
            }
            if(Number($(this).val().split(':')[1])){arr2.shift();arr2.shift()}else{arr2.shift();}
            arr2.splice(0, 0, '<option value="">-请选择-</option>');
            $(obj).find('.js-t-end').html(arr2.join(''));
        });
        
        arr.shift();arr.push('<option value='+e+':00>'+e+':00</option>');
        arr.splice(0, 0, '<option value="">-请选择-</option>');
        $(obj).find('.js-t-end').html(arr.join(''));
        
        this.defaultStart('', dt) && $(obj).find('.js-t-start').val(this.defaultStart('', dt)).trigger('change');
    },
    defaultStart: function(obj, val_){
        var t_ = $.grep(CLASS_obj_.child, function(n, i) {
        	return n['eTime'] == val_;
        });
        return (t_[0] && t_[0]['eStartTime']) || '';
    },
    disSelectOpt: function(obj_){
        var e_ = $(obj_).find('.js-sel-day-time>option');
        e_.show();
        e_.filter(':selected').each(function(i, n){
            if(n.value != -1){
                e_.each(function(i1, n1){
                    if(n1.value == n.value) $(n1).hide();
                });
            }
        });
    },
    reInitSelectOpt: function(obj){
        $(obj).html(this.copyHtml_);
    },
    toObjArr: function(obj){
        var arr = [];
        $.each($(obj).find('.calendar-class-time'), function(i, n){
            var o ={}, tar =$(n);
            o['eTime']=tar.find('.js-sel-day-time').val();
            o['eStartTime']=tar.find('.js-t-start').val();
            o['eEndTime']=tar.find('.js-t-end').val();
            arr.push(o);
        });
        return arr;
    },
    sumTotaltime: function(obj, type){
        var arr=[], num=0;
        arr = type ? obj : this.toObjArr(obj);
        for(var i=0, len=arr.length; i<len; i++){
            num += function(obj){
                var a = obj['eStartTime'].split(':'),
                b = obj['eEndTime'].split(':');
                return Number(b[0])-a[0]+(b[1]-a[1])/60;
            }(arr[i]);
        }
        return num;
    },
    comModDayTime: function(sday, type, epoi){
        if(type == 1){  //这是删除
            var eLastDay_ = '';
            this.arrayObjectSortBy(EVENTS_arr_, 'eId', 1); //根据时间(eId)排序
            var lastDay_ = this.special_check_day(); //获取对应类型下的最后时间
            var tarArr = cus_TOOLS_data.get_search_data('eStartday', lastDay_);  //获取目标天所有数据
            var copyArr_ = $.extend(true, [], CLASS_obj_.child); //深拷贝
            //只判断最后一天是否有空位
            for(var i = 0, ilen = tarArr.length; i < ilen; i++){
                for (var j = 0, jlen = copyArr_.length; j < jlen; j++) {
                    if(copyArr_[j]['eTime'] == tarArr[i]['eTime']){
                        copyArr_.splice(j, 1);
                        break;
                    }
                }
            }
            sday >= lastDay_ ? copyArr_ = [] : sday = lastDay_;    //判断删除的是否是最后一天，自动后移
            this.autoAddDayTime(sday, epoi, copyArr_, true);
        }else if(type == 2){ //这是增加
            cus_TOOLS_data.del_dataSource_fun('', epoi, true);
        }
        this.sortNum();
    },
    autoAddDayTime: function(sda_, poi, yArr, param){
        sda_ = yArr.length ? sda_ : this.check_weeks(sda_, CLASS_obj_.cType);
        while(poi>0){
            var tlen_ = yArr.length || CLASS_obj_.child.length,
            xArr_ = yArr.length ? yArr : CLASS_obj_.child;
            for(var i = 0; i < tlen_; i++){
                if(poi > 0 && poi < xArr_[i]['ePoi']){  //不足以创建完整的一条时
                  xArr_[i]['eEndTime'] = moment(sda_ + 'T' + xArr_[i]['eStartTime']).add(poi,'hours').format('HH:mm');
                }
                
                if(poi <= 0) break;
                poi = poi - xArr_[i]['ePoi'];
                calender_plu_tool.add_ca_event(sda_, CLASS_obj_['teaId'], CLASS_obj_['teaName'], 1, CLASS_obj_.cType, '', [xArr_[i]], param);
            }
            yArr=[];
            sda_ = this.check_weeks(sda_, CLASS_obj_.cType);
        }
    },
    arrayObjectSortBy: function(array_, attr_, sortby_) {
        sortby_ = sortby_ || 1;
        array_.sort(function(a, b){
            a = a[attr_];
            b = b[attr_];
            if(a < b) {
                return sortby_ * -1;
            }
            if(a > b) {
                return sortby_ * 1;
            }
            return 0;
        });
    },
    check_weeks: function(sday_, cType_){
        if(cType_ == CL_DEFAULE_CONFIG.cType.d1) {
            sday_ = moment(sday_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
        } else {
            sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
        }
        return sday_;
    },
    checkTime: function(str){   //发生冲突时提示信息用
        var callback = '';
        str == 1 ? callback = '上午' : (str == 2 ? callback = '下午' : (str == 3 ? callback = '晚上' : ''));
        return callback;
    },
    judgmentConflict: function(key_arr){ //给冲突的数据添加标识
        for(var i = 0, len = key_arr.length; i < len; i++){
            var tobj = cus_TOOLS_data.get_search_data('eId', key_arr[i])[0];
            tobj.estate = 1;
        }
        refetch_ca_draw();
    },
    special_check_day: function(){  //按类型返回正确的末尾日期
        if(CLASS_obj_.cType == 1){
            var i = 1, lArr = EVENTS_arr_[EVENTS_arr_.length - i],
            baseDay_ = moment(CLASS_obj_['cStartDay']).day() || 7,  //判断星期
            tarDay_ = moment(lArr['eStartday']).day() || 7;
            while(baseDay_ != tarDay_){ //倒着取，获取星期相同的
                lArr = EVENTS_arr_[EVENTS_arr_.length - i++];
                tarDay_ = moment(lArr['eStartday']).day() || 7;
            }
        }else if(CLASS_obj_.cType == 2){
            lArr = EVENTS_arr_[EVENTS_arr_.length - 1];
        }
        return lArr['eStartday'];
    },
    sortNum: function(){
        this.arrayObjectSortBy(EVENTS_arr_, 'eId', 1);
        for (var i = 0, ilen = EVENTS_arr_.length; i < ilen; i++) {
        	EVENTS_arr_[i]['eNum'] = (i+1);
        }
    },
    deleteState: function(key){ //删除状态字段
        $.each(EVENTS_arr_, function(i, n) {
        	delete n[key];
        });
    }
}


/* calendar tool fun start */
var calendar = null;

function refetch_ca_draw() { //重新获取数据并刷新视图
    calendar.fullCalendar('refetchEvents');
    //calender_plu_tool.save_cal_dataTolocal();
}

function creat_ca_event_fun(evt_) { /*创建整天课程*/
    var sda_ = cus_TOOLS_data.cur_sdate_;
    if(!calender_plu_tool.check_cur_day(sda_)) {
        return false;
    }
    var tea_ = calender_plu_tool.input_tea.val(),
        teaN_ = calender_plu_tool.input_teaN.val(),
        daynum_ = calender_plu_tool.input_daynum.val(),
        desc_ = calender_plu_tool.input_desc.val() || '';
    //var checked_input = calender_plu_tool.input_cChild.filter(':checked');
    var endT_ = $('.js-t-end:visible:last').val();
    var dayT_ = $('.js-sel-day-time:visible').last().val(); 
    var child_arr = [];
    var ids_ = [];
    
    if(!tea_ || !teaN_ || !daynum_ || dayT_ == -1 || !endT_){
        COM_TOOLS.alert('请完整填写数据');
        return false;
    }
    child_arr = cus_FN_cj.toObjArr('#calendar_win_child_box');
    if(cus_TOOLS_data.check_data_byEvent(sda_, daynum_, 2, child_arr)) { //强制短期班
        COM_TOOLS.alert('当前操作日期含有相同课程信息，添加失败！');
        return false;
    }
    if(daynum_<= 0 || parseInt(daynum_, 10) != daynum_){
        COM_TOOLS.alert('天数输入有误');
        return false;
    }
    var curAddTotal = cus_FN_cj.sumTotaltime('#calendar_win_child_box') * daynum_;
    //if(curAddTotal > cus_FN_cj.sumTotaltime(EVENTS_arr_, 1)){COM_TOOLS.alert('错误！创建课时大于总课时数'); return false;}
    //TODO
    var ajaxD_ = [], eT_ = $('.js-sel-day-time:visible');
    for(var i = 0, ilen = eT_.length; i < ilen; i++){
        ajaxD_.push({
            cId: CLASS_obj_.cId,
            teaId: tea_, 
            timeBeginStr: sda_, 
            timeEndStr: moment(sda_).add((daynum_ - 1), 'days').format('YYYY-MM-DD'), 
            eTime: eT_.eq(i).val()
        });
    }
    checkTeachAjax(evt_, {queryInfo: JSON.stringify(ajaxD_)}, function(){
        cus_TOOLS_data.del_dataSource_fun('', curAddTotal); //删除课时
        calender_plu_tool.add_ca_event(sda_, tea_, teaN_, daynum_, 2, desc_, child_arr, true); //强制短期班
        cus_FN_cj.sortNum(); //课次排序
        calender_plu_tool.close_cal_win();
        refetch_ca_draw();
    });
}

var calender_plu_tool = {
    input_tea: $('#calendar_win_tea_val_hide'),
    input_teaN: $('#calendar_win_tea_val'),
    input_daynum: $('#calendar_win_day_val'),
    input_cChild: '', //多选框
    input_desc: $('#calendar_win_desc_val'),
    check_cur_day: function(sda_) {
        if(!sda_) {
            COM_TOOLS.alert('错误：没有获取当前操作的日期！');
            return false;
        } else {
            return true;
        }
    },
    /**
     * 添加事件
     * @param {String} sda_ 开始日期 yyyy-MM-dd
     * @param {String} tea_ 讲师ID
     * @param {String} teaN_ 讲师名称
     * @param {Number} daynum_ 天数
     * @param {String} cType_ 课程类型
     * @param {String} desc_  备注
     * @param {Array} classChild_ 课程详情
     * @return {String} 下一个课程日期
     */
    add_ca_event: function(sda_, tea_, teaN_, daynum_, cType_, desc_, classChild_, param) {
        var desc_ = desc_ || '',
            daynum_ = daynum_ || 0,
            classChild_ = classChild_ || [];
        if(!calender_plu_tool.check_cur_day(sda_)) {
            return false;
        }
        if(!daynum_ || !tea_ || !teaN_ || classChild_.length == 0) {
            COM_TOOLS.alert('参数错误！');
            return false;
        }
        var sday_ = sda_;
        //var check_num_ = 0;
        //var cur_last_day_ = EVENTS_arr_.length > 0 ? EVENTS_arr_[EVENTS_arr_.length - 1]['eStartday'] : null;
        for(var i = 0, len = parseInt(daynum_); i < len; i++) {
            sday_ = cus_TOOLS_data.get_curWeekDay(sday_, cType_);
            //var day_data_ = cus_TOOLS_data.get_search_data('eStartday', sday_, false);
            //if(day_data_.length == 0) {
                for(var j = 0, jlen = classChild_.length; j < jlen; j++) {
                    EVENTS_arr_.push(cus_TOOLS_data.set_data_obj({
                        sday: sday_, //日期
                        eTea: tea_, //讲师ID
                        eTeaN: teaN_, //讲师名字
                        eTime: classChild_[j]['eTime'], //时间 1：上午； 2：下午； 3：晚上
                        eStartTime: classChild_[j]['eStartTime'], // 开始时间
                        eEndTime: classChild_[j]['eEndTime'], //结束时间
                        eDesc: desc_ //备注
                    }, param));
                }
            /*} else {
                check_num_++;
            }*/
            if(cType_ == CL_DEFAULE_CONFIG.cType.d1) {
                sday_ = moment(sday_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
            } else {
                sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
            }
        }
        /*if(check_num_ > 0) {
            if(cType_ == CL_DEFAULE_CONFIG.cType.d1) {
                cur_last_day_ = moment(cur_last_day_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
            } else {
                cur_last_day_ = moment(cur_last_day_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
            }
            calender_plu_tool.add_ca_event(cur_last_day_, tea_, teaN_, check_num_, cType_, desc_, classChild_, function(num_) {
                var t_ = num_ - EVENTS_arr_.length + CLASS_obj_.cClassNum();
                cus_TOOLS_data.del_dataSource_fun(num_);
            });
        }*/
    },
    /**
     * @description 将休息日设置为工作日，并重拍（前移）后面的课程
     * @param {String} sda_ 当前操作天;
     */
    set_to_weekday: function(sda_) {},
    /**
     * @description 删除整天事件
     * @param {String} sda_ 当前操作天;
     */
    del_ca_event: function(sda_) {
        COM_TOOLS.confirm('确认删除', function(layin_) {
            if(!calender_plu_tool.check_cur_day(sda_)) {
                return false;
            }
            var del_arr_ = cus_TOOLS_data.get_search_data('eStartday', sda_);
            if(del_arr_.length == 0) {
                COM_TOOLS.alert('错误：无操作数据！');
                return false;
            }
            /* 删除课程 */
            cus_TOOLS_data.del_data_byday(sda_); //删除数据
            cus_FN_cj.comModDayTime(sda_, 1, cus_FN_cj.sumTotaltime(del_arr_, 1));

            refetch_ca_draw();
            layer.close(layin_);
        });
    },
    close_cal_win: function() {
        layer.close($('#calendar_win').data('win_ind'));
    },
    save_cal_dataTolocal: function() {
        try {
            if(COM_TOOLS.localStorageSupport()) {
                var str = {
                    vcode: 1,
                    EVENTS_arr_: EVENTS_arr_,
                    WEEKDAYS_PRIVATE_: WEEKDAYS_PRIVATE_,
                    endClass_day: cus_TOOLS_data.endClass_day
                };
                COM_TOOLS.save_toLocal('calender_obj_', str);
            } else {
                COM_TOOLS.alert('浏览器版本低不支持本地存储');
            }
        } catch(e) {
            COM_TOOLS.alert('本地存储异常，请提交当前数据后，手动从服务器更新数据！', {
                time: 4000
            });
        }
    }
}

function edit_ca_event_winf(cEvent) { //修改单个事件弹窗
    var win_ = $('#jsevent_win_edit');
    $('#jsevent_win_tea_val').val(cEvent['eTeaN'] || '');
    $('#jsevent_win_tea_val_hide').val(cEvent['eTea'] || '');
    $('#jsevent_win_desc_val').val(cEvent['eDesc'] || '');
    $('#jsevent_win_date_val').val(cEvent['eStartday'] || '');
    win_.data('edata', {
        eId: cEvent['eId'],
        eTime: cEvent['eTime'],
        eType: cEvent['eType'],
        eStartday: cEvent['eStartday'],
        eTea: cEvent['eTea'],
        eStartTime: cEvent['eStartTime'],
        eEndTime: cEvent['eEndTime']
    });
    var ind_ = cumCurWinModal('课程', win_, '', {
        type: 1,
        area: ['375px', 'auto'],
        success: function() {
            $('#jsevent_win_date_box').datetimepicker({
                startDate: (moment(new Date()).format('YYYY-MM-DD') > CLASS_obj_['cStartDay'] ? '+0d' : CLASS_obj_['cStartDay']),
                zIndex: 99999999
            });
            cus_FN_cj.bindSelect('#event_dat_time');
            $('#event_dat_time').find('.js-sel-day-time').val(cEvent['eTime']).trigger('change')
            .end().find('.js-t-start').val(cEvent['eStartTime']).trigger('change').end().find('.js-t-end').val(cEvent['eEndTime']);
        },
        end: function() {
            $('#jsevent_win_date_box').datetimepicker('remove');
            $('#event_dat_time').html(cus_FN_cj.copyHtml_);
        }
    });
    win_.data('win_ind', ind_);
}

function edit_ca_event(evt_) { //修改单个事件
    var tea_ = $('#jsevent_win_tea_val_hide').val(),
        teaN_ = $.trim($('#jsevent_win_tea_val').val()),
        sday_ = $('#jsevent_win_date_val').val(),
        desc_ = $('#jsevent_win_desc_val').val();
    var id_ = $('#jsevent_win_edit').data('edata')['eId'];
    var eTime_ = $('#jsevent_win_edit').find('.js-sel-day-time').val();
    var eT_ = $('#jsevent_win_edit').find('.js-t-end').val();
    var old_eStartday_ = $('#jsevent_win_edit').data('edata')['eStartday'];
    var old_eTime_ = $('#jsevent_win_edit').data('edata')['eTime'];
    var old_eStartTime_ = $('#jsevent_win_edit').data('edata')['eStartTime'];
    var old_eEndTime_ = $('#jsevent_win_edit').data('edata')['eEndTime'];
    var old_eTea_ = $('#jsevent_win_edit').data('edata')['eTea'];
    if(!id_ || !tea_ || !teaN_ || !sday_ || !eTime_ || !eT_) {
        COM_TOOLS.alert('请完整填写数据');
        return false;
    }
    if(((old_eStartday_ != sday_) || (old_eTime_ != eTime_)) && cus_TOOLS_data.get_searchHi_data(function(n, i) {
            return(sday_ == n['eStartday'] && n['eTime'] == eTime_)
        }).length > 0) {
        COM_TOOLS.alert('目标日期已存在相同课程，不可操作！');
        return false;
    }
    //TODO
    var ajaxD_ = [{
        cId: CLASS_obj_.cId,
        teaId: tea_, 
        timeBeginStr: sday_, 
        timeEndStr: sday_, 
        eTime: eTime_
    }];
    checkTeachAjax(evt_, {queryInfo: JSON.stringify(ajaxD_)}, function(){
        var tArr = $.extend(true, [], cus_TOOLS_data.get_search_data('eId', id_));  //深拷贝，引用类型
        var nTime = cus_FN_cj.toObjArr('#event_dat_time');
        var nEpoi = cus_FN_cj.sumTotaltime('#event_dat_time');
        
        cus_TOOLS_data.set_data_byid(id_, { //这修改会因此 tArr
            eId: moment(sday_ + 'T' + nTime[0]['eStartTime']).valueOf() + '-' + COM_TOOLS.get_random_fun(6),
            eStartday: sday_, //日期
            eTea: tea_, //讲师ID
            eTeaN: teaN_, //讲师名字
            eTime: nTime[0]['eTime'], //时间 1：上午； 2：下午； 3：晚上
            eStartTime: nTime[0]['eStartTime'], // 开始时间
            eEndTime: nTime[0]['eEndTime'], //结束时间
            ePoi: nEpoi,
            eDesc: desc_, //备注
            estate: (function(){
                if((old_eStartday_ != sday_) || 
                    (old_eTime_ != nTime[0]['eTime']) || 
                    (old_eStartTime_ != nTime[0]['eStartTime']) || 
                    (old_eEndTime_ != nTime[0]['eEndTime']) || 
                    (old_eTea_ != tea_)
                ){
                    return 2;
                }else{
                    return 0;
                }
            })()
        });
        //(((old_eStartday_ != sday_) || (old_eTime_ != nTime[0]['eTime'])) && 2)
        if(nEpoi > tArr[0]['ePoi']){ //增加时间
            cus_FN_cj.comModDayTime(tArr['eStartday'], 2, (nEpoi - tArr[0]['ePoi']));
        }else if(nEpoi < tArr[0]['ePoi']){ //减少时间
            cus_FN_cj.comModDayTime(tArr['eStartday'], 1, (tArr[0]['ePoi'] - nEpoi));
        }else{
            cus_FN_cj.sortNum();
        }
        
        layer.close($('#jsevent_win_edit').data('win_ind'));
        refetch_ca_draw();
    });
}

/**
 * @description 删除单一事件
 */
function del_ca_event_fun() {
    COM_TOOLS.confirm('确认删除', function(layin_) {
        var id_ = $('#jsevent_win_edit').data('edata')['eId'];
        if(!id_) {
            COM_TOOLS.alert('参数错误！');
            return false;
        }
        var tArr = cus_TOOLS_data.get_search_data('eId', id_);
        /* 删除课程 */
        cus_TOOLS_data.del_data_bySearch(function(n, i) {
            return(id_ == n['eId'])
        }, true); //删除数据
        cus_FN_cj.comModDayTime(tArr[0]['eStartday'], 1, cus_FN_cj.sumTotaltime(tArr, 1));

        refetch_ca_draw();
        layer.close(layin_);
        layer.close($('#jsevent_win_edit').data('win_ind'));
    });
}
function calendar_init_fun() {
    var calendar_ = $('#calendar').fullCalendar({
        customButtons: {
            cusBtnSave: {
                text: '提交至服务器',
                click: function() {
                    saveScheduleInfo();
                }
            }
        },
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'cusBtnSave',
        },
        events: function(start, end, timezone, callback) {
            cus_FN_cj.arrayObjectSortBy(EVENTS_arr_, 'eId', 1); //根据时间(eId)排序
            $.each(EVENTS_arr_, function(i, n) {
                var cobj_ = CLASS_obj_[n['cId']];
                EVENTS_arr_[i]['title'] = n['eStartTime'] + '-' + n['eEndTime'] +'-'+ n['eTeaN'] + '-' + n['eNum'];
                EVENTS_arr_[i]['start'] = (n['eStartday'] + 'T' + n['eStartTime']);
                EVENTS_arr_[i]['end'] = (n['eStartday'] + 'T' + n['eEndTime']);
                EVENTS_arr_[i]['className'] = (n['estate'] == 1 ? CL_DEFAULE_CONFIG.eClass[4] : (n['estate'] == 2 ? CL_DEFAULE_CONFIG.eClass[3] : CL_DEFAULE_CONFIG.eClass[0]));
                EVENTS_arr_[i]['eIndex'] = i;
            });
            var start_ = start.format('YYYY-MM-DD'),
                end_ = end.format('YYYY-MM-DD');
            var t_ = cus_TOOLS_data.get_searchHi_data(function(n, i) {
                return(start_ <= n['eStartday'] && n['eStartday'] <= end_)
            });
            callback(t_);
        },
        timeFormat: ' ',
        eventRender: function(cEvent, element) {
            element.tooltip({
                title: '班级名称：' + cEvent['cName'] + '<br>人数：' + CLASS_obj_['actualNumber'] + '<br>班主任：' + cEvent['headMaster'] + '<br>校区：' + cEvent['orgCore'] + '<br>备注：' + cEvent['eDesc'],
                html: true,
                placement: 'auto right',
                container: 'body'
            });
        },
        dayClick: function(date, jsEvent, view) {
            if(!date.format('YYYY-MM-DD')) {
                COM_TOOLS.alert('操作参数错误！请联系管理员！');
                return false;
            }
            var sda_ = date.format('YYYY-MM-DD');
            if(sda_ < moment().format('YYYY-MM-DD')) {
                // 修改日期小于当前日期
                cus_TOOLS_data.cur_sdate_ = '';
                COM_TOOLS.alert('修改日期不能小于当前日期！');
                return false;
            }
            cus_TOOLS_data.cur_sdate_ = sda_;
            var e_tar_ = $(jsEvent.target);
            if(e_tar_.hasClass('cus-label-xs')) { //删除按钮
                calender_plu_tool.del_ca_event(sda_);
            } else if(e_tar_.hasClass('js-label-xs-creat')) { //创建全天
                var win_ = $('#calendar_win');
                var ind_ = cumCurWinModal('课程', win_, '', {
                    type: 1,
                    area: ['400px', 'auto'],
                    end: function() {
                        calender_plu_tool.input_tea.val('');
                        calender_plu_tool.input_teaN.val('');
                        //calender_plu_tool.input_cChild.prop('checked', false);
                        calender_plu_tool.input_daynum.val('');
                        calender_plu_tool.input_desc.val('');
                        cus_FN_cj.reInitSelectOpt('#calendar_win_child_box');
                    },
                    success: function() {

                    }
                });
                win_.data('win_ind', ind_);
            } else if(e_tar_.hasClass('js-label-xs-addone')) { //延期
                COM_TOOLS.alert('暂未开放！');
            } else if(e_tar_.hasClass('js-label-xs-btnwd')) { //改为工作日并前移

            } else if(e_tar_.hasClass('js-label-xs-other')) { //其它
                //TODO
            }
        },
        eventClick: function(cEvent, jsEvent, view) {
            //$(jsEvent.target).popover({content:'asdasd',container:'body'}).popover('show');
            if(cEvent['eStartday'] < moment().format('YYYY-MM-DD')) {
                //修改日期小于当前日期
                cus_TOOLS_data.cur_sdate_ = '';
                COM_TOOLS.alert('修改日期不能小于当前日期！');
            } else {
                edit_ca_event_winf(cEvent);
            }
        },
        eventAfterRender: function(cEvent, element, view) {
            /*单事件渲染完成*/
        },
        eventAfterAllRender: function(view) {
            /*所有事件渲染完成*/
        },
        dayRender: function(date, cell) {
            var sday_ = date.format();
            if(cus_TOOLS_data.is_playerDay(sday_)) {
                cell.addClass("cus-playerday-bg");
            }
        },
        viewRender: function(view, element) {
            /* 按钮组 */
            //<i class="js-label-xs-addone fa fa-arrow-circle-right" title="延期"></i>
            $('.fc-content-skeleton thead td').append('<i class="js-label-xs-creat fa fa-plus-circle" title="插入阶段"></i><i class="cus-label-xs fa fa-times-circle" title="删除当前天"></i>');
            /* 结课 */
            if(cus_TOOLS_data['endClass_day']) {
                $('.fc-content-skeleton thead td[data-date="' + cus_TOOLS_data['endClass_day'] + '"]').append('<span id="endclass_iconobj">结课</span>');
            }
            //颜色提示信息
            var html_ = '<div class="cus-info">'+
                '<span class="cus-info-color cus-ca-class3"></span><span class="cus-wz">默认</span>'+
                '<span class="cus-info-color cus-ca-class2"></span><span class="cus-wz">已修改未提交</span>'+
                '<span class="cus-info-color cus-ca-class4"></span><span class="cus-wz">讲师时间冲突</span>'+
                '</div>';
            $('.fc-toolbar .fc-left').append(html_);    
        }
    });
    return calendar_;
}
/* calendar tool fun end */
