var GOODS_INFO_FORM = $('#js_formGoodsInfo')
var GOODS_PY_FORM = $('#js_formPY')
var GOODS_PK_FORM = $('#js_formPK')

var GOODS_LIST_HTML = $('#js_goodsListTbody')
var PY_LIST_HTML = $('#js_PYListTbody')
var PK_LIST_HTML = $('#js_PKListTbody')

var PY_REASON_LIST = []
var PK_REASON_LIST = []
// validate 校验
var GOODS_INFO_VALID = GOODS_INFO_FORM.validate()
var GOODS_PK_VALID = GOODS_PK_FORM.validate()

var SUM_TOOLS = {
  add: function(arg1, arg2) {
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
  sub: function(arg1, arg2) {
    return this.add(arg1, -Number(arg2), arguments[2])
  },
  mul: function(arg1, arg2) {
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
  div: function(arg1, arg2) {
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
// 跳到制定位置
function toTargetStepNew(btnNode, stepNode, type, prevFn, nextFn) {
  // 执行方法
  var callback = function() {
    if (callback.use) {
      return
    }
    // console.log('-callback-')
    t_.data('stepnum', tmpStep)
    // 按钮处理
    btnNodes.eq(0).prop('disabled', tmpStep === 1)
    btnNodes.eq(1).prop('disabled', tmpStep === stepNodeLen)
    // 滚动位置
    var top = stepNode.eq(--tmpStep).position().top
    $('html').animate({ scrollTop: top - 60 })
    // flag 限制
    callback.use = true
  }
  var t_ = $(btnNode)
  var btnNodes = t_.find('.js-btn-step')
  var stepNode = $(stepNode)

  if (t_.length && stepNode.length) {
    var curStep = t_.data('stepnum')
    var tmpStep = null
    var stepNodeLen = stepNode.length

    if (type === 'last') {
      tmpStep = curStep <= 1 ? 1 : --curStep
    } else if (type === 'next') {
      tmpStep = curStep >= stepNodeLen ? stepNodeLen : ++curStep
    }
    if (!!tmpStep) {
      if (type === 'last') {
        if (prevFn) {
          prevFn(tmpStep, callback)
        } else {
          callback()
        }
      } else if (type === 'next') {
        if (nextFn) {
          nextFn(tmpStep, callback)
        } else {
          callback()
        }
      }
    }
  }
}
// 上/下步骤
$('#js_step_handle').on('click', '.js-btn-step', function() {
  var t_ = $(this)
  var stepType = t_.data('step')

  var baseFn = function(step) {
    step -= 1
    // 修改标题
    var stepTitle = $('.step-show')
    stepTitle.removeClass('active')
    stepTitle.eq(step).addClass('active')
    // 遮罩
    var lock = $('.lock-box-wrp')
    lock.addClass('disabled')
    lock.eq(step).removeClass('disabled')
  }

  toTargetStepNew(
    '.js-step-btn-group',
    '.js-step-wrp',
    stepType,
    function(step, done) {
      COM_TOOLS.confirm('返回上一步，将清空当前步骤数据', {
        closeBtn: 0,
        yes: function(index) {
          // console.log('prev-', step)
          baseFn(step)
          PK_LIST_HTML.html('')
          PY_LIST_HTML.html('')
          $('#js_formSubmit').prop('disabled', true)

          done()
          cumCloseWin(index)
        }
      })
    },
    function(step, done) {
      if (!GOODS_INFO_VALID.form()) {
        return
      }
      COM_TOOLS.confirm('请确认当前步骤数据是否准确', {
        closeBtn: 0,
        yes: function(index) {
          // console.log('next-', step)
          baseFn(step)
          getStatusByNum({
            hourseCode: $('#hourseCode').val(),
            goodsCheckStr: subDataStatusByNum()
          })
          $('#js_formSubmit').prop('disabled', false)

          done()
          cumCloseWin(index)
        }
      })
    }
  )
})
// 构建日期
function createSelDate() {
  var c = new Date()
  var y = c.getFullYear()
  var m = c.getMonth() + 1

  var str = y + '-' + (m > 9 ? m : '0' + m)
  var str2 = y + '-' + (m > 9 ? m - 1 : '0' + (m - 1))

  var html =
    '<option value="' +
    str2 +
    '">' +
    str2 +
    '</option><option value="' +
    str +
    '">' +
    str +
    '</option>'
  $('#month').html(html)
}
// 构建 goodslist
function createGoodsListTr(list) {
  var tmp = []
  list.forEach(function(item) {
    var trNode = $(
      '<tr class="js-tr-item">' +
        '<td>' +
        item.goodsName +
        '</td>' +
        '<td>' +
        item.goodsCode +
        '</td>' +
        '<td class="text-center">' +
        item.systemNum +
        '</td>' +
        '<td class="text-center">' +
        item.systemMoney +
        '</td>' +
        '<td class="text-center">' +
        item.availableSellNum +
        '</td>' +
        '<td class="text-center">' +
        item.availableSellMoney +
        '</td>' +
        '<td class="text-center">' +
        item.unGetNum +
        '</td>' +
        '<td class="text-center">' +
        item.advanceSaleNum +
        '</td>' +
        '<td><input type="number" class="input-sm cus-inp text-center js-stock-num" name="sn_' +
        item.goodsCode +
        '" digits="true" required /></td>' +
        '<td class="text-center js-stock-status"></td>' +
        '</tr>'
    ).data('sdata', item)
    tmp.push(trNode)
  })
  GOODS_LIST_HTML.html(tmp)
}
// 构建 差异数量
function createDiffReason(list) {
  var tmp = []
  list.forEach(function(item) {
    tmp.push('<option value="' + item.hiddenValue + '">' + item.viewValue + '</option>')
  })
  return tmp.join('')
}
// 构建 pk list
function createPKListTr(list) {
  var tmp = []
  list.forEach(function(item) {
    var diffNum = SUM_TOOLS.sub(item.actualNum, item.systemNum)
    var trNode = $(
      '<tr class="js-tr-item">' +
        '<td>' +
        item.goodsName +
        '</td>' +
        '<td>' +
        item.goodsCode +
        '</td>' +
        '<td class="text-center">' +
        checkStockText(diffNum) +
        '</td>' +
        '<td class="text-center">' +
        diffNum +
        '</td>' +
        '<td class="text-center">' +
        item.downMoney +
        '</td>' +
        '<td><select class="cus-sel js-diff-reason">' +
        createDiffReason(PK_REASON_LIST) +
        '</select></td>' +
        '<td><select class="cus-sel js-duty-sel"><option value="1">是</option><option value="0">否</option></select></td>' +
        '<td><div class="input-group input-group-sm cus-inp-group">' +
        '<input type="text" class="form-control input-sm js-duty-inp" name="di_' +
        item.goodsCode +
        '" value="" readonly required />' +
        '<span class="input-group-btn"><button class="btn btn-primary js-duty-btn" type="button"><i class="fa fa-search"></i></button></span>' +
        '</div></td>' +
        '<td><input type="number" class="input-sm cus-inp text-center js-diff-money" name="dm_' +
        item.goodsCode +
        '" value="" required min="0" /></td>' +
        '</tr>'
    ).data('sdata', item)
    tmp.push(trNode)
  })
  PK_LIST_HTML.html(tmp)
}
// 构建 py list
function createPYListTr(list) {
  var tmp = []
  list.forEach(function(item) {
    var diffNum = SUM_TOOLS.sub(item.actualNum, item.systemNum)
    var trNode = $(
      '<tr class="js-tr-item">' +
        '<td>' +
        item.goodsName +
        '</td>' +
        '<td>' +
        item.goodsCode +
        '</td>' +
        '<td class="text-center">' +
        checkStockText(diffNum) +
        '</td>' +
        '<td class="text-center">' +
        diffNum +
        '</td>' +
        '<td class="text-center">' +
        item.upMoney +
        '</td>' +
        '<td><select class="cus-sel js-diff-reason">' +
        createDiffReason(PY_REASON_LIST) +
        '</select></td>' +
        '</tr>'
    ).data('sdata', item)
    tmp.push(trNode)
  })
  PY_LIST_HTML.html(tmp)
}
// 判断库存状态
function checkStockText(num) {
  var getHtml = function(type) {
    var tmp = ''
    switch (type) {
      case -1:
        tmp = '<span class="text-green">盘亏</span>'
        break
      case 0:
        tmp = '<span>盘平</span>'
        break
      case 1:
        tmp = '<span class="text-red">盘盈</span>'
        break
      default:
        tmp = '<span>--</span>'
        break
    }

    return tmp
  }
  var type = num > 0 ? 1 : num === 0 ? 0 : -1
  return getHtml(type)
}
// sub data 获取盘点状态
function subDataStatusByNum() {
  var tmp = []
  GOODS_LIST_HTML.find('.js-tr-item').each(function() {
    var t_ = $(this)
    var t_p = t_.closest('.js-tr-item')
    var sData = t_p.data('sdata')
    var stockNum = t_p.find('.js-stock-num').val()
    tmp.push(sData.goodsCode + ':' + stockNum)
  })
  return tmp.join(',')
}
// 提交申请
function submitData() {
  // 过滤数据
  var filterData = function(data) {
    return {
      goodsCode: data.goodsCode,
      goodsName: data.goodsName,
      systemNum: data.systemNum,
      systemMoney: data.systemMoney,
      availableSellNum: data.availableSellNum,
      availableSellMoney: data.availableSellMoney,
      unGetNum: data.unGetNum,
      unGetMoney: data.unGetMoney,
      advanceSaleNum: data.advanceSaleNum,
      actualNum: data.actualNum,
      status: data.status,
      downMoney: data.downMoney,
      upMoney: data.upMoney,
      reason: data.reason,
      dutyPerson: data.dutyPerson,
      dutyPersonId: data.dutyPersonId,
      fine: data.fine
    }
  }
  // 基础数据
  var tmp = []
  var pkObj = {}
  var pyObj = {}
  // 盘亏
  PK_LIST_HTML.find('.js-tr-item').each(function() {
    var t_ = $(this)
    var sData = t_.data('sdata')
    var userData = t_.data('userdata') || {}
    var reason = t_.find('.js-diff-reason').val()
    var fine = t_.find('.js-diff-money').val() || ''

    pkObj[sData.goodsCode] = {
      status: sData.status,
      downMoney: sData.downMoney,
      upMoney: sData.upMoney,
      reason: reason,
      dutyPerson: userData.itemtxt || '',
      dutyPersonId: userData.itemid || '',
      fine: fine
    }
  })
  // 盘盈
  PY_LIST_HTML.find('.js-tr-item').each(function() {
    var t_ = $(this)
    var sData = t_.data('sdata')
    var reason = t_.find('.js-diff-reason').val()

    pyObj[sData.goodsCode] = {
      status: sData.status,
      downMoney: sData.downMoney,
      upMoney: sData.upMoney,
      reason: reason
    }
  })
  // 商品列表
  GOODS_LIST_HTML.find('.js-tr-item').each(function() {
    var t_ = $(this)
    var sData = filterData(t_.data('sdata'))
    var status = t_.data('status')

    if (sData.goodsCode) {
      sData.actualNum = t_.find('.js-stock-num').val()
      if (status === -1) {
        // 盘亏
        if (pkObj[sData.goodsCode]) {
          tmp.push($.extend({}, sData, pkObj[sData.goodsCode]))
        }
      } else if (status === 1) {
        // 盘盈
        if (pyObj[sData.goodsCode]) {
          tmp.push($.extend({}, sData, pyObj[sData.goodsCode]))
        }
      } else {
        sData.status = '盘平'
        tmp.push(sData)
      }
    }
  })

  return tmp
}
// 事件绑定
$('#js_eventMain')
  .on('change', '#month', function() {
    var val = $(this).val()
    var stockId = $('#hourseCode').val()
    var orgCoreCode = $('#orgCoreCode').val()
    if (stockId) {
      getGoodsList({ checkDateStr: val, hourseCode: stockId, orgCoreCode: orgCoreCode })
    }
  })
  .on('click', '#js_formSubmit', function() {
    if (GOODS_INFO_VALID.form() && GOODS_PK_VALID.form()) {
      console.log('-submit-')
      var baseData = $('#js_hourseBtn').data('sdata')
      baseData.checkDateStr = $('#month').val()

      sendApply(
        JSON.stringify({
          base: baseData,
          detailArray: submitData()
        })
      )
    } else {
      console.log('-submit error-')
    }
  })
  .on('input', '.js-stock-num', function(e) {
    // 输入的实际库存
    var t_ = $(this)
    var t_p = t_.closest('.js-tr-item')
    var sData = t_p.data('sdata')
    var cVal = e.target.value
    // console.log(cVal, sData)
    if (!!cVal && cVal >= 0) {
      var res = SUM_TOOLS.sub(cVal * 1, sData.systemNum * 1)
      // console.log('res-', res)
      t_p.find('.js-stock-status').html(checkStockText(res))
      t_p.data('status', res > 0 ? 1 : res === 0 ? 0 : -1)
    } else {
      t_p.find('.js-stock-status').html('')
      t_p.removeData('status')
    }
  })
  .on('change', '.js-duty-sel', function() {
    // 是否有责任人
    var t_ = $(this)
    var t_p = t_.closest('.js-tr-item')
    var tVal = t_.val()

    if (tVal == 1) {
      t_p.find('.js-duty-inp, .js-diff-money, .js-duty-btn').prop('disabled', false)
    } else {
      t_p.removeData('userdata')
      t_p.find('.js-duty-inp, .js-diff-money').val('')
      t_p
        .find('.js-duty-inp, .js-diff-money, .js-duty-btn')
        .prop('disabled', true)
        .tooltip('destroy')
    }
  })
  .on('click', '.js-duty-btn', function() {
    // 是否有责任人
    var t_ = $(this)
    var t_p = t_.closest('.js-tr-item')
    //显示主角色与兼任角色
    cumParentWinModal(
      '选择责任人',
      SERVER_API + '/kcrmuser/chooseUser?centerCodes=' + $('#orgCoreCode').val(),
      {
        area: ['800px', '380px'],
        callback: {
          getData: function(params) {
            console.log(params)
            if (params) {
              t_p.data('userdata', params)
              t_p.find('.js-duty-inp').val(params.itemtxt)
            }
          }
        }
      }
    )
  })
