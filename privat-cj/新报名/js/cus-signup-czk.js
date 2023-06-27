// !version 20200318.200

// 常量
var DELETE_COURSE_ARR = [];
var FMBoxIdx = ''; // 定金弹窗
var SCBoxIdx = ''; // 选课弹窗
var SignClassHTML = $('#signClassHTML');
var SignCertificateHTML = $('#signCertificateHTML');
var SignOtherPayHTML = $('#signOtherPayHTML');
var SignRechargeCardHTML = $('#signRechargeCardHTML');
var SignTeachingHTML = $('#signTeachingHTML');
// 公共方法
var COM_FN = {
  /**
   * 加法
   */
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
  /**
   * 减法
   */
  sub: function (arg1, arg2) {
    return this.add(arg1, -Number(arg2), arguments[2]);
  },
  /**
   * 乘法
   */
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
  /**
   * 除法
   */
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

    return this.optional(element) || (value >= 0 && value <= params);
  },
  '不能超过最大值'
);
$.validator.addMethod(
  'ck-cus-card',
  function (value, element, params) {
    var reg_ = /^[^\u4e00-\u9fa5]+$/;
    return this.optional(element) || reg_.test(value);
  },
  '请输入正确的证件号'
);
$.validator.addMethod(
  'ck-cus-length',
  function (value, element, params) {
    return this.optional(element) || value.length <= 50;
  },
  '最多可以输入50个字符'
);

// instance
var baseValid = $('#baseInfo').validate();
var payValid = $('#payInfo').validate();
var courseStageValid = $('#signClassHTML').validate();
// 定金
var frontMoneyValid = $('#frontMoneyForm').validate();
var signCertificateValid = $('#signCertificateHTML').validate();
var signTeachingValid = $('#signTeachingHTML').validate();
// 省份 select2
var sel2_province = COM_TOOLS.select2_init('provinceCode');
sel2_province.changeCallback(function (e) {
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
var DT_instance_flag = true;
var cloneDTData = {};

var searchParemOBj_ = {
  ifBindGoodsFlag: true,
  orgCoreCode: $('#orgCore_code').val(),
  studentCodeIn: '',
  studentCodeNotIn: ''
};
var dt_choice_class = '';
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
// 构建 table tr
function courseTrHTML(key, item, type) {
  var c_price = COM_FN.mul(item.totalClassHour || item.classHour, item.classHourPrice); // 数据回显时好用
  // 课程模式
  function createCoursePattern(item, list) {
    var tmp = '';
    for (var i = 0; i < list.length; i++) {
      var item_ = list[i];
      if (type === 'edit' && item.coursePattern == item_.hiddenValue) {
        tmp +=
          '<option selected value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>';
      } else {
        tmp += '<option value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>';
      }
    }
    return (
      '<select class="cus-sel js-sel-pattern" name="pattern_' +
      item.courseStageCode +
      '">' +
      tmp +
      '</select>'
    );
  }
  // 周中/末
  var weekSelect = function (data) {
    var tmp_html = '';
    if (checkTsWeekType(data.ifWeek)) {
      tmp_html = '<option value="">无</option>';
    } else {
      tmp_html =
        '<option ' +
        (data.courseWeek == 'weekdays' ? 'selected' : '') +
        ' value="weekdays">周中</option>' +
        '<option ' +
        (data.courseWeek == 'weekend' ? 'selected' : '') +
        ' value="weekend">周末</option>';
    }
    return tmp_html;
  };
  var htmlStr = null;
  // 处理合同主体
  processNoCompanyCode(item);
  if (type === 'create') {
    htmlStr =
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
      weekSelect(item) +
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
      '</tr>';
    return $(htmlStr).data('sdata', item);
  } else if (type === 'edit') {
    // 处理 选班/优惠/教具 data 数据
    var paramsClass = {
      itemcode: item.classCode,
      itemname: item.className,
      classLxName: item.classLxName,
      teach: item.teach,
      fullNumber: item.fullNumber,
      actualNumber: item.actualNumber
    };
    var paramsDiscount = [];
    if (item.discountList.length) {
      paramsDiscount = item.discountList;
    }
    var paramsGooks = {};
    if (item.goodsCode) {
      paramsGooks = {
        goodsCode: item.goodsCode,
        goodsName: item.goodsName,
        goodsUnitCode: item.goodsUnit,
        goodsUnitName: item.goodsUnitName,
        hourseCode: item.hourseCode,
        teachingMaterialCost: item.teachingMaterialCost,
        sellGoodsNum: 1
      };
    }

    htmlStr =
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
      item.classHour +
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
      weekSelect(item) +
      '</select>' +
      '</td>' +
      '<td><input type="text" class="cus-inp-h1 js-inp-hide-class" name="cc_' +
      item.courseStageCode +
      '" required="true" value="' +
      item.classCode +
      '"/><button type="button" class="btn btn-xs btn-primary js-btn-class btn-success" data-toggle="tooltip" data-placement="bottom" title="' +
      (item.classCode + '(' + item.className + ')') +
      '">选班</button></td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-primary js-btn-discount">优惠</button>&nbsp;' +
      '<input type="text" name="cd_' +
      item.courseStageCode +
      '" ck-discount="' +
      (item.discountAmount || 0) +
      '" class="input-sm cus-inp btn-inp js-money js-dy-discount" value="' +
      (item.discountAmount || 0) +
      '" required readonly>' +
      '</td>' +
      '<td><input type="text" class="cus-inp js-price-discount js-money" value="' +
      item.totalAmount +
      '" readonly></td>' +
      '<td>' +
      '<button type="button" class="btn btn-xs btn-primary js-btn-books ' +
      (item.goodsCode ? 'btn-success' : '') +
      '" data-toggle="tooltip" data-placement="bottom" title="' +
      (item.goodsName || '') +
      '">教具</button>&nbsp;' +
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
      '<td>' +
      '<button type="button" class="btn btn-xs btn-warning js-tr-remove"><i class="glyphicon glyphicon-remove" ></i ></button > ' +
      '</td>' +
      '</tr>';
    return $(htmlStr)
      .data('sdata', item)
      .data('paramsClass', paramsClass)
      .data('paramsDiscount', paramsDiscount)
      .data('paramsGooks', paramsGooks);
  }
}
// 构建 报名课程 HTML
function createCourseHTML(sArr, callback, type) {
  var _type = type || 'create';
  var tmp_obj = handleCourseData(sArr);
  // 构建 table
  function courseTable(id) {
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
    var _tableHTML = courseTable(key);

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

    var _trHTML = courseTrHTML(strArr[2], item, _type);

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
// 判断贴息状态 request
// function clearLoanCheckbox() {
//   var classHourRatio = sumClassHourRo()
//
//   $.get(CONTEXT_PATH + '/stuPay/getInterestIndex', {
//     orgCoreCode: $('#orgCore_code').val(),
//     classCode: '',
//     classHourRatio: classHourRatio
//   })
//     .then(function(res) {
//       if (res == 1) {
//         setLoanCheckbox(true)
//       } else if (res == 0) {
//         setLoanCheckbox(false)
//       }
//     })
//     .fail(function(err) {})
// }
// 强制控制 贴息状态
function setLoanCheckbox(flag) {
  if (flag) {
    $('#interestIndex').show();
  } else {
    $('#interestIndex').hide();
    $('#loanIndex').iCheck('uncheck');
  }
}
// 清理 付款方式
function clearPayInfo(flag) {
  // 付款/支付
  $('#payMethod,#paymentMethod').val('');
  // 金额
  !flag && $('#totalAmount,#discountAmount').val(0);
  // 定金数据
  $('.js-pay-method[data-type="FKFS02"]').removeData('sdata');
  // 按钮去标记
  $('.js-pay-method,.js-pay2-method').removeClass('btn-success');
  // 转账 转账信息
  $('#transferWrp').hide();
  $('#loanName,#loanCode').val('');
  // 凭证
  $('#certificate_wrp').hide();
  $('#evidenceText,#evidenceUrl,#uploadEvidence_evidence').val('');
  $('#thisPaymentAmount').val(0).closest('.form-group').show();
  clearRechargeCardInfo();
}
// 清理
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
// 生成 定金其他内容 HTML
function FMOtherTrHTML() {
  var htmlStr = [];
  // 证书
  $.each(SignCertificateHTML.find('.js-tr-item'), function (i, item) {
    var t_ = $(this);
    var data = t_.data('sdata');
    htmlStr.push(
      '<tr><td>证书-' +
        data.certificateName +
        '</td><td class="js-s-amount">' +
        data.certificatePrice +
        '</td></tr>'
    );
  });

  // 教具
  $.each(SignTeachingHTML.find('.js-tr-item'), function (i, item) {
    var t_ = $(this);
    var data = t_.data('sdata');
    var sellPrice = t_.find('.js-sell-price').val();
    htmlStr.push(
      '<tr><td>教具-' + data.goodsName + '</td><td class="js-s-amount">' + sellPrice + '</td></tr>'
    );
  });

  // 其他
  $.each(SignOtherPayHTML.find('.js-tr-item'), function (i, item) {
    var t_ = $(this);
    var data = t_.data('sdata');
    htmlStr.push(
      '<tr><td>其他-' +
        data.paymentSecName +
        '</td><td class="js-s-amount">' +
        data.paymentPrice +
        '</td></tr>'
    );
  });

  return htmlStr;
}
// 生成 定金其他内容 金额
function FMOtherTrAmount() {
  var sum = 0;
  $('#other_fm_tbody')
    .find('.js-s-amount')
    .each(function (i, item) {
      var t_ = $(this);
      var val = t_.text();
      sum = COM_FN.add(sum, val);
    });
  return sum;
}
// 总计应付金额

function sumTotalPayment() {
  var sum = 0;
  // 所报课程的合计
  SignClassHTML.find('.js-price-discount').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());
    sum = COM_FN.add(sum, val);
  });
  // 证书
  SignCertificateHTML.find('.js-zs-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });
  // 教具
  SignTeachingHTML.find('.js-sell-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });
  // 其他缴费
  SignOtherPayHTML.find('.js-qt-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });
  // 充值卡
  SignRechargeCardHTML.find('.js-czk-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });

  $('#totalAmount').val(sum);
}
// 优惠金额
function sumTotalDiscount() {
  var sum = 0;

  SignClassHTML.find('.js-dy-discount').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());
    sum = COM_FN.add(sum, val);
  });

  $('#discountAmount').val(sum);
}
// 定金弹窗内的合计金额
function sumFrontMoney_box() {
  var sum = 0;
  $('#frontMoneyForm .js-dy-fm').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());

    sum = COM_FN.add(sum, val);
  });
  return sum;
}
// 定金+其他+证书+充值卡
function sumFrontMoney() {
  var sum = 0;

  $('#frontMoneyForm .js-dy-fm').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());
    sum = COM_FN.add(sum, val);
  });
  // 证书
  SignCertificateHTML.find('.js-zs-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });
  // 其他缴费
  SignOtherPayHTML.find('.js-qt-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });
  // 充值卡
  SignRechargeCardHTML.find('.js-czk-price').each(function (key, item) {
    var t_ = $(this);
    var val = t_.val().toString();
    sum = COM_FN.add(sum, val);
  });

  return sum;
}
// 定金=课程+其他所有
function sumFrontMoney_new() {
  var sum = 0;

  $('#frontMoneyForm .js-dy-fm').each(function (key, item) {
    var t_ = $(this);
    var val = Number(t_.val());
    sum = COM_FN.add(sum, val);
  });
  // 其他所有
  $('#other_fm_tbody .js-s-amount').each(function (key, item) {
    var t_ = $(this);
    var val = t_.text() * 1;
    sum = COM_FN.add(sum, val);
  });

  return sum;
}
//计算课时比例
function sumClassHourRo() {
  //var class_hour_dy = 0
  //var class_hour_hidden = 0
  var total_class_hour_ro = 0;
  var baseHTML;
  if (SignClassHTML.length > 0 && SignClassHTML.find('.js-tr-item').length > 0) {
    baseHTML = SignClassHTML;
  } else {
    baseHTML = $('#chargeCourseHtml');
  }
  baseHTML.find('.js-dy-classHour').each(function (key, item) {
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var s_data = p_tr.data('sdata');
    //class_hour_dy = COM_FN.add(class_hour_dy, Number(t_.val() || 0))
    //class_hour_hidden = COM_FN.add(class_hour_hidden, Number(s_data.classHour_hidden || 0))
    var class_hour_ro = 0;
    var class_hour_dy = Number(t_.val() || 0);
    var class_hour_hidden = Number(s_data.classHour_hidden || 0);
    if (class_hour_hidden != 0) {
      class_hour_ro = Math.round((10.0 * class_hour_dy) / class_hour_hidden) / 10.0;
    }
    total_class_hour_ro = COM_FN.add(total_class_hour_ro, class_hour_ro);
  });
  return total_class_hour_ro;
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

  $('#signClassHTML .direction-item').each(function (key, item) {
    var tmp_arr = [];
    var t_dir = $(item);
    var c_stage = t_dir.find('.js-tr-item');

    c_stage.each(function (key2, item2) {
      var t_ = $(item2);
      var s_data = t_.data();

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
// 缴费金额非零判断 及 总计应付金额非0
function decideNo0() {
  var val = Number($('#thisPaymentAmount').val());
  var totalVal = Number($('#totalAmount').val());

  if (val < 0) {
    COM_TOOLS.alert('本次缴费金额不能小于0，请填写正确金额。');
    return true;
  } else if (totalVal != 0 && val <= 0) {
    COM_TOOLS.alert('总计应付金额非0，本次缴费金额不能为0，请填写正确金额。');
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
// !200319新增
// 构建 证书 HTML
function createCertificateHTML(list, tarDom, type) {
  var _type = type || 'create';
  var trHTML = function (row) {
    var htztName = $('#payLegalSubjectName').val() || '--';
    var htmlStr = null;
    if (_type === 'create') {
      htmlStr =
        '<tr id="zs_' +
        row.itemid +
        '" class="js-tr-item">' +
        '<td>' +
        row.certificateName +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-zs-price" readonly value="' +
        row.certificatePrice +
        '" /></td>' +
        '<td><select name="zs_id_type_' +
        row.itemid +
        '" class="cus-sel js-zs-id-type" required><option selected value="ZJLB001">身份证</option></select></td>' +
        '<td><input name="zs_id_course_' +
        row.itemid +
        '" type="text" class="input-sm cus-inp js-zs-id-num" required ck-cus-card="true" ck-cus-length="true" /></td>' +
        '<td><button type="button" class="btn btn-xs btn-primary js-zs-btn-course">选课</button><input type="text" class="input-sm cus-inp js-zs-course" style="width: auto; margin-left: 4px;" name="zs_id_num_' +
        row.itemid +
        '" readonly required ></td>' +
        '<td>' +
        row.certificateClassificationName +
        '</td>' +
        '<td>' +
        row.certificateLevelName +
        '</td>' +
        '<td>' +
        htztName +
        '</td>' +
        '<td><button type="button" class="btn btn-xs btn-warning js-tr-remove-zs"><i class="glyphicon glyphicon-remove"></i></button></td>' +
        '</tr>';
    } else if (_type === 'edit') {
      htmlStr =
        '<tr id="zs_' +
        row.id +
        '" class="js-tr-item">' +
        '<td>' +
        row.certificateName +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-zs-price" readonly value="' +
        row.certificatePrice +
        '" /></td>' +
        '<td><select name="zs_id_type_' +
        row.id +
        '" class="cus-sel js-zs-id-type" required><option selected value="ZJLB001">身份证</option></select></td>' +
        '<td><input name="zs_id_course_' +
        row.id +
        '" type="text" class="input-sm cus-inp js-zs-id-num" required ck-cus-card="true" ck-cus-length="true"/></td>' +
        '<td><button type="button" class="btn btn-xs btn-primary js-zs-btn-course">选课</button><input type="text" required class="input-sm cus-inp js-zs-course" style="width: auto; margin-left: 4px;" name="zs_id_num_' +
        row.id +
        '" value="' +
        row.courseName +
        '" readonly required ></td>' +
        '<td>' +
        row.certificateClassificationName +
        '</td>' +
        '<td>' +
        row.certificateLevelName +
        '</td>' +
        '<td>' +
        htztName +
        '</td>' +
        '<td><button type="button" class="btn btn-xs btn-warning js-tr-remove-zs"><i class="glyphicon glyphicon-remove"></i></button></td>' +
        '</tr>';
    }
    return $(htmlStr).data('sdata', row);
  };
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">证书申请</div><div class="class-item js-table-wrp"></div></div>';
  var tableHTML =
    '<table id="js_table_zs" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%"><thead><tr>' +
    '<th>证书名称</th>' +
    '<th style="width: 100px;">价格</th>' +
    '<th style="width: 100px;">证件类型</th>' +
    '<th style="width: 150px;">证件编码</th>' +
    '<th style="width: 190px;">课程</th>' +
    '<th>证书类型</th>' +
    '<th>证书级别</th>' +
    '<th>合同主体</th>' +
    '<th style="width: 42px">操作</th>' +
    '</tr></thead>' +
    '<tbody></tbody></table>';

  list.forEach(function (row) {
    var tbNode = $('#js_table_zs');

    if (!tbNode.length) {
      tarDom.html(outWrpHTML);
      tarDom.find('.js-table-wrp').html(tableHTML);
      $('#js_table_zs').append(trHTML(row));
    } else {
      if (!tbNode.find('#zs_' + row.itemid).length) {
        tbNode.append(trHTML(row));
      } else {
        // todo 提示信息
      }
    }
  });
  $('.js-money').number(true, 2);
}
// 构建 其他缴费 HTML
function createOtherPayHTML(list, tarDom, type) {
  var _type = type || 'create';
  var trHTML = function (row) {
    var htztName = $('#payLegalSubjectName').val() || '--';
    if (_type === 'edit') {
      row.paymentPrice = row.retailPrice = row.thisPaymentAmount;
    }
    return $(
      '<tr class="js-tr-item">' +
        '<td>' +
        row.paymentName +
        '</td>' +
        '<td>' +
        row.paymentSecName +
        (row.paymentThrName ? '-' + row.paymentThrName : '') +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-qt-price" value="' +
        row.paymentPrice +
        '" readonly/></td>' +
        '<td>' +
        (row.goodsName || '--') +
        '</td>' +
        '<td>' +
        (row.sellGoodsNum || '--') +
        '</td>' +
        '<td>' +
        htztName +
        '</td>' +
        '<td><button type="button" class="btn btn-xs btn-warning js-tr-remove-qt"><i class="glyphicon glyphicon-remove"></i></button></td>' +
        '</tr>'
    ).data('sdata', row);
  };
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">其他缴费</div><div class="class-item js-table-wrp"></div></div>';
  var tableHTML =
    '<table id="js_table_qt" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%"><thead><tr>' +
    '<th>缴费类型</th>' +
    '<th>子类型</th>' +
    '<th style="width: 100px;">价格</th>' +
    '<th>商品</th>' +
    '<th style="width: 100px;">数量</th>' +
    '<th>合同主体</th>' +
    '<th style="width: 42px">操作</th>' +
    '</tr></thead>' +
    '<tbody></tbody></table>';

  list.forEach(function (row) {
    var tbNode = $('#js_table_qt');

    if (!tbNode.length) {
      tarDom.html(outWrpHTML);
      tarDom.find('.js-table-wrp').html(tableHTML);
      $('#js_table_qt').append(trHTML(row));
    } else {
      tbNode.append(trHTML(row));
    }
  });
  $('.js-money').number(true, 2);
}
// 构建 充值卡 HTML
function createRechargeCardHTML(list) {
  var trHTML = function (row) {
    var htztName = $('#payLegalSubjectName').val();

    return $(
      '<tr class="js-tr-item">' +
        '<td>' +
        row.cardTypeName +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-czk-amount" value="' +
        row.cardAmount +
        '" readonly/></td>' +
        '<td>' +
        row.giftName +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-czk-price" value="' +
        row.thisPaymentAmount +
        '" readonly/></td>' +
        '<td>' +
        htztName +
        '</td>' +
        '<td><button type="button" class="btn btn-xs btn-warning js-tr-remove-czk"><i class="glyphicon glyphicon-remove"></i></button></td>' +
        '</tr>'
    ).data('sdata', row);
  };
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">购买充值卡</div><div class="class-item js-table-wrp"></div></div>';
  var tableHTML =
    '<table id="js_table_czk" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%"><thead><tr>' +
    '<th>充值卡名称</th>' +
    '<th style="width: 120px;">面额</th>' +
    '<th>礼品</th>' +
    '<th style="width: 120px;">本次缴费</th>' +
    '<th>合同主体</th>' +
    '<th style="width: 42px">操作</th>' +
    '</tr></thead>' +
    '<tbody></tbody></table>';

  list.forEach(function (row) {
    var tbNode = $('#js_table_czk');

    if (!tbNode.length) {
      SignRechargeCardHTML.html(outWrpHTML);
      SignRechargeCardHTML.find('.js-table-wrp').html(tableHTML);
      $('#js_table_czk').append(trHTML(row));
    } else {
      tbNode.append(trHTML(row));
    }
  });
  $('.js-money').number(true, 2);
}
// 构建 教具 html
function createTeachingHTML(list, tarDom, type) {
  var _type = type || 'create';
  // 二级缴费类型
  var selectList = function (val) {
    var tmp = [];
    if (teachingSecTypeList.length) {
      for (var i = 0; i < teachingSecTypeList.length; i++) {
        var item = teachingSecTypeList[i];
        if (val == item.hiddenValue) {
          tmp.push(
            '<option value="' + item.hiddenValue + '" selected>' + item.viewValue + '</option>'
          );
        } else {
          tmp.push('<option value="' + item.hiddenValue + '">' + item.viewValue + '</option>');
        }
      }
    }
    return tmp.join('');
  };

  var trHTML = function (row) {
    var htmlStr = null;
    if (_type === 'create') {
      htmlStr =
        '<tr class="js-tr-item">' +
        '<td>' +
        row.goodsName +
        '</td>' +
        '<td><select class="cus-sel js-sec-type" name="g_tye_' +
        row.goodsCode +
        '">' +
        selectList() +
        '</select></td>' +
        '<td>' +
        row.goodsUnitName +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-goods-num" name="g_num_' +
        row.goodsCode +
        '" min="1" digits="true" value="' +
        (row.sellGoodsNum || 1) +
        '"/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-suggest-price" value="' +
        row.retailPrice +
        '" readonly/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-min-price" value="' +
        (row.minRetailPrice || row.retailPrice) +
        '" readonly/></td>' +
        '<td><button type="button" class="btn btn-xs btn-primary js-btn-discount-teach">优惠</button><input type="text" style="width: calc(100% - 38px)"  class="input-sm cus-inp js-money js-discount-price" value="0" readonly/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-mg-discount" value="0" readonly/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-sell-price" name="g_price_' +
        row.goodsCode +
        '" ck-course-price="' +
        (row.minRetailPrice || row.retailPrice) +
        '" value="' +
        row.retailPrice +
        '"/></td>' +
        '<td><button type="button" class="btn btn-xs btn-warning js-tr-remove-teach"><i class="glyphicon glyphicon-remove"></i></button></td>' +
        '</tr>';
    } else if (_type === 'edit') {
      // 优惠金额处理
      var minPrice = COM_FN.mul(row.sellGoodsNum, row.minRetailPrice || row.retailPrice);
      var tmp = COM_FN.sub(minPrice, COM_FN.add(row.specialsDis, row.fullEveryDis));
      var minPriceByDiscount = tmp > 0 ? tmp : 0;
      htmlStr =
        '<tr class="js-tr-item">' +
        '<td>' +
        row.goodsName +
        '</td>' +
        '<td><select class="cus-sel js-sec-type" name="g_tye_' +
        row.goodsCode +
        '">' +
        selectList(row.paymentSecType) +
        '</select></td>' +
        '<td>' +
        row.goodsUnitName +
        '</td>' +
        '<td><input type="text" class="input-sm cus-inp js-goods-num" name="g_num_' +
        row.goodsCode +
        '" min="1" digits="true" value="' +
        (row.sellGoodsNum || 1) +
        '"/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-suggest-price" value="' +
        COM_FN.mul(row.sellGoodsNum, row.retailPrice) +
        '" readonly/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-min-price" value="' +
        minPrice +
        '" readonly/></td>' +
        '<td><button type="button" class="btn btn-xs btn-primary js-btn-discount-teach">优惠</button><input type="text" style="width: calc(100% - 38px)"  class="input-sm cus-inp js-money js-discount-price" value="' +
        row.specialsDis +
        '" readonly/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-mg-discount" value="' +
        row.fullEveryDis +
        '" readonly/></td>' +
        '<td><input type="text" class="input-sm cus-inp js-money js-sell-price" name="g_price_' +
        row.goodsCode +
        '" ck-course-price="' +
        minPriceByDiscount +
        '" value="' +
        row.thisPaymentAmount +
        '"/></td>' +
        '<td><button type="button" class="btn btn-xs btn-warning js-tr-remove-teach"><i class="glyphicon glyphicon-remove"></i></button></td>' +
        '</tr>';
    }

    return $(htmlStr).data('sdata', row);
  };
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">购买教具</div><div class="class-item js-table-wrp"></div><div class="lian-wrp form-inline clearfix"><div class="form-group form-group-sm"><label class="checkbox-inline"><input class="js-dis-mjmg" type="checkbox" value="1">使用满购优惠</label></div><div class="form-group form-group-sm js-mjmg-cont"></div><div class="total pull-right form-group form-group-sm"><label>合计：</label><input type="text" class="form-control input-sm js-money js-total-money" readonly></div></div></div>';

  var tableHTML =
    '<table id="js_table_teaching" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%"><thead><tr>' +
    '<th>商品名称</th>' +
    '<th style="width: 100px;">类型</th>' +
    '<th style="width: 42px;">单位</th>' +
    '<th style="width: 60px;">数量</th>' +
    '<th style="width: 100px;">建议零售价</th>' +
    '<th style="width: 100px;">最低售价</th>' +
    '<th style="width: 150px">特殊优惠</th>' +
    '<th style="width: 130px">满购优惠金额</th>' +
    '<th style="width: 100px">小计</th>' +
    '<th style="width: 42px">操作</th>' +
    '</tr></thead>' +
    '<tbody></tbody></table>';

  list.forEach(function (row) {
    var tbNode = $('#js_table_teaching');

    if (!tbNode.length) {
      tarDom.html(outWrpHTML);
      tarDom.find('.js-table-wrp').html(tableHTML);
      $('#js_table_teaching').append(trHTML(row));
    } else {
      tbNode.append(trHTML(row));
    }
  });
  $('.js-money').number(true, 2);
}

// 构建 submit data 证书
function processSubDataCertificate(payInfo) {
  var tmp = [];
  var _payMethod = $('#payMethod').val();

  $.each(SignCertificateHTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item);
    var sData = t_.data('sdata');
    var typeOfID = t_.find('.js-zs-id-type').val();
    var IDCard = t_.find('.js-zs-id-num').val();

    tmp.push({
      payMethod: _payMethod,
      thisPaymentAmount: sData.certificatePrice,
      typeOfID: typeOfID,
      IDCard: IDCard,
      certificateName: sData.certificateName,
      certificateCode: sData.certificateCode,
      certificateClassificationName: sData.certificateClassificationName,
      certificateClassification: sData.certificateClassification,
      certificateLevelName: sData.certificateLevelName,
      certificateLevel: sData.certificateLevel,
      certificatePrice: sData.certificatePrice,
      courseName: sData.courseName,
      courseCode: sData.courseCode,
      evidenceUrl: payInfo.evidenceUrl
    });
  });
  return tmp;
}
// 构建 submit data 教具
function processSubDataTeaching(payInfo) {
  var tmp = [];
  var _payMethod = $('#payMethod').val();

  $.each(SignTeachingHTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item);
    var sData = t_.data('sdata');
    var _sellGoodsNum = t_.find('.js-goods-num').val();
    var _thisPaymentAmount = t_.find('.js-sell-price').val();
    var _secType = t_.find('.js-sec-type').val();

    tmp.push({
      payMethod: _payMethod,
      thisPaymentAmount: _thisPaymentAmount, // 实际缴费
      paymentType: 'JFLX09', // 缴费类型
      paymentSecType: _secType, // 子类型
      goodsName: sData.goodsName,
      goodsCode: sData.goodsCode,
      hourseCode: sData.hourseCode, // 仓库
      goodsUnit: sData.goodsUnit,
      retailPrice: sData.retailPrice, // 单价
      minRetailPrice: sData.minRetailPrice,
      sellGoodsNum: _sellGoodsNum,
      evidenceUrl: payInfo.evidenceUrl
    });
  });
  return tmp;
}
// 构建 submit data 其他缴费
function processSubDataOtherPay(payInfo) {
  var tmp = [];
  var _payMethod = $('#payMethod').val();

  $.each(SignOtherPayHTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item);
    var sData = t_.data('sdata');

    tmp.push({
      payMethod: _payMethod,
      thisPaymentAmount: sData.paymentPrice, // 实际缴费
      paymentType: sData.paymentType, // 缴费类型
      paymentSecType: sData.paymentSecType, // 子类型
      paymentThrType: sData.paymentThrType, // 三级类型
      goodsName: sData.goodsName,
      goodsCode: sData.goodsCode,
      hourseCode: sData.hourseCode, // 仓库
      goodsUnit: sData.goodsUnit,
      retailPrice: sData.retailPrice, // 单价
      minRetailPrice: '',
      sellGoodsNum: sData.sellGoodsNum,
      evidenceUrl: payInfo.evidenceUrl
    });
  });
  return tmp;
}
// 构建 submit data 充值卡
function processSubDataRechargeCard(payInfo) {
  var tmp = [];
  var _payMethod = $('#payMethod').val();

  $.each(SignRechargeCardHTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item);
    var sData = t_.data('sdata');

    tmp.push({
      payMethod: _payMethod,
      thisPaymentAmount: sData.thisPaymentAmount,
      paymentType: 'JFLX07',
      paymentSecType: 'JFLX0704',
      cardId: sData.card_type,
      giftName: sData.giftName,
      receiveName: sData.receiveName,
      receivePhone: sData.receivePhone,
      receiveAddress: sData.receiveAddress,
      remark: sData.remark,
      evidenceUrl: payInfo.evidenceUrl
    });
  });
  return tmp;
}
// 跳到制定位置
function toTargetStep(stepNum, type) {
  if (type === 'last') {
    stepNum -= 2;
  } else if (type === 'next') {
    stepNum;
  }
  // 修改标题
  var stepTitle = $('.step-show');
  stepTitle.removeClass('active');
  stepTitle.eq(stepNum).addClass('active');
  // 滚动位置
  var top = $('.js-step-wrp').eq(stepNum).position().top;
  $('html').animate({ scrollTop: top - 60 });
  // 开关 按钮
  if (stepNum == 0) {
    $('.js-btn-step[data-step="last"]').prop('disabled', true);
  } else if (stepNum == 1) {
    $('.js-btn-step').prop('disabled', false);
  } else if (stepNum == 2) {
    $('.js-btn-step[data-step="next"]').prop('disabled', true);
  }
  // 遮罩
  var lock = $('.lock-box-wrp');
  lock.addClass('disabled');
  lock.eq(stepNum).removeClass('disabled');
}
// 获取课程信息用于判断是否可用充值卡
function classInfoByCard() {
  var tmp = [];

  var tar = null;
  var tar1 = SignClassHTML.find('.js-tr-item');
  var tar2 = $('#chargeCourseHtml').find('.js-tr-item');

  tar = tar1.length ? tar1 : tar2;

  tar.each(function (key, item) {
    var t_ = $(this);
    var sData = t_.data('sdata');

    tmp.push({
      courseCode: sData.courseCode,
      courseStageCode: sData.courseStageCode,
      courseClassifyCode: sData.classificationCode
    });
  });

  return tmp;
}
// 获取其他缴费信息用于判断是否可用充值卡
function otherPayInfoByCard() {
  var tmp = [];
  SignOtherPayHTML.find('.js-tr-item').each(function () {
    var t_ = $(this);
    var sData = t_.data('sdata');

    tmp.push({
      paymentType: sData.paymentType,
      paymentSecType: sData.paymentSecType
    });
  });
  return tmp;
}
// 获取教具信息用于判断是否可用充值卡
function teachingInfoByCard() {
  var tmp = [];
  SignTeachingHTML.find('.js-tr-item').each(function () {
    var t_ = $(this);
    var sData = t_.data('sdata');

    tmp.push({
      paymentType: sData.paymentType,
      paymentSecType: sData.paymentSecType
    });
  });
  return tmp;
}

// 清理-充值卡相关信息
function clearRechargeCardInfo() {
  var node = $('#js_rechargeCard_wrp');
  node.hide();
  node.find('.js-czk-info').val('');
  node.removeData('card_info');
}
// ts 获取 课程/证书/教具/其他 单条记录计算优惠，在计算合计
function tsClassOrCertificateDiscount(totalAmount, disRatio, balanceDis) {
  // 比较可用的优惠金额
  function compareValue(balanceDis2, val) {
    var tmp = null;
    if (balanceDis2 > val) {
      tmp = val;
      balanceDis = COM_FN.sub(balanceDis2, val);
    } else {
      tmp = balanceDis2;
      balanceDis = 0;
    }
    return tmp;
  }
  // 计算 课程/证书/教具/其他 对应的优惠后金额
  var itemByCardDiscount = function (type, totalAmount, opts) {
    opts = opts || { dom: '', domItem: '', dataKey: '' };
    $.each(opts['dom'].find('.js-tr-item'), function (key, item) {
      var t_ = $(item);
      var thisPaymentAmount = null;
      if (type === 'dom') {
        thisPaymentAmount = Number(t_.find(opts['domItem']).val());
      } else if (type === 'data') {
        var sData = t_.data('sdata');
        thisPaymentAmount = sData[opts.dataKey];
      }
      var c_balanceDis = getGoodsByCardRatioAmount(thisPaymentAmount, disRatio);

      totalAmount = COM_FN.sub(totalAmount, compareValue(balanceDis, c_balanceDis));
    });
    return totalAmount;
  };
  // 付款方式 全款/定金
  var paymentMethod = $('#paymentMethod').val();

  if (paymentMethod == 'FKFS01') {
    // 全款 课程
    totalAmount = itemByCardDiscount('dom', totalAmount, {
      dom: SignClassHTML,
      domItem: '.js-price-discount'
    });
  } else if (paymentMethod == 'FKFS02') {
    // 定金弹窗
    var fmData = $('.js-pay-method[data-type="FKFS02"]').data('sdata') || [];
    if (fmData.length) {
      fmData.forEach(function (item) {
        var fmVal = item.fmPrice;
        var c_balanceDis = getGoodsByCardRatioAmount(fmVal, disRatio);

        totalAmount = COM_FN.sub(totalAmount, compareValue(balanceDis, c_balanceDis));
      });
    }
  }

  // 证书
  totalAmount = itemByCardDiscount('data', totalAmount, {
    dom: SignCertificateHTML,
    dataKey: 'certificatePrice'
  });
  // 教具
  totalAmount = itemByCardDiscount('dom', totalAmount, {
    dom: SignTeachingHTML,
    domItem: '.js-sell-price'
  });
  // 其他
  totalAmount = itemByCardDiscount('data', totalAmount, {
    dom: SignOtherPayHTML,
    dataKey: 'paymentPrice'
  });
  return totalAmount;
}
// 续费补缴页面使用
function tsClassOrCertificateDiscount_bj(totalAmount, disRatio, balanceDis) {
  function compareValue(balanceDis2, val) {
    var tmp = null;
    if (balanceDis2 > val) {
      tmp = val;
      balanceDis = COM_FN.sub(balanceDis2, val);
    } else {
      tmp = balanceDis2;
      balanceDis = 0;
    }
    return tmp;
  }
  $('#chargeCourseHtml .js-tr-item').each(function (key, item) {
    var t_ = $(this);
    // var sData = t_.data('sdata')
    var val = t_.find('.js-supplementary').val() * 1;
    var c_balanceDis = getGoodsByCardRatioAmount(val, disRatio);

    totalAmount = COM_FN.sub(totalAmount, compareValue(balanceDis, c_balanceDis));
  });
  return totalAmount;
}
// 计算使用充值卡后，本次实际缴费金额
function showRechargeCardInfo(info) {
  var thisPaymentAmount = $('#thisPaymentAmount').val();
  if (location.href.indexOf('payAginIndex') != -1) {
    var actualPayAmount = tsClassOrCertificateDiscount_bj(
      thisPaymentAmount,
      info.disRatio,
      info.balanceDis
    );
  } else {
    var actualPayAmount = tsClassOrCertificateDiscount(
      thisPaymentAmount,
      info.disRatio,
      info.balanceDis
    );
  }

  $('#thisRechargeCardName').val(info.cardName);
  $('#thisRechargeCardAmount').val(thisPaymentAmount);
  $('#thisPaymentAmountByCardDisconut').val(actualPayAmount);
  $('#js_rechargeCard_wrp').show();
  $('#thisPaymentAmount').closest('.form-group').hide();
}
// 处理-充值卡相关信息
function processRechargeCardInfo(sData) {
  var ratio = COM_FN.div(sData.payAmount, sData.cardAmount);

  return {
    id: sData.id,
    cardName: sData.cardName,
    balanceDis: COM_FN.sub(sData.avaliableAmount, sData.avaliablePayAmount),
    ratio: ratio,
    disRatio: COM_FN.sub(1, ratio)
  };
}
// 计算-对应商品按照充值卡优惠比，所有优惠的金额；四舍五入取整
function getGoodsByCardRatioAmount(thisPaymentAmount, ratio) {
  // return Math.round(thisPaymentAmount * ratio)
  return Math.ceil(thisPaymentAmount * ratio);
}
// 校验充值卡面值是否充足，
function checkRechargeCardAmount(num) {
  var curAmount = $('#thisPaymentAmount').val() * 1;
  return num * 1 >= curAmount;
}
// 追加充值卡对课程/证书相关字段
function addRechargeCardInfo(list, cardInfo) {
  var balanceDis = cardInfo.balanceDis;

  list.forEach(function (item) {
    var t_discountAmount = getGoodsByCardRatioAmount(item.thisPaymentAmount, cardInfo.disRatio);
    // 当计算的商品对应的卡优惠金额 > 卡剩余优惠金额，替换掉
    if (balanceDis >= t_discountAmount) {
      // balanceDis -= t_discountAmount
      balanceDis = COM_FN.sub(balanceDis, t_discountAmount);
    } else {
      t_discountAmount = balanceDis;
    }

    item.inforCardId = cardInfo.id; // 卡号
    item.useCardAmount = item.thisPaymentAmount; // 使用面值
    item.cardDisAmount = t_discountAmount; // 卡优惠金额
  });
}
// ts 追加充值卡对课程/证书相关字段
function addRechargeCardInfoClass(list, cardInfo) {
  // 方向
  for (var i = 0; i < list.length; i++) {
    var classDir = list[i];
    // 课程
    addRechargeCardInfo(classDir, cardInfo);
  }
}
// 未选课程时，定金按钮禁止
function djBtnDisabled() {
  if (SignClassHTML.children().length === 0) {
    $('[data-type="FKFS02"]').prop('disabled', true);
  } else {
    $('[data-type="FKFS02"]').prop('disabled', false);
  }
}
// *按照所购买内容，判断 付款/支付 方式的可用性
// 包含其他缴费不允许使用充值卡或百度贷进行支付
// 单独只有其他缴费可以使用
// 证书缴费不允许使用百度贷支付
// 充值卡购买不允许使用充值卡支付
// 支付为0 ，不允许使用百度贷
function checkZFFSTips(type) {
  var thisPaymentAmount = $('#thisPaymentAmount').val();
  // 收钱吧
  if (type === 'ZFFS11') {
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用收钱吧');
      return false;
    }
  }
  // 百度贷
  if (type === 'ZFFS19') {
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用百度贷');
      return false;
    }
  }
  //惠民贷款
  if (type === 'ZFFS20') {
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用交行惠民贷');
      return false;
    }
  }
  // 充值卡方式
  if (type == 'ZFFS13') {
    if (SignRechargeCardHTML.children().length) {
      COM_TOOLS.alert('充值卡购买不允许使用充值卡支付');
      return false;
    }
    // if (SignOtherPayHTML.children().length) {
    //   COM_TOOLS.alert('其他缴费不允许使用充值卡或百度贷进行支付')
    //   return false
    // }
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用充值卡');
      return false;
    }
  }
  // 百度贷/银行转账(百度)
  // if (type == 'ZFFS07' || type === 'ZFFS19' || type === 'ZFFS20') {
  //   if (
  //     SignOtherPayHTML.children().length &&
  //     (SignClassHTML.children().length > 0 ||
  //       SignRechargeCardHTML.children().length > 0 ||
  //       SignCertificateHTML.children().length > 0)
  //   ) {
  //     COM_TOOLS.alert('其他缴费不允许使用充值卡,百度贷,惠民贷进行支付');
  //     return false;
  //   }
  //   if (SignCertificateHTML.children().length) {
  //     COM_TOOLS.alert('证书缴费不允许使用百度贷,惠民贷支付');
  //     return false;
  //   }
  // }
  return true;
}

/**
 * 只有其他缴费时，隐藏 贴息按钮 并不执行 cb
 * 有课程时 执行 cb
 * @param {function} cb
 */
function checkSetLoan(cb) {
  if (
    SignClassHTML.children().length === 0 &&
    (SignOtherPayHTML.children().length > 0 ||
      SignRechargeCardHTML.children().length > 0 ||
      SignCertificateHTML.children().length > 0 ||
      SignTeachingHTML.children().length > 0)
  ) {
    setLoanCheckbox();
  } else {
    cb && cb();
  }
}

/**
 * 校验信息唯一
 * @param {string} type ‘add|del’
 * @param {string} dom dom对象
 * @param {string} id 唯一标识
 */
function checkInfoSole(type, dom, id) {
  var flag = false;
  var checkList = dom.data('checklist') || {};

  if (type === 'add') {
    if (!checkList[id]) {
      checkList[id] = flag = true;
    }
  } else if (type === 'del') {
    if (checkList[id]) {
      delete checkList[id];
      flag = true;
    }
  }
  dom.data('checklist', checkList);
  return flag;
}

// *event bind
$('#formSubmit').click(function () {
  if (!payValid.form()) {
    // COM_TOOLS.alert('请检查内容是否填写完整')
    return false;
  }

  if (decideNo0()) {
    return false;
  }

  var p = $('#payMethod').val();
  var cardInfo = $('#js_rechargeCard_wrp').data('card_info');
  if (p == 'ZFFS13' && !cardInfo) {
    COM_TOOLS.alert('使用充值卡支付方式但未选择充值卡');
    return false;
  }
  // 确认提示
  COM_TOOLS.confirm('确认后，学员姓名等基本信息将无法更改，请确认！', function (idx) {
    var base_info = COM_TOOLS.serializeObject('#baseInfo');
    var pay_info = handleNum(COM_TOOLS.serializeObject('#payInfo'));
    // 课程数据
    var res_sub = submitStageData(base_info, pay_info);
    // 证书
    var certificate_info = processSubDataCertificate(pay_info);
    // 教具
    var teaching_info = processSubDataTeaching(pay_info);
    // 其他缴费
    var ohterPay_info = processSubDataOtherPay(pay_info);
    // 充值卡
    var rechargeCard_info = processSubDataRechargeCard(pay_info);
    // 使用充值卡时追加数据字段
    var cardInfo = $('#js_rechargeCard_wrp').data('card_info');
    if (cardInfo) {
      // addRechargeCardInfo(res_sub, cardInfo)
      addRechargeCardInfoClass(res_sub, cardInfo);
      addRechargeCardInfo(certificate_info, cardInfo);
      addRechargeCardInfo(ohterPay_info, cardInfo);
      addRechargeCardInfo(teaching_info, cardInfo);
      // 基本信息内追加 卡号 本次缴费金额
      base_info.inforCardId = cardInfo.id;
      base_info.useCardAmount = $('#thisRechargeCardAmount').val();
    }
    console.log('base_info-', base_info);
    console.log('pay_info-', pay_info);
    console.log('class_info-', res_sub);
    console.log('certificate_info-', certificate_info);
    console.log('teaching_info-', teaching_info);
    console.log('ohterPay_info-', ohterPay_info);
    console.log('rechargeCard_info-', rechargeCard_info);
    // 图片凭证
    base_info.evidenceUrl = pay_info.evidenceUrl;
    var params = {
      signupMul: JSON.stringify(base_info),
      payMsg: JSON.stringify(pay_info),
      signupSubArr: JSON.stringify(res_sub),
      ceriPayArr: JSON.stringify(certificate_info),
      goodsPayArr: JSON.stringify(teaching_info),
      otherPayArr: JSON.stringify(ohterPay_info),
      cardPayArr: JSON.stringify(rechargeCard_info)
    };
    cumCloseWin(idx);
    //
    if ('ZFFS19' == pay_info.payMethod) {
      if (!checkIfBaiduLoan().succ) {
        COM_TOOLS.alert('当前学员有未扫码的百度贷信息，请先完成原有百度贷，再选择使用新的百度贷。');
        return;
      }
    }
    COM_TOOLS.loadingShade.open();
    $.post(CONTEXT_PATH + '/newsignup/savaSignup', params)
      .then(function (res) {
        COM_TOOLS.loadingShade.close();
        if (res.code == '0') {
          COM_TOOLS.alert(res.msg);
        } else if (res.code == '1') {
          COM_TOOLS.alert('报名成功');
          var pay_method = pay_info.payMethod;
          //新增的百度贷也需要 支付页面，需要与原有的收钱盘分开跳转
          var checkNeedPayIndex = checkIfPayIndex(pay_method);
          if (checkNeedPayIndex) {
            //新的百度贷
            if ('ZFFS19' == pay_method) {
              cumParentWinModal(
                '百度贷支付',
                CONTEXT_PATH +
                  '/newsignup/payIndexBaiduLoan?togetherStamp=' +
                  res.data[0].togetherStamp +
                  '&baiduLoanOrderNo=' +
                  res.data[0].baiduLoanOrderNo,
                {
                  other: {
                    closeBtn: 0
                  }
                }
              );
            } else if ('ZFFS20' == pay_method) {
              //交行惠民贷
              cumParentWinModal(
                '惠民贷支付',
                CONTEXT_PATH +
                  '/newsignup/payIndexHmdLoan?togetherStamp=' +
                  res.data[0].togetherStamp,
                {
                  other: {
                    closeBtn: 0
                  }
                }
              );
            } else {
              //原有的收钱吧
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
          }

          $.ajax({
            type: 'post',
            url: CONTEXT_PATH + '/newsignup/sendToolNotice',
            data: {
              togetherStamp: res.data[0].togetherStamp,
              studentCode: $('#studentCode').val()
            },
            success: function (data) {
              if (data.code != 1) {
                parent.COM_TOOLS.alert(data.msg, { time: 5000 });
              }
            },
            error: function () {
              COM_TOOLS.alert(TEDU_MESSAGE.get('platform.common.msg.exception'));
            }
          });
          debugger;
          $.ajax({
            type: 'post',
            url: CONTEXT_PATH + '/stuElectronicCompact/verificationStudent',
            data: {
              togetherStamp: res.data[0].togetherStamp,
              studentCode: $('#studentCode').val()
            },
            success: function (data) {
              if (data.code == 1) {
                cumParentWinModal(
                  '<ta:local key=""/>电子合同',
                  CONTEXT_PATH +
                    '/stuElectronicCompact/toDetailsPage?togetherStamp=' +
                    res.data[0].togetherStamp +
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

          /*if(pay_method == "ZFFS02" || pay_method == "ZFFS03" || pay_method == "ZFFS04" ){
                                      cumParentWinModal('支付信息', CONTEXT_PATH + '/newsignup/payIndex?togetherStamp=' + res.data[0].togetherStamp, {
                                          other: {
                                              closeBtn: 0
                                          }
                                      });
                                  }*/
          //          cumParentCallValue()
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
            var _orgCode = $('#orgCore_code').val();
            getOrgCoreTmpList(_orgCode);
            getBtnListByOrg(_orgCode);
            getClassHourLimit(_orgCode);
          }
        }
      }
    );

    // 修改时提示
    // if (!$.isEmptyObject(cloneDTData)) {
    //   COM_TOOLS.confirm('修改中心，将导致已报课程清空', {
    //     closeBtn: 0,
    //     yes: function(index) {
    //       $('#signClassHTML').html('')
    //       cloneDTData = {}
    //       clearLoanCheckbox()
    //       cumCloseWin(index)
    //     }
    //   })
    // }

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
  .on('change', '.js-dy-classHour', function () {
    // 修改 课时
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
    // sumTotalDiscount()
    // clearLoanCheckbox()
  })
  .on('change', '.js-dy-price', function (evt) {
    // 单价
    var t_ = $(this);
    var p_tr = $(this).closest('.js-tr-item');
    var pp_dir = t_.closest('.direction-item');

    js_classPrice(p_tr);

    clearTrDiscount(p_tr);
    clearLBData(pp_dir);

    // js_discountPrice(p_tr);
    // js_outstanding(p_tr);

    xiaojiMoney(pp_dir);
    // clearPayInfo()

    // sumTotalPayment()
    // sumTotalDiscount()
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

    // clearPayInfo()

    // sumTotalPayment()
    // sumTotalDiscount()
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
      orderType: '',
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

              // clearPayInfo()

              // sumTotalPayment()
              // sumTotalDiscount()
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

            // clearPayInfo()

            // sumTotalPayment()
            // sumTotalDiscount()
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

    // clearPayInfo()

    // sumTotalPayment()
    // sumTotalDiscount()
  })
  .on('click', '.js-btn-books', function () {
    // 选择教具
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var courseCode = p_tr.data('sdata')['courseCode'];
    var orgCoreCode = $('#orgCore_code').val();

    if (t_.data('loading')) {
      return false;
    }
    t_.data('loading', true);
    // 判断 绑定教具/单独购买
    $.post(CONTEXT_PATH + '/newsignup/checkIfNeedChooseGoods', {
      courseCode: courseCode,
      orgCoreCode: orgCoreCode
    })
      .then(function (res) {
        t_.data('loading', false);
        if (res.code == 1) {
          if (res.data == '1' || res.data == '-2') {
            // 绑定
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
                    if (params) {
                      alterBtnStatus('add', t_);

                      p_tr.removeData('params-gooks').data('params-gooks', params);
                      t_.attr('data-original-title', params.goodsName);

                      t_.siblings('.js-dy-gooks')
                        .val(params.retailPrice)
                        .attr('ck-course-price', params.retailPrice);
                      //.removeAttr('readonly')
                    }
                  },
                  empty: function () {
                    alterBtnStatus('clear', t_, '教具');

                    p_tr.removeData('params-gooks');
                    t_.removeAttr('data-original-title');
                    t_.siblings('.js-dy-gooks')
                      .val(0)
                      .attr('ck-course-price', 0)
                      .attr('readonly', true);
                  }
                }
              }
            );
          } else {
            // 单独
            $('#js_addTeaching').trigger('click');
          }
        }
      })
      .fail(function () {
        t_.data('loading', false);
      });
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

        // clearPayInfo()

        // sumTotalPayment()
        // sumTotalDiscount()

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

            // clearPayInfo()

            // sumTotalPayment()
            // sumTotalDiscount()
          },
          empty: function () {
            t_.removeData('sdata').removeAttr('data-original-title');
            p_dir.find('.js-lb-discount').val(0);
            // 恢复各个优惠的价格
            p_dir.find('.js-tr-item').each(function (key, item) {
              var t_tr = $(this);
              // var discount_data = t_.data('params-discount') || [];

              // var discount_amount = sumDiscount(discount_data, 'price');
              // t_.find('.js-dy-discount').val(discount_amount).attr('ck-discount', discount_amount);
              fillDiscount(t_tr, p_dir);

              js_discountPrice(t_tr);
              js_outstanding(t_tr);

              xiaojiMoney(p_dir);

              // clearPayInfo()

              // sumTotalPayment()
              // sumTotalDiscount()
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
    // if ($.isEmptyObject(cloneDTData)) {
    //   COM_TOOLS.alert('请先添加课程')
    //   return false
    // }
    clearPayInfo(true);

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

      $('#fm_tbody').html(FMTrHTML(SignClassHTML.find('.js-tr-item'), sdata));

      // 其他内容
      $('#other_fm_tbody').html(FMOtherTrHTML());
      $('#totalFMOther').val(FMOtherTrAmount());

      FMBoxIdx = cumCurWinModal('分摊定金金额', $('#fronMoneyWrp'), '', {
        area: ['650px', '550px'],
        type: 1,
        success: function (layer) {
          $('#fm_tbody .js-money').number(true, 2);
          $('#fm_tbody').find('.js-dy-fm').trigger('change');
        },
        end: function () {
          $('#fm_tbody, #other_fm_tbody').html('');
          $('#totalFM, #totalFMOther').val('');
        }
      });
    }
  })
  .on('click', '.js-pay2-method', function () {
    // 支付方式
    var pay_type = this.dataset.type;

    if (location.href.indexOf('payAginIndex') === -1) {
      if (!$('#paymentMethod').val()) {
        COM_TOOLS.alert('请先选择付款方式');
        return false;
      }
    }
    if (!checkZFFSTips(pay_type)) {
      return false;
    }
    // 充值卡 node
    clearRechargeCardInfo();
    var card_wrp = $('#js_rechargeCard_wrp');

    $('#payMethod').val(pay_type);
    $(this).addClass('btn-success').siblings('.btn').removeClass('btn-success');
    payValid.element('#payMethod');

    $('#transferWrp').find('.i-checks').iCheck('uncheck');
    $('#transferWrp').hide().find('.js-loan-elm').attr('disabled', true).tooltip('destroy');
    $('#certificate_wrp').hide().find('#evidenceText').tooltip('destroy');
    $('#evidenceText, #uploadEvidence_evidence, #evidenceUrl').val('');

    if (pay_type == 'ZFFS07') {
      // 银行转账(百度)
      //checkSetLoan(function () {
      //  discountInterest('TXGLZFS01');
      //});
      //加载贷款利率
      showLoanRate(pay_type);
      // 百度 转账
      $('#transferWrp').show().find('.js-loan-elm').removeAttr('disabled');
      // 上传凭证
      $('#certificate_wrp').show();
      // 只有其他缴费时-不能使用贴息
      if (
        $('.js-tr-item').filter(function () {
          return $(this).closest('#signOtherPayHTML').length === 0;
        }).length === 0
      ) {
        setLoanCheckbox();
      }
    } else if (pay_type == 'ZFFS19' || pay_type == 'ZFFS20') {
      // 百度贷，惠民贷 贴息检查改为，用户选择贷款期数后，在进行检测
      //checkSetLoan(function () {
      //  var loanProvider = pay_type == 'ZFFS19' ? 'TXGLZFS01' : 'TXGLZFS02';
      //  discountInterest(loanProvider);
      //});

      //加载贷款利率
      showLoanRate(pay_type);
      // 百度贷款
      $('#transferWrp').show().find('.js-loan-elm').removeAttr('disabled');
      // 上传凭证 新的百度贷不用上传凭证
      //$('#certificate_wrp').show()
      // 只有其他缴费时-不能使用贴息
      if (
        $('.js-tr-item').filter(function () {
          return $(this).closest('#signOtherPayHTML').length === 0;
        }).length === 0
      ) {
        setLoanCheckbox();
      }
    } else if (pay_type == 'ZFFS13') {
      // *充值卡
      var extraData = {
        classInfo: classInfoByCard(),
        otherPayInfo: otherPayInfoByCard()
      };
      var orgCoreCode = $('#orgCore_code').val();
      var informationCode = $('#informationCode').val();

      cumParentWinModal(
        '选择充值卡',
        CONTEXT_PATH +
          '/inforStoredCard/chooseCard?orgCoreCode=' +
          // './rechargeCardList.html?' +
          orgCoreCode +
          '&informationCode=' +
          informationCode,
        {
          area: ['800px', '480px'],
          callid: extraData,
          callback: {
            getData: function (data) {
              data = data[0];

              var checkRes = checkRechargeCardAmount(data.avaliableAmount);
              if (checkRes) {
                var cardInfo = processRechargeCardInfo(data);
                // 存储信息
                card_wrp.data('card_info', cardInfo);
                // 展示充值卡支付信息
                showRechargeCardInfo(cardInfo);
              } else {
                COM_TOOLS.alert('该学员充值卡剩余面值不足，请更改付款方式或者更换其他充值卡！');
              }
            }
          }
        }
      );
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
  })
  .on('click', '#js_addClass', function () {
    // !200318 新增
    // 添加信息-课程
    SCBoxIdx = cumCurWinModal('选择课程', $('#selctClassWrp'), '', {
      area: ['800px', '400px'],
      type: 1,
      success: function (layer) {
        if (DT_instance_flag) {
          DT_instance_flag = false;
          dt_choice_class = COM_TOOLS.DT_init(
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
        }
      },
      end: function () {}
    });
  })
  .on('click', '#js_addCertificate', function () {
    // 添加信息-证书
    // todo 要修改数据传递方式
    cumParentWinModal('证书选择', CONTEXT_PATH + '/certificateBase/toChooseCertificate', {
      area: ['800px', '480px'],
      callback: {
        getData: function (data) {
          createCertificateHTML(data, SignCertificateHTML);
          $('#thisPaymentAmount').val(0);
        }
      }
    });
  })
  .on('click', '.js-zs-btn-course', function () {
    var t = $(this);
    var t_p = t.closest('.js-tr-item');
    var sData = t_p.data('sdata');

    cumParentWinModal(
      '课程',
      CONTEXT_PATH + '/chooseCourse/toChoosePage?orgCoreCode=' + $('#orgCore_code').val(),
      {
        area: ['800px', '480px'],
        callid: 'course',
        callback: {
          getData: function (data) {
            // COM_TOOLS.callParentWinCacheFn('getData', obj.closest('tr').data());
            t_p.find('.js-zs-course').val(data.courseName).trigger('focusout.validate');
            // 添加课程数据
            sData.courseName = data.courseName;
            sData.courseCode = data.courseCode;
          }
        }
      }
    );
  })
  .on('click', '#js_addOther', function () {
    // 添加信息-其他缴费
    // cumParentWinModal('其他缴费', './otherPay.html', {
    var orgCoreCode = $('#orgCore_code').val();
    cumParentWinModal('其他缴费', CONTEXT_PATH + '/stuPay/otherPay?orgCoreCode=' + orgCoreCode, {
      area: ['800px', '480px'],
      callback: {
        getData: function (data) {
          createOtherPayHTML(data, SignOtherPayHTML);
        }
      }
    });
  })
  .on('click', '#js_addRechargeCard', function () {
    // 添加信息-充值卡
    cumParentWinModal(
      '购买充值卡',
      CONTEXT_PATH +
        '/inforStoredCard/addRechargeCard?informationCode=' +
        $('#informationCode').val(),
      {
        area: ['800px', '480px'],
        callback: {
          getData: function (data) {
            createRechargeCardHTML(data);
          }
        }
      }
    );
  })
  .on('click', '#js_addTeaching', function () {
    var _orgCoreCode = $('#orgCore_code').val();

    cumParentWinModal(
      '商品',
      CONTEXT_PATH +
        '/hourseGoods/toChoosePage?index=signup&hourseType=2&orgCoreCode=' +
        _orgCoreCode,
      {
        area: ['600px', '480px'],
        callid: '',
        callback: {
          fn1: function (params) {
            // 兼容最初还没节点的情况
            var $dir = SignTeachingHTML.find('.direction-item');
            if (!$dir.length) {
              createTeachingHTML([params], SignTeachingHTML);
              teachimg_sumTotal();
              checkInfoSole('add', SignTeachingHTML.find('.direction-item'), params.goodsCode);
            } else {
              if (checkInfoSole('add', $dir, params.goodsCode)) {
                teachimg_clearTrDiscount('', 'mg');
                createTeachingHTML([params], SignTeachingHTML);
                teachimg_sumTotal();
              } else {
                COM_TOOLS.alert('不可重复添加同一件商品');
              }
            }
          }
        }
      }
    );
  })
  .on('click', '.js-tr-remove-zs, .js-tr-remove-qt, .js-tr-remove-czk', function () {
    // 删除记录 证书 其他缴费 充值卡
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var p_form = t_.closest('.sign-class-wrp');

    // cb 处理
    // var s_data = p_tr.data('sdata')
    // if (Number(s_data.totalPaymentAmount || 0)) {
    //   COM_TOOLS.alert('已付款，不能删除')
    //   return false
    // }

    COM_TOOLS.confirm('确定删除？', {
      closeBtn: 0,
      yes: function (index) {
        // 清除数据
        if (p_tr.siblings().length === 0) {
          p_form.html('');
        } else {
          p_tr.remove();
        }

        cumCloseWin(index);
      }
    });
  });
// !200610 教具
// 计算 tr 小计
function te_sumTrSubtotalByNum(dom) {
  // 计算对应的优惠(选择后的) 最小为 0
  var sumDiscountBySelection = function (arr) {
    arr = arr || [];
    return arr.reduce(function (prev, cur) {
      var tmp = COM_FN.sub(prev, cur);
      return tmp <= 0 ? 0 : tmp;
    });
  };

  dom = dom || SignTeachingHTML.find('.js-tr-item');

  dom.each(function () {
    var t_ = $(this);
    var t_num = t_.find('.js-goods-num').val();
    var sdata = t_.data('sdata');
    var disData = t_.data('disdata') || { resTotal: 0 };
    // 合计价格
    var t_price = COM_FN.mul(t_num, sdata.retailPrice);
    // 满购
    var cur_mgDis = t_.find('.js-mg-discount').val() * 1;
    // 建议零售价
    t_.find('.js-suggest-price').val(t_price);
    // 最低售价
    var t_min_price = COM_FN.mul(t_num, sdata.minRetailPrice || sdata.retailPrice);
    t_.find('.js-min-price').val(t_min_price);
    // 优惠金额
    t_.find('.js-discount-price').val(disData.resTotal);
    // 合计价格
    t_.find('.js-sell-price ')
      .val(sumDiscountBySelection([t_price, disData.resTotal, cur_mgDis]))
      .attr('ck-course-price', sumDiscountBySelection([t_min_price, disData.resTotal, cur_mgDis]))
      .trigger('focusout.validate');
  });
}

// 计算 教具合计
function teachimg_sumTotal() {
  var sum = 0;
  SignTeachingHTML.find('.js-sell-price').each(function () {
    var t = $(this);
    var val = t.val();
    sum = COM_FN.add(sum, val);
  });
  SignTeachingHTML.find('.js-total-money').val(sum);
}
// 清空 优惠/满购
function teachimg_clearTrDiscount(dom, type) {
  type = type || 'all';
  if (type === 'all') {
    dom.find('.js-discount-price').val(0);
    dom.removeData('disdata');
  }

  SignTeachingHTML.find('.js-mg-discount').val(0);
  SignTeachingHTML.find('.direction-item').removeData('mgdata');
  SignTeachingHTML.find('.js-dis-mjmg').prop('checked', false);
  SignTeachingHTML.find('.js-mjmg-cont').html('');
}
// 按比例分摊满购优惠
function byProportionDistribution(dom, total, disTotal) {
  var tmp = disTotal;
  $.each(dom, function () {
    var t_ = $(this);
    var sPrice = t_.find('.js-suggest-price').val();
    // 所占比例
    var tRatio = COM_FN.div(sPrice, total);
    // 所占优惠 取整
    var tDis = Math.ceil(COM_FN.mul(tRatio, tmp));
    if (disTotal > tDis) {
      disTotal = COM_FN.sub(disTotal, tDis);
    } else {
      tDis = disTotal;
      disTotal = 0;
    }
    t_.find('.js-mg-discount').val(tDis);
  });
}
// *教具 event bind
SignTeachingHTML.on('change', '.js-dis-mjmg', function () {
  var t_ = $(this);
  var flag = t_.prop('checked');

  if (flag) {
    var _orgCoreCode = $('#orgCore_code').val();
    // 建议零售价的总和
    var _total = (function () {
      var sum = 0;
      SignTeachingHTML.find('.js-suggest-price').each(function () {
        var val = $(this).val() * 1;
        sum += val;
      });
      return sum;
    })();
    var _totalNum = (function () {
      var sum = 0;
      SignTeachingHTML.find('.js-goods-num').each(function () {
        var val = $(this).val() * 1;
        sum += val;
      });
      return sum;
    })();
    $.post(
      CONTEXT_PATH +
        '/goodsDiscount/countMaxDiscount?orgCoreCode=' +
        _orgCoreCode +
        '&goodsSumNum=' +
        _totalNum +
        '&goodsSumMoney=' +
        _total
    ).then(function (res) {
      if (res.code == 1) {
        byProportionDistribution(SignTeachingHTML.find('.js-tr-item'), _total, res.data.discount);
        SignTeachingHTML.find('.direction-item').data('mgdata', res.data);
        te_sumTrSubtotalByNum();
        teachimg_sumTotal();
        // 名称
        SignTeachingHTML.find('.js-mjmg-cont').text(
          '名称：' + res.data.discountName + ' 优惠：' + res.data.discount
        );
      } else {
        COM_TOOLS.alert(res.msg);
        teachimg_clearTrDiscount('', 'mg');
        SignTeachingHTML.find('.js-mjmg-cont').html('');
      }
    });
  } else {
    // 重置 无满购优惠
    teachimg_clearTrDiscount('', 'mg');
    te_sumTrSubtotalByNum();
    teachimg_sumTotal();
  }
})
  .on('blur', '.js-goods-num', function () {
    var t_ = $(this);
    var t_p = t_.closest('.js-tr-item');

    teachimg_clearTrDiscount(t_p);

    te_sumTrSubtotalByNum();

    teachimg_sumTotal();
  })
  .on('click', '.js-btn-discount-teach', function () {
    // 选择优惠
    var t_ = $(this);
    var t_p = t_.closest('.js-tr-item');
    var sData = t_p.data('sdata');
    var goodsNum = t_p.find('.js-goods-num').val();
    // 添加数量
    sData.goodsNums = goodsNum * 1;
    var _orgCoreCode = $('#orgCore_code').val();

    cumParentWinModal(
      '选择商品优惠',
      CONTEXT_PATH +
        '/goodsDiscount/selectiveGoodsDiscount?orgCoreCode=' +
        _orgCoreCode +
        '&goodsCode=' +
        sData.goodsCode,
      {
        area: ['800px', '60%'],
        callid: sData,
        callback: {
          getData: function (params) {
            t_p.data('disdata', params);

            te_sumTrSubtotalByNum(t_p);
            //  总合计
            teachimg_sumTotal();
          }
        }
      }
    );
  })
  .on('blur', '.js-sell-price', function () {
    // 更改合计
    teachimg_sumTotal();
  })
  .on('click', '.js-tr-remove-teach', function () {
    // 删除记录
    var t_ = $(this);
    var p_tr = t_.closest('.js-tr-item');
    var sData = p_tr.data('sdata');
    var p_form = t_.closest('.sign-class-wrp');

    COM_TOOLS.confirm('确定删除？', {
      closeBtn: 0,
      yes: function (index) {
        // 清除数据
        if (p_tr.siblings().length === 0) {
          p_form.html('');
        } else {
          var $dir = SignTeachingHTML.find('.direction-item');
          checkInfoSole('del', $dir, sData.goodsCode);
          p_tr.remove();

          teachimg_clearTrDiscount('', 'mg');
          te_sumTrSubtotalByNum();
          teachimg_sumTotal();
        }

        cumCloseWin(index);
      }
    });
  });
// !end 200610 教具

// !200318 新增
// 上/下步骤
$('#js_step_handle').on('click', '.js-btn-step', function () {
  var t_ = $(this);
  var stepType = t_.data('step');
  var p_t = t_.closest('.js-step-btn-group');
  var curStepNum = p_t.data('stepnum'); // 1 2 3
  if (stepType === 'last') {
    // 上一步
    COM_TOOLS.confirm('返回上一步，将清空当前步骤数据', {
      closeBtn: 0,
      yes: function (index) {
        // 要清除当前数据
        if (curStepNum === 3) {
          clearPayInfo();
        } else if (curStepNum === 2) {
          cloneDTData = {};
          SignClassHTML.html('');
          SignCertificateHTML.html('');
          SignOtherPayHTML.html('');
          SignRechargeCardHTML.html('');
          SignTeachingHTML.html('');
        }

        toTargetStep(curStepNum, 'last');
        p_t.data('stepnum', --curStepNum);
        cumCloseWin(index);
      }
    });
  } else if (stepType === 'next') {
    // 下一步 要进行 validatar 校验
    var valFLag = true;
    if (curStepNum === 1) {
      valFLag = baseValid.form();
    } else if (curStepNum === 2) {
      valFLag = courseStageValid.form() && signCertificateValid.form() && signTeachingValid.form();
      if (
        !SignClassHTML.children().length &&
        !SignCertificateHTML.children().length &&
        !SignTeachingHTML.children().length &&
        !SignOtherPayHTML.children().length &&
        !SignRechargeCardHTML.children().length
      ) {
        COM_TOOLS.alert('请最少添加一项内容');
        valFLag = false;
      }
      // 课时数限制
      var resHour = checkClassHourLimit(handleClassHourNum(SignClassHTML));
      if (resHour.res) {
        COM_TOOLS.alert('联报年数超过集团规定限制(联报不得大于' + resHour.hour + ')，请重新选择！');
        valFLag = false;
      }
    }

    if (valFLag) {
      toTargetStep(curStepNum, 'next');
      // 跳到支付信息时 计算金额
      if (curStepNum === 2) {
        // 定金按钮
        djBtnDisabled();
        // 判断贴息
        //clearLoanCheckbox()
        // 计算金额
        sumTotalPayment();
        sumTotalDiscount();
      }
      p_t.data('stepnum', ++curStepNum);
      // COM_TOOLS.confirm('请确认当前步骤数据是否准确', {
      //   closeBtn: 0,
      //   yes: function(index) {
      //     cumCloseWin(index)
      //   }
      // })
    }
  }
});
// 选课弹窗 evnet
$('#eventMain_xc')
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

    createCourseHTML(arr, function (cid, item) {
      var p_dir = $('#d' + item.classificationCode);
      // 清理联报
      var lb_Data = p_dir.find('.js-btn-lb').data('sdata');
      if (!$.isEmptyObject(lb_Data)) {
        clearLBData(p_dir);
      }
      // 小计
      xiaojiMoney(p_dir);
      // sumTotalDiscount()
    });

    cumCloseWin(SCBoxIdx);
  });
// *定金弹窗 eventMain_fm
$('#eventMain_fm')
  .on('blur', '.js-dy-fm', function () {
    // 定金 合计
    var sum = sumFrontMoney_box();

    $('#totalFM').val(sum);
    $('#totalFMOther').val(sum + FMOtherTrAmount());
  })
  .on('click', '.js-btn-confirm', function () {
    // 定金确认
    if (!frontMoneyValid.form()) {
      return false;
    }
    var params = [];

    $('#frontMoneyForm .js-dy-fm').each(function (key, item) {
      var t_ = $(this);
      var val = Number(t_.val());
      var code = this.dataset.code;

      params.push({
        courseStageCode: code,
        fmPrice: val
      });
    });

    $('.js-pay-method[data-type="FKFS02"]').data('sdata', params);

    var total_fm = sumFrontMoney_new();
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
//判断用户是否有未扫码的百度贷
function checkIfBaiduLoan() {
  var result = false;
  $.ajax({
    url:
      CONTEXT_PATH + '/newsignup/checkIfBaiduLoan?informationCode=' + $('#informationCode').val(),
    async: false,
    success: function (res) {
      result = res;
    }
  });
  return result;
}

//回显数据触发
(function () {
  var sel2_cityCode = $('#cityCode');
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
//判断能否使用贴息优惠
function discountInterest(loanProvider) {
  var totalAmount = 0;
  var courseStageCode = '';
  var totalHour = 0;
  var classHourRatio = sumClassHourRo();
  var weekType = '';
  var baseHTML;

  if (SignClassHTML.length > 0 && SignClassHTML.find('.js-tr-item').length > 0) {
    baseHTML = SignClassHTML;
  } else {
    baseHTML = $('#chargeCourseHtml');
  }

  $.each(baseHTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item);
    var inp_discount = Number(t_.find('.js-price-discount').val());
    totalAmount = COM_FN.add(totalAmount, inp_discount);
    var csCode = t_.attr('id').substr(1);
    if (courseStageCode == '') {
      courseStageCode = csCode;
    } else {
      courseStageCode += ',' + csCode;
    }
    var inp_classHour = Number(t_.find('.js-dy-classHour').val());
    totalHour = COM_FN.add(totalHour, inp_classHour);
    var courseWeekType = t_.find('.js-sel-week').val();
    if (weekType == '') {
      weekType = courseWeekType;
    } else {
      if (weekType != courseWeekType) {
        weekType = 'none';
      }
    }
  });

  var paymentMethod = $('#paymentMethod').val();
  if (paymentMethod == 'FKFS02') {
    // 定金弹窗
    totalAmount = 0;
    var fmData = $('.js-pay-method[data-type="FKFS02"]').data('sdata') || [];
    if (fmData.length) {
      fmData.forEach(function (item) {
        var fmVal = item.fmPrice;
        var c_balanceDis = getGoodsByCardRatioAmount(fmVal, 1);
        totalAmount = COM_FN.add(totalAmount, c_balanceDis);
      });
    }
  } else if ($('#bjAmount').length > 0) {
    totalAmount = $('#bjAmount').val();
  }

  var loanRateCode = $('#loanRateCode').val();
  $.ajax({
    type: 'post',
    url: CONTEXT_PATH + '/discount/interest/validate/loanPeriods',
    async: false,
    data: {
      orgCoreCode: $('#orgCore_code').val(),
      totalAmount: totalAmount,
      courseStageCode: courseStageCode,
      totalHour: totalHour,
      classHourRatio: classHourRatio,
      weekType: weekType,
      loanProvider: loanProvider,
      loanPeriod: loanRateCode
    },
    success: function (res) {
      if (res == '1') {
        setLoanCheckbox(true);
      } else {
        setLoanCheckbox(false);
      }
    }
  });
}
// !200619 优惠模版
function templateDataToHTML(rData) {
  tmpId = rData.id;
  if (rData.courseList && rData.courseList.length) {
    rData.courseList.forEach(function (n) {
      var dirData = n;
      var filterData = checkDTData(dirData.dirList);

      createCourseHTML(
        filterData,
        function (cid, item) {
          var p_dir = $('#d' + item.classificationCode);
          p_dir.data('sdata', {
            id: dirData.id
          });
          // 联报优惠
          if (dirData.mulDiscountData.code) {
            p_dir
              .find('.js-btn-lb')
              .attr('title', dirData.mulDiscountData.name)
              .data('sdata', { item: dirData.mulDiscountData });
            p_dir.find('.js-lb-discount').val(dirData.mulDiscountData.discountAmount);
          }
          // 小计
          xiaojiMoney(p_dir);
        },
        'edit'
      );
    });
  }
  if (rData.certList && rData.certList.length) {
    createCertificateHTML(rData.certList, SignCertificateHTML, 'edit');
  }
  if (rData.teachAidsList && rData.teachAidsList.length) {
    createTeachingHTML(rData.teachAidsList, SignTeachingHTML, 'edit');
    // 防重复
    var tmp = $.map(rData.teachAidsList, function (n) {
      return n.goodsCode;
    });
    checkInfoSole('add', SignTeachingHTML.find('.direction-item'), tmp);
    // 满购优惠
    if (rData.teachAidsList[0].discountCode) {
      var _mgData = {
        discountCode: rData.teachAidsList[0].discountCode,
        discountName: rData.teachAidsList[0].discountName,
        discount: rData.teachAidsList[0].fullAllDis
      };
      SignTeachingHTML.find('.js-dis-mjmg').prop('checked', true);
      SignTeachingHTML.find('.direction-item').data('mgdata', _mgData);
      SignTeachingHTML.find('.js-mjmg-cont').text(
        '名称：' + _mgData.discountName + ' 优惠：' + _mgData.discount
      );
    }
    // 合计
    teachimg_sumTotal();
  }
  if (rData.otherPayList && rData.otherPayList.length) {
    createOtherPayHTML(rData.otherPayList, SignOtherPayHTML, 'edit');
  }
}
// 构建中心套餐选项
function createTmpItem(list) {
  var tmp = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    tmp.push(
      '<button class="js-tmp-item" data-code="' +
        item.packageCode +
        '">' +
        item.packageName +
        '</button>'
    );
  }
  return tmp.join('');
}
function getTmpbyCode(code) {
  $.post(CONTEXT_PATH + '/packageManager/queryDetail', { packageCode: code }).then(function (res) {
    if (res) {
      templateDataToHTML(res);
    } else {
      $('#js_org_tmp').find('.js-tmp-item').prop('disabled', false);
    }
  });
}
$('#js_org_tmp').on('click', '.js-tmp-item', function () {
  var _t = $(this);
  var code = _t.data('code');
  if (code) {
    $('#js_org_tmp').find('.js-tmp-item').prop('disabled', true);
    getTmpbyCode(code);
  }
});

// !200619 报名优惠 v3.1
function getBtnListByOrg(code) {
  $.post(CONTEXT_PATH + '/newsignup/findPayMethodListByCenter', {
    orgCoreCode: code
  }).then(function (res) {
    $('#eventMain').find('.js-pay2-method').remove();
    if (res.code == 1) {
      var _html = createPayMethodBtn(res.data);
      $('#eventMain').find('#transferWrp').before(_html);
    } else {
      COM_TOOLS.alert(res.msg);
    }
  });
}

function createPayMethodBtn(list) {
  var tmp = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    tmp.push(
      '<button type="button" class="btn btn-sm btn-primary js-pay2-method" data-type="' +
        item.hiddenValue +
        '">' +
        item.viewValue +
        '</button>'
    );
  }
  return tmp.join('&nbsp;');
}

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
    // console.log(222)
    for (var i = 0; i < params.items.length; i++) {
      var item = params.items[i];
      if (item.totalHour && item.totalHour > COURSE_LIMIT) {
        return { hour: COURSE_LIMIT, res: true };
      }
    }
  }
  if (DIR_LIMIT != '-1') {
    // console.log(111)
    if (params.totalHour && params.totalHour > DIR_LIMIT) {
      return { hour: DIR_LIMIT, res: true };
    }
  }
  return { res: false };
}
//选择贷款支付方式，加载特有的利率
function showLoanRate(payType) {
  $.get(CONTEXT_PATH + '/dictionary/getLoanRate/new?payType=' + payType).then(function (res) {
    if (res.code == '1') {
      addLoanRate(res.data);
    } else {
      addLoanRate(res.data);
    }
  });
}
//添加利率，最新需求，添加贷款期数，贷款期数修改，利率修改
function addLoanRate(data) {
  $('#loanRateCode').empty();
  $('#loanPeriodsCode').empty();
  //先加上请选择，确保用户选择，触发 change事件
  // var op1 = '<option value="">---请选择---</option>';
  var lpc1 = '<option value="" hiddenValue=""  viewValue="">---请选择---</option>';
  //$('#loanRateCode').append(op1);
  $('#loanPeriodsCode').append(lpc1);

  for (var i = 0; i < data.length; i++) {
    // var op = '<option value="' + data[i].hiddenValue + '">'   + data[i].viewValue + '</option>';
    var lpc =
      '<option value="' +
      data[i].extend2 +
      '" hiddenValue="' +
      data[i].hiddenValue +
      '" viewValue="' +
      data[i].viewValue +
      '" >' +
      data[i].extend1 +
      '</option>';
    //$('#loanRateCode').append(op);
    $('#loanPeriodsCode').append(lpc);
  }

  //验证能否使用贴息
  checkSetLoanNew();
}
// 贷款期数修改，修改利率
$('#loanPeriodsCode').on('change', function () {
  //获取选中的期数
  //var loanPeriodsCode = $('#loanPeriodsCode').val();
  var lpcHiddenValue = $('#loanPeriodsCode').find('option:selected').attr('hiddenValue');
  var lpcViewValue = $('#loanPeriodsCode').find('option:selected').attr('viewValue');
  //清空利率
  $('#loanRateCode').empty();
  var op = '<option value="' + lpcHiddenValue + '">' + lpcViewValue + '</option>';
  $('#loanRateCode').append(op);
  //设置选中的利率
  $('#loanRateCode').val(lpcHiddenValue);

  //验证能否使用贴息
  checkSetLoanNew();
  //checkSetLoan(function () {
  //		  var pay_type = $('#payMethod').val();
  //		  var loanProvider = null;
  //		  if(pay_type){
  //   		   if(pay_type == 'ZFFS19'){//百度贷，线上
  //   		   	loanProvider = 'TXGLZFS01';
  //   		   }else if(pay_type == 'ZFFS20'){// 交通惠民贷
  //   		   	loanProvider = 'TXGLZFS02';
  //   		   }else if(pay_type == 'ZFFS07'){//百度贷，转账
  //   		   	loanProvider = 'TXGLZFS01';
  //   		   }
  //     	discountInterest(loanProvider);
  //	  }
  //});
});

function checkSetLoanNew() {
  //验证能否使用贴息
  checkSetLoan(function () {
    var pay_type = $('#payMethod').val();
    var loanProvider = null;
    if (pay_type) {
      if (pay_type == 'ZFFS19') {
        //百度贷，线上
        loanProvider = 'TXGLZFS01';
      } else if (pay_type == 'ZFFS20') {
        // 交通惠民贷
        loanProvider = 'TXGLZFS02';
      } else if (pay_type == 'ZFFS07') {
        //百度贷，转账
        loanProvider = 'TXGLZFS01';
      }
      discountInterest(loanProvider);
    }
  });
}
// 新增 立减/贴息 二选一
$('#loanIndex').on('ifChecked', function () {
  if (
    SignCertificateHTML.children().length == 0 &&
    SignTeachingHTML.children().length == 0 &&
    SignOtherPayHTML.children().length == 0
  ) {
    discountsIfSubsidy().then(function (res) {
      if (res.code == '0') {
        COM_TOOLS.alert(res.msg);
        $('#loanIndex').iCheck('uncheck');
      }
    });
    return;
  }

  discountsIfSubsidy().then(function (res) {
    if (res.code == '0') {
      COM_TOOLS.alert(res.msg);
      $('#loanIndex').iCheck('uncheck');
    } else {
      COM_TOOLS.confirm(
        '除课程费用外贷款童程童美无法进行贴息，利息部分由家长承担，请确认！',
        function (index) {
          layer.close(index);
        },
        function () {
          $('#loanIndex').iCheck('uncheck');
        }
      );
    }
  });

  function discountsIfSubsidy() {
    var temp = [];
    var api = '';

    // 补缴页面
    if (PAGE_TYPE && PAGE_TYPE === 'repairPay') {
      $('#chargeTbody')
        .find('.js-tr-item')
        .each(function (index, item) {
          var sData = $(item).data('sdata');
          if (sData && sData.orderCode) {
            temp.push(sData.orderCode);
          }
        });

      api = '/discount/checkDiscountWithLoanByOrder?orderCodes=' + temp.join(',');
    } else {
      SignClassHTML.find('.js-tr-item').each(function (index, item) {
        var paramsDiscount = $(item).data('paramsDiscount');
        if (paramsDiscount) {
          paramsDiscount.forEach(function (value) {
            if (['HYYH', 'YHQYH', 'YHBYH'].indexOf(value.typeCode) === -1) {
              temp.push(value.code);
            }
          });
        }
      });

      api = '/discount/checkDiscountWithLoan?ids=' + temp.join(',');
    }

    return $.get(CONTEXT_PATH + api);
  }
});
