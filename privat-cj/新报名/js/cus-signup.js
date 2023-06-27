// version 20191017.100

// 常量
var DELETE_COURSE_ARR = [];
var FMBoxIdx = ''; // 定金弹窗
var SignClassHTML = $('#signClassHTML');
// 公共方法
var COM_FN = {
  add: function (arg1, arg2) {
    (arg1 = arg1.toString()), (arg2 = arg2.toString());
    var arg1Arr = arg1.split('.'),
      arg2Arr = arg2.split('.'),
      d1 = arg1Arr.length == 2 ? arg1Arr[1] : '',
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : '';
    var maxLen = Math.max(d1.length, d2.length);
    var m = Math.pow(10, maxLen);
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
    var d = arguments[2];
    return typeof d === 'number' ? Number(result.toFixed(d)) : result;
  },
  sub: function (arg1, arg2) {
    return this.add(arg1, -Number(arg2), arguments[2]);
  },
  mul: function (arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2];
    m =
      (r1.split('.')[1] ? r1.split('.')[1].length : 0) +
      (r2.split('.')[1] ? r2.split('.')[1].length : 0);
    resultVal = (Number(r1.replace('.', '')) * Number(r2.replace('.', ''))) / Math.pow(10, m);
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  div: function (arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2];
    m =
      (r2.split('.')[1] ? r2.split('.')[1].length : 0) -
      (r1.split('.')[1] ? r1.split('.')[1].length : 0);
    resultVal = (Number(r1.replace('.', '')) / Number(r2.replace('.', ''))) * Math.pow(10, m);
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  getVal: function (param1, param2, list) {
    var res = '';

    $.each(list, function (key, item) {
      if (param1 == list[param2]) {
        res = item;
      }
    });

    return res;
  }
};
// 性别
$('.i-checks').iCheck({
  checkboxClass: 'icheckbox_square-green',
  radioClass: 'iradio_square-green'
});
// 生日
$('#birthday').datetimepicker({
  startView: 4
});
// cus validator
$.validator.addMethod(
  'ck-course-hour',
  function (value, element, params) {
    var params = params.split(',');
    var base = Number(params[0]);
    var percent = Number(TotalClassHourRatio) || 1;

    var maxVal = Number(COM_FN.mul(base, percent));
    value = Number(value);
    // console.log('ck-hour-', value);

    return this.optional(element) || (value > 0 && value <= maxVal);
  },
  '必须>0，且<=' + COM_FN.mul(TotalClassHourRatio, 100) + '%'
);
$.validator.addMethod(
  'ck-course-price',
  function (value, element, params) {
    value = Number(value);

    return this.optional(element) || value >= params;
  },
  '必须>=基础值'
);
$.validator.addMethod(
  'ck-discount',
  function (value, element, params) {
    value = Number(value);
    params = Number(params);
    // console.log('ck-discount--', value, params, value >= 0, value <= params);

    return this.optional(element) || (value >= 0 && value <= params);
  },
  '不能超过最大值'
);
// instance
var baseValid = $('#baseInfo').validate();
var payValid = $('#payInfo').validate();
var courseStageValid = $('#signClassHTML').validate();
var frontMoneyValid = $('#frontMoneyForm').validate();
// 省份 select2
var sel2_province = COM_TOOLS.select2_init('provinceCode');
sel2_province.changeCallback(function (e) {
  //console.log(sel2_province.getVal())
  var provinceId = sel2_province.getVal();
  // 数据清理
  sel2_city.updateOption('<option value="">请选择</option>');
  sel2_school.updateOption('<option value="">请选择</option>');

  if (!!!provinceId) {
    $('#province').val('');
    return false;
  }
  $('#province').val($('#provinceCode').find('option:selected').text());

  $.post(CONTEXT_PATH + '/city/queryForRedis', {
    provinceId: provinceId
  }).then(function (res) {
    //console.log(res)
    var arr = ['<option value="">请选择</option>'];

    for (var i = 0; i < res.length; i++) {
      arr.push('<option value="' + res[i].id + '">' + res[i].name + '</option>');
    }

    sel2_city.updateOption(arr.join(''));
  });
});
// 城市 sel2
var sel2_city = COM_TOOLS.select2_init('cityCode');
sel2_city.changeCallback(function (e) {
  //console.log(sel2_city.getVal())
  var cityCode = sel2_city.getVal();

  sel2_school.updateOption('<option value="">请选择</option>');

  if (!!!cityCode) {
    $('#city').val('');
    return false;
  }
  $('#city').val($('#cityCode').find('option:selected').text());

  var city = cityCode;
  city = city == '' ? 0 : city;
  var version = $('#schoolVersion').val();
  var schoolData = localStorage.getItem('kcrm-school-data-' + city + '-' + version);
  if (schoolData) {
    initSchool(JSON.parse(schoolData));
    return;
  }
  $.post(CONTEXT_PATH + '/school/getSchoolListByCity', {
    cityCode: cityCode
  }).then(function (res) {
    var schoolArr = [];
    res.forEach(function (e) {
      schoolArr.push(e.schoolName);
    });
    for (item in window.localStorage) {
      if (
        window.localStorage.hasOwnProperty(item) &&
        item.indexOf('kcrm-school-data-' + city) >= 0
      ) {
        localStorage.removeItem(item);
      }
    }
    localStorage.setItem('kcrm-school-data-' + city + '-' + version, JSON.stringify(schoolArr));
    initSchool(schoolArr);
  });
});

function initSchool(data) {
  var arr = ['<option value="">请选择</option>'];
  for (var i = 0; i < data.length; i++) {
    arr.push(
      '<option value="' +
        data[i] +
        '" ' +
        (data[i] == schoolValue ? 'selected' : '') +
        '>' +
        data[i] +
        '</option>'
    );
  }
  sel2_school.updateOption(arr.join(''));
}

// 学校 sel2
var sel2_school = COM_TOOLS.select2_init('school');
// datatable
var cloneDTData = {};

var searchParemOBj_ = {
  orgCoreCode: $('#orgCore_code').val(),
  studentCodeIn: '',
  studentCodeNotIn: ''
};
var dt_choice_class = COM_TOOLS.DT_init(
  'tdChoiceClass',
  [
    {
      width: '30px',
      title: '操作',
      className: 'select-checkbox',
      defaultContent: ''
    },
    {
      data: 'classificationName',
      title: '课程方向'
    },
    {
      data: 'courseName',
      title: '课程名称'
    },
    {
      data: 'courseStageName',
      title: '课程阶段'
    },
    {
      data: 'classHourPrice_hidden',
      title: '课程单价(元)'
    },
    {
      data: 'classHour_hidden',
      title: '课时'
    }
  ],
  CONTEXT_PATH + '/chooseCourse/list',
  'get',
  searchParemOBj_,
  {
    other: {
      scrollY: '192px',
      pageLength: 12
    }
  }
);
// 上传凭证
/* COM_TOOLS._view.cusFileUpload('img_dy_upload', 'evidenceUrl', {
	serve_url: CONTEXT_PATH + '/evidenceUpload/upload',
	serve_name: 'evidence',
  required: true
}); */
// 处理课程没有合同主体
function processNoCompanyCode(item) {
  if (item.companyCode == -1 || item.companyCode == null) {
    item.companyCode = $('#legalSubjectCode').val();
    item.companyName = $('#legalSubjectName').val();
  }
}

// dt 新旧数据匹配 cloneDTData
function checkDTData(list) {
  var arr = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    // 不存在
    if (cloneDTData['cs_' + item.courseStageCode] == null) {
      cloneDTData['cs_' + item.courseStageCode] = item;
      arr.push(item);
    }
  }

  return arr;
}
// {d: {d1: {id, name}}, c: {d1_c1: {id, name}}, s: {d1_c1_s1: {item}}}
// 处理所选课程数据
function handleCourseData(list) {
  var obj = {
    d: {},
    c: {},
    s: {}
  };

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    // console.log(key, item);

    var did = item.classificationCode;
    var cid = item.courseCode;
    var sid = item.courseStageCode;

    // 方向
    if (obj.d['d' + did] == null) {
      obj.d['d' + did] = {
        id: did,
        name: item.classificationName,
        lb_data: item.mulDiscountData || {}
      };
    }
    // 课程
    if (obj.c['d' + did + '_c' + cid] == null) {
      obj.c['d' + did + '_c' + cid] = {
        id: cid,
        name: item.courseName
      };
    }
    // 阶段
    obj.s['d' + did + '_c' + cid + '_s' + sid] = item;
  }

  return obj;
}
// 特殊课程判断 周中/末
// CO201704010012 | 0 select 是空
function checkTsWeekType(type_params) {
  var res = false;
  if (type_params == '0') {
    res = true;
  }
  return res;
}

// 构建 table
function tableHTML(id) {
  return (
    '<table id="t_' +
    id +
    '" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%">' +
    '<thead><tr>' +
    '<th style="width: 80px;">课程阶段</th>' +
    '<th style="width: 120px;">价格</th>' +
    '<th style="width: 90px;">课时</th>' +
    '<th>课时单价</th>' +
    '<th style="width: 70px;">模式</th>' +
    '<th style="width: 100px;">周中/周末</th>' +
    '<th style="width: 50px;">选班</th>' +
    '<th>优惠金额</th>' +
    '<th style="width: 120px;">折后总额</th>' +
    '<th>含教具金额</th>' +
    '<th style="width: 10%;">合同主体</th>' +
    '<th style="width: 42px;">操作</th>' +
    '</tr></thead>' +
    '<tbody></tbody></table>'
  );
}
// 构建 table tr
// 部分数据接口获取
function trHTML(key, item) {
  var c_price = COM_FN.mul(item.totalClassHour, item.classHourPrice); // 数据回显时好用
  var tmp_html = '';
  if (checkTsWeekType(item.ifWeek)) {
    tmp_html = '<option value="">无</option>';
  } else {
    tmp_html = '<option value="weekdays">周中</option><option value="weekend">周末</option>';
  }
  // 课程模式
  function createCoursePattern(item, list) {
    var tmp = '';
    for (var i = 0; i < list.length; i++) {
      var item_ = list[i];
      tmp += '<option value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>';
    }
    return (
      '<select class="cus-sel js-sel-pattern" name="pattern_' +
      item.courseStageCode +
      '">' +
      tmp +
      '</select>'
    );
  }
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
      item.totalClassHour +
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
      '<select name="week_' +
      item.courseStageCode +
      '" class="cus-sel js-sel-week">' +
      tmp_html +
      '</select>' +
      '</td>' +
      '<td><input type="text" class="cus-inp-h1 js-inp-hide-class" name="cc_' +
      item.courseStageCode +
      '" required="true"/><button type="button" class="btn btn-xs btn-primary js-btn-class" data-toggle="tooltip" data-placement="bottom">选班</button></td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-primary js-btn-discount">优惠</button>&nbsp;' +
      '<input type="text" name="cd_' +
      item.courseStageCode +
      '" ck-discount="0" class="input-sm cus-inp btn-inp js-money js-dy-discount" value="0" required readonly>' +
      '</td>' +
      '<td><input type="text" class="cus-inp js-price-discount js-money" value="' +
      c_price +
      '" readonly></td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-primary js-btn-books" data-toggle="tooltip" data-placement="bottom">教具</button>&nbsp;' +
      '<input type="text" name="cb_' +
      item.courseStageCode +
      '" ck-course-price="0" class="input-sm cus-inp btn-inp js-money js-dy-gooks" value="0" required readonly>' +
      '</td>' +
      '<td style="font-size:12px;">' +
      item.companyName +
      '</td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-warning js-tr-remove"><i class="glyphicon glyphicon-remove" ></i ></button > ' +
      '</td>' +
      '</tr>'
  ).data('sdata', item);
}
// 构建 联报
function lianbaoHTML() {
  return (
    '<div class="lian-wrp form-inline">' +
    '<div class="form-group form-group-sm">' +
    '<button type="button" class="btn btn-sm btn-primary js-btn-lb" data-toggle="tooltip" data-placement="bottom">联报优惠</button>' +
    '</div>' +
    '<div class="form-group form-group-sm">' +
    '<label>最大减免：</label>' +
    '<input type="text" class="form-control input-sm js-money js-lb-discount" value="0" readonly>' +
    '</div>' +
    '<div class="total pull-right form-group form-group-sm">' +
    '<label>小计：</label><input type="text" class="form-control input-sm js-money js-total-money" value="" readonly>' +
    '</div>' +
    '</div>'
  );
}
// 构建 报名课程 HTML
function CourseHTML(sArr, callback) {
  var tmp_obj = handleCourseData(sArr);
  // 方向
  $.each(tmp_obj.d, function (key, item) {
    if ($('#' + key).length) {
      return false;
    }

    var _lianbaoHTML = lianbaoHTML();

    SignClassHTML.append(
      '<div class="direction-item" id="' +
        key +
        '"><div class="dir-name">' +
        item.name +
        '</div>' +
        _lianbaoHTML +
        '</div>'
    );
  });
  // 课程
  $.each(tmp_obj.c, function (key, item) {
    if ($('#' + key).length) {
      return false;
    }

    var did = key.split('_')[0];
    var _tableHTML = tableHTML(key);

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

    var _trHTML = trHTML(strArr[2], item);

    $('#t_' + cid)
      .find('tbody')
      .append(_trHTML);
    // 添加完节点的回调
    callback && callback(cid, item);
  });
  // 特殊处理
  $('.js-money').number(true, 2);
  $('[data-toggle="tooltip"]').tooltip();
}
// 计算 价格=课时*单价
function js_classPrice($obj) {
  var class_hour = Number($obj.find('.js-dy-classHour').val());
  var class_price = Number($obj.find('.js-dy-price').val());

  var res = COM_FN.mul(class_hour, class_price);
  $obj.find('.js-price-course').val(res);
}
// 计算 折后金额=价格-优惠
function js_discountPrice($obj) {
  var class_total_price = Number($obj.find('.js-price-course').val());
  var discount_price = Number($obj.find('.js-dy-discount').val());

  var res = COM_FN.sub(class_total_price, discount_price);
  $obj.find('.js-price-discount').val(res);
}

function js_outstanding($tr) {
  var s_data = $tr.data('sdata');
  var discount_amount = Number($tr.find('.js-price-discount').val());
  var outstanding_amount = COM_FN.sub(discount_amount, s_data.totalPaymentAmount || 0);

  $tr.find('.js-dy-outstanding').val(outstanding_amount);
}
// 填写 优惠金额
function fillDiscount($obj_tr, $obj_dir, dis_price) {
  var tr_data = $obj_tr.data('sdata');
  var paramsDiscount = $obj_tr.data('params-discount') || [];
  var lb_data = $obj_dir.find('.js-btn-lb').data('sdata');

  var discount_price = sumDiscount(paramsDiscount, 'price');
  var discount_amount = discount_price;

  var t_obj = $obj_tr.find('.js-dy-discount');

  if (!$.isEmptyObject(lb_data)) {
    for (var i = 0; i < lb_data.list.length; i++) {
      var item = lb_data.list[i];
      if (tr_data.courseStageCode == item.courseStageCode) {
        discount_amount = COM_FN.add(discount_price, item.dismoney);
      }
    }
  }

  t_obj.attr('ck-discount', discount_amount).val(discount_amount);

  if (discount_amount && paramsDiscount.length) {
    t_obj.removeAttr('readonly');
  } else {
    t_obj.attr('readonly', true);
  }
}
// 清理 班级
function clearSelectClass($obj_tr) {
  $obj_tr.removeData('params-class');
  $obj_tr.find('.js-inp-hide-class').val('');
  $obj_tr.find('.js-btn-class').removeAttr('data-original-title');

  alterBtnStatus('clear', $obj_tr.find('.js-btn-class'), '选班');
}
// 修改 选班 教具 按钮
function alterBtnStatus(type, $btn, text) {
  if (type == 'add') {
    $btn.text('已选').addClass('btn-success');
  } else if (type == 'clear') {
    $btn.text(text).removeClass('btn-success');
  }
}
// 清理 优惠金额 该方向下的所有
function clearTrDiscount($obj_tr) {
  $obj_tr.removeData('params-discount');
}
// 暂时 弃用
function clearDiscount($obj) {
  var pp_dir = $obj.closest('.direction-item');
  // 清理 选班
  // $obj.removeData('params-class');
  // $obj.find('.js-inp-hide-class').val('');
  // $obj.find('.js-btn-class').removeAttr('data-original-title');
  // 清理 联报优惠
  pp_dir.find('.js-btn-lb').removeData('sdata').removeAttr('data-original-title');
  pp_dir.find('.js-lb-discount').val(0);
  // 清理所有 优惠
  pp_dir.find('.js-tr-item').each(function (key, item) {
    var t_ = $(this);

    t_.removeData('params-discount');
    t_.find('.js-dy-discount').val(0).attr({
      readonly: true,
      'ck-discount': 0
    });

    js_discountPrice(t_);
  });
  // 清理 付款方式
  clearPayInfo();
}
// 清理 优惠类型 empty
function clearDiscountEmpty($obj, $obj_dir) {
  var tr_data = $obj.data('sdata');
  var lb_data = $obj_dir.find('.js-btn-lb').data('sdata');
  var discount_amount = 0;

  if (!$.isEmptyObject(lb_data)) {
    for (var i = 0; i < lb_data.list.length; i++) {
      var item = lb_data.list[i];
      if (tr_data.courseStageCode == item.courseStageCode) {
        discount_amount = item.dismoney;
      }
    }
  }

  $obj
    .find('.js-dy-discount')
    .val(discount_amount)
    .attr('ck-discount', discount_amount)
    .attr('readonly', true);
}
// 清理 联报
function clearLBData($obj_dir) {
  // 清理 按钮数据 data
  $obj_dir.find('.js-btn-lb').removeData('sdata').removeAttr('data-original-title');
  $obj_dir.find('.js-lb-discount').val(0);
  // 恢复 方向原有优惠
  $obj_dir.find('.js-tr-item').each(function (key, item) {
    var t_tr = $(this);
    // var dis_data = t_tr.data('params-discount') || [];

    // var discount_price = sumDiscount(dis_data, 'price');
    fillDiscount(t_tr, $obj_dir);

    js_discountPrice(t_tr);

    js_outstanding(t_tr);
  });
}
// 清理贴息 request
function clearLoanCheckbox() {
  $('#interestIndex').hide();
  // var classHourRatio = sumClassHourRo();
  // $.get(CONTEXT_PATH + '/stuPay/getInterestIndex', {
  //   orgCoreCode: $('#orgCore_code').val(),
  //   classCode: '',
  //   classHourRatio: classHourRatio,
  // }).then(function (res) {
  //   if (res == 1) {
  //     $('#interestIndex').show();
  //   } else if (res == 0) {
  //     $('#interestIndex').hide();
  //     $('#loanIndex').iCheck('uncheck');
  //   }
  // }).fail(function (err) {})
}
// 清理 付款方式
function clearPayInfo() {
  $('#payMethod,#paymentMethod').val('');

  $('.js-pay-method,.js-pay2-method').removeClass('btn-success');
  $('.js-pay-method[data-type="FKFS02"]').removeData('sdata');

  $('#transferWrp').hide();
  $('#loanName,#loanCode').val('');

  $('#totalAmount,#discountAmount,#thisPaymentAmount').val(0);
}
// 汇总 优惠金额
function sumDiscount(list, key) {
  if (!list) {
    return 0;
  }
  var sum = 0;

  for (var i = 0; i < list.length; i++) {
    var item = list[i];

    sum = COM_FN.add(sum, item[key]);
  }

  return sum;
}
// 小计 传 choice-class
function xiaojiMoney($dir) {
  var p_discount = $dir.find('.js-price-discount');
  var sum = 0;

  p_discount.each(function (key, item) {
    var t_val = Number($(this).val());
    sum = COM_FN.add(sum, t_val);
  });

  $dir.find('.js-total-money').val(sum);
}
// 联报状态判断
function checkLB(list) {
  var sum = 0;

  $.each(list, function (key, item) {
    var baseCH = this.dataset.orgHour;
    var vale = this.value;

    sum += COM_FN.div(vale, baseCH);
  });

  return {
    sum: sum,
    res: sum >= 2
  };
}
// 构建 联报数据
function createLBData(list) {
  var arr = [];

  $.each(list, function (key, item) {
    var t_ = $(item);
    var data = t_.data('sdata');
    var discount_data = t_.data('params-discount');
    // var discount_amount = Number(t_.find('.js-dy-discount').val());
    var source_discount_amount = sumDiscount(discount_data, 'price');

    var dy_class_hour = Number(t_.find('.js-dy-classHour').val());
    var dy_class_price = Number(t_.find('.js-dy-price').val());
    var c_price = COM_FN.mul(dy_class_hour, dy_class_price);

    arr.push({
      courseStageCode: data.courseStageCode,
      discountAmount: source_discount_amount,
      totalAmount: c_price,
      classHour: dy_class_hour,
      classHourPrice: dy_class_price
    });
  });

  return arr;
}
// 生成 分摊定金HTML
function FMTrHTML($list, callback) {
  var html = [];
  var callback_ = {};

  if (callback) {
    for (var i = 0; i < callback.length; i++) {
      var item = callback[i];

      callback_['cs_' + item.courseStageCode] = item;
    }
  }

  $.each($list, function (key, item) {
    var t_ = $(this);
    var data = t_.data('sdata');
    var discount_after = Number(t_.find('.js-price-discount').val());

    var cb_val = callback_['cs_' + data.courseStageCode]
      ? callback_['cs_' + data.courseStageCode].fmPrice
      : '';

    html.push(
      '<tr><td>' +
        data.courseName +
        '</td><td>' +
        data.courseStageName +
        '</td><td><input type="text" class="input-sm form-control js-money" value="' +
        discount_after +
        '" readonly disabled /></td><td><input type="text" ck-discount="' +
        discount_after +
        '" data-code="' +
        data.courseStageCode +
        '" class="input-sm form-control js-money js-dy-fm" value="' +
        cb_val +
        '"/></td></tr>'
    );
  });

  return html;
}
// 总计应付金额
function sumTotalPayment() {
  var sum = 0;

  $('.js-price-discount').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());
    // console.log('1-', val, this.value);
    sum = COM_FN.add(sum, val);
  });

  $('#totalAmount').val(sum);
}

//计算课时比例
function sumClassHourRo() {
  var class_hour_dy = 0;
  var class_hour_hidden = 0;
  $('.js-dy-classHour').each(function (key, item) {
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var s_data = p_tr.data('sdata');
    class_hour_dy = COM_FN.add(class_hour_dy, Number(t_.val()));
    class_hour_hidden = COM_FN.add(class_hour_hidden, Number(s_data.classHour_hidden));
  });
  return Math.round((10.0 * class_hour_dy) / class_hour_hidden) / 10.0;
}

// 优惠金额
function sumTotalDiscount() {
  var sum = 0;

  $('.js-dy-discount').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());
    // console.log('2-', val, this.value);
    sum = COM_FN.add(sum, val);
  });

  $('#discountAmount').val(sum);
}
// 删除 tr-node
function removeSignupCourse($obj) {
  var p_class = $obj.closest('.class-item');
  var p_dir = $obj.closest('.direction-item');
  // 删除-阶段
  $obj.remove();
  // 删除-课程
  if (p_class.find('.js-tr-item').length == 0) {
    p_class.remove();
  }
  // 删除-方向
  if (p_dir.find('.class-item').length == 0) {
    p_dir.remove();
  }
}
// 处理定金相关
function getFrontMoney(code) {
  var s_data = $('.js-pay-method[data-type="FKFS02"]').data('sdata') || [];
  var res = '';

  for (var i = 0; i < s_data.length; i++) {
    var item = s_data[i];

    if (item.courseStageCode == code) {
      res = item.fmPrice;
      break;
    }
  }
  return res;
}
// 11.00 数据处理
function handleNum(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      if (/\.[0-9]{2}$/.test(value)) {
        obj[key] = Number(value);
      }
    }
  }

  return obj;
}
// 创建 提交用 阶段数据
function submitStageData(baseInfo, payInfo) {
  var arr = [];

  $('.direction-item').each(function (key, item) {
    var tmp_arr = [];
    var t_dir = $(item);
    var c_stage = t_dir.find('.js-tr-item');

    c_stage.each(function (key2, item2) {
      var t_ = $(item2);
      var s_data = t_.data();
      // console.log(t_, s_data)

      var tmp_obj = $.extend(
        true,
        {},
        s_data.sdata,
        s_data.paramsClass,
        s_data.paramsGooks,
        payInfo
      );
      tmp_obj.discountData = s_data.paramsDiscount || [];
      // 用户输入数据
      // tmp_obj.classHour_hidden = tmp_obj.totalClassHour;
      tmp_obj.classHour = Number(t_.find('.js-dy-classHour').val());
      // tmp_obj.classHourPrice_hidden = tmp_obj.classHourPrice;
      tmp_obj.classHourPrice = Number(t_.find('.js-dy-price').val());
      // 周 类型
      var week = t_.find('.js-sel-week').val();
      tmp_obj.week = week;
      tmp_obj.weekendType = week ? t_.find('.js-sel-week>option:selected').text() : '';
      // 额外数据 - base
      tmp_obj.informationCode = baseInfo.informationCode;
      tmp_obj.informationSource = baseInfo.informationSource;
      tmp_obj.informationChannel = baseInfo.informationChannel;
      tmp_obj.studentCode = baseInfo.studentCode;
      tmp_obj.orgCore = baseInfo.orgCore;
      tmp_obj.orgCoreCode = baseInfo.orgCoreCode;
      // pay
      var inp_discount = Number(t_.find('.js-price-discount').val());
      var tuition = COM_FN.sub(
        Number(t_.find('.js-price-course').val()),
        Number(t_.find('.js-dy-gooks').val())
      );
      var FM_data = getFrontMoney(tmp_obj.courseStageCode);
      /*tmp_obj.paymentMethod = payInfo.paymentMethod;
      tmp_obj.payMethod = payInfo.payMethod;
      tmp_obj.loanCode = payInfo.loanCode || '';
      tmp_obj.loanName = payInfo.loanName || '';
      tmp_obj.loanPeriods = payInfo.loanPeriods || '';
      tmp_obj.loanPeriodsCode = payInfo.loanPeriodsCode || '';
      tmp_obj.loanRate = payInfo.loanRate || '';
      tmp_obj.loanRateCode = payInfo.loanRateCode || '';
      tmp_obj.remark = payInfo.remark;*/
      // 学费
      tmp_obj.tuition = tuition;
      // 定金
      tmp_obj.thisPaymentAmount = tmp_obj.paymentMethod == 'FKFS02' ? FM_data : inp_discount;
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
      tmp_obj.classCode = s_data.paramsClass ? s_data.paramsClass.itemcode : '';
      tmp_obj.className = s_data.paramsClass ? s_data.paramsClass.itemname : '';
      // 教具
      tmp_obj.sellGoodsNum = 1;
      tmp_obj.teachingMaterialCost = Number(t_.find('.js-dy-gooks').val());
      //综报订单号
      tmp_obj.togetherStamp = '';
      tmp_obj.type = '';

      tmp_arr.push(tmp_obj);
    });

    arr.push(tmp_arr);
  });

  return arr;
}
// 缴费金额非零判断
function decideNo0() {
  var val = Number($('#thisPaymentAmount').val());

  if (val < 0) {
    COM_TOOLS.alert('本次缴费金额不能小于0，请填写正确金额。');
    return true;
  }
  return false;
}
// 获取已有的 .js-tr-item
function getDomTrItem() {
  var arr = [];

  SignClassHTML.find('.js-tr-item').each(function (item, key) {
    arr.push($(this).data('sdata'));
  });

  return arr;
}
// ts 过滤
function filterArr(arr1, arr2) {
  var _arr = [];
  var tmp = {};
  // arr1
  for (var i = 0; i < arr1.length; i++) {
    var item = arr1[i];
    if (tmp['a_' + item.courseStageCode] == null) {
      tmp['a_' + item.courseStageCode] = true;
      _arr.push(item);
    }
  }
  // arr2
  for (var i = 0; i < arr2.length; i++) {
    var item = arr2[i];
    if (tmp['a_' + item.courseStageCode] == null) {
      tmp['a_' + item.courseStageCode] = true;
      _arr.push(item);
    }
  }

  tmp = null;
  return _arr;
}
// 判断所有与已有合同主体不同问题
function checkCompanyCode(list) {
  // console.log('check-com', list)
  var _list = list || [];
  var tmp;

  for (var i = 0; i < _list.length; i++) {
    var item = _list[i];

    if (tmp == undefined) {
      tmp = item.companyCode;
    }
    if (tmp != item.companyCode) {
      return {
        res: false,
        item: _list[0]
      };
    }
  }

  return {
    res: true
  };
}

// event bind
$('#formSubmit').click(function () {
  if (!(baseValid.form() && courseStageValid.form() && payValid.form())) {
    COM_TOOLS.alert('请检查内容是否填写完整');
    return false;
  }

  if (decideNo0()) {
    return false;
  }

  // 确认提示
  COM_TOOLS.confirm('确认后，学员姓名等基本信息将无法更改，请确认！', function (idx) {
    // console.log(1)
    var base_info = COM_TOOLS.serializeObject('#baseInfo');
    var pay_info = handleNum(COM_TOOLS.serializeObject('#payInfo'));

    var res_sub = submitStageData(base_info, pay_info);

    console.log(base_info, pay_info, res_sub);
    // 图片凭证
    base_info.evidenceUrl = pay_info.evidenceUrl;
    var params = {
      signupMul: JSON.stringify(base_info),
      signupSubArr: JSON.stringify(res_sub)
    };
    // console.log(params);
    cumCloseWin(idx);
    COM_TOOLS.loadingShade.open();
    $.post(CONTEXT_PATH + '/newsignup/savaSignup', params)
      .then(function (res) {
        // console.log("SIGNUP_RES:" + res);
        COM_TOOLS.loadingShade.close();
        if (res.code == '0') {
          COM_TOOLS.alert(res.msg);
        } else if (res.code == '1') {
          COM_TOOLS.alert('报名成功');
          var pay_method = pay_info.payMethod;
          if (checkIfPayIndex(pay_method)) {
            cumParentWinModal(
              '支付信息',
              CONTEXT_PATH + '/newsignup/payIndex?togetherStamp=' + res.data[0].togetherStamp,
              {
                other: {
                  closeBtn: 0
                }
              }
            );
          }
          /*if(pay_method == "ZFFS02" || pay_method == "ZFFS03" || pay_method == "ZFFS04" ){				
					cumParentWinModal('支付信息', CONTEXT_PATH + '/newsignup/payIndex?togetherStamp=' + res.data[0].togetherStamp, {
						other: {
							closeBtn: 0
						}
					});
				}*/
          cumParentCallValue();
        } else {
          COM_TOOLS.alert('未知错误');
        }
      })
      .fail(function (err) {
        COM_TOOLS.loadingShade.close();
      });
  });
});

$('#formClose').click(function () {
  // cu
  cumParentCallValue();
});

$('#eventMain')
  .on('click', '#btnCenter', function () {
    // 中心
    cumParentWinModal(
      TEDU_MESSAGE.get('kcrm.basic.lable.class_center'),
      CONTEXT_PATH + '/center/toChooseCenter',
      {
        area: ['600px', '480px'],
        callid: 'orgCore',
        callback: {
          fn1: function (params) {
            console.log('--', params);
          }
        }
      }
    );

    // 修改时提示
    if (!$.isEmptyObject(cloneDTData)) {
      COM_TOOLS.confirm('修改中心，将导致已报课程清空', {
        closeBtn: 0,
        yes: function (index) {
          $('#signClassHTML').html('');
          cloneDTData = {};
          clearPayInfo();
          clearLoanCheckbox();
          cumCloseWin(index);
        }
      });
    }

    // dt_choice_class.setAjaxData(searchParemOBj_);
  })
  .on('change', '#orgCore', function () {
    // 中心 内容改变
    //signClassHTML.html('');
  })
  .on('click', '#btnCompany', function () {
    // 缴费主体
    cumParentWinModal(
      TEDU_MESSAGE.get('kcrm.consultation.lable.flzt'),
      CONTEXT_PATH + '/company/toChoosePage',
      {
        area: ['600px', '480px'],
        callid: 'payLegalSubjectName'
      }
    );
  })
  .on('click', '#choiceClassSearch', function () {
    searchParemOBj_['orgCoreCode'] = $('#orgCore_code').val();
    searchParemOBj_['classificationName'] = $.trim($('#courseDirection').val());
    searchParemOBj_['courseName'] = $.trim($('#courseName').val());

    dt_choice_class.setAjaxData(searchParemOBj_);
  })
  .on('click', '#choiceClassAdd', function () {
    // 添加 课程
    var choice_dt_data = dt_choice_class.getSelectRowsData();
    dt_choice_class.table.rows().deselect();

    // var _tmp = filterArr(choice_dt_data, getDomTrItem());
    // var check_res = checkCompanyCode(_tmp)
    // if (!check_res.res) {
    //   COM_TOOLS.alert('您选择的'+check_res.item.courseName+'[ '+ check_res.item.courseStageName +' ] 与其他课程的合同主体不一致，不能一起下单，请单独下单报名。')
    //   return false;
    // }

    // 获取差异的 dt_data
    var arr = checkDTData(choice_dt_data);
    console.log('check-arr-', arr);

    CourseHTML(arr, function (cid, item) {
      var p_dir = $('#d' + item.classificationCode);
      // 清理联报
      var lb_Data = p_dir.find('.js-btn-lb').data('sdata');
      if (!$.isEmptyObject(lb_Data)) {
        clearLBData(p_dir);
      }
      // 小计
      xiaojiMoney(p_dir);

      clearPayInfo();

      sumTotalPayment();
      sumTotalDiscount();
    });
  })
  .on('change', '.js-dy-classHour', function () {
    // 修改 课时
    // console.log('-课时-');
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var s_data = p_tr.data('sdata');
    var pp_dir = t_.closest('.direction-item');
    var dy_class_hour = Number(p_tr.find('.js-dy-classHour').val());
    var dy_class_hour_hidden = s_data.classHour_hidden;
    var week_type = p_tr.find('.js-sel-week').val();

    js_classPrice(p_tr);
    // clearDiscount(p_tr);
    //js_discountPrice(p_tr);
    clearTrDiscount(p_tr);
    clearLBData(pp_dir);
    xiaojiMoney(pp_dir);
    clearPayInfo();
    sumTotalPayment();
    sumTotalDiscount();
    clearLoanCheckbox();
  })
  .on('change', '.js-dy-price', function (evt) {
    // 单价
    // console.log('-单价-');
    var t_ = $(this);
    var p_tr = $(this).closest('.js-tr-item');
    var pp_dir = t_.closest('.direction-item');

    js_classPrice(p_tr);

    clearTrDiscount(p_tr);
    clearLBData(pp_dir);

    // js_discountPrice(p_tr);
    // js_outstanding(p_tr);

    xiaojiMoney(pp_dir);
    clearPayInfo();

    sumTotalPayment();
    sumTotalDiscount();
  })
  .on('change', '.js-sel-pattern', function () {
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');

    clearSelectClass(p_tr);
  })
  .on('change', '.js-sel-week', function () {
    // 周中/周末
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var pp_dir = t_.closest('.direction-item');

    clearSelectClass(p_tr);
    clearTrDiscount(p_tr);

    clearLBData(pp_dir);

    // clearDiscount(p_tr);
    //js_discountPrice(p_tr);
    xiaojiMoney(pp_dir);

    clearPayInfo();

    sumTotalPayment();
    sumTotalDiscount();
  })
  .on('click', '.js-btn-class', function () {
    // 选择班级
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var s_data = p_tr.data('sdata');

    var params = {
      orgCoreCode: $('#orgCore_code').val(),
      courseStageCode: s_data.courseStageCode,
      week: p_tr.find('.js-sel-week').val(),
      classClassify: p_tr.find('.js-sel-pattern').val(),
      isFilter: 'Y'
    };

    cumParentWinModal('选择班级', CONTEXT_PATH + '/class/toChoosePage?' + $.param(params), {
      area: ['800px', '600px'],
      callback: {
        'bm-fn': function (params) {
          alterBtnStatus('add', t_);

          p_tr.removeData('params-class').data('params-class', params);
          p_tr.find('.js-inp-hide-class').val(params.itemcode).trigger('focusout.validate');
          t_.attr('data-original-title', params.itemcode + '(' + (params.itemname || '') + ')');
        },
        empty: function () {
          alterBtnStatus('clear', t_, '选班');

          p_tr.removeData('params-class');
          p_tr.find('.js-inp-hide-class').val('');
          t_.removeAttr('data-original-title');
        }
      }
    });
  })
  .on('click', '.js-btn-discount', function () {
    // 选择优惠
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var s_data = p_tr.data('sdata');
    var pp_dir = t_.closest('.direction-item');
    var history_data = p_tr.data('params-discount') || [];

    var dy_class_hour = Number(p_tr.find('.js-dy-classHour').val());
    var dy_class_price = Number(p_tr.find('.js-dy-price').val());
    var class_price = Number(p_tr.find('.js-price-course').val());

    var week_type = p_tr.find('.js-sel-week').val();

    var params = {
      orderCode: '',
      orderType: s_data.orderStatus || '',
      informationCode: $('#informationCode').val(),
      informationChannel: $('#informationChannel').val(),
      informationSource: $('#informationSource').val(),
      studentCode: $('#studentCode').val(),
      orgCoreCode: $('#orgCore_code').val(),
      classificationCode: s_data.classificationCode,
      courseCode: s_data.courseCode,
      courseStageCode: s_data.courseStageCode,
      classHourRatio: COM_FN.div(dy_class_hour, s_data.classHour_hidden),
      weekendType: week_type,
      discountTermOfClassHour: dy_class_hour,
      discountTermOfMoney: class_price
    };

    cumParentWinModal(
      '优惠类型选择',
      CONTEXT_PATH + '/newsignup/signupNewDiscount?' + $.param(params),
      {
        callid: {
          classHour: dy_class_hour,
          price: dy_class_price,
          courseStageCode: s_data.courseStageCode,
          history: history_data
        },
        callback: {
          fn1: function (params) {
            if (params) {
              p_tr.removeData('params-discount').data('params-discount', params);

              // var discount_price = sumDiscount(params, 'price');
              // fillDiscount(p_tr, pp_dir, discount_price);
              clearLBData(pp_dir);

              // js_discountPrice(p_tr);
              xiaojiMoney(pp_dir);

              clearPayInfo();

              sumTotalPayment();
              sumTotalDiscount();
            }
          },
          empty: function () {
            p_tr.removeData('params-discount');
            // t_.removeAttr('data-original-title');
            // 清理 数据及状态 包括 联报优惠
            // clearDiscountEmpty(p_tr, pp_dir);
            clearLBData(pp_dir);

            // js_discountPrice(p_tr);
            xiaojiMoney(pp_dir);

            clearPayInfo();

            sumTotalPayment();
            sumTotalDiscount();
          }
        }
      }
    );
  })
  .on('change', '.js-dy-discount', function () {
    // 优惠金额
    var t_ = $(this);
    var p_tr = $(this).closest('.js-tr-item');
    var pp_dir = t_.closest('.direction-item');

    js_discountPrice(p_tr);
    js_outstanding(p_tr);

    xiaojiMoney(pp_dir);

    clearPayInfo();

    sumTotalPayment();
    sumTotalDiscount();
  })
  .on('click', '.js-btn-books', function () {
    // 选择教具
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var courseCode = p_tr.data('sdata')['courseCode'];
    var orgCoreCode = $('#orgCore_code').val();

    cumParentWinModal(
      '选择教具',
      CONTEXT_PATH +
        '/hourseGoods/toChoosePage?index=signup&hourseType=2&courseCode=' +
        courseCode +
        '&orgCoreCode=' +
        orgCoreCode,
      {
        area: ['800px', '600px'],
        callback: {
          fn1: function (params) {
            // console.log('books-', params);
            if (params) {
              alterBtnStatus('add', t_);

              p_tr.removeData('params-gooks').data('params-gooks', params);
              t_.attr('data-original-title', params.goodsName);

              t_.siblings('.js-dy-gooks')
                .val(params.retailPrice)
                .attr('ck-course-price', params.retailPrice);
              //.removeAttr('readonly');
            }
          },
          empty: function () {
            alterBtnStatus('clear', t_, '教具');
            var sData = p_tr.data('sdata');
            if (sData.goodsCode) {
              sData.goodsCode = '';
              sData.goodsName = '';
              sData.goodsList = { goodsName: '' };
              sData.goodsUnit = '';
              sData.hourseCode = '';
              sData.sellGoodsNum = 0;
              sData.teachingMaterialCost = 0;
            }

            p_tr.removeData('params-gooks');
            t_.removeAttr('data-original-title');
            t_.siblings('.js-dy-gooks').val(0).attr('ck-course-price', 0).attr('readonly', true);
          }
        }
      }
    );
  })
  .on('click', '.js-tr-remove', function () {
    // 删除记录
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var p_class = p_tr.closest('.choice-class');
    var p_dir = t_.closest('.direction-item');

    // cb 处理
    var s_data = p_tr.data('sdata');
    if (Number(s_data.totalPaymentAmount || 0)) {
      COM_TOOLS.alert('已付款，不能删除');
      return false;
    }

    COM_TOOLS.confirm('确定删除？', {
      closeBtn: 0,
      yes: function (index) {
        // 清除数据
        var s_data = p_tr.data('sdata');
        delete cloneDTData['cs_' + s_data.courseStageCode];
        // cb 处理
        if (s_data.orderCode) {
          DELETE_COURSE_ARR.push(s_data.orderCode);
        }

        // clearDiscount(p_tr);
        removeSignupCourse(p_tr);
        // 清理联报
        clearLBData(p_dir);

        xiaojiMoney(p_dir);

        clearPayInfo();

        sumTotalPayment();
        sumTotalDiscount();

        cumCloseWin(index);
      }
    });
  })
  .on('click', '.js-btn-lb', function () {
    // 联报
    var t_ = $(this);
    var p_dir = t_.closest('.direction-item');
    // 联报状态判断
    var res_lb = checkLB(p_dir.find('.js-dy-classHour'));
    if (res_lb.res) {
      var courseData = createLBData(p_dir.find('.js-tr-item'));

      var params = {
        orderCode: '',
        orderType: '',
        orgCoreCode: $('#orgCore_code').val(),
        classHourRatio: res_lb.sum,
        studentCode: $('#studentCode').val(),
        informationSource: $('#informationSource').val(),
        informationChannel: $('#informationChannel').val(),
        informationCode: $('#informationCode').val(),
        classificationCode: p_dir.attr('id').split('d')[1]
      };

      cumParentWinModal('联报优惠', CONTEXT_PATH + '/newsignup/signupNewMul?' + $.param(params), {
        callid: {
          courseList: courseData
        },
        callback: {
          fn1: function (params) {
            // console.log('lbyh-', params)
            t_.data('sdata', params).attr('data-original-title', params.item.name);

            var lb_discount = sumDiscount(params.list, 'dismoney');
            p_dir.find('.js-lb-discount').val(lb_discount);

            // 回填 阶段-优惠
            for (var i = 0; i < params.list.length; i++) {
              var item = params.list[i];
              var p_tr = $('#s' + item.courseStageCode);

              fillDiscount(p_tr, p_dir);

              // p_tr.find('.js-dy-discount').val(item.discountAmount).attr('ck-discount', item.discountAmount);
              js_discountPrice(p_tr);
              js_outstanding(p_tr);
            }
            xiaojiMoney(p_dir);

            clearPayInfo();

            sumTotalPayment();
            sumTotalDiscount();
          },
          empty: function () {
            t_.removeData('sdata').removeAttr('data-original-title');
            p_dir.find('.js-lb-discount').val(0);
            // 恢复各个优惠的价格
            p_dir.find('.js-tr-item').each(function (key, item) {
              var t_tr = $(this);
              // var discount_data = t_.data('params-discount') || [];

              // var discount_amount = sumDiscount(discount_data, 'price');
              //console.log('lb-clear',discount_amount)
              // t_.find('.js-dy-discount').val(discount_amount).attr('ck-discount', discount_amount);
              fillDiscount(t_tr, p_dir);

              js_discountPrice(t_tr);
              js_outstanding(t_tr);

              xiaojiMoney(p_dir);

              clearPayInfo();

              sumTotalPayment();
              sumTotalDiscount();
            });
          }
        }
      });
    } else {
      COM_TOOLS.alert('课时数>=两年才可选择');
    }
  })
  .on('click', '.js-pay-method', function (evt) {
    // 付款方式
    if ($.isEmptyObject(cloneDTData)) {
      COM_TOOLS.alert('请先添加课程');
      return false;
    }

    var pay_type = this.dataset.type;
    $('#paymentMethod').val(pay_type);
    $(this).addClass('btn-success').siblings('.btn').removeClass('btn-success');
    payValid.element('#paymentMethod');

    if (pay_type == 'FKFS01') {
      // 全款
      $('#thisPaymentAmount').val($('#totalAmount').val());
    } else if (pay_type == 'FKFS02') {
      // 定金
      $('#thisPaymentAmount').val(0);
      var sdata = $(this).data('sdata');

      $('#fm_tbody').html(FMTrHTML($('.js-tr-item'), sdata));

      FMBoxIdx = cumCurWinModal('分摊定金金额', $('#fronMoneyWrp'), '', {
        area: ['600px', '400px'],
        type: 1,
        success: function (layer) {
          $('#fm_tbody .js-money').number(true, 2);
          $('#fm_tbody').find('.js-dy-fm').trigger('change');
        },
        end: function () {
          $('#fm_tbody').html('');
          $('#totalFM').val('');
        }
      });
    }
  })
  .on('click', '.js-pay2-method', function () {
    // 支付方式
    if ($.isEmptyObject(cloneDTData)) {
      COM_TOOLS.alert('请先添加课程');
      return false;
    }

    var pay_type = this.dataset.type;
    $('#payMethod').val(pay_type);
    $(this).addClass('btn-success').siblings('.btn').removeClass('btn-success');
    payValid.element('#payMethod');

    $('#transferWrp').hide().find('.js-loan-elm').attr('disabled', true).tooltip('destroy');
    $('#certificate_wrp').hide().find('#evidenceText').tooltip('destroy');
    $('#evidenceText, #uploadEvidence_evidence, #evidenceUrl').val('');
    if (pay_type == 'ZFFS07') {
      // 百度 转账
      $('#transferWrp').show().find('.js-loan-elm').removeAttr('disabled');
      // 上传凭证
      $('#certificate_wrp').show();
    } else if (!checkIfPayIndex(pay_type)) {
      // 上传凭证
      $('#certificate_wrp').show();
    }
  })
  .on('change', '.js-sel-loan', function (evt) {
    // 贷款 期数/利率
    var t_ = $(this);
    var t_op_txt = t_.children('option:selected').text();
    t_.prev('.js-inp-loan').val(t_op_txt);
  })
  .on('click', '#ownUserBtn', function () {
    // 业绩归属人
    cumParentWinModal(
      '业绩归属人',
      CONTEXT_PATH +
        '/kcrmuser/chooseUser?roleCode=KCGW-ZXJL-XXTMK-CITYTMK&orgCore=' +
        encodeURI(encodeURI($('#orgCore').val())),
      {
        callid: 'ownUser'
      }
    );
  })
  .on('keypress', '#courseDirection', function (e) {
    if (e.keyCode === 13) {
      $('#choiceClassSearch').trigger('click');
    }
  })
  .on('keypress', '#courseName', function (e) {
    if (e.keyCode === 13) {
      $('#choiceClassSearch').trigger('click');
    }
  });
// eventMain_fm
$('#eventMain_fm')
  .on('blur', '.js-dy-fm', function () {
    // 定金 合计
    var sum = 0;
    $('.js-dy-fm').each(function (key, item) {
      var t_ = $(this);
      var val = Number(t_.val());

      sum = COM_FN.add(sum, val);
    });

    $('#totalFM').val(sum);
  })
  .on('click', '.js-btn-confirm', function () {
    // 定金确认
    if (!frontMoneyValid.form()) {
      return false;
    }
    var params = [];

    $('.js-dy-fm').each(function (key, item) {
      var t_ = $(this);
      // console.log(this.value);
      var val = Number(t_.val());
      var code = this.dataset.code;

      params.push({
        courseStageCode: code,
        fmPrice: val
      });
    });
    $('.js-pay-method[data-type="FKFS02"]').data('sdata', params);

    var total_fm = Number($('#totalFM').val());
    $('#thisPaymentAmount').val(total_fm);

    cumCloseWin(FMBoxIdx);
  });

//计算年龄
function calBirthDay() {
  var birthday = $('input[name="birthday"]').val();
  if (birthday != '') {
    var newDay = new Date();
    var newYear = newDay.getFullYear();
    var birthdayYear = birthday.split('-')[0];
    var age = newYear * 1 - birthdayYear * 1;
    $('#studentAge').val(age * 1 < 1 ? '' : age);
  }
}
//判断是否跳转支付页面
function checkIfPayIndex(payMethod) {
  var result = false;
  $.ajax({
    url: CONTEXT_PATH + '/newsignup/checkIfPayIndex',
    async: false,
    data: { hiddenValue: payMethod },
    success: function (res) {
      result = res;
    }
  });
  return result;
}

//回显数据触发
(function () {
  var sel2_cityCode = $('#cityCode');
  //console.log(sel2_cityCode)
  if (sel2_cityCode.val()) {
    sel2_cityCode.trigger('change');
  }
})();
$(function () {
  calBirthDay();
  $('input[name="birthday"]').change(function () {
    calBirthDay();
  });
});
