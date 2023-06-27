<%@ page language="java" pageEncoding="UTF-8"%> <%@ taglib
uri="http://shiro.apache.org/tags" prefix="shiro"%> <%@ taglib
uri="http://www.tedu.cn" prefix="ta"%> <%@ include
file="../../../common/jsp/header.jsp"%>

<!DOCTYPE html>
<html>
  <head>
    <title>充值卡缴费</title>
  </head>
  <body>
    <div class="container-fluid">
      <div class="row" style="min-height: 50px;">
        <div
          class="p-sm col-xs-12 text-center"
          style="padding:10px;"
          id="demoaffix1"
          data-spy="affix"
          data-offset-top="50"
        >
          <button class="btn btn-primary btn-sm" type="button" onclick="save()">
            <ta:local key="platform.common.btn.save" />
          </button>
          <button
            class="btn btn-success btn-sm"
            type="button"
            onclick="cumParentCallValue()"
          >
            <ta:local key="platform.common.btn.close" />
          </button>
        </div>
      </div>
    </div>

    <div>
      <div class="row p-xxs">
        <div class="col-sm-12">
          <form id="stuPayForm" class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>选择充值卡</label
              >
              <div class="col-sm-3">
                <select
                  class="form-control input-sm"
                  name="card_type"
                  id="card_type"
                  required
                >
                  <option value=""
                    >---<ta:local
                      key="platform.system.label.choose"
                    />---</option
                  >
                  <c:forEach var="storeCalueCard" items="${avaliableCardList}">
                    <option value="${storeCalueCard.id}"
                      >${storeCalueCard.name}</option
                    >
                  </c:forEach>
                </select>
              </div>
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>充值卡面额</label
              >
              <div class="col-sm-3">
                <input
                  type="text"
                  class="form-control input-sm"
                  name="cardAmount"
                  id="cardAmount"
                  readOnly="readOnly"
                  value=""
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>礼品</label
              >
              <div class="col-sm-3">
                <select
                  class="form-control input-sm"
                  name="giftName"
                  id="giftName"
                  required
                >
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>充值卡售价</label
              >
              <div class="col-sm-3">
                <input
                  type="text"
                  class="form-control input-sm"
                  name="sellingPrice"
                  id="sellingPrice"
                  readOnly="readOnly"
                  value=""
                />
              </div>
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>使用有效期限</label
              >
              <div class="col-sm-3">
                <input
                  type="text"
                  class="form-control input-sm"
                  name="effectiveMonth"
                  id="effectiveMonth"
                  readOnly="readOnly"
                  value=""
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>收货人姓名</label
              >
              <div class="col-sm-3">
                <input
                  type="text"
                  class="form-control input-sm"
                  name="receiveName"
                  id="receiveName"
                  required
                  value=""
                />
              </div>
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>收货人手机号</label
              >
              <div class="col-sm-3">
                <input
                  type="text"
                  class="form-control input-sm"
                  name="receivePhone"
                  id="receivePhone"
                  required
                  number="true"
                  maxlength="11"
                  minlength="11"
                  value=""
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>收货人地址</label
              >
              <div class="col-sm-3">
                <input
                  type="text"
                  class="form-control input-sm"
                  name="receiveAddress"
                  id="receiveAddress"
                  required
                  value=""
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label"
                ><span class="text-danger">*</span>本次缴费:</label
              >
              <div class="col-sm-2">
                <input
                  type="text"
                  class="form-control input-sm js-money valid"
                  name="thisPaymentAmount"
                  readonly="readonly"
                  id="thisPaymentAmount"
                  required=""
                  ck-num="2"
                  min="0.01"
                  data-original-title=""
                  title=""
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">
                <ta:local key="platform.common.label.remark" />
              </label>
              <div class="col-sm-8">
                <textarea
                  class="form-control"
                  maxlength="30"
                  id="remark"
                  name="remark"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <%@ include file="../../../common/jsp/footer.jsp"%>
    <script>
      $(function() {
        /*自定义校验*/
        jQuery.validator.addMethod(
          'ck-num',
          function(value, element, param) {
            if (param == 1) {
              var rStr_ = '(^0\\.(0[1-9])$)|(^0\\.([1-9][0-9]*)$)'
            } else if (param == 2) {
              var rStr_ = '(^[0-9]+(\\.[0-9]{1,2}){0,1}$)'
            }
            var reg_ = new RegExp(rStr_)
            return this.optional(element) || reg_.test(value)
          },
          TEDU_MESSAGE.get('kcrm.educational.lable.srgsbzq')
        )
        //选择充值卡
        $('#card_type').change(function() {
          //删除来源渠道下所有下拉选，
          var cardTypeId = $('#card_type').val()
          $('#giftName').append('')
          $('#thisPaymentAmount').val('')
          //if(""==cardTypeId){
          $('#cardAmount').val('')
          $('#sellingPrice').val('')
          $('#effectiveMonth').val('')
          //$("#giftName").val('<option value="">--请选择--</option>');
          $('#thisPaymentAmount').val('')
          $('#giftName').empty()
          //return;
          //}
          $.ajax({
            type: 'post',
            async: false,
            url: '${contextPath}/storedValueCard/info',
            data: {
              id: cardTypeId
            },
            success: function(data, status) {
              if (data.success) {
                $('#cardAmount').val(data.obj.denomination)
                $('#sellingPrice').val(data.obj.sellingPrice)
                $('#effectiveMonth').val(data.obj.effectiveMonth)
                $('#thisPaymentAmount').val(data.obj.sellingPrice)

                var arr = []
                for (var i = 0, l = data.obj.giftNameList.length; i < l; i++) {
                  arr.push(
                    '<option value="' +
                      data.obj.giftNameList[i] +
                      '">' +
                      data.obj.giftNameList[i] +
                      '</option>'
                  )
                }
                str = arr.join('')
                $('#giftName').append(str)
              } else {
                COM_TOOLS.alert(data.msg) //系统异常
              }
            },
            error: function() {
              COM_TOOLS.alert("<ta:local key='platform.common.msg.-1102'/>") //系统异常
            }
          })
        })

        //表单提交
        $('#stuPayForm').validate({
          submitHandler: function(form) {
            var data = COM_TOOLS.serializeObject(form)

            data.cardTypeName = $('#card_type>option:selected').text()

            COM_TOOLS.callParentWinCacheFn('getData', [data])
            cumParentCallValue()
          }
        })
      })
      //表单提交
      function save() {
        $('#stuPayForm').submit()
      }
    </script>
  </body>
</html>
