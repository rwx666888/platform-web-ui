(function () {
  $.get(CONTEXT_PATH + '/newsignup/findAllSignupByTogetherStamp', {
    togetherStamp: COM_TOOLS.requestParam('togetherStamp')
  })
    .then(function (res) {
      if (res.length) {
        checkDTData(res);
        var _html = supplementaryHTML(res);

        $('#chargeTbody').html(_html);
        sumTotalPayment2();

        $('.js-money').number(true, 2);
      }
    })
    .fail(function (err) {});
})();
$.validator.addMethod(
  'ck-inp-price',
  function (value, element, params) {
    value = Number(value);

    return this.optional(element) || value <= params;
  },
  '应<=欠款金额'
);
// node 构造
function supplementaryHTML(list) {
  var arr = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    //console.log(item);
    processNoCompanyCode(item);
    arr.push(
      $(
        '<tr class="js-tr-item" id="s' +
          item.courseStageCode +
          '">' +
          '<td>' +
          item.orderCode +
          '<input type="hidden" class="js-dy-classHour" value="' +
          item.classHour +
          '">' +
          '<input type="hidden" class="js-sel-week" value="' +
          item.weekendTypeCode +
          '">' +
          '</td>' +
          '<td>' +
          item.classificationName +
          '</td>' +
          '<td>' +
          item.courseName +
          '</td>' +
          '<td>' +
          item.courseStageName +
          '</td>' +
          '<td>' +
          item.companyName +
          '</td>' +
          '<td><input type="text" class="input-sm cus-inp js-money js-price-discount" value="' +
          item.actualTotalAmount +
          '" readonly></td>' +
          '<td><input type="text" class="input-sm cus-inp js-money" value="' +
          item.totalPaymentAmount +
          '" readonly></td>' +
          '<td><input type="text" class="input-sm cus-inp js-money js-arrearage" value="' +
          item.outStandingAmount +
          '" readonly></td></tr>'
      ).data('sdata', item)
    );
  }

  return arr;
}

function sumTotalPayment2() {
  var sum = 0;
  // 所报课程的合计
  $('#chargeCourseHtml')
    .find('.js-price-discount')
    .each(function (key, item) {
      var t_ = $(this);
      var val = Number(t_.val());
      // console.log('1-', val, this.value);
      sum = COM_FN.add(sum, val);
    });

  $('#totalAmount').val(sum);
}

// 回填全款金额
function fillMoney() {
  var sum = 0;

  $('.js-tr-item').each(function (key, item) {
    var tr = $(this);
    var s_data = tr.data('sdata');

    sum = COM_FN.add(sum, s_data.outStandingAmount);
  });

  $('#thisPaymentAmount').val(sum);
}
// 构造提交数据
function submitStageData_jf(baseInfo, payInfo) {
  delete payInfo.totalAmount;
  var arr = [];

  $('#chargeCourseHtml .direction-item').each(function (key, item) {
    var tmp_arr = [];
    var t_dir = $(item);
    var c_stage = t_dir.find('.js-tr-item');

    c_stage.each(function (key2, item2) {
      var t_ = $(item2);
      var s_data = t_.data('sdata');

      var tmp_obj = $.extend(true, {}, s_data, s_data.classList, s_data.goodsList, payInfo);
      tmp_obj.discountData = s_data.discountAmountList || [];
      tmp_obj.paymentMethod = payInfo.paymentMethod || 'FKFS02';
      tmp_obj.payMethod = payInfo.payMethod;
      tmp_obj.evidenceUrl = baseInfo.evidenceUrl;

      if (tmp_obj.paymentMethod === 'FKFS01') {
        // 补缴金额
        tmp_obj.thisPaymentAmount = s_data.outStandingAmount;
      } else if (tmp_obj.paymentMethod === 'FKFS02') {
        var fmData = $('.js-pay-method2[data-type="FKFS02"]').data('sdata');
        tmp_obj.thisPaymentAmount = fmData[key2]['fmPrice'];
      }

      tmp_arr.push(tmp_obj);
    });

    arr.push(tmp_arr);
  });

  return arr;
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
function createIDS() {
  var arr = [];

  $('#signClassHTML .js-tr-item').each(function (key, item) {
    var s_data = $(this).data('sdata');
    arr.push(s_data.id);
  });

  return arr;
}

// 生成 分摊定金HTML
function FMTrHTML2($list, callback) {
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

    var cb_val = callback_['cs_' + data.courseStageCode]
      ? callback_['cs_' + data.courseStageCode].fmPrice
      : '';

    html.push(
      '<tr><td>' +
        data.courseName +
        '</td><td>' +
        data.courseStageName +
        '</td><td><input type="text" class="input-sm form-control js-money" value="' +
        data.actualTotalAmount +
        '" readonly disabled /></td>' +
        '<td><input type="text" class="input-sm form-control js-money" value="' +
        data.outStandingAmount +
        '" readonly disabled /></td>' +
        '<td><input type="text" ck-discount="' +
        data.outStandingAmount +
        '" data-code="' +
        data.courseStageCode +
        '" class="input-sm form-control js-money js-dy-fm" value="' +
        cb_val +
        '"/></td></tr>'
    );
  });

  return html;
}

// bind event
var chargeCourseValid = $('#chargeCourseHtml').validate();
$('#formSubmit_charge').click(function (evt) {
  if (!(payValid.form() && chargeCourseValid.form())) {
    COM_TOOLS.alert('请检查内容是否填写完整');
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
  var base_info = COM_TOOLS.serializeObject('#baseInfo');
  var pay_info = handleNum(COM_TOOLS.serializeObject('#payInfo'));
  // 图片凭证
  base_info.evidenceUrl = pay_info.evidenceUrl;
  var res_sub = submitStageData_jf(base_info, pay_info);
  console.log(res_sub);
  // 使用充值卡时追加数据字段
  var cardInfo = $('#js_rechargeCard_wrp').data('card_info');
  console.log('cardInfo-', cardInfo);
  if (cardInfo) {
    addRechargeCardInfoClass(res_sub, cardInfo);
    // 基本信息内追加 卡号 本次缴费金额
    base_info.inforCardId = cardInfo.id;
    base_info.useCardAmount = $('#thisRechargeCardAmount').val();
  }
  var ids = createIDS().join(',');
  var params = {
    signupMul: JSON.stringify(base_info),
    signupSubArr: JSON.stringify(res_sub)
  };
  //
  if ('ZFFS19' == pay_info.payMethod) {
    if (!checkIfBaiduLoan().succ) {
      COM_TOOLS.alert('当前学员有未扫码的百度贷信息，请先完成原有百度贷，再选择使用新的百度贷。');
      return;
    }
  }
  COM_TOOLS.loadingShade.open();
  $.post(CONTEXT_PATH + '/newsignup/savePay', params)
    .then(function (res) {
      COM_TOOLS.loadingShade.close();
      if (res.code == '0') {
        COM_TOOLS.alert(res.msg);
      } else if (res.code == '1') {
        COM_TOOLS.alert('续费成功');
        var pay_method = pay_info.payMethod;
        if (checkIfPayIndex(pay_method)) {
          //新的百度贷
          if ('ZFFS19' == pay_method) {
            cumParentWinModal(
              '百度贷支付',
              CONTEXT_PATH +
                '/newsignup/payIndexBaiduLoan?togetherStamp=' +
                COM_TOOLS.requestParam('togetherStamp') +
                '&baiduLoanOrderNo=' +
                res.resultList[0].baiduLoanOrderNo,
              {
                other: {
                  closeBtn: 0
                }
              }
            );
          } else if ('ZFFS20' == pay_method) {
            //交行惠民贷
            cumParentWinModal(
              '交行惠民贷支付',
              CONTEXT_PATH +
                '/newsignup/payIndexHmdLoan?togetherStamp=' +
                COM_TOOLS.requestParam('togetherStamp'),
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
              CONTEXT_PATH +
                '/newsignup/payIndex?togetherStamp=' +
                COM_TOOLS.requestParam('togetherStamp') +
                '&ids=' +
                res.data,
              { other: { closeBtn: 0 } }
            );
          }
          cumParentCallValue();
        } else {
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
        }
      } else {
        COM_TOOLS.alert('未知错误');
      }
    })
    .fail(function (err) {
      COM_TOOLS.loadingShade.close();
    });
});

$('#eventMain').on('click', '.js-pay-method2', function (ev) {
  var pay_type = this.dataset.type;
  $('#paymentMethod').val(pay_type);
  $(this).addClass('btn-success').siblings('.btn').removeClass('btn-success');
  $('#thisPaymentAmount').val(0);

  if (pay_type == 'FKFS01') {
    fillMoney();
  } else if (pay_type == 'FKFS02') {
    var sdata = $(this).data('sdata');

    $('#fm_tbody').html(FMTrHTML2($('#chargeCourseHtml').find('.js-tr-item'), sdata));

    FMBoxIdx = cumCurWinModal('分摊定金金额', $('#fronMoneyWrp'), '', {
      area: ['650px', '550px'],
      type: 1,
      success: function (layer) {
        $('#totalFM').val(sumFrontMoney_box());

        $('#fm_tbody .js-money').number(true, 2);
        $('#fm_tbody').find('.js-dy-fm').trigger('change');
      },
      end: function () {
        $('#fm_tbody, #other_fm_tbody').html('');
        $('#totalFM, #totalFMOther').val('');
      }
    });
  }
});

$('#eventMain_fm').on('click', '.js-btn-confirm2', function () {
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
  $('.js-pay-method2[data-type="FKFS02"]').data('sdata', params);

  var total_fm = sumFrontMoney_new();
  $('#thisPaymentAmount').val(total_fm);

  cumCloseWin(FMBoxIdx);
});
