// 公共方法
var COM_FN = {
  /**
   * 加法
   */
  add: function (arg1, arg2) {
    ;(arg1 = arg1.toString()), (arg2 = arg2.toString())
    var arg1Arr = arg1.split('.'),
      arg2Arr = arg2.split('.'),
      d1 = arg1Arr.length == 2 ? arg1Arr[1] : '',
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : ''
    var maxLen = Math.max(d1.length, d2.length)
    var m = Math.pow(10, maxLen)
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen))
    var d = arguments[2]
    return typeof d === 'number' ? Number(result.toFixed(d)) : result
  },
  /**
   * 减法
   */
  sub: function (arg1, arg2) {
    return this.add(arg1, -Number(arg2), arguments[2])
  },
  /**
   * 乘法
   */
  mul: function (arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2]
    m =
      (r1.split('.')[1] ? r1.split('.')[1].length : 0) +
      (r2.split('.')[1] ? r2.split('.')[1].length : 0)
    resultVal = (Number(r1.replace('.', '')) * Number(r2.replace('.', ''))) / Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },
  /**
   * 除法
   */
  div: function (arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2]
    m =
      (r2.split('.')[1] ? r2.split('.')[1].length : 0) -
      (r1.split('.')[1] ? r1.split('.')[1].length : 0)
    resultVal = (Number(r1.replace('.', '')) / Number(r2.replace('.', ''))) * Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  }
}
// *节点构建
// 部分数据接口获取
// 构建 table tr
function courseTrHTML(key, item, type) {
  var c_price = COM_FN.mul(item.totalClassHour || item.classHour, item.classHourPrice) // 数据回显时好用
  // 课程模式
  function createCoursePattern(item, list) {
    var tmp = ''
    for (var i = 0; i < list.length; i++) {
      var item_ = list[i]
      if (type === 'edit' && item.coursePattern == item_.hiddenValue) {
        tmp += '<option selected value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>'
      } else {
        tmp += '<option value="' + item_.hiddenValue + '">' + item_.viewValue + '</option>'
      }
    }
    return (
      '<select class="cus-sel js-sel-pattern" name="pattern_' +
      item.courseStageCode +
      '">' +
      tmp +
      '</select>'
    )
  }
  // 周中/末
  var weekSelect = function (data) {
    var tmp_html = ''
    if (checkTsWeekType(data.ifWeek)) {
      tmp_html = '<option value="">无</option>'
    } else {
      tmp_html =
        '<option ' +
        (data.courseWeek == 'weekdays' ? 'selected' : '') +
        ' value="weekdays">周中</option>' +
        '<option ' +
        (data.courseWeek == 'weekend' ? 'selected' : '') +
        ' value="weekend">周末</option>'
    }
    return tmp_html
  }
  var htmlStr = null
  // 处理合同主体
  processNoCompanyCode(item)
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
      '</tr>'
    return $(htmlStr).data('sdata', item)
  } else if (type === 'edit') {
    // 处理 选班/优惠/教具 data 数据
    var paramsClass = {
      itemcode: item.classCode,
      itemname: item.className,
      classLxName: item.classLxName,
      teach: item.teach,
      fullNumber: item.fullNumber,
      actualNumber: item.actualNumber
    }
    var paramsDiscount = []
    if (item.discountList.length) {
      paramsDiscount = item.discountList
    }
    var paramsGooks = {}
    if (item.goodsCode) {
      paramsGooks = {
        goodsCode: item.goodsCode,
        goodsName: item.goodsName,
        goodsUnitCode: item.goodsUnit,
        goodsUnitName: item.goodsUnitName,
        hourseCode: item.hourseCode,
        teachingMaterialCost: item.teachingMaterialCost,
        sellGoodsNum: 1
      }
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
      '</tr>'
    return $(htmlStr)
      .data('sdata', item)
      .data('paramsClass', paramsClass)
      .data('paramsDiscount', paramsDiscount)
      .data('paramsGooks', paramsGooks)
  }
}
// 构建 报名课程 HTML
function createCourseHTML(sArr, callback, type) {
  var _type = type || 'create'
  var tmp_obj = handleCourseData(sArr)
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
    )
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
    )
  }
  // 方向
  $.each(tmp_obj.d, function (key, item) {
    if ($('#' + key).length) {
      return false
    }

    var _lianbaoHTML = lianbaoHTML()

    CLASS_HTML.append(
      '<div class="direction-item" id="' +
        key +
        '"><div class="dir-name">' +
        item.name +
        '</div>' +
        _lianbaoHTML +
        '</div>'
    )
  })
  // 课程
  $.each(tmp_obj.c, function (key, item) {
    if ($('#' + key).length) {
      return false
    }

    var did = key.split('_')[0]
    var _tableHTML = courseTable(key)

    $('#' + did + '>.dir-name').after(
      '<div class="class-item" id="' +
        key +
        '"><div class="class-name">' +
        item.name +
        '</div><div class="choice-class">' +
        _tableHTML +
        '</div></div>'
    )
  })
  // 阶段
  $.each(tmp_obj.s, function (key, item) {
    var strArr = key.split('_')
    var cid = strArr[0] + '_' + strArr[1]

    var _trHTML = courseTrHTML(strArr[2], item, _type)

    $('#t_' + cid)
      .find('tbody')
      .append(_trHTML)
    // 添加完节点的回调
    callback && callback(cid, item)
  })
  // 特殊处理
  $('.js-money').number(true, 2)
  $('[data-toggle="tooltip"]').tooltip()
}
/**
 * 构建 证书 HTML
 * @param {array} list 数据数组
 * @param {string} tarDom 要追加的节点对象
 * @param {string} type 模式 create|edit
 */
function createCertificateHTML(list, tarDom, type) {
  var _type = type || 'create'
  var trHTML = function (row) {
    var htztName = $('#payLegalSubjectName').val() || '--'
    var htmlStr = null
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
        '" type="text" class="input-sm cus-inp js-zs-id-num" ck-cus-card="true" ck-cus-length="true"/></td>' +
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
        '</tr>'
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
        '" type="text" class="input-sm cus-inp js-zs-id-num" ck-cus-card="true" ck-cus-length="true"/></td>' +
        '<td><button type="button" class="btn btn-xs btn-primary js-zs-btn-course">选课</button><input type="text" class="input-sm cus-inp js-zs-course" style="width: auto; margin-left: 4px;" name="zs_id_num_' +
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
        '</tr>'
    }
    return $(htmlStr).data('sdata', row)
  }
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">证书申请</div><div class="class-item js-table-wrp"></div></div>'
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
    '<tbody></tbody></table>'

  list.forEach(function (row) {
    var tbNode = $('#js_table_zs')

    if (!tbNode.length) {
      tarDom.html(outWrpHTML)
      tarDom.find('.js-table-wrp').html(tableHTML)
      $('#js_table_zs').append(trHTML(row))
    } else {
      if (!tbNode.find('#zs_' + row.itemid).length) {
        tbNode.append(trHTML(row))
      } else {
        // todo 提示信息
      }
    }
  })
  $('.js-money').number(true, 2)
}
/**
 * 构建 其他缴费 HTML
 * @param {array} list 数据数组
 * @param {string} tarDom 要追加的节点对象
 * @param {string} type 模式 create|edit
 */
function createOtherPayHTML(list, tarDom, type) {
  var _type = type || 'create'
  var trHTML = function (row) {
    var htztName = $('#payLegalSubjectName').val() || '--'
    if (_type === 'edit') {
      row.paymentPrice = row.retailPrice = row.thisPaymentAmount
    }
    return $(
      '<tr class="js-tr-item">' +
        '<td>' +
        row.paymentName +
        '</td>' +
        '<td>' +
        row.paymentSecName +
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
    ).data('sdata', row)
  }
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">其他缴费</div><div class="class-item js-table-wrp"></div></div>'
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
    '<tbody></tbody></table>'

  list.forEach(function (row) {
    var tbNode = $('#js_table_qt')

    if (!tbNode.length) {
      tarDom.html(outWrpHTML)
      tarDom.find('.js-table-wrp').html(tableHTML)
      $('#js_table_qt').append(trHTML(row))
    } else {
      tbNode.append(trHTML(row))
    }
  })
  $('.js-money').number(true, 2)
}
/**
 * 构建 教具 html
 * @param {array} list 数据数组
 * @param {string} tarDom 要追加的节点对象
 * @param {string} type 模式 create|edit
 */
function createTeachingHTML(list, tarDom, type) {
  var _type = type || 'create'
  // 二级缴费类型
  var selectList = function (val) {
    var tmp = []
    if (teachingSecTypeList.length) {
      for (var i = 0; i < teachingSecTypeList.length; i++) {
        var item = teachingSecTypeList[i]
        if (val == item.hiddenValue) {
          tmp.push(
            '<option value="' + item.hiddenValue + '" selected>' + item.viewValue + '</option>'
          )
        } else {
          tmp.push('<option value="' + item.hiddenValue + '">' + item.viewValue + '</option>')
        }
      }
    }
    return tmp.join('')
  }

  var trHTML = function (row) {
    var htmlStr = null
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
        '</tr>'
    } else if (_type === 'edit') {
      // 优惠金额处理
      var minPrice = COM_FN.mul(row.sellGoodsNum, row.minRetailPrice || row.retailPrice)
      var tmp = COM_FN.sub(minPrice, COM_FN.add(row.specialsDis, row.fullEveryDis))
      var minPriceByDiscount = tmp > 0 ? tmp : 0
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
        '</tr>'
    }

    return $(htmlStr).data('sdata', row)
  }
  var outWrpHTML =
    '<div class="direction-item"><div class="dir-name">购买教具</div><div class="class-item js-table-wrp"></div><div class="lian-wrp form-inline clearfix"><div class="form-group form-group-sm"><label class="checkbox-inline"><input class="js-dis-mjmg" type="checkbox" value="1">使用满购优惠</label></div><div class="form-group form-group-sm js-mjmg-cont"></div><div class="total pull-right form-group form-group-sm"><label>合计：</label><input type="text" class="form-control input-sm js-money js-total-money" readonly></div></div></div>'

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
    '<tbody></tbody></table>'

  list.forEach(function (row) {
    var tbNode = $('#js_table_teaching')

    if (!tbNode.length) {
      tarDom.html(outWrpHTML)
      tarDom.find('.js-table-wrp').html(tableHTML)
      $('#js_table_teaching').append(trHTML(row))
    } else {
      tbNode.append(trHTML(row))
    }
  })
  $('.js-money').number(true, 2)
}

// 删除记录 证书 其他缴费 充值卡
function removeItemTr(doom) {
  var t_ = doom
  var p_tr = t_.closest('.js-tr-item')
  var p_form = t_.closest('.sign-class-wrp')

  COM_TOOLS.confirm('确定删除？', {
    closeBtn: 0,
    yes: function (index) {
      // 清除数据
      if (p_tr.siblings().length === 0) {
        p_form.html('')
      } else {
        p_tr.remove()
      }

      cumCloseWin(index)
    }
  })
}
// 计算 价格=课时*单价
function js_classPrice($obj) {
  var class_hour = Number($obj.find('.js-dy-classHour').val())
  var class_price = Number($obj.find('.js-dy-price').val())

  var res = COM_FN.mul(class_hour, class_price)
  $obj.find('.js-price-course').val(res)
}

// 计算 折后金额=价格-优惠
function js_discountPrice($obj) {
  var class_total_price = Number($obj.find('.js-price-course').val())
  var discount_price = Number($obj.find('.js-dy-discount').val())

  var res = COM_FN.sub(class_total_price, discount_price)
  $obj.find('.js-price-discount').val(res)
}

function js_outstanding($tr) {
  var s_data = $tr.data('sdata')
  var discount_amount = Number($tr.find('.js-price-discount').val())
  var outstanding_amount = COM_FN.sub(discount_amount, s_data.totalPaymentAmount || 0)

  $tr.find('.js-dy-outstanding').val(outstanding_amount)
}

// 小计 传 choice-class
function xiaojiMoney($dir) {
  var p_discount = $dir.find('.js-price-discount')
  var sum = 0

  p_discount.each(function (key, item) {
    var t_val = Number($(this).val())
    sum = COM_FN.add(sum, t_val)
  })

  $dir.find('.js-total-money').val(sum)
}

// 清理 班级
function clearSelectClass($obj_tr) {
  $obj_tr.removeData('params-class')
  $obj_tr.find('.js-inp-hide-class').val('')
  $obj_tr.find('.js-btn-class').removeAttr('data-original-title')

  alterBtnStatus('clear', $obj_tr.find('.js-btn-class'), '选班')
}

// 清理 联报
function clearLBData($obj_dir) {
  // 清理 按钮数据 data
  $obj_dir.find('.js-btn-lb').removeData('sdata').removeAttr('data-original-title')
  $obj_dir.find('.js-lb-discount').val(0)
  // 恢复 方向原有优惠
  $obj_dir.find('.js-tr-item').each(function (key, item) {
    var t_tr = $(this)
    // var dis_data = t_tr.data('params-discount') || [];

    // var discount_price = sumDiscount(dis_data, 'price');
    fillDiscount(t_tr, $obj_dir)

    js_discountPrice(t_tr)

    js_outstanding(t_tr)
  })
}
// 总计应付金额
function sumTotalPayment(arr) {
  var sum = 0

  if (arr && arr.length) {
    arr.forEach(function (n, i) {
      $.each(n, function () {
        var t_ = $(this)
        var val = Number(t_.val())
        sum = COM_FN.add(sum, val)
      })
    })
  }

  return sum
}
// 处理课程没有合同主体
function processNoCompanyCode(item) {
  if (item.companyCode == -1 || item.companyCode == null) {
    item.companyCode = ''
    item.companyName = ''
  }
}
// dt 新旧数据匹配 cloneDTData
function checkDTData(list) {
  var arr = []

  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    // 不存在
    if (cloneDTData['cs_' + item.courseStageCode] == null) {
      cloneDTData['cs_' + item.courseStageCode] = item
      arr.push(item)
    }
  }

  return arr
}
// {d: {d1: {id, name}}, c: {d1_c1: {id, name}}, s: {d1_c1_s1: {item}}}
// 处理所选课程数据
function handleCourseData(list) {
  var obj = {
    d: {},
    c: {},
    s: {}
  }

  for (var i = 0; i < list.length; i++) {
    var item = list[i]

    var did = item.classificationCode
    var cid = item.courseCode
    var sid = item.courseStageCode

    // 方向
    if (obj.d['d' + did] == null) {
      obj.d['d' + did] = {
        id: did,
        name: item.classificationName,
        lb_data: item.mulDiscountData || {}
      }
    }
    // 课程
    if (obj.c['d' + did + '_c' + cid] == null) {
      obj.c['d' + did + '_c' + cid] = {
        id: cid,
        name: item.courseName
      }
    }
    // 阶段
    obj.s['d' + did + '_c' + cid + '_s' + sid] = item
  }

  return obj
}
// 特殊课程判断 周中/末
// CO201704010012 | 0 select 是空
function checkTsWeekType(type_params) {
  var res = false
  if (type_params == '0') {
    res = true
  }
  return res
}
// 汇总 优惠金额
function sumDiscount(list, key) {
  if (!list) {
    return 0
  }
  var sum = 0

  for (var i = 0; i < list.length; i++) {
    var item = list[i]

    sum = COM_FN.add(sum, item[key])
  }

  return sum
}

// 填写 优惠金额
function fillDiscount($obj_tr, $obj_dir, dis_price) {
  var tr_data = $obj_tr.data('sdata')
  var paramsDiscount = $obj_tr.data('params-discount') || []
  var lb_data = $obj_dir.find('.js-btn-lb').data('sdata')

  var discount_price = sumDiscount(paramsDiscount, 'price')
  var discount_amount = discount_price

  var t_obj = $obj_tr.find('.js-dy-discount')

  if (!$.isEmptyObject(lb_data)) {
    for (var i = 0; i < lb_data.list.length; i++) {
      var item = lb_data.list[i]
      if (tr_data.courseStageCode == item.courseStageCode) {
        discount_amount = COM_FN.add(discount_price, item.dismoney)
      }
    }
  }

  t_obj.attr('ck-discount', discount_amount).val(discount_amount)

  if (discount_amount && paramsDiscount.length) {
    t_obj.removeAttr('readonly')
  } else {
    t_obj.attr('readonly', true)
  }
}
/**
 * 校验信息唯一
 * @param {string} type ‘add|del’
 * @param {string} dom dom对象
 * @param {string} id 唯一标识
 */
function checkInfoSole(type, dom, id) {
  var flag = false
  var checkList = dom.data('checklist') || {}
  var _ids = id instanceof Array ? id : [id]

  for (var i = 0; i < _ids.length; i++) {
    var item = _ids[i]
    if (type === 'add') {
      if (!checkList[item]) {
        checkList[item] = flag = true
      }
    } else if (type === 'del') {
      if (checkList[item]) {
        delete checkList[item]
        flag = true
      }
    }
  }

  dom.data('checklist', checkList)
  return flag
}
// 修改 选班 教具 按钮
function alterBtnStatus(type, $btn, text) {
  if (type == 'add') {
    $btn.text('已选').addClass('btn-success')
  } else if (type == 'clear') {
    $btn.text(text).removeClass('btn-success')
  }
}
// 删除 tr-node
function removeSignupCourse($obj) {
  var p_class = $obj.closest('.class-item')
  var p_dir = $obj.closest('.direction-item')
  // 删除-阶段
  $obj.remove()
  // 删除-课程
  if (p_class.find('.js-tr-item').length == 0) {
    p_class.remove()
  }
  // 删除-方向
  if (p_dir.find('.class-item').length == 0) {
    p_dir.remove()
  }
}
// 联报状态判断
function checkLB(list) {
  var sum = 0

  $.each(list, function (key, item) {
    var baseCH = this.dataset.orgHour
    var vale = this.value

    sum += COM_FN.div(vale, baseCH)
  })

  return {
    sum: sum,
    res: sum >= 2
  }
}
// 构建 联报数据
function createLBData(list) {
  var arr = []

  $.each(list, function (key, item) {
    var t_ = $(item)
    var data = t_.data('sdata')
    var discount_data = t_.data('params-discount')
    // var discount_amount = Number(t_.find('.js-dy-discount').val());
    var source_discount_amount = sumDiscount(discount_data, 'price')

    var dy_class_hour = Number(t_.find('.js-dy-classHour').val())
    var dy_class_price = Number(t_.find('.js-dy-price').val())
    var c_price = COM_FN.mul(dy_class_hour, dy_class_price)

    arr.push({
      courseStageCode: data.courseStageCode,
      discountAmount: source_discount_amount,
      totalAmount: c_price,
      classHour: dy_class_hour,
      classHourPrice: dy_class_price
    })
  })

  return arr
}
// 清理 优惠金额 该方向下的所有
function clearTrDiscount($obj_tr) {
  $obj_tr.removeData('params-discount')
}

// ?教具相关处理
// 计算 tr 小计
function te_sumTrSubtotalByNum(dom) {
  // 计算对应的优惠(选择后的) 最小为 0
  var sumDiscountBySelection = function (arr) {
    arr = arr || []
    return arr.reduce(function (prev, cur) {
      var tmp = COM_FN.sub(prev, cur)
      return tmp <= 0 ? 0 : tmp
    })
  }

  dom = dom || SignTeachingHTML.find('.js-tr-item')

  dom.each(function () {
    var t_ = $(this)
    var t_num = t_.find('.js-goods-num').val()
    var sdata = t_.data('sdata')
    var disData = t_.data('disdata') || { resTotal: 0 }
    // 合计价格
    var t_price = COM_FN.mul(t_num, sdata.retailPrice)
    // 满购
    var cur_mgDis = t_.find('.js-mg-discount').val() * 1
    // 建议零售价
    t_.find('.js-suggest-price').val(t_price)
    // 最低售价
    var t_min_price = COM_FN.mul(t_num, sdata.minRetailPrice || sdata.retailPrice)
    t_.find('.js-min-price').val(t_min_price)
    // 优惠金额
    t_.find('.js-discount-price').val(disData.resTotal)
    // 合计价格
    t_.find('.js-sell-price ')
      .val(sumDiscountBySelection([t_price, disData.resTotal, cur_mgDis]))
      .attr('ck-course-price', sumDiscountBySelection([t_min_price, disData.resTotal, cur_mgDis]))
      .trigger('focusout.validate')
  })
}
function teachimg_sumTotal() {
  var sum = 0
  TEACHING_AID_HTML.find('.js-sell-price').each(function () {
    var t = $(this)
    var val = t.val()
    sum = COM_FN.add(sum, val)
  })
  TEACHING_AID_HTML.find('.js-total-money').val(sum)
}

// 清空 优惠/满购
function teachimg_clearTrDiscount(dom, type) {
  type = type || 'all'
  if (type === 'all') {
    dom.find('.js-discount-price').val(0)
    dom.removeData('disdata')
  }

  TEACHING_AID_HTML.find('.js-mg-discount').val(0)
  TEACHING_AID_HTML.find('.direction-item').removeData('mgdata')
  TEACHING_AID_HTML.find('.js-dis-mjmg').prop('checked', false)
  TEACHING_AID_HTML.find('.js-mjmg-cont').html('')
}

// 按比例分摊满购优惠
function byProportionDistribution(dom, total, disTotal) {
  var tmp = disTotal
  $.each(dom, function () {
    var t_ = $(this)
    var sPrice = t_.find('.js-suggest-price').val()
    // 所占比例
    var tRatio = COM_FN.div(sPrice, total)
    // 所占优惠 取整
    var tDis = Math.ceil(COM_FN.mul(tRatio, tmp))
    if (disTotal > tDis) {
      disTotal = COM_FN.sub(disTotal, tDis)
    } else {
      tDis = disTotal
      disTotal = 0
    }
    t_.find('.js-mg-discount').val(tDis)
  })
}
// 获取课时限制数
var DIR_LIMIT = '-1'
var COURSE_LIMIT = '-1'
function getClassHourLimit(orgCode) {
  $.get(CONTEXT_PATH + '/limitMul/findLimitByCenter?orgCoreCode=' + orgCode).then(function (res) {
    if (res.code == 1) {
      DIR_LIMIT = res.data.difference
      COURSE_LIMIT = res.data.same
    } else {
      COM_TOOLS.alert(res.msg)
    }
  })
}

// 校验添加的 方向课时 及 总课时 数
function handleClassHourNum(tarDom) {
  function trClassHour(list) {
    // console.log(list)
    var sum = 0
    $.each(list, function () {
      // console.log(this)
      var baseCH = this.dataset.orgHour
      var vale = this.value
      // console.log(baseCH, vale)
      sum += COM_FN.div(vale, baseCH)
    })
    return sum
  }

  var _tmp = []
  var _sum = 0

  tarDom.find('.direction-item').each(function () {
    var tDir = $(this)
    var tClass = tDir.find('.js-dy-classHour')
    var sData = tDir.find('.js-tr-item').eq(0).data('sdata')

    var rSum = trClassHour(tClass)
    _sum = COM_FN.add(_sum, rSum)

    _tmp.push({
      dirCode: sData.classificationCode,
      dirName: sData.classificationName,
      totalHour: rSum
    })
  })
  return {
    items: _tmp,
    totalHour: _sum
  }
}

function checkClassHourLimit(params) {
  if (COURSE_LIMIT != '-1') {
    // console.log(222)
    for (var i = 0; i < params.items.length; i++) {
      var item = params.items[i]
      if (item.totalHour && item.totalHour > COURSE_LIMIT) {
        return { hour: COURSE_LIMIT, res: true }
      }
    }
  }
  if (DIR_LIMIT != '-1') {
    // console.log(111)
    if (params.totalHour && params.totalHour > DIR_LIMIT) {
      return { hour: DIR_LIMIT, res: true }
    }
  }
  return { res: false }
}
