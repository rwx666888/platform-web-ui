/**
 * 20180709-cj
 * 添加晚上时段
 * 20180730-cj
 * 放开添加时段与间隔 6-24
 */
/* tools fun start */
var cus_TOOLS_data = {
  /* 当前日期操作时间 yyyy-MM-dd*/
  cur_sdate_: '',
  /* 特例事件对象 自习等非正课事件 */
  arr_sp_arr: [],
  /* 结课时间 */
  endClass_day: '',
  /*获取当前时间及后面的 数据*/
  get_curAndAfter_data: function (cdata) {
    return $.grep(EVENTS_arr_, function (n, i) {
      return n['eStartday'] >= cdata;
    });
  },
  /*获取当前时间前面的数据*/
  get_brief_data: function (cdata) {
    return $.grep(
      EVENTS_arr_,
      function (n, i) {
        return n['eStartday'] >= cdata;
      },
      true
    );
  },
  /*获取指定的数据*/
  get_search_data: function (k, v, t) {
    return $.grep(
      EVENTS_arr_,
      function (n, i) {
        return n[k] == v;
      },
      t || false
    );
  },
  /*获取指定的数据 自定义
   * @param checkfun(n,i){//TODU; return true||false;}
   * */
  get_searchHi_data: function (checkfun, t) {
    return $.grep(EVENTS_arr_, checkfun, t || false);
  },
  /*新增数据*/
  set_addData_fun: function (obj) {
    EVENTS_arr_.push(obj);
  },
  /*按天删除数据*/
  del_data_byday: function (day) {
    EVENTS_arr_ = cus_TOOLS_data.get_search_data('eStartday', day, true);
  },
  /* 删除匹配检索条件的数据 */
  del_data_bySearch: function (checkfun, t) {
    EVENTS_arr_ = cus_TOOLS_data.get_searchHi_data(checkfun, t);
  },
  /* 建立data obj */
  // *eRest: 0, // new 休息时间，没有为 0
  // *eClassTime: 45 // new 上课时长
  set_data_obj: function (obj, param) {
    return {
      eId:
        moment(obj['sday'] + 'T' + obj['eStartTime']).valueOf() + '-' + COM_TOOLS.get_random_fun(6), //模拟事件ID，来源于后台：唯一
      headMaster: CLASS_obj_['headMaster'],
      orgCore: CLASS_obj_['orgCore'],
      actualNumber: CLASS_obj_['actualNumber'],
      cName: CLASS_obj_['cName'],
      ccName: CLASS_obj_['ccName'],
      eStartday: obj['sday'], //课程日期 yyyy-MM-dd
      eTea: obj['eTea'], //讲师ID
      eTeaN: obj['eTeaN'], //讲师姓名
      classroom: obj['classroom'], //教室
      classroomId: obj['classroomId'], //教室id
      eClassroom: obj['eClassroom'], //电子教室
      eClassroomId: obj['eClassroomId'], //电子教室id
      knowledgeIdArr: obj['knowledgeIdArr'], //知识点
      eTime: obj['eTime'], //时间类型   1：上午； 2：下午； 3：晚上
      eStartTime: obj['eStartTime'], //开始时间
      eEndTime: obj['eEndTime'], //结束时间
      eDesc: obj['eDesc'], //备注
      // ePoi: function () { // todo 不用计算的，课时数
      //     var a = obj['eStartTime'].split(':'),
      //         b = obj['eEndTime'].split(':');
      //     return b[0] - a[0] + (b[1] - a[1]) / 60;
      // }(),
      eRest: obj['eRest'],
      eClassTime: obj['eClassTime'],
      ePoi: obj['ePoi'],
      estate: param ? 2 : 0
    };
  },
  /* 更新数据源
   * @param arr nextdata;
   * @param opt nextdata[0].start 开始时间
   * */
  update_dataSource_fun: function (arr, opt) {},
  /* 校验是否是休息日 是：true
   * @param sday_:日期 2016-10-10
   * */
  is_playerDay: function (sday_) {
    return $.inArray(sday_, PLAYDAYS_) != -1 && $.inArray(sday_, WEEKDAYS_) == -1;
  },
  /* 检验时间  ,获取下一个工作日
   * @param sday_待检测的时间
   * @param s_arr（可选）待过滤的数组*/
  get_curWeekDay: function (sday_, cType_) {
    if ($.inArray(sday_, PLAYDAYS_) != -1 && $.inArray(sday_, WEEKDAYS_) == -1) {
      /* 休息日 */
      if (cType_ == CL_DEFAULE_CONFIG.cType.d1) {
        sday_ = moment(sday_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
      } else {
        sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
      }
      return arguments.callee(sday_);
    } else {
      return sday_;
    }
  },
  // 根据id修改事件
  set_data_byid: function (id_, obj) {
    $.each(EVENTS_arr_, function (j, m) {
      if (id_ == m['eId']) {
        $.extend(EVENTS_arr_[j], obj);
        return false;
      }
    });
  },
  get_class_curTotal: function () {
    var num_ = 0;
    $.each(EVENTS_arr_, function (j, m) {
      if (m['ePoi']) {
        num_ += Number(m['ePoi']);
      } else {
        COM_TOOLS.alert('元数据，课程时长信息有误！');
        num_ = 0;
        return false;
      }
    });
    return num_;
  },
  check_class_total: function () {
    return this.get_class_curTotal() === CLASS_obj_.cTimeAll;
  },
  /**
   * @param {String} sday_ 开始时间
   * @param {Number} daynum_ 天数
   * @param {Number} cType_ 课程类型
   * @return {Boolean} 是否存在冲突； 存在：true; 不存在：false;
   */
  check_data_byEvent: function (sday_, daynum_, cType_, cArray_) {
    var hasLock_ = false;
    for (var i = 0, len = parseInt(daynum_); i < len; i++) {
      sday_ = cus_TOOLS_data.get_curWeekDay(sday_, cType_);
      $.each(cArray_, function (mi, mn) {
        if (
          cus_TOOLS_data.get_searchHi_data(function (n, i) {
            return sday_ == n['eStartday'] && n['eTime'] == mn['eTime'];
          }).length > 0
        ) {
          hasLock_ = true;
        }
      });
      if (cType_ == CL_DEFAULE_CONFIG.cType.d1) {
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
  del_dataSource_fun: function (arr, num_, param) {
    if (num_ <= 0) {
      if (num_ < 0) {
        COM_TOOLS.alert('发生内部错误！');
      }
      return false;
    }

    var lastEvent = EVENTS_arr_[EVENTS_arr_.length - 1];
    var a_ = num_ - lastEvent['ePoi'];

    if (a_ >= 0) {
      EVENTS_arr_.splice(-1, 1);
      arguments.callee('', a_);
    } else {
      // todo lastEvent['eEndTime'] 修改
      // var minute = cus_FN_cj.sumEndTime(lastEvent['eStartTime'], -a_, lastEvent['eClassTimes'], lastEvent['eRest']);
      // lastEvent['eEndTime'] = moment(lastEvent['eStartday'] + 'T' + lastEvent['eStartTime']).add(-a_, 'm').format('HH:mm');
      lastEvent['eEndTime'] = cus_FN_cj.sumEndTime(
        lastEvent['eStartTime'],
        -a_,
        lastEvent['eClassTime'],
        lastEvent['eRest']
      );
      lastEvent['ePoi'] = -a_;
      lastEvent['estate'] = 2;
    }
  }
};
/* tools fun end */

var calender_plu_tool = {
  input_tea: $('#calendar_win_tea_val_hide'),
  input_teaN: $('#calendar_win_tea_val'),
  input_classroomId: $('#calendar_win_room_itemid'),
  input_classroom: $('#calendar_win_room_name'),
  input_daynum: $('#calendar_win_day_val'),
  input_cChild: '', //多选框
  input_desc: $('#calendar_win_desc_val'),
  check_cur_day: function (sda_) {
    if (!sda_) {
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
   * @param {String} classroom_ 讲师名称
   * @param {String} classroomId_ 讲师名称
   * @param {String} eClassroom 电子教室
   * @param {String} eClassroomId 电子教室ID
   * @param {Array} knowledgeIdArr 知识点 array
   * @param {Number} daynum_ 天数
   * @param {String} cType_ 课程类型
   * @param {String} desc_  备注
   * @param {Array} classChild_ 课程详情
   * @return {String} 下一个课程日期
   */
  add_ca_event: function (
    sda_,
    tea_,
    teaN_,
    classroom_,
    classroomId_,
    eClassroom,
    eClassroomId,
    knowledgeIdArr,
    daynum_,
    cType_,
    desc_,
    classChild_,
    param
  ) {
    var desc_ = desc_ || '',
      daynum_ = daynum_ || 0,
      classChild_ = classChild_ || [];

    if (!calender_plu_tool.check_cur_day(sda_)) {
      // 判断时候有 sda_
      return false;
    }

    if (!daynum_ || !tea_ || !teaN_ || classChild_.length == 0) {
      COM_TOOLS.alert('参数错误！');
      return false;
    }

    var sday_ = sda_;

    for (var i = 0, len = parseInt(daynum_); i < len; i++) {
      sday_ = cus_TOOLS_data.get_curWeekDay(sday_, cType_); // 判断是否在休息日列表里

      for (var j = 0, jlen = classChild_.length; j < jlen; j++) {
        // 插入完整的数据
        EVENTS_arr_.push(
          cus_TOOLS_data.set_data_obj(
            {
              sday: sday_, //日期
              eTea: tea_, //讲师ID
              eTeaN: teaN_, //讲师名字
              classroom: classroom_, //教室
              classroomId: classroomId_, //教室
              eClassroom: eClassroom, //电子教室
              eClassroomId: eClassroomId, //电子教室 id
              knowledgeIdArr: knowledgeIdArr, //知识点
              eTime: classChild_[j]['eTime'], //时间 1：上午； 2：下午； 3：晚上
              eStartTime: classChild_[j]['eStartTime'], // 开始时间
              eEndTime: classChild_[j]['eEndTime'], //结束时间
              eDesc: desc_, //备注
              ePoi: classChild_[j]['ePoi'], // new ePoi
              eRest: classChild_[j]['eRest'],
              eClassTime: classChild_[j]['eClassTime']
            },
            param
          )
        );
      }

      if (cType_ == CL_DEFAULE_CONFIG.cType.d1) {
        // 常规班
        sday_ = moment(sday_).add(1, 'weeks').format('YYYY-MM-DD'); //速度较慢 1ms
      } else {
        sday_ = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
      }
    }
  },
  /**
   * @description 将休息日设置为工作日，并重拍（前移）后面的课程
   * @param {String} sda_ 当前操作天;
   */
  set_to_weekday: function (sda_) {},
  /**
   * @description 删除整天事件
   * @param {String} sda_ 当前操作天;
   */
  del_ca_event: function (sda_) {
    COM_TOOLS.confirm('确认删除', function (layin_) {
      if (!calender_plu_tool.check_cur_day(sda_)) {
        return false;
      }

      var del_arr_ = cus_TOOLS_data.get_search_data('eStartday', sda_); // 获取删除的数据

      if (sda_ == moment().format('YYYY-MM-DD')) {
        del_arr_ = cus_FN_cj.filterArr(del_arr_, function (item) {
          return item['eStartTime'] >= moment().add(cus_FN_cj.tqDate, 'h').format('HH:mm');
        });
      }

      if (del_arr_.length == 0) {
        COM_TOOLS.alert('无操作数据！');
        return false;
      }
      /* 删除课程 */
      // cus_TOOLS_data.del_data_byday(sda_); //删除数据 (过滤掉那条数据)
      for (var i = 0; i < del_arr_.length; i++) {
        cus_TOOLS_data.del_data_bySearch(function (n, i2) {
          return del_arr_[i]['eId'] == n['eId'];
        }, true);
      }

      // var totalEpoi = cus_FN_cj.sumTotaltime(del_arr_, 1);
      var totalEpoi = cus_FN_cj.sumNewEpoi(del_arr_);
      cus_FN_cj.comModDayTime(sda_, 1, totalEpoi);

      refetch_ca_draw();
      layer.close(layin_);
    });
  },
  close_cal_win: function () {
    layer.closeAll();
  },
  save_cal_dataTolocal: function () {
    try {
      if (COM_TOOLS.localStorageSupport()) {
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
    } catch (e) {
      COM_TOOLS.alert('本地存储异常，请提交当前数据后，手动从服务器更新数据！', {
        time: 4000
      });
    }
  }
};

// *cus_FN_cj
var cus_FN_cj = {
  tqDate: '1', // 单位是小时
  // *全天用的
  // todo delete
  init_classData_fn: function (obj) {
    // *#calendar_win_child_box 全天上课时段
    var tar_ = $('#calendar_win_child_box');
    this.copyHtml_ = tar_.html();

    $('#add_class_time').click(function () {
      // todo 可以去除 js-sel-day-time
      if (
        tar_.find('.js-sel-day-time:last').val() == '-1' ||
        tar_.find('.js-t-start:last').val() == '' ||
        tar_.find('.js-t-end:last').val() == ''
      ) {
        COM_TOOLS.alert('请填写已有记录数据');
        return false;
      }

      tar_.append(cus_FN_cj.copyHtml_).find('.js-re-class-time:last').show(); // 减号
      // tar_.find('.js-sel-day-time:last').val(CLASS_obj_.child[0]['eTime']).trigger('change'); // todo 上下午
    });

    this.bindSelect('#calendar_win_child_box');
    // 删除添加的课时条
    tar_.on('click', '.js-re-class-time', function () {
      $(this).closest('.calendar-class-time').remove();
    });
  },
  // todo delete
  bindSelect: function (obj) {
    var tar_ = $(obj);
    //时段
    tar_.off().on('change', '.js-sel-day-time', function (e) {
      var t_ = $(this);
      var p_ = t_.closest('.calendar-class-time');
      if (t_.val() != '-1') {
        cus_FN_cj.initSelectOpt(p_, t_.val());
      } else {
        t_.val(t_.data('last'));
        COM_TOOLS.alert('拒绝修改');
        return false;
      }
      t_.data('last', t_.val());
    });
  },
  // 创建 option
  // todo delete
  initSelectOpt: function (obj, dt) {
    var s = 6,
      e = 24,
      arr = [];
    // (s = 6, e = 24)

    for (var i = s; i < e; i++) {
      if (i == 24) {
        break;
      }
      arr.push(
        '<option value=' + (i < 10 ? '0' + i : i) + ':00>' + (i < 10 ? '0' + i : i) + ':00</option>'
      );
      if (i + 1 <= e)
        arr.push(
          '<option value=' +
            (i < 10 ? '0' + i : i) +
            ':30>' +
            (i < 10 ? '0' + i : i) +
            ':30</option>'
        );
    }

    $(obj)
      .find('.js-t-start')
      .html(arr.join(''))
      .off()
      .on('change', function () {
        // todo 结束改成自动计算的
        var s2 = Number($(this).val().split(':')[0]),
          arr2 = [],
          eTime_ = 0;
        for (var i2 = s2; i2 <= e; i2++) {
          if (i2 == 24) {
            break;
          }
          arr2.push(
            '<option value=' +
              (i2 < 10 ? '0' + i2 : i2) +
              ':00>' +
              (i2 < 10 ? '0' + i2 : i2) +
              ':00</option>'
          );
          if (i2 + 1 <= e)
            arr2.push(
              '<option value=' +
                (i2 < 10 ? '0' + i2 : i2) +
                ':30>' +
                (i2 < 10 ? '0' + i2 : i2) +
                ':30</option>'
            );
        }
        if (Number($(this).val().split(':')[1])) {
          arr2.shift();
          arr2.shift();
        } else {
          arr2.shift();
        }
        arr2.splice(0, 0, '<option value="">-请选择-</option>');
        $(obj).find('.js-t-end').html(arr2.join(''));
      });

    // todo 结束改成自动计算的
    arr.shift(); // 去除第一个 6:00
    if (e != 24) {
      arr.push('<option value=' + e + ':00>' + e + ':00</option>');
    }
    arr.splice(0, 0, '<option value="">-请选择-</option>');
    $(obj).find('.js-t-end').html(arr.join(''));
  },
  initWinModalData: function (obj, data) {
    var $t_ = $(obj);
    data = data || {};

    $t_.find('#calendar_win_tea_val').val(data.eTeaN);
    $t_.find('#calendar_win_tea_val_hide').val(data.eTea);
    $t_.find('#calendar_win_room_name').val(data.classroom);
    $t_.find('#calendar_win_room_itemid').val(data.classroomId);
    $t_.find('#e_classroom_name').val(data.eClassroom);
    $t_.find('#e_classroom_itemid').val(data.eClassroomId);
    $t_
      .find('.js-class-minute')
      .val(
        (data.eClassTime == null ? CLASS_obj_.child[0].eClassTime : data.eClassTime * 1) ||
          CLASS_obj_.child[0].eClassTime
      );

    // 时间条
    var curSartTime = (data.eStartTime || CLASS_obj_.child[0].eStartTime).split(':');
    $t_.find('.js-st-h').val(curSartTime[0]); // 分钟
    $t_.find('.js-st-m').val(curSartTime[1]); // 秒
    $t_.find('.js-t-end').val(data.eEndTime || CLASS_obj_.child[0].eEndTime);

    // 单次 > 1 休息 > 0
    var tsRest = data.eRest || CLASS_obj_.child[0].eRest;
    if ((data.ePoi || CLASS_obj_.child[0].ePoi) > 1 && parseInt(tsRest)) {
      $t_.find('.js-isrest[value=1]').prop('checked', 'checked');
      $t_.find('.js-total-rest');
    } else {
      $t_.find('.js-isrest[value=0]').prop('checked', 'checked');
      if ((data.ePoi || CLASS_obj_.child[0].ePoi) > 1) {
        $t_.find('.js-total-rest').attr('disabled', 'disabled');
      } else {
        $t_.find('.js-total-rest, .js-isrest').attr('disabled', 'disabled');
      }
    }

    $t_.find('.js-total-rest').val(tsRest);
    // *特殊处理单次课时
    if (data.ePoi) {
      this.tsCreateOpt($t_.find('.js-single-classhour'), data.ePoi);
    }
    $t_.find('.js-single-classhour').val(data.ePoi || CLASS_obj_.child[0].ePoi); // 单次课时

    // 知识点
    $t_
      .find('#knowledgeId')
      .val(data.knowledgeIdArr || [])
      .select2({
        placeholder: '请选择知识点',
        language: 'zh-CN',
        closeOnSelect: false,
        dropdownParent: $t_
      });
  },
  tsCreateOpt: function (obj, val) {
    obj = typeof obj == 'string' ? $(obj) : obj;

    if ($.inArray(String(val), CLASS_obj_.cPoiList) == -1) {
      obj.append('<option id="js-tsopt" value="' + val + '" disabled>' + val + '</option>');
    }
  },
  createOption: function (obj, list) {
    var arr = [];

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      arr.push('<option value="' + item + '">' + item + '</option>');
    }

    $(obj).append(arr.join(''));
  },
  // 创建开始时间下拉项
  createStartTimeOption: function (obj, s, e) {
    var s = s || 6,
      e = e || 24,
      arrH = [],
      arrM = [];
    // hour
    for (var i = s; i < e; i++) {
      var num = i < 10 ? '0' + i : i;
      arrH.push('<option value="' + num + '">' + num + '</option>');
    }
    // minute
    for (var i = 0; i < 60; i += 5) {
      var num = i < 10 ? '0' + i : i;
      arrM.push('<option value="' + num + '">' + num + '</option>');
    }

    $('.js-st-h:last').html(arrH.join(''));
    $('.js-st-m:last').html(arrM.join(''));

    // $(obj).find('.js-t-start').html(arr.join(''));
  },
  getStartTime: function (obj) {
    var $t_ = $(obj) || cus_FN_cj.winTar;
    return $t_.find('.js-st-h:last').val() + ':' + $t_.find('.js-st-m:last').val();
  },
  // 自动计算结束时间
  // *单次课时没有 休息时长
  getEndOption: function (sTime) {
    // var $t_ = $(obj);
    var $t_ = cus_FN_cj.winTar;

    // var singleTimes = $t_.find('.js-single-classhour').val();
    var singleTimes = $t_.find('.js-single-classhour>option:checked').val();
    var classHour = $t_.find('.js-class-minute').val(); // 时长
    var isRest = $t_.find('.js-isrest:checked').val(); // 是否休息
    var restHour = $t_.find('.js-total-rest').val();

    restHour = Number(isRest) ? restHour : 0;
    restHour = singleTimes == 1 ? 0 : restHour; // 课时 = 1

    var that = this;
    cus_FN_cj.timeTar.find('.calendar-class-time').each(function (i, n) {
      sTime = that.getStartTime(this);

      var sumETime = that.sumEndTime(sTime, singleTimes, classHour, restHour);
      $(this).find('.js-t-end:last').val(sumETime);
    });
  },
  // 按 params 和开始时间计算结束时间
  // *公式：singleTimes * classHour + restHour
  sumEndTime: function (sTime, singleTimes, classHour, restHour) {
    var val_ = Number(singleTimes * classHour) + Number(restHour);

    return moment('2019-06-27 ' + sTime)
      .add(val_, 'm')
      .format('HH:mm');
  },
  // 重新初始化开始结束时间的选择
  reInitSelectOpt: function (obj) {
    cus_FN_cj.timeTar.html(this.cloneHtml);
    this.createStartTimeOption();
  },
  getSourceData: function (obj, val_) {
    //根据类型获取原数据里对应的类型
    var t_ = $.grep(CLASS_obj_.child, function (n, i) {
      return n['eTime'] == val_;
    });
    return t_.length ? t_[0] : { ePoi: CLASS_obj_.child[0].ePoi };
  },
  disSelectOpt: function (obj_) {
    var e_ = $(obj_).find('.js-sel-day-time>option');
    e_.show();
    e_.filter(':selected').each(function (i, n) {
      if (n.value != -1) {
        e_.each(function (i1, n1) {
          if (n1.value == n.value) $(n1).hide();
        });
      }
    });
  },
  // * 将所选内容转为单条对象 -> arr
  // todo 这个要加上 ePoi
  toObjArr: function (obj, sda_) {
    var arr = [];
    var $tar = $(obj);

    var classHour = $tar.find('.js-class-minute').val(), // 上课时长
      totalRest = $tar.find('.js-total-rest').val(), // 总休息时长
      // epoi_ = $tar.find('.js-single-classhour').val();
      // knowledgeIdArr = $tar.find('#knowledgeId').val(),
      epoi_ = $tar.find('.js-single-classhour>option:checked').val();

    $.each($tar.find('.calendar-class-time'), function (i, n) {
      var o = {},
        tar = $(n);

      o['eStartday'] = sda_;
      o['eTime'] = CLASS_obj_.child[0].eTime; // todo 已经没用了，默认取值
      o['eStartTime'] = cus_FN_cj.getStartTime(this); // new
      o['start'] = sda_ + 'T' + o['eStartTime'];
      o['eEndTime'] = tar.find('.js-t-end').val();
      o['end'] = sda_ + 'T' + o['eEndTime'];
      // todo
      o['eId'] = moment(o['start']).valueOf() + '-' + COM_TOOLS.get_random_fun(6); //模拟事件
      o['eClassTime'] = classHour; // new
      o['eRest'] = totalRest; // new
      o['ePoi'] = epoi_; // new
      // o['knowledgeIdArr'] = knowledgeIdArr; // knowledgeIdArr

      arr.push(o);
    });
    return arr;
  },
  // todo delete
  // *按开始/结束时间计算对应的 epoi 课时数
  sumTotaltime: function (obj, type) {
    var arr = [],
      num = 0;
    // arr = (type ? obj : this.toObjArr(obj));
    arr = $.type(obj) == 'array' ? obj : this.toObjArr(obj);
    for (var i = 0, len = arr.length; i < len; i++) {
      num += (function (obj) {
        var a = obj['eStartTime'].split(':'),
          b = obj['eEndTime'].split(':');
        return Number(b[0]) - a[0] + (b[1] - a[1]) / 60;
      })(arr[i]);
    }
    return num;
  },
  // 直接通过 ePoi 字段计算
  sumNewEpoi: function (obj, num) {
    var arr = [],
      sum = 0;
    arr = $.type(obj) == 'array' ? obj : this.toObjArr(obj);

    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      sum += Number(item.ePoi);
    }
    return sum * (num || 1);
  },
  /**
   * @param sday
   * @param type 1 在数组中增加，2 在数组中减少
   */
  comModDayTime: function (sday, type, epoi) {
    if (type == 1) {
      //减少时间，要在数组中补时间
      this.arrayObjectSortBy(EVENTS_arr_, 'eId', 1); //根据时间(eId)排序

      var lastDay_ = EVENTS_arr_[EVENTS_arr_.length - 1]['eStartday']; //获取对应类型下的最后时间
      var lastArr = $.extend(true, [], cus_TOOLS_data.get_search_data('eStartday', lastDay_)); //获取最后天的所有数据
      var copyArr_ = [];

      if (!(sday >= lastDay_)) {
        //判断删除的是否是最后一天，自动后移
        sday = lastDay_;
        //只判断最后一天是否有空位
        var nArr = lastArr.concat(CLASS_obj_.child);
        var flag = this.check_time_interval(nArr, lastDay_);

        if (!flag.res) {
          // 有空位
          copyArr_ = CLASS_obj_.child;
        }
      }

      this.autoAddDayTime(sday, epoi, copyArr_, true);
    } else if (type == 2) {
      //增加时间，所以要从原数组中减少
      cus_TOOLS_data.del_dataSource_fun('', epoi, true);
    }
    this.sortNum();
  },
  // todo 按课时追加课程
  autoAddDayTime: function (sda_, poi, yArr, param) {
    // 看最后一天时候有空位 yArr.length > 0 为有
    sda_ = yArr.length ? sda_ : this.check_weeks(sda_, CLASS_obj_.cType);

    while (poi > 0) {
      var tlen_ = yArr.length || CLASS_obj_.child.length, // *这是为了做遍历用
        xArr_ = yArr.length ? yArr : $.extend(true, [], CLASS_obj_.child); // *这是为了修改时，不改变基础数据

      for (var i = 0; i < tlen_; i++) {
        var item = xArr_[i];
        if (poi > 0 && poi < item['ePoi']) {
          // 不足以创建完整的一条时
          // todo 这要按照 SCH 修改
          // item['eEndTime'] = moment(sda_ + 'T' + item['eStartTime']).add(poi, 'hours').format('HH:mm');
          item['ePoi'] = poi;
          if (poi <= 1) {
            item['eRest'] = '0';
          }
          item['eEndTime'] = cus_FN_cj.sumEndTime(
            item['eStartTime'],
            poi,
            item['eClassTime'],
            item['eRest']
          );
        }

        if (poi <= 0) break;
        poi = poi - item['ePoi'];

        calender_plu_tool.add_ca_event(
          sda_,
          CLASS_obj_['teaId'] || '',
          CLASS_obj_['teaName'] || '',
          CLASS_obj_['classroom'] || '',
          CLASS_obj_['classroomId'] || '',
          CLASS_obj_['eClassroom'] || '',
          CLASS_obj_['eClassroomId'] || '',
          CLASS_obj_['knowledgeIdArr'] || [],
          1,
          CLASS_obj_.cType,
          '',
          [item],
          param
        );
      }
      yArr = [];
      sda_ = this.check_weeks(sda_, CLASS_obj_.cType); // 获取下一个符合规则的时间
    }
  },
  arrayObjectSortBy: function (array_, attr_, sortby_) {
    sortby_ = sortby_ || 1;
    array_.sort(function (a, b) {
      a = a[attr_];
      b = b[attr_];
      if (a < b) {
        return sortby_ * -1;
      }
      if (a > b) {
        return sortby_ * 1;
      }
      return 0;
    });
  },
  arrayObjectSortBy2: function (array_, attr_, sortby_) {
    sortby_ = sortby_ || 1;
    array_.sort(function (a, b) {
      var cDay = moment().format('YYYY-MM-DD');
      a = moment(cDay + 'T' + a[attr_]);
      b = moment(cDay + 'T' + b[attr_]);
      if (a < b) {
        return sortby_ * -1;
      }
      if (a > b) {
        return sortby_ * 1;
      }
      return 0;
    });
  },
  check_weeks: function (sday_, cType_) {
    var lastDay = '';

    if (cType_ == CL_DEFAULE_CONFIG.cType.d1) {
      lastDay = this.special_check_day(cType_);
      while (lastDay <= sday_) {
        lastDay = moment(lastDay).add(1, 'weeks').format('YYYY-MM-DD');
      }
    } else {
      lastDay = moment(sday_).add(1, 'days').format('YYYY-MM-DD'); //速度较慢 1ms
    }
    return lastDay;
  },
  checkTime: function (str) {
    //发生冲突时提示信息用
    var callback = '';
    str == 1
      ? (callback = '上午')
      : str == 2
      ? (callback = '下午')
      : str == 3
      ? (callback = '晚上')
      : '';
    return callback;
  },
  judgmentConflict: function (key_arr) {
    //给冲突的数据添加标识
    for (var i = 0, len = key_arr.length; i < len; i++) {
      var tobj = cus_TOOLS_data.get_search_data('eId', key_arr[i])[0];
      tobj.estate = 1;
    }
    refetch_ca_draw();
  },
  special_check_day: function (cType_) {
    //按类型返回正确的末尾日期
    var lArr = {},
      lastDate_ = EVENTS_arr_[EVENTS_arr_.length - 1]['eStartday'];

    if (cType_ == CL_DEFAULE_CONFIG.cType.d1) {
      var baseDay_ = moment(CLASS_obj_['cStartDay']).day() || 7; //基础值
      var tarDay_ = moment(lastDate_).day() || 7; //比较值

      while (baseDay_ != tarDay_) {
        //倒着取，获取星期相同的
        lastDate_ = moment(lastDate_).add(1, 'days').format('YYYY-MM-DD');
        tarDay_ = moment(lastDate_).day() || 7;
      }
    }
    return lastDate_;
  },
  // 添加 eNum 用于表示这是第几节课
  sortNum: function () {
    this.arrayObjectSortBy(EVENTS_arr_, 'eId', 1);
    for (var i = 0, ilen = EVENTS_arr_.length; i < ilen; i++) {
      EVENTS_arr_[i]['eNum'] = i + 1;
    }
  },
  deleteState: function (key) {
    //删除状态字段
    $.each(EVENTS_arr_, function (i, n) {
      delete n[key];
    });
  },
  // 返回某个时段数据
  get_interval_data: function (cdata, tdata) {
    return $.grep(EVENTS_arr_, function (n, i) {
      return n['eStartday'] >= cdata && n['eStartday'] <= tdata;
    });
  },
  // 判断所选时间间是否冲突
  check_time_interval: function (check_date, param) {
    var flag = { res: false };

    this.arrayObjectSortBy2(check_date, 'eStartTime', 1); // * 新的全天 arr 按开始时间排序

    // var curDay = moment().format('YYYY-MM-DD');

    $.each(check_date, function (key, val) {
      var cur_ = val;
      var cur_next = check_date[key + 1]; // 获取下一条记录

      if (
        cur_next &&
        moment(cur_.eStartday + 'T' + cur_.eEndTime).isAfter(
          cur_.eStartday + 'T' + cur_next.eStartTime
        )
      ) {
        flag = { res: true, date: param ? param : cur_next.eStartday };
        return false;
      }
    });
    return flag;
  },
  // todo 判断插入位时间是否冲突
  check_date_interval: function (s_data, curDate, daynum) {
    var flag = { res: false };

    for (var i = 0; i < daynum; i++) {
      var t_date = moment(curDate).add(i, 'd').format('YYYY-MM-DD');
      var t_date_arr = this.get_interval_data(t_date, t_date); // 获取插入位置原有数据

      t_date_arr = $.grep(t_date_arr, function (n, i) {
        var old_eId = n.eId.split('-')[0];
        var new_eId = (s_data[0].old_eId || '').split('-')[0];

        // return n.eId && (n.eId !== s_data[0].old_eId) // todo 这待确定
        return n.eId && new_eId !== old_eId; // todo 过滤掉一样的
      });

      var new_arr = s_data.concat(t_date_arr);

      flag = this.check_time_interval(new_arr, t_date);
      if (flag.res) {
        break;
      }
    }
    return flag;
  },
  // 构造检验讲师冲突的数据
  checkTeacherData: function (s_list, teaId, classroomId, sDate, dayNum) {
    var arr = [];

    for (var i = 0, len = s_list.length; i < len; i++) {
      arr.push({
        cId: CLASS_obj_.cId, // 课表 id
        teaId: teaId,
        classroomId: classroomId,
        timeBeginStr: sDate,
        timeEndStr: moment(sDate)
          .add(dayNum - 1, 'days')
          .format('YYYY-MM-DD'),
        eTime: CLASS_obj_.child[0].eTime,
        eStartTime: s_list[i].eStartTime,
        eEndTime: s_list[i].eEndTime,
        classDateStr: sDate
      });
    }

    return arr;
  },
  // 特殊处理 获取数字：eRest -> 10分钟
  handleRest: function (list, type) {
    var strToNum = function (str) {
      return String(str).match(/[0-9]+/)[0];
    };
    var numToStr = function (num) {
      return num + '分钟';
    };

    for (var i = 0; i < list.length; i++) {
      if (type == 'add') {
        if (typeof list[i] == 'string') {
          list[i] = numToStr(list[i]);
        } else {
          list[i].eRest = numToStr(list[i].eRest);
        }
      } else if (type == 'remove') {
        if (typeof list[i] == 'string') {
          list[i] = strToNum(list[i]);
        } else {
          list[i].eRest = strToNum(list[i].eRest);
        }
      }
    }
  },
  // 比较数据是否变化
  // aData 弹窗内的，bData 原数据
  checkDataEq: function (aData, bData) {
    var res = true;

    for (var key in aData) {
      if (key == 'eId' || key == 'old_eId' || key == 'start') {
        continue;
      }
      if (aData[key] != bData[key]) {
        res = false;
        break;
      }
    }

    return res;
  },
  // 数组对象过滤
  filterArr: function (tArr, checkfun, t) {
    return $.grep(tArr, checkfun, t || false);
  },
  // 设置颜色 class
  setItemClass(state) {
    var className = '';
    switch (state) {
      case 1:
        className = CL_DEFAULE_CONFIG.eClass[4];
        break;
      case 2:
        className = CL_DEFAULE_CONFIG.eClass[3];
        break;
      default:
        className = CL_DEFAULE_CONFIG.eClass[0];
        break;
    }

    return className;
  }
};

/* calendar tool fun start */
var calendar = null;

function refetch_ca_draw() {
  //重新获取数据并刷新视图
  calendar.fullCalendar('refetchEvents');
}
/*创建整天课程*/
function creat_ca_event_fun(evt_) {
  var sda_ = cus_TOOLS_data.cur_sdate_;

  if (!calender_plu_tool.check_cur_day(sda_)) {
    return false;
  }
  // 获取填写的数据
  var tea_ = cus_FN_cj.winTar.find('#calendar_win_tea_val_hide').val(), // code
    teaN_ = cus_FN_cj.winTar.find('#calendar_win_tea_val').val(),
    classroom_ = cus_FN_cj.winTar.find('#calendar_win_room_name').val(),
    classroomId_ = cus_FN_cj.winTar.find('#calendar_win_room_itemid').val(),
    eClassroom = cus_FN_cj.winTar.find('#e_classroom_name').val(),
    eClassroomId = cus_FN_cj.winTar.find('#e_classroom_itemid').val(),
    knowledgeIdArr = cus_FN_cj.winTar.find('#knowledgeId').val(),
    daynum_ = cus_FN_cj.winTar.find('#calendar_win_day_val').val(),
    desc_ = cus_FN_cj.winTar.find('#calendar_win_desc_val').val() || '',
    singleClassHour = cus_FN_cj.winTar.find('.js-single-classhour').val(),
    classHour = cus_FN_cj.winTar.find('.js-class-minute').val(), // 上课时长
    isRest = cus_FN_cj.winTar.find('.js-isrest:checked').val(), // 上课时长
    totalRest = cus_FN_cj.winTar.find('.js-total-rest').val(); // 总休息时长

  // var lastEndTime = cus_FN_cj.winTar.find('.js-t-end:last').val() // 最后一个结束时间

  // var endT_ = $('.js-t-end:visible:last').val();
  // todo 上下午已经失效了
  // var dayT_ = $('.js-sel-day-time:visible').last().val(); // 上下午
  var child_arr = [];

  if (!tea_ || !teaN_ || !classroom_ || !classroomId_) {
    COM_TOOLS.alert('请完整填写数据');
    return false;
  }

  if (singleClassHour == null) {
    COM_TOOLS.alert('请选择单次课课时');
    return false;
  }

  var child_arr = cus_FN_cj.toObjArr(cus_FN_cj.winTar, sda_); // * 新的全天 arr
  var conflict_day_check = cus_FN_cj.check_time_interval(child_arr); // *判断新选择的时间之际是否冲突
  // *所选时间
  if (conflict_day_check.res) {
    COM_TOOLS.alert('所选上课时段冲突！');
    return false;
  }
  // *本天操作 只能添加当前时候后对应小时的课程
  var ckeck_qt = cus_FN_cj.filterArr(child_arr, function (item) {
    return (
      item.eStartday == moment().format('YYYY-MM-DD') &&
      item['eStartTime'] < moment().add(cus_FN_cj.tqDate, 'h').format('HH:mm')
    );
  });
  if (ckeck_qt.length) {
    COM_TOOLS.alert('距上课时间小于' + cus_FN_cj.tqDate + '小时，禁止修改');
    return false;
  }
  // *跨天校验
  var ckeck_kt = cus_FN_cj.filterArr(child_arr, function (item) {
    return item.eStartTime > item.eEndTime;
  });
  if (ckeck_kt.length) {
    COM_TOOLS.alert('上课时间跨天，请填写真实的上课时间');
    return false;
  }

  var conflict_date_check = cus_FN_cj.check_date_interval(child_arr, sda_, daynum_); // 判断插入位是否冲突(多天的)
  // *插入位置
  if (conflict_date_check.res) {
    COM_TOOLS.alert('与&nbsp;' + conflict_date_check.date + '&nbsp;上课时段冲突');
    return false;
  }

  // var curAddTotal = cus_FN_cj.sumTotaltime('#calendar_win_child_box') * daynum_; // *计算添加的总课时
  var curAddTotal = cus_FN_cj.sumNewEpoi(child_arr, daynum_); // *计算添加的总课时

  // return;

  // * 检测对应时间讲师冲突
  var ajaxD_ = cus_FN_cj.checkTeacherData(child_arr, tea_, classroomId_, sda_, daynum_);
  checkTeachAjax(evt_, { queryInfo: JSON.stringify(ajaxD_) }, function () {
    cus_TOOLS_data.del_dataSource_fun('', curAddTotal); //* 删除对应课时数

    calender_plu_tool.add_ca_event(
      sda_,
      tea_,
      teaN_,
      classroom_,
      classroomId_,
      eClassroom,
      eClassroomId,
      knowledgeIdArr,
      daynum_,
      2,
      desc_,
      child_arr,
      true
    ); // 添加事件，强制短期班

    cus_FN_cj.sortNum(); //课次从新排序

    calender_plu_tool.close_cal_win();
    refetch_ca_draw();
  });
}

// *修改单个事件-弹窗
function edit_ca_event_winf(cEvent) {
  var win_ = cus_FN_cj.winTar;

  $('#calendar_win_tea_val').val(cEvent['eTeaN'] || '');
  $('#calendar_win_tea_val_hide').val(cEvent['eTea'] || '');
  $('#calendar_win_desc_val').val(cEvent['eDesc'] || '');
  $('#jsevent_win_date_val').val(cEvent['eStartday'] || ''); // 日历插件展示

  win_.data('edata', {
    eId: cEvent['eId'],
    eTime: cEvent['eTime'],
    eType: cEvent['eType'],
    eStartday: cEvent['eStartday'],
    eTea: cEvent['eTea'],
    classroom: cEvent['classroom'],
    eStartTime: cEvent['eStartTime'],
    eEndTime: cEvent['eEndTime']
  });

  var ind_ = cumCurWinModal('课程', win_, '', {
    type: 1,
    area: ['375px', 'auto'],
    success: function (layer) {
      cus_FN_cj.initWinModalData(layer, cEvent);
      // 按钮
      cus_FN_cj.winTar.find('.js-wm-q').hide();
      cus_FN_cj.winTar.find('.js-wm-s').show();
      cus_FN_cj.winTar.find('.js-add-classtime').hide();
      // cus_FN_cj.winTar.find('.js-single-classhour').trigger('change');
      // 日历窗口
      $('#js_quan_date').hide();
      $('#js_dtp_box').show();

      $('#jsevent_win_date_box').datetimepicker({
        startDate:
          moment(new Date()).format('YYYY-MM-DD') > CLASS_obj_['cStartDay']
            ? '+0d'
            : CLASS_obj_['cStartDay'],
        zIndex: 99999999,
        clearBtn: false
      });

      // cus_FN_cj.bindSelect('#event_dat_time');

      // $('#event_dat_time').find('.js-sel-day-time').val(cEvent['eTime']).trigger('change')
      // .end().find('.js-t-start').val(cEvent['eStartTime']).trigger('change').end().find('.js-t-end').val(cEvent['eEndTime']);
    },
    end: function () {
      $('#jsevent_win_date_box').datetimepicker('remove');
      // 按钮
      cus_FN_cj.winTar.find('.js-wm-q').show();
      cus_FN_cj.winTar.find('.js-wm-s').hide();
      cus_FN_cj.winTar.find('.js-add-classtime').show();
      // *特殊处理
      cus_FN_cj.winTar.find('#js-tsopt').remove();
      $('#calendar_win_desc_val').val('');
      // 日历窗口
      $('#js_quan_date').show();
      $('#js_dtp_box').hide();
      // $('#event_dat_time').html(cus_FN_cj.cloneHtml);
      cus_FN_cj.reInitSelectOpt();

      $('#knowledgeId').val('').trigger('change.select2').select2('destroy');
    }
  });

  // win_.data('win_ind', ind_);
}

// *修改单个事件-保存
function edit_ca_event(evt_) {
  var $jsevent_win_edit = cus_FN_cj.winTar; // 窗口对象

  var tea_ = $jsevent_win_edit.find('#calendar_win_tea_val_hide').val(),
    teaN_ = $jsevent_win_edit.find('#calendar_win_tea_val').val(),
    classroom_ = $jsevent_win_edit.find('#calendar_win_room_name').val(),
    classroomId_ = $jsevent_win_edit.find('#calendar_win_room_itemid').val(),
    sday_ = $jsevent_win_edit.find('#jsevent_win_date_val').val(), // 日历选的时间
    desc_ = $jsevent_win_edit.find('#calendar_win_desc_val').val();
  var knowledgeIdArr = $jsevent_win_edit.find('#knowledgeId').val();
  var eClassroom_ = $jsevent_win_edit.find('#e_classroom_name').val();
  var eClassroomId_ = $jsevent_win_edit.find('#e_classroom_itemid').val();
  var id_ = $jsevent_win_edit.data('edata')['eId'];

  var old_eId_ = $jsevent_win_edit.data('edata')['eId'];

  var child_arr = cus_FN_cj.toObjArr(cus_FN_cj.winTar, sday_);
  var nEvent = child_arr[0];
  nEvent.eTea = tea_;
  nEvent.old_eId = old_eId_;
  nEvent.eDesc = desc_;
  nEvent.classroomId = classroomId_;
  nEvent.eClassroomId = eClassroomId_;
  nEvent.knowledgeIdArr = knowledgeIdArr;
  // 这是该记录的原始数据
  var tarData = $.extend(true, [], cus_TOOLS_data.get_search_data('eId', id_))[0]; //深拷贝，引用类型
  var dataModfiy = !cus_FN_cj.checkDataEq(nEvent, tarData);

  if (dataModfiy) {
    // 只有修改了才触发改变
    // 允许修改当前天的特殊处理
    if (
      nEvent.eStartday == moment().format('YYYY-MM-DD') &&
      nEvent.eStartTime < moment().add(cus_FN_cj.tqDate, 'h').format('HH:mm')
    ) {
      COM_TOOLS.alert('距上课时间小于' + cus_FN_cj.tqDate + '小时，禁止修改');
      return false;
    }
    if (nEvent.eStartTime > nEvent.eEndTime) {
      COM_TOOLS.alert('上课时间跨天，请填写真实的上课时间');
      return false;
    }

    var conflict_date_check = cus_FN_cj.check_date_interval(child_arr, sday_, 1);

    if (conflict_date_check.res) {
      COM_TOOLS.alert('与&nbsp;' + conflict_date_check.date + '&nbsp;上课时段冲突！');
      return false;
    }

    var curAddTotal = cus_FN_cj.sumNewEpoi(child_arr);
    //TODO
    var ajaxD_ = cus_FN_cj.checkTeacherData(child_arr, tea_, classroomId_, sday_, 1);
    checkTeachAjax(evt_, { queryInfo: JSON.stringify(ajaxD_) }, function () {
      cus_TOOLS_data.set_data_byid(id_, {
        //这修改会影响 tArr
        eId:
          moment(sday_ + 'T' + nEvent['eStartTime']).valueOf() + '-' + COM_TOOLS.get_random_fun(6),
        eStartday: sday_, //日期
        eTea: tea_, //讲师ID
        eTeaN: teaN_, //讲师名字
        classroom: classroom_,
        classroomId: classroomId_,
        eClassroom: eClassroom_,
        eClassroomId: eClassroomId_,
        knowledgeIdArr: knowledgeIdArr,
        eTime: nEvent.eTime, //时间 1：上午； 2：下午； 3：晚上
        eStartTime: nEvent.eStartTime, // 开始时间
        eEndTime: nEvent.eEndTime, //结束时间
        eClassTime: nEvent.eClassTime, // new
        eRest: curAddTotal <= 1 ? '0' : nEvent.eRest, // new
        ePoi: curAddTotal,
        eDesc: desc_, //备注
        estate: 2
      });

      var changeEpoi = curAddTotal - tarData['ePoi'];
      if (changeEpoi > 0) {
        //增加当前天时间
        cus_FN_cj.comModDayTime(tarData['eStartday'], 2, changeEpoi);
      } else if (changeEpoi < 0) {
        //减少当前天时间
        cus_FN_cj.comModDayTime(tarData['eStartday'], 1, Math.abs(changeEpoi));
      } else {
        cus_FN_cj.sortNum();
      }

      calender_plu_tool.close_cal_win();
      refetch_ca_draw();
    });
  } else {
    calender_plu_tool.close_cal_win();
    refetch_ca_draw();
  }
}

/**
 * @description 删除单一事件
 */
function del_ca_event_fun() {
  COM_TOOLS.confirm('确认删除', function (layin_) {
    var id_ = cus_FN_cj.winTar.data('edata')['eId'];

    if (!id_) {
      COM_TOOLS.alert('参数错误！');
      return false;
    }

    var tArr = cus_TOOLS_data.get_search_data('eId', id_);
    // 删除数据，过滤掉
    cus_TOOLS_data.del_data_bySearch(function (n, i) {
      return id_ == n['eId'];
    }, true);

    // var totalEpoi = cus_FN_cj.sumTotaltime(tArr, 1);
    var totalEpoi = cus_FN_cj.sumNewEpoi(tArr);
    cus_FN_cj.comModDayTime(tArr[0]['eStartday'], 1, totalEpoi); // 要在数组里增加

    calender_plu_tool.close_cal_win();
    refetch_ca_draw();
    // layer.close(layin_);
    // layer.close($('#jsevent_win_edit').data('win_ind'));
  });
}

function calendar_init_fun() {
  var calendar_ = $('#calendar').fullCalendar({
    customButtons: {
      cusBtnSave: {
        text: '保存并提交至服务器',
        click: function () {
          saveScheduleInfo();
        }
      }
    },
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'cusBtnSave'
    },
    // contentHeight:'100%',
    // height:'parent',
    // aspectRatio:2,
    events: function (start, end, timezone, callback) {
      cus_FN_cj.arrayObjectSortBy(EVENTS_arr_, 'eId', 1); //根据时间(eId)排序
      $.each(EVENTS_arr_, function (i, n) {
        var cobj_ = CLASS_obj_[n['cId']];
        EVENTS_arr_[i]['title'] =
          n['eStartTime'] + '-' + n['eEndTime'] + '-' + n['eTeaN'] + '-' + n['eNum'];
        EVENTS_arr_[i]['start'] = n['eStartday'] + 'T' + n['eStartTime'];
        EVENTS_arr_[i]['end'] = n['eStartday'] + 'T' + n['eEndTime'];
        EVENTS_arr_[i]['className'] =
          n['estate'] == 1
            ? CL_DEFAULE_CONFIG.eClass[4]
            : n['estate'] == 2
            ? CL_DEFAULE_CONFIG.eClass[3]
            : CL_DEFAULE_CONFIG.eClass[0];
        EVENTS_arr_[i]['eIndex'] = i;
      });
      var start_ = start.format('YYYY-MM-DD'),
        end_ = end.format('YYYY-MM-DD');
      var t_ = cus_TOOLS_data.get_searchHi_data(function (n, i) {
        return start_ <= n['eStartday'] && n['eStartday'] <= end_;
      });
      callback(t_);
    },
    timeFormat: ' ',
    eventRender: function (cEvent, element) {
      element.tooltip({
        title:
          '班级名称：' +
          (cEvent['cName'] || '') +
          '<br>人数：' +
          CLASS_obj_['actualNumber'] +
          '<br>班主任：' +
          (cEvent['headMaster'] || '') +
          '<br>校区：' +
          (cEvent['orgCore'] || '') +
          '<br>备注：' +
          (cEvent['eDesc'] || ''),
        html: true,
        placement: 'auto right',
        container: 'body'
      });
    },
    dayClick: function (date, jsEvent, view) {
      if (!date.format('YYYY-MM-DD')) {
        COM_TOOLS.alert('操作参数错误！请联系管理员！');
        return false;
      }
      var sda_ = date.format('YYYY-MM-DD');
      // 当天日期能修改
      if (sda_ < moment().format('YYYY-MM-DD')) {
        // 修改日期小于当前日期
        cus_TOOLS_data.cur_sdate_ = '';
        COM_TOOLS.alert('修改日期不能小于当前日期！');
        return false;
      }
      cus_TOOLS_data.cur_sdate_ = sda_;
      var e_tar_ = $(jsEvent.target);

      if (e_tar_.hasClass('cus-label-xs')) {
        // *删除全天按钮
        calender_plu_tool.del_ca_event(sda_);
      } else if (e_tar_.hasClass('js-label-xs-creat')) {
        // *创建全天
        var win_ = $('#calendar_win');
        var ind_ = cumCurWinModal('课程', win_, '', {
          type: 1,
          area: ['375px', 'auto'],
          end: function () {
            // calender_plu_tool.input_tea.val('');
            // calender_plu_tool.input_teaN.val('');
            //calender_plu_tool.input_cChild.prop('checked', false);
            calender_plu_tool.input_daynum.attr('disabled', false);
            calender_plu_tool.input_daynum.val(1);
            calender_plu_tool.input_desc.val('');

            cus_FN_cj.reInitSelectOpt();

            $('#knowledgeId').val('').trigger('change.select2').select2('destroy');
          },
          success: function (layer) {
            cus_FN_cj.initWinModalData(layer);
            // 时间=当前天 天数强制为1
            if (sda_ == moment().format('YYYY-MM-DD')) {
              calender_plu_tool.input_daynum.attr('disabled', true);
            }
            // 按钮
            // cus_FN_cj.winTar.find('.js-wm-q').show();
            // cus_FN_cj.winTar.find('.js-wm-s').hide();
            // cus_FN_cj.winTar.find('.js-single-classhour').trigger('change');

            // 打开时，显示结束时间
            // cus_FN_cj.getEndOption();
          }
        });
        win_.data('win_ind', ind_);
      } else if (e_tar_.hasClass('js-label-xs-addone')) {
        //延期
        COM_TOOLS.alert('暂未开放！');
      } else if (e_tar_.hasClass('js-label-xs-btnwd')) {
        //改为工作日并前移
      } else if (e_tar_.hasClass('js-label-xs-other')) {
        //其它
        //TODO
      }
    },
    eventClick: function (cEvent, jsEvent, view) {
      //$(jsEvent.target).popover({content:'asdasd',container:'body'}).popover('show');
      // 当天日期能修改
      if (cEvent['eStartday'] < moment().format('YYYY-MM-DD')) {
        //修改日期小于当前日期
        cus_TOOLS_data.cur_sdate_ = '';
        COM_TOOLS.alert('修改日期不能小于当前日期！');
      } else if (
        cEvent['eStartday'] == moment().format('YYYY-MM-DD') &&
        cEvent.eStartTime < moment().add(cus_FN_cj.tqDate, 'h').format('HH:mm')
      ) {
        COM_TOOLS.alert('距上课时间小于' + cus_FN_cj.tqDate + '小时，禁止改动');
      } else {
        edit_ca_event_winf(cEvent);
      }
    },
    eventAfterRender: function (cEvent, element, view) {
      /*单事件渲染完成*/
    },
    eventAfterAllRender: function (view) {
      /*所有事件渲染完成*/
    },
    dayRender: function (date, cell) {
      var sday_ = date.format();
      if (cus_TOOLS_data.is_playerDay(sday_)) {
        cell.addClass('cus-playerday-bg');
      }
    },
    viewRender: function (view, element) {
      /* 按钮组 */
      //<i class="js-label-xs-addone fa fa-arrow-circle-right" title="延期"></i>
      $('.fc-content-skeleton thead td').append(
        '<i class="js-label-xs-creat fa fa-plus-circle" title="插入阶段"><i class="cus-label-xs fa fa-times-circle" title="删除当前天"></i>'
      );
      /* 结课 */
      if (cus_TOOLS_data['endClass_day']) {
        $(
          '.fc-content-skeleton thead td[data-date="' + cus_TOOLS_data['endClass_day'] + '"]'
        ).append('<span id="endclass_iconobj">结课</span>');
      }
      //颜色提示信息
      var html_ =
        '<div class="cus-info">' +
        '<span class="cus-info-color cus-ca-class3"></span><span class="cus-wz">默认</span>' +
        '<span class="cus-info-color cus-ca-class2"></span><span class="cus-wz">已修改未提交</span>' +
        '<span class="cus-info-color cus-ca-class4"></span><span class="cus-wz">讲师或教室冲突</span>' +
        '</div>';
      var tar_ = $('.fc-toolbar .fc-left');
      if (!tar_.has('.cus-info').length) {
        tar_.append(html_);
      }
    }
  });
  return calendar_;
}
/* calendar tool fun end */
$(document)
  .on('change.sclasshour', '.js-single-classhour', function () {
    // 单次课时
    var t_ = $(this);
    var val = t_.val();

    if (val == 1) {
      cus_FN_cj.winTar
        .find('.js-isrest[value=0]')
        .prop('checked', 'checked')
        .trigger('change.isrest');
      setTimeout(function () {
        cus_FN_cj.winTar.find('.js-isrest').attr('disabled', 'disabled');
      }, 200);
      // cus_FN_cj.winTar.find('.js-total-rest').val(0).attr('disabled', 'disabled');
    } else {
      if (cus_FN_cj.winTar.find('.js-isrest:disabled').length) {
        cus_FN_cj.winTar.find('.js-isrest').removeAttr('disabled');
        // cus_FN_cj.winTar.find('.js-isrest').trigger('click');
      }
    }

    cus_FN_cj.getEndOption();
  })
  .on('click.classminute', '.js-class-minute', function () {
    // todo 课时长，暂时不会变动
    // cus_FN_cj.getEndOption();
  })
  .on('change.isrest', '.js-isrest', function (e) {
    // 是否休息
    // var isRest = cus_FN_cj.winTar.find('.js-isrest:checked').val(); // 这个不同步
    var isRest = e.target.value;
    if (Number(isRest)) {
      cus_FN_cj.winTar.find('.js-total-rest').removeAttr('disabled');
    } else {
      cus_FN_cj.winTar.find('.js-total-rest').val(0).attr('disabled', 'disabled');
    }

    cus_FN_cj.getEndOption();
  })
  .on('change.totalrest', '.js-total-rest', function () {
    // 休息时长
    cus_FN_cj.getEndOption();
  })
  .on('change.starttime', '.js-t-start', function () {
    // 开始时间
    cus_FN_cj.getEndOption();
  })
  .on('click.add', '.js-add-classtime', function () {
    // 添加 时段条
    cus_FN_cj.timeTar.append(cus_FN_cj.cloneHtml).find('.js-re-class-time:last').show();
    cus_FN_cj.createStartTimeOption();
    cus_FN_cj.getEndOption();
  })
  .on('click.remove', '.js-re-class-time', function () {
    // 全天-删除课时条
    $(this).closest('.calendar-class-time').remove();
  });
