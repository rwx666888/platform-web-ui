// todo 删除只添加 delete 字段 不删除数据
// 报名课程-获取历史数据
(function () {
  $.get(CONTEXT_PATH + '/newsignup/findAllSignupByTogetherStamp', {
    togetherStamp: COM_TOOLS.requestParam('togetherStamp')
  }).then(function (res) {
    // console.log('response-', res)
    var arr = checkDTData(res);
    // console.log('cy-', arr);
    CourseHTML_cb(arr, '', function (item) {
      var p_dir = $('#d' + item.classificationCode);

      xiaojiMoney(p_dir);
    });
  });
})();
// 构建 table
function tableHTML_cb(id) {
  return (
    '<table id="t_' +
    id +
    '" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%">' +
    '<thead><tr>' +
    '<th style="width: 80px;">课程阶段</th>' +
    '<th style="width: 100px;">价格</th>' +
    '<th style="width: 60px;">课时</th>' +
    '<th>单价</th>' +
    '<th style="width: 70px;">模式</th>' +
    '<th style="width: 100px;">周中/周末</th>' +
    '<th style="width: 50px;">选班</th>' +
    '<th>优惠金额</th>' +
    '<th style="width: 100px;">折后总额</th>' +
    '<th>含教具金额</th>' +
    '<th style="width: 8%;">合同主体</th>' +
    '<th>已付金额</th>' +
    '<th>欠费金额</th>' +
    '<th style="width: 42px;">操作</th>' +
    '</tr></thead>' +
    '<tbody></tbody></table>'
  );
}
// 判断周选择
function judgeWeek(param, type) {
  var res = '';

  if (param == type) {
    res = 'selected';
  }

  return res;
}
// 金额 只读 判断
function judgeMoneyReadonly(num) {
  num = num || 0;
  var res = '';

  if (Number(num) == 0) {
    res = 'readonly';
  }

  return res;
}
// 判断 该方向能否修改 欠费金额
function judgeIfModify(num) {
  var flag = false;

  if (Number(num) == 0) {
    flag = true;
  }

  return flag;
}
// 构建 table tr
function trHTML_cb(key, item, createType) {
  var tmp_html = '';

  if (checkTsWeekType(item.courseCode)) {
    tmp_html = '<option value="">无</option>';
  } else {
    tmp_html =
      '<option value="weekdays" ' +
      judgeWeek(item.week, 'weekdays') +
      '>周中</option><option value="weekend" ' +
      judgeWeek(item.week, 'weekend') +
      '>周末</option>';
  }

  if (judgeIfModify(item.outStandingAmount)) {
    var p_dir = $('#d' + item.classificationCode);
    if (!p_dir.hasClass('disabled')) {
      p_dir.addClass('disabled');
    }
  }
  // 课程模式
  function createCoursePattern(item, list) {
    var tmp = '';
    for (var i = 0; i < list.length; i++) {
      var item_ = list[i];
      if (item.classClassify == item_.hiddenValue) {
        tmp +=
          '<option selected value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>';
      } else {
        tmp += '<option value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>';
      }
    }
    return (
      '<select ' +
      (isCreateMode ? '' : 'disabled') +
      ' class="cus-sel js-sel-pattern" name="pattern_' +
      item.courseStageCode +
      '">' +
      tmp +
      '</select>'
    );
  }

  // 新增模式 非 回显
  var isCreateMode = createType == 'add';

  var class_hour = isCreateMode ? item.totalClassHour : item.classHour;
  //console.log('add', class_hour)

  var c_price = COM_FN.mul(class_hour, item.classHourPrice); // 数据回显时好用

  // 处理合同主体
  processNoCompanyCode(item);

  return $(
    '<tr id="' +
      key +
      '" class="js-tr-item">' +
      '<td style="font-size: 12px;">' +
      item.courseStageName +
      '</td>' +
      '<td><input type="text" class="cus-inp js-price-course js-money" value="' +
      c_price +
      '" readonly></td>' +
      '<td><input type="text" name="ch_' +
      item.courseStageCode +
      '" ck-course-hour="' +
      item.classHour_hidden +
      '" data-org-hour="' +
      item.classHour_hidden +
      '" class="input-sm cus-inp js-dy-classHour" value="' +
      class_hour +
      '" required></td>' +
      '<td><input type="text" name="cp_' +
      item.courseStageCode +
      '" ck-course-price="' +
      item.classHourPrice_hidden +
      '" class="input-sm cus-inp js-money js-dy-price" value="' +
      item.classHourPrice +
      '" required></td>' +
      '<td>' +
      createCoursePattern(item, classClassifyList) +
      '</td>' +
      '<td>' +
      '<select ' +
      (isCreateMode ? '' : 'disabled') +
      ' name="week_' +
      item.courseStageCode +
      '" class="cus-sel js-sel-week">' +
      tmp_html +
      '</select>' +
      '</td>' +
      '<td><input type="text" class="cus-inp-h1 js-inp-hide-class" name="cc_' +
      item.courseStageCode +
      '" value="' +
      (item.classCode || '') +
      '" required /><button ' +
      (isCreateMode ? '' : 'disabled') +
      ' type="button" class="btn btn-xs btn-primary ' +
      (isCreateMode ? '' : 'btn-success') +
      ' js-btn-class" data-toggle="tooltip" data-placement="bottom" title="' +
      (isCreateMode ? '' : item.classCode + '(' + (item.className || '') + ')') +
      '">' +
      (isCreateMode ? '选班' : '已选') +
      '</button></td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-primary js-btn-discount">优惠</button>&nbsp;' +
      '<input type="text" name="cd_' +
      item.courseStageCode +
      '" ck-discount="' +
      (item.discountAmount || 0) +
      '" class="input-sm cus-inp btn-inp js-money js-dy-discount" value="' +
      (item.discountAmount || 0) +
      '" required ' +
      judgeMoneyReadonly(item.discountAmount) +
      '>' +
      '</td>' +
      '<td><input type="text" class="cus-inp js-price-discount js-money" value="' +
      (item.actualTotalAmount || c_price) +
      '" readonly></td>' +
      '<td>' +
      '<button ' +
      (isCreateMode ? '' : 'disabled') +
      ' type="button" class="btn btn-xs btn-primary ' +
      (item.goodsList && item.goodsList.goodsName ? 'btn-success' : '') +
      ' js-btn-books" data-toggle="tooltip" data-placement="bottom" title="' +
      ((item.goodsList && item.goodsList.goodsName) || '') +
      '">' +
      (item.goodsList && item.goodsList.goodsName ? '已选' : '教具') +
      '</button>&nbsp;' +
      '<input type="text" name="cb_' +
      item.courseStageCode +
      '" ck-course-price="' +
      (item.teachingMaterialCost || 0) +
      '" class="input-sm cus-inp btn-inp js-money js-dy-gooks" value="' +
      (item.teachingMaterialCost || 0) +
      '" required readonly>' +
      '</td>' +
      '<td style="font-size:12px;">' +
      item.companyName +
      '</td>' +
      '<td><input type="text" class="cus-inp js-money" value="' +
      (item.totalPaymentAmount || 0) +
      '" readonly /></td>' +
      '<td><input type="text" min="0" class="cus-inp js-money js-dy-outstanding" value="' +
      (item.outStandingAmount || 0) +
      '" readonly /></td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-warning js-tr-remove"><i class="glyphicon glyphicon-remove" ></i ></button > ' +
      '</td>' +
      '</tr>'
  )
    .data('sdata', item)
    .data('params-class', item.classList)
    .data('params-discount', item.discountAmountList)
    .data('params-gooks', item.goodsList);
}
// 构建 联报
function lianbaoHTML_cb(params) {
  var item = (params && params.item) || {};

  return $(
    '<div class="lian-wrp form-inline">' +
      '<div class="form-group form-group-sm">' +
      '<button type="button" class="btn btn-sm btn-primary js-btn-lb" data-toggle="tooltip" data-placement="bottom" title="' +
      (item.name || '') +
      '">联报优惠</button>' +
      '</div>' +
      '<div class="form-group form-group-sm">' +
      '<label>最大减免：</label>' +
      '<input type="text" class="form-control input-sm js-money js-lb-discount" value="' +
      (item.money || 0) +
      '" readonly>' +
      '</div>' +
      '<div class="total pull-right form-group form-group-sm">' +
      '<label>小计：</label><input type="text" class="form-control input-sm js-money js-total-money" value="" readonly>' +
      '</div>' +
      '</div>'
  )
    .find('.js-btn-lb')
    .data('sdata', params)
    .end();
}
// 构建 报名课程 HTML
function CourseHTML_cb(sArr, type, callback) {
  var tmp_obj = handleCourseData(sArr);
  // console.log(tmp_obj, tmp_obj.d)
  // 方向
  $.each(tmp_obj.d, function (key, item) {
    if ($('#' + key).length) {
      return false;
    }

    SignClassHTML.append(
      '<div class="direction-item" id="' +
        key +
        '"><div class="dir-name">' +
        item.name +
        '</div></div>'
    );

    var _lianbaoHTML = lianbaoHTML_cb(item.lb_data);
    $('#' + key).append(_lianbaoHTML);
  });
  // 课程
  $.each(tmp_obj.c, function (key, item) {
    if ($('#' + key).length) {
      return false;
    }

    var did = key.split('_')[0];
    var _tableHTML = tableHTML_cb(key);

    $('#' + did + '>.dir-name').after(
      '<div class="class-item" id="' +
        key +
        '"><div class="class-name">' +
        item.name +
        '</div><div class="choice-class">' +
        _tableHTML +
        '</div></div>'
    );
  });
  // 阶段
  $.each(tmp_obj.s, function (key, item) {
    var strArr = key.split('_');
    var cid = strArr[0] + '_' + strArr[1];

    var _trHTML = trHTML_cb(strArr[2], item, type);

    $('#t_' + cid)
      .find('tbody')
      .append(_trHTML);

    callback && callback(item);
    // 小计
    // var p_dir = $('#t_' + cid).closest('.direction-item');
    // xiaojiMoney(p_dir);

    // sumTotalPayment();
    // sumTotalDiscount();
  });
  // 特殊处理
  $('.js-money').number(true, 2);
  $('[data-toggle="tooltip"]').tooltip();
}
// 创建 提交用 阶段数据
// obj1 为主
function checkCurObj(obj1, obj2) {
  var res = obj1 || obj2 || {};

  return res;
}

function submitStageData_cb(baseInfo, payInfo) {
  var arr = [];

  $('.direction-item').each(function (key, item) {
    var tmp_arr = [];
    var t_dir = $(item);
    var c_stage = t_dir.find('.js-tr-item');

    c_stage.each(function (key2, item2) {
      var t_ = $(item2);
      var s_data = t_.data();
      // console.log(t_, s_data)

      var tmp_obj = $.extend(true, {}, s_data.sdata, s_data.paramsClass, s_data.paramsGooks);

      // 额外数据 - base
      tmp_obj.informationCode = baseInfo.informationCode;
      tmp_obj.informationSource = baseInfo.informationSource;
      tmp_obj.informationChannel = baseInfo.informationChannel;
      tmp_obj.studentCode = baseInfo.studentCode;
      tmp_obj.orgCore = baseInfo.orgCore;
      tmp_obj.orgCoreCode = baseInfo.orgCoreCode;

      tmp_obj.togetherStamp = tmp_obj.togetherStamp || '';
      tmp_obj.type = tmp_obj.type || '';
      // 优惠数据
      tmp_obj.discountData = s_data.paramsDiscount || [];
      // 用户输入数据
      tmp_obj.classHour = Number(t_.find('.js-dy-classHour').val());
      tmp_obj.classHourPrice = Number(t_.find('.js-dy-price').val());
      // 周 类型
      var week = t_.find('.js-sel-week').val();
      tmp_obj.week = week;
      tmp_obj.weekendType = week ? t_.find('.js-sel-week>option:selected').text() : '';
      // pay
      var inp_discount = Number(t_.find('.js-price-discount').val());
      var tuition = COM_FN.sub(
        Number(t_.find('.js-price-course').val()),
        Number(t_.find('.js-dy-gooks').val())
      );
      var FM_data = getFrontMoney(tmp_obj.courseStageCode);
      // 学费
      tmp_obj.tuition = tuition;

      // tmp_obj.paymentMethod = payInfo.paymentMethod;
      // tmp_obj.payMethod = payInfo.payMethod;
      // tmp_obj.loanCode = payInfo.loanCode || '';
      // tmp_obj.loanName = payInfo.loanName || '';
      // tmp_obj.loanPeriods = payInfo.loanPeriods || '';
      // tmp_obj.loanPeriodsCode = payInfo.loanPeriodsCode || '';
      // tmp_obj.loanRate = payInfo.loanRate || '';
      // tmp_obj.loanRateCode = payInfo.loanRateCode || '';
      // tmp_obj.remark = payInfo.remark;
      // // 定金
      // tmp_obj.thisPaymentAmount = FM_data || inp_discount;
      // 折后金额
      tmp_obj.totalAmount = inp_discount;
      tmp_obj.actualTotalAmount = inp_discount;
      // 优惠金额
      tmp_obj.discountAmount = Number(t_.find('.js-dy-discount').val());
      // 联报
      var mul_data = t_dir.find('.js-btn-lb').data('sdata');
      if (!$.isEmptyObject(mul_data)) {
        tmp_obj.mulDiscountData = mul_data.item;
      } else {
        tmp_obj.mulDiscountData = {};
      }
      //班级编号，班级名称
      var class_obj = checkCurObj(s_data.paramsClass, s_data.classList);
      tmp_obj.classCode = class_obj.itemcode || class_obj.classCode || '';
      tmp_obj.className = class_obj.itemname || class_obj.className || '';
      // 教具
      tmp_obj.sellGoodsNum = 1;
      tmp_obj.teachingMaterialCost = Number(t_.find('.js-dy-gooks').val());

      tmp_arr.push(tmp_obj);
    });

    arr.push(tmp_arr);
  });

  return arr;
}
// 请求-删除数据
function r_deleteTRData(params) {
  var dtd = $.Deferred();

  $.post(CONTEXT_PATH + '/newsignup/deleteOrder', {
    orderCode: DELETE_COURSE_ARR
  })
    .then(function (res) {
      if (res.code != 1) {
        COM_TOOLS.alert(res.msg);
        dtd.reject(res);
      } else {
        dtd.resolve(res);
      }
    })
    .fail(function (err) {
      dtd.reject(err);
    });

  return dtd.promise();
}
// 请求-发送保存
function r_saveFormData(params) {
  return $.post(CONTEXT_PATH + '/newsignup/savaSignup', params)
    .then(function (res) {
      COM_TOOLS.loadingShade.close();
      if (res.code == '0') {
        COM_TOOLS.alert(res.msg);
      } else if (res.code == '1') {
        top.COM_TOOLS.alert('保存成功');

        /*$.ajax({
		            type : "post",
		            url : CONTEXT_PATH + '/stuElectronicCompact/verificationCompact',
		            data : {
		         		 'togetherStamp':COM_TOOLS.requestParam('togetherStamp'),
		      		 'studentCode':$('#studentCode').val()
		            },
		            success : function(data){
		            	if(data.code!=0){
		    	            	COM_TOOLS.confirm("此订单已全款，即将生成电子合同并发短信至"+data.msg + "请您联系家长签署合同",{
			           	              btnStyleArr:['btn-info'],
			                       btn:['确认']
			                   },yes);
		         	       function yes(){cumParentCallValue();}
		  	         }else{
		  	        	 cumParentCallValue();
		  	         }
		            },
		            error : function(){
		                COM_TOOLS.alert(TEDU_MESSAGE.get('platform.common.msg.exception'));
		            }
		        });
				$.ajax({
		      type : "post",
		      url : CONTEXT_PATH + '/stuElectronicCompact/sendCompact',
		      data : {
		      	'togetherStamp':COM_TOOLS.requestParam('togetherStamp'),
		      	'studentCode':$('#studentCode').val()
		      },
		      success : function(data){
		      	if(data.code==1){
		      	}else{
		      		parent.COM_TOOLS.alert(data.msg, {time : 5000});
					}
		      },
		      error : function(){
		          COM_TOOLS.alert(TEDU_MESSAGE.get('platform.common.msg.exception'));
		      }
		  });*/
        $.ajax({
          type: 'post',
          url: CONTEXT_PATH + '/stuElectronicCompact/verificationStudent',
          data: {
            togetherStamp: COM_TOOLS.requestParam('togetherStamp'),
            studentCode: $('#studentCode').val()
          },
          success: function (data) {
            if (data.code == 1) {
              cumParentWinModal(
                '<ta:local key=""/>电子合同',
                CONTEXT_PATH +
                  '/stuElectronicCompact/toDetailsPage?togetherStamp=' +
                  COM_TOOLS.requestParam('togetherStamp') +
                  '&studentCode=' +
                  $('#studentCode').val() +
                  '&orgCoreCode=' +
                  $('#orgCore_code').val() +
                  '&orgCore=' +
                  $('#orgCore').val(),
                {
                  scrollbar: true,
                  area: ['1000px', '500px'],
                  end: function () {},
                  other: { noTriEnd: true }
                }
              );
              cumParentCallValue();
            } else {
              cumParentCallValue();
            }
          },
          error: function () {
            COM_TOOLS.alert(TEDU_MESSAGE.get('platform.common.msg.exception'));
            cumParentCallValue();
          }
        });
      } else {
        COM_TOOLS.alert('未知错误');
      }
    })
    .fail(function (err) {
      COM_TOOLS.loadingShade.close();
    });
}

// bind event
$('#eventMain').on('click', '#choiceClassAdd_cb', function (evt) {
  var choice_dt_data = dt_choice_class.getSelectRowsData();
  dt_choice_class.table.rows().deselect();
  // 获取差异的 dt_data
  // console.log('dt--', choice_dt_data);
  var arr = checkDTData(choice_dt_data);
  // console.log('cy-', arr);
  CourseHTML_cb(arr, 'add', function (item) {
    var p_dir = $('#d' + item.classificationCode);
    // 清理联报
    var lb_Data = p_dir.find('.js-btn-lb').data('sdata');
    if (!$.isEmptyObject(lb_Data)) {
      clearLBData(p_dir);
    }
    // 小计
    xiaojiMoney(p_dir);
  });
});
// 保存 修改
$('#formSubmit_cb').click(function () {
  if (!(baseValid.form() && payValid.form() && courseStageValid.form())) {
    COM_TOOLS.alert('请检查内容是否填写完整');
    return false;
  }

  // 课时数限制
  var resHour = checkClassHourLimit(handleClassHourNum(SignClassHTML));
  if (resHour.res) {
    COM_TOOLS.alert('联报年数超过集团规定限制(联报不得大于' + resHour.hour + ')，请重新选择！');
    return false;
  }

  var base_info = COM_TOOLS.serializeObject('#baseInfo');
  // var pay_info = handleNum(COM_TOOLS.serializeObject('#payInfo'));

  var res_sub = submitStageData_cb(base_info);

  // console.log(base_info, res_sub);
  var params = {
    signupMul: JSON.stringify(base_info),
    signupSubArr: JSON.stringify(res_sub)
  };
  // console.log(params);

  // todo 先删除，再保存；没有直接保存
  COM_TOOLS.loadingShade.open();
  if (DELETE_COURSE_ARR.length) {
    r_deleteTRData()
      .then(function (res) {
        r_saveFormData(params);
      })
      .fail(function (err) {
        COM_TOOLS.loadingShade.close();
      });
  } else {
    r_saveFormData(params);
  }
});

// 获取课时限制数
var DIR_LIMIT = '-1';
var COURSE_LIMIT = '-1';
function getClassHourLimit(orgCode) {
  $.get(CONTEXT_PATH + '/limitMul/findLimitByCenter?orgCoreCode=' + orgCode).then(function (res) {
    if (res.code == 1) {
      DIR_LIMIT = res.data.difference;
      COURSE_LIMIT = res.data.same;
    } else {
      COM_TOOLS.alert(res.msg);
    }
  });
}
getClassHourLimit($('#orgCore_code').val());

// 校验添加的 方向课时 及 总课时 数
function handleClassHourNum(tarDom) {
  function trClassHour(list) {
    // console.log(list)
    var sum = 0;
    $.each(list, function () {
      // console.log(this)
      var baseCH = this.dataset.orgHour;
      var vale = this.value;
      // console.log(baseCH, vale)
      sum += COM_FN.div(vale, baseCH);
    });
    return sum;
  }

  var _tmp = [];
  var _sum = 0;

  tarDom.find('.direction-item').each(function () {
    var tDir = $(this);
    var tClass = tDir.find('.js-dy-classHour');
    var sData = tDir.find('.js-tr-item').eq(0).data('sdata');

    var rSum = trClassHour(tClass);
    _sum = COM_FN.add(_sum, rSum);

    _tmp.push({
      dirCode: sData.classificationCode,
      dirName: sData.classificationName,
      totalHour: rSum
    });
  });
  console.log({
    items: _tmp,
    totalHour: _sum
  });
  return {
    items: _tmp,
    totalHour: _sum
  };
}

function checkClassHourLimit(params) {
  if (COURSE_LIMIT != '-1') {
    console.log(222);
    for (var i = 0; i < params.items.length; i++) {
      var item = params.items[i];
      if (item.totalHour && item.totalHour > COURSE_LIMIT) {
        return { hour: COURSE_LIMIT, res: true };
      }
    }
  }
  if (DIR_LIMIT != '-1') {
    console.log(111);
    if (params.totalHour && params.totalHour > DIR_LIMIT) {
      return { hour: DIR_LIMIT, res: true };
    }
  }
  return { res: false };
}
