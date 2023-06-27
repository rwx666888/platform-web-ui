// !200615 v1.0 报名模版

// 常量
var CLASS_HTML = $('#signClassHTML')
var CERTIFICATE_HTML = $('#signCertificateHTML')
var TEACHING_AID_HTML = $('#signTeachingAidHTML')
var OTHER_PAY_HTML = $('#signOtherPayHTML')
// 校验
var BASE_VALID = $('#baseInfo').validate()
var CLASS_VALID = CLASS_HTML.validate()
var CERTIFICATE_VALID = CERTIFICATE_HTML.validate()
var TEACHING_AID_VALID = TEACHING_AID_HTML.validate()
var OTHER_PAY_VALID = OTHER_PAY_HTML.validate()

// 特常量
var tmpId = ''
var DT_instance_flag = true
var cloneDTData = {}
var searchParemOBj_ = {
  ifBindGoodsFlag: true,
  studentCodeIn: '',
  studentCodeNotIn: '',
  orgCoreCode: $('#orgCore_code').val()
}
var dt_choice_class = '' // dt js 实例
// 方法初始化
;(function () {
  getClassHourLimit($('#orgCore_code').val())
})()

// *选课弹窗 evnet
$('#eventMain_xc')
  .on('click', '#choiceClassSearch', function () {
    searchParemOBj_['orgCoreCode'] = $('#orgCore_code').val()
    searchParemOBj_['classificationName'] = $.trim($('#courseDirection').val())
    searchParemOBj_['courseName'] = $.trim($('#courseName').val())

    dt_choice_class.setAjaxData(searchParemOBj_)
  })
  .on('click', '#choiceClassAdd', function () {
    // 添加 课程
    var choice_dt_data = dt_choice_class.getSelectRowsData()
    dt_choice_class.table.rows().deselect()

    // 获取差异的 dt_data
    var arr = checkDTData(choice_dt_data)

    createCourseHTML(arr, function (cid, item) {
      var p_dir = $('#d' + item.classificationCode)
      // 清理联报
      var lb_Data = p_dir.find('.js-btn-lb').data('sdata')
      if (!$.isEmptyObject(lb_Data)) {
        clearLBData(p_dir)
      }
      // 小计
      xiaojiMoney(p_dir)
    })

    cumCloseWin(SCBoxIdx)
  })

// * main bind
$('#eventMain')
  //中心选择
  .on('click', '#btnPackageCenter', function () {
    // 中心
    cumParentWinModal(
      TEDU_MESSAGE.get('kcrm.basic.lable.class_center'),
      CONTEXT_PATH + '/center/toChooseCenter?type=class',
      {
        area: ['600px', '480px'],
        callid: 'orgCore',
        callback: {
          fn1: function (params) {
            var _orgCode = $('#orgCore_code').val()
            // getOrgCoreTmpList(_orgCode)
            // getBtnListByOrg(_orgCode)
            getClassHourLimit(_orgCode)
          }
        }
      }
    )
  })
  .on('click', '#formSubmit', function () {
    if (
      !CLASS_HTML.children().length &&
      !CERTIFICATE_HTML.children().length &&
      !TEACHING_AID_HTML.children().length &&
      !OTHER_PAY_HTML.children().length
    ) {
      COM_TOOLS.alert('请最少添加一项内容')
      return false
    }
    // 课时数限制
    var resHour = checkClassHourLimit(handleClassHourNum(CLASS_HTML))
    if (resHour.res) {
      COM_TOOLS.alert('联报年数超过集团规定限制(联报不得大于' + resHour.hour + ')，请重新选择！')
      return false
    }
    if (
      !(
        BASE_VALID.form() &&
        CLASS_VALID.form() &&
        CERTIFICATE_VALID.form() &&
        TEACHING_AID_VALID.form() &&
        OTHER_PAY_VALID.form()
      )
    ) {
      COM_TOOLS.alert('请检查内容是否填写完整')
      return false
    }
    COM_TOOLS.loadingShade.open()
    var courseData = subData_course()
    var certData = subData_cert()
    var otherData = subData_otherPay()
    var teachData = subData_teaching()

    console.log('courseData--', courseData)
    console.log('certData--', certData)
    console.log('otherData--', otherData)
    console.log('teachData--', teachData)

    var _totalPayment = sumTotalPayment([
      CLASS_HTML.find('.js-price-discount'),
      CERTIFICATE_HTML.find('.js-zs-price'),
      TEACHING_AID_HTML.find('.js-sell-price'),
      OTHER_PAY_HTML.find('.js-qt-price')
    ])
    var _packageType = $('#packageType').val()
    var _packageName = $('#packageName').val()
    var _orgCoreCode = $('#orgCore_code').val()
    var _orgCore = $('#orgCore').val()
    // courseList: JSON.stringify(courseData),
    // certList: JSON.stringify(certData),
    // otherPayList: JSON.stringify(otherData),
    // teachAidsList: JSON.stringify(teachData)
    $.post(CONTEXT_PATH + '/packageManager/save', {
      reqJson: JSON.stringify({
        id: tmpId,
        packageCode: $('#js_packageCode').val(),
        packageName: _packageName,
        packageOrgCoreCode: _orgCoreCode,
        packageOrgCoreName: _orgCore,
        packageStatus: '',
        packageType: _packageType,
        packageStartDate: '',
        packageEndDate: '',
        packageAmount: _totalPayment,
        courseList: courseData,
        certList: certData,
        otherPayList: otherData,
        teachAidsList: teachData
      })
    }).then(function (res) {
      COM_TOOLS.loadingShade.close()
      if (res.code == 1) {
        cumParentCallValue()
      } else {
        COM_TOOLS.alert(res.msg)
      }
    })
  })
  //取消按钮
  .on('click', '#cancel', function () {
    cumParentCallValue()
  })
  .on('click', '#js_addClass', function () {
    // 添加信息-课程
    SCBoxIdx = cumCurWinModal('选择课程', $('#selctClassWrp'), '', {
      area: ['800px', '400px'],
      type: 1,
      success: function (layer) {
        if (DT_instance_flag) {
          DT_instance_flag = false
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
          )
        }
      },
      end: function () {}
    })
  })
  .on('click', '#js_addCertificate', function () {
    // 添加信息-证书
    cumParentWinModal('证书选择', CONTEXT_PATH + '/certificateBase/toChooseCertificate', {
      area: ['800px', '480px'],
      callback: {
        getData: function (data) {
          createCertificateHTML(data, CERTIFICATE_HTML)
        }
      }
    })
  })
  .on('click', '#js_addOther', function () {
    // 添加信息-其他缴费
    var _orgCoreCode = $('#orgCore_code').val()
    cumParentWinModal('其他缴费', CONTEXT_PATH + '/stuPay/otherPay?orgCoreCode=' + _orgCoreCode, {
      area: ['800px', '480px'],
      callback: {
        getData: function (data) {
          createOtherPayHTML(data, OTHER_PAY_HTML)
        }
      }
    })
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
        callback: {
          fn1: function (params) {
            // 兼容最初还没节点的情况
            var $dir = TEACHING_AID_HTML.find('.direction-item')
            if (!$dir.length) {
              createTeachingHTML([params], TEACHING_AID_HTML)
              teachimg_sumTotal()
              checkInfoSole('add', TEACHING_AID_HTML.find('.direction-item'), params.goodsCode)
            } else {
              if (checkInfoSole('add', $dir, params.goodsCode)) {
                teachimg_clearTrDiscount('', 'mg')
                createTeachingHTML([params], TEACHING_AID_HTML)
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

// *报名课程
// *class bind
CLASS_HTML.on('change', '.js-dy-classHour', function () {
  // 修改 课时
  var t_ = $(this)
  var p_tr = t_.closest('.js-tr-item')
  var s_data = p_tr.data('sdata')
  var pp_dir = t_.closest('.direction-item')
  var dy_class_hour = Number(p_tr.find('.js-dy-classHour').val())
  var dy_class_hour_hidden = s_data.classHour_hidden
  var week_type = p_tr.find('.js-sel-week').val()

  js_classPrice(p_tr)
  // clearDiscount(p_tr);
  //js_discountPrice(p_tr);
  clearTrDiscount(p_tr)
  clearLBData(pp_dir)
  xiaojiMoney(pp_dir)
  // sumTotalDiscount()
  // clearLoanCheckbox()
})
  .on('change', '.js-dy-price', function (evt) {
    // 单价
    var t_ = $(this)
    var p_tr = $(this).closest('.js-tr-item')
    var pp_dir = t_.closest('.direction-item')
    p_tr.removeData('params-discount')

    js_classPrice(p_tr)
    clearLBData(pp_dir)
    xiaojiMoney(pp_dir)
  })
  .on('change', '.js-sel-pattern', function () {
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')

    clearSelectClass(p_tr)
  })
  .on('change', '.js-sel-week', function () {
    // 周中/周末
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var pp_dir = t_.closest('.direction-item')
    p_tr.removeData('params-discount')

    clearSelectClass(p_tr)
    clearLBData(pp_dir)
    xiaojiMoney(pp_dir)
  })
  .on('click', '.js-btn-class', function () {
    // 选择班级
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var s_data = p_tr.data('sdata')

    var params = {
      orgCoreCode: $('#orgCore_code').val(),
      courseStageCode: s_data.courseStageCode,
      week: p_tr.find('.js-sel-week').val(),
      classClassify: p_tr.find('.js-sel-pattern').val(),
      isFilter: 'Y'
    }

    cumParentWinModal('选择班级', CONTEXT_PATH + '/class/toChoosePage?' + $.param(params), {
      area: ['800px', '600px'],
      callback: {
        'bm-fn': function (params) {
          alterBtnStatus('add', t_)

          p_tr.removeData('params-class').data('params-class', params)
          p_tr.find('.js-inp-hide-class').val(params.itemcode).trigger('focusout.validate')
          t_.attr('data-original-title', params.itemcode + '(' + (params.itemname || '') + ')')
        },
        empty: function () {
          alterBtnStatus('clear', t_, '选班')

          p_tr.removeData('params-class')
          p_tr.find('.js-inp-hide-class').val('')
          t_.removeAttr('data-original-title')
        }
      }
    })
  })
  .on('click', '.js-btn-discount', function () {
    // 选择优惠
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var s_data = p_tr.data('sdata')
    var pp_dir = t_.closest('.direction-item')
    var history_data = p_tr.data('params-discount') || []

    var dy_class_hour = Number(p_tr.find('.js-dy-classHour').val())
    var dy_class_price = Number(p_tr.find('.js-dy-price').val())
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
      discountTermOfMoney: class_price,
      packageType: $('#packageType').val()
    }

    cumParentWinModal(
      '优惠类型选择',
      CONTEXT_PATH + '/packageManager/signupNewDiscount?' + $.param(params),
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
  .on('click', '.js-btn-books', function () {
    // 选择教具
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var courseCode = p_tr.data('sdata')['courseCode']
    var orgCoreCode = $('#orgCore_code').val()
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
              alterBtnStatus('add', t_)

              p_tr.removeData('params-gooks').data('params-gooks', params)
              t_.attr('data-original-title', params.goodsName)

              t_.siblings('.js-dy-gooks')
                .val(params.retailPrice)
                .attr('ck-course-price', params.retailPrice)
              //.removeAttr('readonly')
            }
          },
          empty: function () {
            alterBtnStatus('clear', t_, '教具')

            p_tr.removeData('params-gooks')
            t_.removeAttr('data-original-title')
            t_.siblings('.js-dy-gooks').val(0).attr('ck-course-price', 0).attr('readonly', true)
          }
        }
      }
    )
  })
  .on('click', '.js-tr-remove', function () {
    // 删除记录
    var t_ = $(this)
    var p_tr = t_.closest('.js-tr-item')
    var p_class = p_tr.closest('.choice-class')
    var p_dir = t_.closest('.direction-item')

    // cb 处理
    var s_data = p_tr.data('sdata')
    if (Number(s_data.totalPaymentAmount || 0)) {
      COM_TOOLS.alert('已付款，不能删除')
      return false
    }

    COM_TOOLS.confirm('确定删除？', {
      closeBtn: 0,
      yes: function (index) {
        // 清除数据
        var s_data = p_tr.data('sdata')
        delete cloneDTData['cs_' + s_data.courseStageCode]
        // cb 处理
        if (s_data.orderCode) {
          DELETE_COURSE_ARR.push(s_data.orderCode)
        }
        removeSignupCourse(p_tr)
        // 清理联报
        clearLBData(p_dir)
        xiaojiMoney(p_dir)
        cumCloseWin(index)
      }
    })
  })
  .on('click', '.js-btn-lb', function () {
    // 联报
    var t_ = $(this)
    var p_dir = t_.closest('.direction-item')
    // 联报状态判断
    var res_lb = checkLB(p_dir.find('.js-dy-classHour'))
    if (res_lb.res) {
      var courseData = createLBData(p_dir.find('.js-tr-item'))

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
      }

      cumParentWinModal('联报优惠', CONTEXT_PATH + '/newsignup/signupNewMul?' + $.param(params), {
        callid: {
          courseList: courseData
        },
        callback: {
          fn1: function (params) {
            t_.data('sdata', params).attr('data-original-title', params.item.name)

            var lb_discount = sumDiscount(params.list, 'dismoney')
            p_dir.find('.js-lb-discount').val(lb_discount)

            // 回填 阶段-优惠
            for (var i = 0; i < params.list.length; i++) {
              var item = params.list[i]
              var p_tr = $('#s' + item.courseStageCode)

              fillDiscount(p_tr, p_dir)
              js_discountPrice(p_tr)
              js_outstanding(p_tr)
            }
            xiaojiMoney(p_dir)
          },
          empty: function () {
            t_.removeData('sdata').removeAttr('data-original-title')
            p_dir.find('.js-lb-discount').val(0)
            // 恢复各个优惠的价格
            p_dir.find('.js-tr-item').each(function (key, item) {
              var t_tr = $(this)
              fillDiscount(t_tr, p_dir)
              js_discountPrice(t_tr)
              js_outstanding(t_tr)
              xiaojiMoney(p_dir)
            })
          }
        }
      })
    } else {
      COM_TOOLS.alert('课时数>=两年才可选择')
    }
  })

// *cert bind
CERTIFICATE_HTML.on('click', '.js-zs-btn-course', function () {
  // 选课
  var t = $(this)
  var t_p = t.closest('.js-tr-item')
  var sData = t_p.data('sdata')

  cumParentWinModal(
    '课程',
    CONTEXT_PATH + '/chooseCourse/toChoosePage?orgCoreCode=' + $('#orgCore_code').val(),
    {
      area: ['800px', '480px'],
      callid: 'course',
      callback: {
        getData: function (data) {
          t_p.find('.js-zs-course').val(data.courseName).trigger('focusout.validate')
          // 添加课程数据
          sData.courseName = data.courseName
          sData.courseCode = data.courseCode
          // 回填
          t_p.data('sdata', sData)
        }
      }
    }
  )
}).on('click', '.js-tr-remove-zs', function () {
  // 删除记录
  removeItemTr($(this))
})

// *教具相关方法
// *teaching bind
TEACHING_AID_HTML.on('change', '.js-dis-mjmg', function () {
  var t_ = $(this)
  var flag = t_.prop('checked')

  if (flag) {
    var _orgCoreCode = $('#orgCore_code').val()
    // 建议零售价的总和
    var _total = (function () {
      var sum = 0
      TEACHING_AID_HTML.find('.js-suggest-price').each(function () {
        var val = $(this).val() * 1
        sum += val
      })
      return sum
    })()
    var _totalNum = (function () {
      var sum = 0
      TEACHING_AID_HTML.find('.js-goods-num').each(function () {
        var val = $(this).val() * 1
        sum += val
      })
      return sum
    })()
    // 请求获取对应的 满购优惠
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
        byProportionDistribution(TEACHING_AID_HTML.find('.js-tr-item'), _total, res.data.discount)
        TEACHING_AID_HTML.find('.direction-item').data('mgdata', res.data)
        te_sumTrSubtotalByNum()
        teachimg_sumTotal()
        // 名称
        TEACHING_AID_HTML.find('.js-mjmg-cont').text(
          '名称：' + res.data.discountName + ' 优惠：' + res.data.discount
        )
      } else {
        COM_TOOLS.alert(res.msg)
        teachimg_clearTrDiscount('', 'mg')
        TEACHING_AID_HTML.find('.js-mjmg-cont').html('')
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
          var $dir = TEACHING_AID_HTML.find('.direction-item')
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

// *other bind
OTHER_PAY_HTML.on('click', '.js-tr-remove-qt', function () {
  // 删除记录
  removeItemTr($(this))
})

// * submit 数据处理
// 课程购买
function subData_course() {
  var tmp = [] // courseList
  $.each(CLASS_HTML.find('.direction-item'), function () {
    var t_dir = $(this)
    var dirData = t_dir.data('sdata') || {}
    var c_stage = t_dir.find('.js-tr-item')
    var lbData = t_dir.find('.js-btn-lb').data('sdata') || { item: {} }
    var _lbDiscount = t_dir.find('.js-lb-discount').val()
    var _totalAmount = t_dir.find('.js-total-money').val()

    var tDirName = t_dir.find('.dir-name').text()
    var tDirId = t_dir.attr('id').split('d')[1]

    var tmp_obj = {
      mulDiscountData: {
        id: lbData.item.id,
        code: lbData.item.code,
        name: lbData.item.name,
        discount: lbData.item.discount,
        money: lbData.item.money,
        preferentialWay: lbData.item.preferentialWay,
        preferentialWayName: lbData.item.preferentialWayName,
        discountAmount: _lbDiscount
      },
      id: dirData.id,
      classificationAmount: _totalAmount,
      classificationCode: tDirId,
      classificationName: tDirName
    }
    var tmp_arr = [] // dirList
    $.each(c_stage, function () {
      var t_tr = $(this)
      var sData = t_tr.data('sdata')
      var classData = t_tr.data('paramsClass')
      var goodsData = t_tr.data('paramsGooks') || {}
      // discountList
      var disData = $.map(t_tr.data('paramsDiscount') || [], function (n) {
        return {
          courseStageCode: sData.courseStageCode,
          price: n.price,
          code: n.code,
          name: n.name,
          typeCode: n.typeCode,
          typeName: n.typeName,
          preferentialWay: n.preferentialWay,
          preferentialWayName: n.preferentialWayName
        }
      })
      // 实时数据
      var inp_classHour = Number(t_tr.find('.js-dy-classHour').val())
      var inp_classHourPrice = Number(t_tr.find('.js-dy-price').val()) // 单价
      var inp_pattern = t_tr.find('.js-sel-pattern').val()
      var inp_weekType = t_tr.find('.js-sel-week').val()
      var inp_discount = Number(t_tr.find('.js-dy-discount').val()) // 优惠金额
      var inp_totalDiscount = Number(t_tr.find('.js-price-discount').val()) // 折后(实际)总额

      tmp_arr.push({
        id: sData.id,
        companyCode: sData.companyCode,
        companyName: sData.companyName,
        classificationCode: sData.classificationCode,
        classificationName: sData.classificationName,
        courseCode: sData.courseCode,
        courseName: sData.courseName,
        courseStageCode: sData.courseStageCode,
        courseStageName: sData.courseStageName,
        classHour: inp_classHour,
        classHour_hidden: sData.totalClassHour,
        classHourPrice: inp_classHourPrice,
        classHourPrice_hidden: sData.classHourPrice,
        coursePattern: inp_pattern,
        ifWeek: sData.ifWeek,
        courseWeek: inp_weekType,
        // 折后金额
        actualTotalAmount: inp_totalDiscount,
        totalAmount: inp_totalDiscount,
        // 选优惠
        discountList: disData,
        discountAmount: inp_discount,
        // 选班
        classCode: classData.itemcode,
        className: classData.itemname,
        classLxName: classData.classLxName,
        teach: classData.teach,
        fullNumber: classData.fullNumber,
        actualNumber: classData.actualNumber,
        // 教具
        ifBindGood: sData.ifBindGoods,
        goodsCode: goodsData.goodsCode,
        goodsName: goodsData.goodsName,
        goodsUnitCode: goodsData.goodsUnit,
        goodsUnitName: goodsData.goodsUnitName,
        hourseCode: goodsData.hourseCode,
        teachingMaterialCost: goodsData.retailPrice,
        sellGoodsNum: 1
      })
    })

    tmp_obj.dirList = tmp_arr
    tmp.push(tmp_obj)
  })
  return tmp
}

// 证书购买
function subData_cert() {
  var tmp = []
  // var _subjectCode = $('#payLegalSubjectCode').val()
  // var _subjectName = $('#payLegalSubjectName').val()

  $.each(CERTIFICATE_HTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item)
    var sData = t_.data('sdata')

    tmp.push({
      companyCode: '',
      companyName: '',
      id: sData.id,
      certificateClassification: sData.certificateClassification,
      certificateClassificationName: sData.certificateClassificationName,
      certificateLevel: sData.certificateLevel,
      certificateLevelName: sData.certificateLevelName,
      certificateCode: sData.certificateCode,
      certificateName: sData.certificateName,
      courseCode: sData.courseCode,
      courseName: sData.courseName,
      certificatePrice: sData.certificatePrice
    })
  })
  return tmp
}

// 教具购买
function subData_teaching() {
  var tmp = []
  // var _subjectCode = $('#payLegalSubjectCode').val()
  // var _subjectName = $('#payLegalSubjectName').val()
  var mgData = TEACHING_AID_HTML.find('.direction-item').data('mgdata') || {
    discountCode: '',
    discountName: '',
    discount: ''
  }

  $.each(TEACHING_AID_HTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item)
    var sData = t_.data('sdata')

    var _sellGoodsNum = t_.find('.js-goods-num').val()
    var _secType = t_.find('.js-sec-type').val()
    var _thisPaymentAmount = t_.find('.js-sell-price').val()
    // var _suggestPrice = t_.find('.js-suggest-price').val()
    // var _minPrice = t_.find('.js-min-price').val()
    var _disPrice = t_.find('.js-discount-price').val()
    var _mgDiscount = t_.find('.js-mg-discount').val()

    tmp.push({
      companyCode: '',
      companyName: '',
      id: sData.id,
      paymentType: 'JFLX09', // 缴费类型
      paymentSecType: _secType, // 子类型
      goodsCode: sData.goodsCode,
      goodsName: sData.goodsName,
      sellGoodsNum: _sellGoodsNum,
      goodsUnit: sData.goodsUnit,
      goodsUnitName: sData.goodsUnitName,
      hourseCode: sData.hourseCode,
      retailPrice: sData.retailPrice,
      minRetailPrice: sData.minRetailPrice || '',
      thisPaymentAmount: _thisPaymentAmount,
      ifFullDis: !!mgData.discountCode ? 1 : 0,
      specialsDis: _disPrice,
      fullEveryDis: _mgDiscount,
      fullAllDis: mgData.discount,
      discountCode: mgData.discountCode,
      discountName: mgData.discountName
    })
  })
  return tmp
}

// 其他缴费
function subData_otherPay() {
  var tmp = []
  // var _subjectCode = $('#payLegalSubjectCode').val()
  // var _subjectName = $('#payLegalSubjectName').val()

  $.each(OTHER_PAY_HTML.find('.js-tr-item'), function (key, item) {
    var t_ = $(item)
    var sData = t_.data('sdata')

    tmp.push({
      companyCode: '',
      companyName: '',
      id: sData.id,
      goodsCode: sData.goodsCode,
      goodsName: sData.goodsName,
      goodsUnit: sData.goodsUnit,
      goodsUnitName: sData.goodsUnitName,
      paymentType: sData.paymentType,
      paymentName: sData.paymentName,
      paymentSecType: sData.paymentSecType,
      paymentSecName: sData.paymentSecName,
      sellGoodsNum: sData.sellGoodsNum, // 默认 1
      thisPaymentAmount: sData.paymentPrice
    })
  })
  return tmp
}
function templateDataToHTML(rData) {
  tmpId = rData.id
  if (rData.courseList && rData.courseList.length) {
    rData.courseList.forEach(function (n) {
      var dirData = n
      createCourseHTML(
        dirData.dirList,
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
  if (rData.certList && rData.certList.length) {
    createCertificateHTML(rData.certList, CERTIFICATE_HTML, 'edit')
  }
  if (rData.teachAidsList && rData.teachAidsList.length) {
    createTeachingHTML(rData.teachAidsList, TEACHING_AID_HTML, 'edit')
    // 防重复
    var tmp = $.map(rData.teachAidsList, function (n) {
      return n.goodsCode
    })
    checkInfoSole('add', TEACHING_AID_HTML.find('.direction-item'), tmp)
    // 满购优惠
    if (rData.teachAidsList[0].discountCode) {
      var _mgData = {
        discountCode: rData.teachAidsList[0].discountCode,
        discountName: rData.teachAidsList[0].discountName,
        discount: rData.teachAidsList[0].fullAllDis
      }
      TEACHING_AID_HTML.find('.js-dis-mjmg').prop('checked', true)
      TEACHING_AID_HTML.find('.direction-item').data('mgdata', _mgData)
      TEACHING_AID_HTML.find('.js-mjmg-cont').text(
        '名称：' + _mgData.discountName + ' 优惠：' + _mgData.discount
      )
    }
    // 合计
    teachimg_sumTotal()
  }
  if (rData.otherPayList && rData.otherPayList.length) {
    createOtherPayHTML(rData.otherPayList, OTHER_PAY_HTML, 'edit')
  }
}
