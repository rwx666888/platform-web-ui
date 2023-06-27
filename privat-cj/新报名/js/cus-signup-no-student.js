// !version 20200318.200

// 常量
var DELETE_COURSE_ARR = []
var SignTeachingHTML = $('#signTeachingHTML')
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
  },
  getVal: function (param1, param2, list) {
    var res = ''

    $.each(list, function (key, item) {
      if (param1 == list[param2]) {
        res = item
      }
    })

    return res
  }
}

$.validator.addMethod(
  'ck-course-price',
  function (value, element, params) {
    value = Number(value)

    return this.optional(element) || value >= params
  },
  '必须>=基础值'
)

// instance
var baseValid = $('#baseInfo').validate()
var payValid = $('#payInfo').validate()
var courseStageValid = $('#signClassHTML').validate()
// 定金
var signCertificateValid = $('#signCertificateHTML').validate()
var signTeachingValid = $('#signTeachingHTML').validate()

function initSchool(data) {
  var arr = ['<option value="">请选择</option>']
  for (var i = 0; i < data.length; i++) {
    arr.push(
      '<option value="' +
        data[i] +
        '" ' +
        (data[i] == schoolValue ? 'selected' : '') +
        '>' +
        data[i] +
        '</option>'
    )
  }
  sel2_school.updateOption(arr.join(''))
}

// 学校 sel2
var sel2_school = COM_TOOLS.select2_init('school')
// datatable
var DT_instance_flag = true
var cloneDTData = {}

var searchParemOBj_ = {
  ifBindGoodsFlag: true,
  orgCoreCode: $('#orgCore_code').val(),
  studentCodeIn: '',
  studentCodeNotIn: ''
}
var dt_choice_class = ''

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

// 修改 选班 教具 按钮
function alterBtnStatus(type, $btn, text) {
  if (type == 'add') {
    $btn.text('已选').addClass('btn-success')
  } else if (type == 'clear') {
    $btn.text(text).removeClass('btn-success')
  }
}
// 清理 优惠金额 该方向下的所有
function clearTrDiscount($obj_tr) {
  $obj_tr.removeData('params-discount')
}

// 清理 优惠类型 empty
function clearDiscountEmpty($obj, $obj_dir) {
  var tr_data = $obj.data('sdata')
  var lb_data = $obj_dir.find('.js-btn-lb').data('sdata')
  var discount_amount = 0

  if (!$.isEmptyObject(lb_data)) {
    for (var i = 0; i < lb_data.list.length; i++) {
      var item = lb_data.list[i]
      if (tr_data.courseStageCode == item.courseStageCode) {
        discount_amount = item.dismoney
      }
    }
  }

  $obj
    .find('.js-dy-discount')
    .val(discount_amount)
    .attr('ck-discount', discount_amount)
    .attr('readonly', true)
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

// 强制控制 贴息状态
function setLoanCheckbox(flag) {
  if (flag) {
    $('#interestIndex').show()
  } else {
    $('#interestIndex').hide()
    $('#loanIndex').iCheck('uncheck')
  }
}
// 清理 付款方式
function clearPayInfo(flag) {
  // 付款/支付
  !flag && $('#payMethod,#paymentMethod').val('')
  // 金额
  !flag && $('#totalAmount,#discountAmount').val(0)
  // 定金数据
  $('.js-pay-method[data-type="FKFS02"]').removeData('sdata')
  // 按钮去标记
  $('.js-pay-method,.js-pay2-method').removeClass('btn-success')
  // 转账 转账信息
  $('#transferWrp').hide()
  $('#loanName,#loanCode').val('')
  // 凭证
  $('#certificate_wrp').hide()
  $('#evidenceText,#evidenceUrl,#uploadEvidence_evidence').val('')
  $('#thisPaymentAmount').val(0).closest('.form-group').show()
  clearRechargeCardInfo()
}
// 清理
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
// 小计 传 choice-class
function xiaojiMoney($dir) {
  var p_discount = $dir.find('.js-price-discount')
  var sum = 0

  p_discount.each(function (key, item) {
    var t_val = Number($(this).val())
    sum = COM_FN.add(sum, t_val)
  })

  $dir.find('.js-total-money').val(sum)
  $('#thisPaymentAmount').val(sum)
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
// 处理定金相关
function getFrontMoney(code) {
  var s_data = $('.js-pay-method[data-type="FKFS02"]').data('sdata') || []
  var res = ''

  for (var i = 0; i < s_data.length; i++) {
    var item = s_data[i]

    if (item.courseStageCode == code) {
      res = item.fmPrice
      break
    }
  }
  return res
}
// 11.00 数据处理
function handleNum(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key]
      if (/\.[0-9]{2}$/.test(value)) {
        obj[key] = Number(value)
      }
    }
  }

  return obj
}

// 缴费金额非零判断 及 总计应付金额非0
function decideNo0() {
  var val = Number($('#thisPaymentAmount').val())
  //var totalVal = Number($('#totalAmount').val())

  if (val <= 0) {
    COM_TOOLS.alert('本次缴费金额不能小于0，请填写正确金额。')
    return true
  }
  /*else if (totalVal != 0 && val <= 0) {
    COM_TOOLS.alert('总计应付金额非0，本次缴费金额不能为0，请填写正确金额。')
    return true
  }*/
  return false
}
//缴费金额非零判断 及 总计应付金额非0
function decideNoTeaching() {
  var val = Number($('#thisPaymentAmount').val())
  var totalVal = Number($('#totalAmount').val())

  if (val < 0) {
    COM_TOOLS.alert('本次缴费金额不能小于0，请填写正确金额。')
    return true
  } else if (totalVal != 0 && val <= 0) {
    COM_TOOLS.alert('总计应付金额非0，本次缴费金额不能为0，请填写正确金额。')
    return true
  } else if (totalVal != 0 && val != 0 && totalVal != val) {
    COM_TOOLS.alert('本次缴费金额与合计金额不相等，请填写正确金额。')
    return true
  }
  return false
}

// ts 过滤
function filterArr(arr1, arr2) {
  var _arr = []
  var tmp = {}
  // arr1
  for (var i = 0; i < arr1.length; i++) {
    var item = arr1[i]
    if (tmp['a_' + item.courseStageCode] == null) {
      tmp['a_' + item.courseStageCode] = true
      _arr.push(item)
    }
  }
  // arr2
  for (var i = 0; i < arr2.length; i++) {
    var item = arr2[i]
    if (tmp['a_' + item.courseStageCode] == null) {
      tmp['a_' + item.courseStageCode] = true
      _arr.push(item)
    }
  }

  tmp = null
  return _arr
}
// 判断所有与已有合同主体不同问题
function checkCompanyCode(list) {
  var _list = list || []
  var tmp

  for (var i = 0; i < _list.length; i++) {
    var item = _list[i]

    if (tmp == undefined) {
      tmp = item.companyCode
    }
    if (tmp != item.companyCode) {
      return {
        res: false,
        item: _list[0]
      }
    }
  }

  return {
    res: true
  }
}
// 构建 教具 html
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
        '<td >' +
        row.goodsName +
        '</td>' +
        '<td ><select class="cus-sel js-sec-type" name="g_tye_' +
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
        '<td><button type="button" class="btn btn-xs btn-primary js-btn-discount-teach">优惠</button><input type="text" style="width:100px;"  class="input-sm cus-inp js-money js-discount-price" value="0" readonly/></td>' +
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
        '<td><button type="button" class="btn btn-xs btn-primary js-btn-discount-teach">优惠</button><input type="text" style="width:100px;"  class="input-sm cus-inp js-money js-discount-price" value="' +
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
    '<div class="direction-item"><div class="dir-name">购买教具</div><div class="class-item js-table-wrp"></div><div class="lian-wrp form-inline clearfix"><div class="form-group form-group-sm"><label class="checkbox-inline"><input class="js-dis-mjmg" type="checkbox" value="1">使用满购优惠</label></div><div class="form-group form-group-sm js-mjmg-cont"></div><div class="total pull-right form-group form-group-sm"><label>合计：</label><input type="text" id="totalAmount" class="form-control input-sm js-money js-total-money" readonly></div></div></div>'

  var tableHTML =
    '<table id="js_table_teaching" class="table table-striped table-bordered nowrap" cellspacing="0" width="100%"><thead><tr>' +
    '<th style="width: 200px;">商品名称</th>' +
    '<th style="width: 100px;">类型</th>' +
    '<th >单位</th>' +
    '<th style="width: 30px;">数量</th>' +
    '<th >建议零售价</th>' +
    '<th >最低售价</th>' +
    '<th >特殊优惠</th>' +
    '<th >满购优惠金额</th>' +
    '<th >小计</th>' +
    '<th style="width: 20px;">操作</th>' +
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

// 构建 submit data 教具
function processSubDataTeaching(payInfo) {
  var tmp = []
  var _payMethod = $('#payMethod').val()

  $.each(SignTeachingHTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item)
    var sData = t_.data('sdata')
    var _sellGoodsNum = t_.find('.js-goods-num').val()
    var _thisPaymentAmount = t_.find('.js-sell-price').val()
    var _secType = t_.find('.js-sec-type').val()

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
    })
  })
  return tmp
}

// 跳到制定位置
function toTargetStep(stepNum, type) {
  if (type === 'last') {
    stepNum -= 2
  } else if (type === 'next') {
    stepNum
  }
  // 修改标题
  var stepTitle = $('.step-show')
  stepTitle.removeClass('active')
  stepTitle.eq(stepNum).addClass('active')
  // 滚动位置
  var top = $('.js-step-wrp').eq(stepNum).position().top
  $('html').animate({ scrollTop: top - 60 })
  // 开关 按钮
  if (stepNum == 0) {
    $('.js-btn-step[data-step="last"]').prop('disabled', true)
  } else if (stepNum == 1) {
    $('.js-btn-step').prop('disabled', false)
  } else if (stepNum == 2) {
    $('.js-btn-step[data-step="next"]').prop('disabled', true)
  }
  // 遮罩
  var lock = $('.lock-box-wrp')
  lock.addClass('disabled')
  lock.eq(stepNum).removeClass('disabled')
}

// 获取教具信息用于判断是否可用充值卡
function teachingInfoByCard() {
  var tmp = []
  SignTeachingHTML.find('.js-tr-item').each(function () {
    var t_ = $(this)
    var sData = t_.data('sdata')

    tmp.push({
      paymentType: sData.paymentType,
      paymentSecType: sData.paymentSecType
    })
  })
  return tmp
}

// *按照所购买内容，判断 付款/支付 方式的可用性
// 包含其他缴费不允许使用充值卡或百度贷进行支付
// 单独只有其他缴费可以使用
// 证书缴费不允许使用百度贷支付
// 充值卡购买不允许使用充值卡支付
// 支付为0 ，不允许使用百度贷
function checkZFFSTips(type) {
  var thisPaymentAmount = $('#thisPaymentAmount').val()
  // 收钱吧
  if (type === 'ZFFS11') {
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用收钱吧')
      return false
    }
  }
  // 百度贷
  if (type === 'ZFFS19') {
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用百度贷')
      return false
    }
  }
  // 充值卡方式
  if (type == 'ZFFS13') {
    if (thisPaymentAmount == 0) {
      COM_TOOLS.alert('本次缴费金额为 0 元，不允许使用充值卡')
      return false
    }
  }
  return true
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

  if (type === 'add') {
    if (!checkList[id]) {
      checkList[id] = flag = true
    }
  } else if (type === 'del') {
    if (checkList[id]) {
      delete checkList[id]
      flag = true
    }
  }
  dom.data('checklist', checkList)
  return flag
}

// *event bind
$('#formSubmit').click(function () {
  if (!payValid.form()) {
    // COM_TOOLS.alert('请检查内容是否填写完整')
    return false
  }

  if (decideNo0()) {
    return false
  }

  var p = $('#payMethod').val()
  var cardInfo = $('#js_rechargeCard_wrp').data('card_info')
  if (p == 'ZFFS13' && !cardInfo) {
    COM_TOOLS.alert('使用充值卡支付方式但未选择充值卡')
    return false
  }
  // 确认提示
  COM_TOOLS.confirm('确认后，基本信息将无法更改，请确认！', function (idx) {
    //var base_info = COM_TOOLS.serializeObject('#baseInfo')
    var pay_info = '' //handleNum(COM_TOOLS.serializeObject('#payInfo'))
    // 课程数据
    //var res_sub = submitStageData(base_info, pay_info)
    // 证书
    // var certificate_info = processSubDataCertificate(pay_info)
    // 教具
    var teaching_info = processSubDataTeaching(pay_info)
    // 其他缴费
    //var ohterPay_info = processSubDataOtherPay(pay_info)
    // 充值卡
    //var rechargeCard_info = processSubDataRechargeCard(pay_info)
    // 使用充值卡时追加数据字段
    var cardInfo = $('#js_rechargeCard_wrp').data('card_info')
    /*console.log('base_info-', base_info)
    console.log('pay_info-', pay_info)
    console.log('class_info-', res_sub)
    console.log('certificate_info-', certificate_info)
    console.log('teaching_info-', teaching_info)
    console.log('ohterPay_info-', ohterPay_info)
    console.log('rechargeCard_info-', rechargeCard_info)*/
    // 图片凭证
    //base_info.evidenceUrl = pay_info.evidenceUrl
    var params = {
      signupMul: JSON.stringify(base_info),
      payMsg: JSON.stringify(pay_info),
      signupSubArr: JSON.stringify(res_sub),
      ceriPayArr: JSON.stringify(certificate_info),
      goodsPayArr: JSON.stringify(teaching_info),
      otherPayArr: JSON.stringify(ohterPay_info),
      cardPayArr: JSON.stringify(rechargeCard_info)
    }
    //cumCloseWin(idx)
    //
    /*    if ('ZFFS19' == pay_info.payMethod) {
      if (!checkIfBaiduLoan().succ) {
        COM_TOOLS.alert('当前学员有未扫码的百度贷信息，请先完成原有百度贷，再选择使用新的百度贷。')
        return
      }
    }*/
    COM_TOOLS.loadingShade.open()
    $.post(CONTEXT_PATH + '/newsignup/savaSignup', params)
      .then(function (res) {
        COM_TOOLS.loadingShade.close()
        if (res.code == '0') {
          COM_TOOLS.alert(res.msg)
        } else if (res.code == '1') {
          COM_TOOLS.alert('报名成功')
          var pay_method = pay_info.payMethod
          //新增的百度贷也需要 支付页面，需要与原有的收钱盘分开跳转
          var checkNeedPayIndex = checkIfPayIndex(pay_method)
          if (checkNeedPayIndex) {
            //新的百度贷
            //原有的收钱吧
            cumParentWinModal(
              '支付信息',
              CONTEXT_PATH + '/newsignup/payIndexOther?togetherStamp=' + res.data[0].togetherStamp,
              {
                other: {
                  closeBtn: 0
                }
              }
            )
          }
          cumParentCallValue()
        } else {
          COM_TOOLS.alert('未知错误')
        }
      })
      .fail(function (err) {
        COM_TOOLS.loadingShade.close()
      })
  })
})

$('#formClose').click(function () {
  // cu
  cumParentCallValue()
})

$('#goodsDiv')
  .on('click', '.js-btn-discount', function () {
    // 选择优惠
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var s_data = p_tr.data('sdata')
    var pp_dir = t_.closest('.direction-item')
    var history_data = p_tr.data('params-discount') || []

    var dy_class_hour = Number(p_tr.find('.js-dy-classHour').val())
    var class_price = Number(p_tr.find('.js-price-course').val())

    var week_type = p_tr.find('.js-sel-week').val()

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
    }

    cumParentWinModal(
      '优惠类型选择',
      CONTEXT_PATH + '/newsignup/signupNewDiscount?' + $.param(params),
      {
        callid: {
          classHour: dy_class_hour,
          courseStageCode: s_data.courseStageCode,
          history: history_data
        },
        callback: {
          fn1: function (params) {
            if (params) {
              p_tr.removeData('params-discount').data('params-discount', params)
              clearLBData(pp_dir)

              xiaojiMoney(pp_dir)
            }
          },
          empty: function () {
            p_tr.removeData('params-discount')
            clearLBData(pp_dir)

            xiaojiMoney(pp_dir)
          }
        }
      }
    )
  })
  .on('change', '.js-dy-discount', function () {
    // 优惠金额
    var t_ = $(this)
    var p_tr = $(this).closest('.js-tr-item')
    var pp_dir = t_.closest('.direction-item')

    js_discountPrice(p_tr)
    js_outstanding(p_tr)

    xiaojiMoney(pp_dir)
  })
  .on('click', '#js_addTeaching', function () {
    var _orgCoreCode = $('#orgCore_code').val()
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
            var $dir = SignTeachingHTML.find('.direction-item')
            if (!$dir.length) {
              createTeachingHTML([params], SignTeachingHTML)
              teachimg_sumTotal()
              checkInfoSole('add', SignTeachingHTML.find('.direction-item'), params.goodsCode)
            } else {
              if (checkInfoSole('add', $dir, params.goodsCode)) {
                teachimg_clearTrDiscount('', 'mg')
                createTeachingHTML([params], SignTeachingHTML)
                teachimg_sumTotal()
              } else {
                COM_TOOLS.alert('不可重复添加同一件商品')
              }
            }
          }
        }
      }
    )
  })

// !200610 教具
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

// 计算 教具合计
function teachimg_sumTotal() {
  var sum = 0
  SignTeachingHTML.find('.js-sell-price').each(function () {
    var t = $(this)
    var val = t.val()
    sum = COM_FN.add(sum, val)
  })
  SignTeachingHTML.find('.js-total-money').val(sum)
  $('#thisPaymentAmount').val(sum)
}
// 清空 优惠/满购
function teachimg_clearTrDiscount(dom, type) {
  type = type || 'all'
  if (type === 'all') {
    dom.find('.js-discount-price').val(0)
    dom.removeData('disdata')
  }

  SignTeachingHTML.find('.js-mg-discount').val(0)
  SignTeachingHTML.find('.direction-item').removeData('mgdata')
  SignTeachingHTML.find('.js-dis-mjmg').prop('checked', false)
  SignTeachingHTML.find('.js-mjmg-cont').html('')
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
// *教具 event bind
SignTeachingHTML.on('change', '.js-dis-mjmg', function () {
  var t_ = $(this)
  var flag = t_.prop('checked')

  if (flag) {
    var _orgCoreCode = $('#orgCore_code').val()
    // 建议零售价的总和
    var _total = (function () {
      var sum = 0
      SignTeachingHTML.find('.js-suggest-price').each(function () {
        var val = $(this).val() * 1
        sum += val
      })
      return sum
    })()
    var _totalNum = (function () {
      var sum = 0
      SignTeachingHTML.find('.js-goods-num').each(function () {
        var val = $(this).val() * 1
        sum += val
      })
      return sum
    })()
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
        byProportionDistribution(SignTeachingHTML.find('.js-tr-item'), _total, res.data.discount)
        SignTeachingHTML.find('.direction-item').data('mgdata', res.data)
        te_sumTrSubtotalByNum()
        teachimg_sumTotal()
        // 名称
        SignTeachingHTML.find('.js-mjmg-cont').text(
          '名称：' + res.data.discountName + ' 优惠：' + res.data.discount
        )
      } else {
        COM_TOOLS.alert(res.msg)
        teachimg_clearTrDiscount('', 'mg')
        SignTeachingHTML.find('.js-mjmg-cont').html('')
      }
    })
  } else {
    // 重置 无满购优惠
    teachimg_clearTrDiscount('', 'mg')
    te_sumTrSubtotalByNum()
    teachimg_sumTotal()
  }
})
  .on('blur', '.js-goods-num', function () {
    var t_ = $(this)
    var t_p = t_.closest('.js-tr-item')

    teachimg_clearTrDiscount(t_p)

    te_sumTrSubtotalByNum()

    teachimg_sumTotal()
  })
  .on('click', '.js-btn-discount-teach', function () {
    // 选择优惠
    var t_ = $(this)
    var t_p = t_.closest('.js-tr-item')
    var sData = t_p.data('sdata')
    var goodsNum = t_p.find('.js-goods-num').val()
    // 添加数量
    sData.goodsNums = goodsNum * 1
    var _orgCoreCode = $('#orgCore_code').val()

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
            t_p.data('disdata', params)

            te_sumTrSubtotalByNum(t_p)
            //  总合计
            teachimg_sumTotal()
          }
        }
      }
    )
  })
  .on('blur', '.js-sell-price', function () {
    // 更改合计
    teachimg_sumTotal()
  })
  .on('click', '.js-tr-remove-teach', function () {
    // 删除记录
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var sData = p_tr.data('sdata')
    var p_form = t_.closest('.sign-class-wrp')

    COM_TOOLS.confirm('确定删除？', {
      closeBtn: 0,
      yes: function (index) {
        // 清除数据
        if (p_tr.siblings().length === 0) {
          p_form.html('')
        } else {
          var $dir = SignTeachingHTML.find('.direction-item')
          checkInfoSole('del', $dir, sData.goodsCode)
          p_tr.remove()

          teachimg_clearTrDiscount('', 'mg')
          te_sumTrSubtotalByNum()
          teachimg_sumTotal()
        }
        cumCloseWin(index)
      }
    })
  })
// !end 200610 教具

//判断是否跳转支付页面
function checkIfPayIndex(payMethod) {
  var result = false
  $.ajax({
    url: CONTEXT_PATH + '/newsignup/checkIfPayIndex',
    async: false,
    data: { hiddenValue: payMethod },
    success: function (res) {
      result = res
    }
  })
  return result
}
//判断用户是否有未扫码的百度贷
/*function checkIfBaiduLoan() {
  var result = false
  $.ajax({
    url:
        CONTEXT_PATH + '/newsignup/checkIfBaiduLoan?informationCode=' + $('#informationCode').val(),
    async: false,
    success: function(res) {
      result = res
    }
  })
  return result
}*/

// !200619 优惠模版
function templateDataToHTML(rData) {
  tmpId = rData.id
  if (rData.courseList && rData.courseList.length) {
    rData.courseList.forEach(function (n) {
      var dirData = n
      var filterData = checkDTData(dirData.dirList)

      createCourseHTML(
        filterData,
        function (cid, item) {
          var p_dir = $('#d' + item.classificationCode)
          p_dir.data('sdata', {
            id: dirData.id
          })
          // 联报优惠
          if (dirData.mulDiscountData.code) {
            p_dir
              .find('.js-btn-lb')
              .attr('title', dirData.mulDiscountData.name)
              .data('sdata', { item: dirData.mulDiscountData })
            p_dir.find('.js-lb-discount').val(dirData.mulDiscountData.discountAmount)
          }
          // 小计
          xiaojiMoney(p_dir)
        },
        'edit'
      )
    })
  }

  if (rData.teachAidsList && rData.teachAidsList.length) {
    createTeachingHTML(rData.teachAidsList, SignTeachingHTML, 'edit')
    // 防重复
    var tmp = $.map(rData.teachAidsList, function (n) {
      return n.goodsCode
    })
    checkInfoSole('add', SignTeachingHTML.find('.direction-item'), tmp)
    // 满购优惠
    if (rData.teachAidsList[0].discountCode) {
      var _mgData = {
        discountCode: rData.teachAidsList[0].discountCode,
        discountName: rData.teachAidsList[0].discountName,
        discount: rData.teachAidsList[0].fullAllDis
      }
      SignTeachingHTML.find('.js-dis-mjmg').prop('checked', true)
      SignTeachingHTML.find('.direction-item').data('mgdata', _mgData)
      SignTeachingHTML.find('.js-mjmg-cont').text(
        '名称：' + _mgData.discountName + ' 优惠：' + _mgData.discount
      )
    }
    // 合计
    teachimg_sumTotal()
  }
}
// 构建中心套餐选项
function createTmpItem(list) {
  var tmp = []
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    tmp.push(
      '<button class="js-tmp-item" data-code="' +
        item.packageCode +
        '">' +
        item.packageName +
        '</button>'
    )
  }
  return tmp.join('')
}
function getTmpbyCode(code) {
  $.post(CONTEXT_PATH + '/packageManager/queryDetail', { packageCode: code }).then(function (res) {
    if (res) {
      templateDataToHTML(res)
    } else {
      $('#js_org_tmp').find('.js-tmp-item').prop('disabled', false)
    }
  })
}
