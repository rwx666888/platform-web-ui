<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.tedu.cn" prefix="ta"%>
<!doctype html>
<html>
  <head>
    <%@ include file="../../../common/jsp/header.jsp"%>

    <title>
      <ta:local key="platform.international.menu.edit" />
    </title><!-- 编辑 -->
    <style>

      .iradio_square-green {
          transform: scale(.8);
          position: relative;
          bottom: 1px;
      }
      
      .cus-mo-btn {
          cursor: pointer;
          margin: 0 3px;
      }
      .js-btn-open-ruleswin{
       cursor: pointer;
       text-decoration: underline;
      }
      .t-item-bg{
        background-color: #FFFFFF; 
        padding: 3px 6px; 
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container-fluid">
      <div class="row" style="min-height: 50px;">
        <div class="p-sm col-xs-12 text-center" style="padding:10px;" id="demoaffix1" data-spy="affix" data-offset-top="50">
          <button class="btn btn-primary btn-sm" type="button" onclick="save()">
            <ta:local key="platform.common.btn.save" /></button><!-- 保存 -->
          <button class="btn btn-success btn-sm" type="button" onclick="cumParentCallValue()">
            <ta:local key="platform.common.btn.close" /></button><!-- 关闭 -->
        </div>
      </div>
    </div>
    <div class="container-fluid">

      <form id="dataForm" class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span> 规则名称：</label>
          <div class="col-sm-7">
            <input name="name" id="name" required class="form-control " type="text" value="${boModel.name}" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">规则描述：</label>
          <div class="col-sm-7">
            <textarea class="form-control" name="remark" rows="2">${boModel.remark }</textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span>任务类型：</label>
          <div class="col-sm-2">
            <select class="form-control " name="type" id="type" required autocomplete="off">
              <option value="">---请选择---</option>
              <c:forEach var="type_item" items="${typeList}">
                <c:choose>
                  <c:when test="${type_item.id==boModel.type}">
                    <option selected value="${type_item.id}">${type_item.text}</option>
                  </c:when>
                  <c:when test="${type_item.id!=boModel.type}">
                    <option value="${type_item.id}">${type_item.text}</option>
                  </c:when>
                </c:choose>
              </c:forEach>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span>匹配规则：</label>
          <div class="col-sm-7">
            <div class="bg-warning" style="padding:10px 15px;">
              <div class="layout-flex t-item-bg" style="margin-bottom: 8px;">
                <div style="width: 140px;">
                  <label class="i-checks checkbox-inline ">
                    <input name="ruleType" type="radio" ${new_or_edit eq 'create' ? 'checked' : '' } ${boModel.ruleType
                      eq 'GZLX_RULE' ? 'checked' : '' } value="GZLX_RULE" autocomplete="off" required /> 来源于规则：
                  </label>
                </div>
                <div class="layout-flex__item form-inline">
                  <p class="form-control-static" id="ruleName">${new_or_edit eq 'create' ? '(请绑定一个规则)' :
                    boModel.ruleName.concat('（').concat(boModel.rule).concat('）') }</p>
                  <span class="js-btn-open-ruleswin text-success" onclick="chooseRule();">编辑</span>
                  <input type="hidden" id="rule" name="rule" value="${boModel.rule}" />
                </div>
              </div>
              <div class="layout-flex t-item-bg">
                <div style="width: 140px;">
                  <label class="i-checks checkbox-inline">
                    <input name="ruleType" type="radio" value="GZLX_GROUP" ${boModel.ruleType eq 'GZLX_GROUP' ?
                      'checked' : '' } required autocomplete="off" /> 来源于群：
                  </label>
                </div>
                <div class="layout-flex__item form-inline">
                  <p class="form-control-static" id="groupName">${empty boModel.groupName ? '(请绑定一个群)' :
                    boModel.groupName}</p>
                  <span class="js-btn-open-ruleswin text-success" onclick="chooseGroupRule();">编辑</span>
                  <input type="hidden" id="groupId" name="groupId" value="${boModel.groupId}" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span>执行动作：</label>
          <div class="col-sm-7">
            <div class="dtop-3 bg-warning" style="padding:10px 15px;">
              <div class="t-item-bg">
                <div class="d1">
                  <div class="pull-right">
                    <div id="drop-gengduo" class="dropdown" style="position: relative;display: inline-block;">
                      <button class="btn btn-primary btn-sm" type="button" data-hover="dropdown" id="cumBtn_gengduo"><i
                          class="glyphicon glyphicon-th-list"></i> 绑定新模板
                      </button>
                      <div class="dropdown-menu p-sm dropdown-menu-right " role="menu">
                        <button class="btn btn-info btn-sm btn-block" type="button" onclick="chooseSms()" id="cumBtn_sms">
                          <i class="fa fa-cog"></i> 短信</button>
                        <button class="btn btn-info btn-sm btn-block" type="button" onclick="chooseWxmsg()" id="cumBtn_qywx">
                          <i class="fa fa-cog"></i> 企业微信消息</button>
                        <button class="btn btn-info btn-sm btn-block" type="button" onclick="chooseEmail()" id="cumBtn_email">
                          <i class="fa fa-cog"></i> 邮件</button>
                        <button class="btn btn-info btn-sm btn-block" type="button" onclick="chooseGroup()" id="cumBtn_group">
                          <i class="fa fa-cog"></i> 企业微信群</button>
                        <button class="btn btn-info btn-sm btn-block" type="button" onclick="chooseTag()" id="cumBtn_tag">
                          <i class="fa fa-cog"></i> 企业微信标签</button>
                      </div>
                    </div>
                  </div>
                  <label class=" i-checks checkbox-inline">
                    <input name="actionType" type="radio" value="ZXDZ_MB" ${new_or_edit eq 'create' ? 'checked' : '' }
                      ${boModel.actionType eq 'ZXDZ_MB' ? 'checked' : '' } required autocomplete="off" /> 业务模板
                  </label>
                </div>
                <table class="table table-bordered table-hover" style="margin-top: 20px;">
                  <thead>
                    <tr>
                      <th>模板名称</th>
                      <th width="120">模板类型</th>
                      <th width="230">模板ID</th>
                      <th width="150">操作</th>
                    </tr>
                  </thead>
                  <tbody id="modeTable" class="md-001"></tbody>
                </table>
              </div>

              <div class="layout-flex t-item-bg" style="margin-top: 8px;">
                <div>
                  <label class="i-checks checkbox-inline">
                    <input name="actionType" type="radio" value="ZXDZ_API" ${boModel.actionType eq 'ZXDZ_API' ?
                      'checked' : '' } required autocomplete="off" /> API模式（类的全路径）：
                  </label>
                </div>
                <div class="layout-flex__item">
                  <!-- <p class="form-control-static">
                    <span id="js_editable07" class="js-item-xe" style="padding-top: 0;">${boModel.classPath}</span>
                    <span style="margin-left: 30px; cursor: pointer;" class="js-open-xe text-success">编辑</span>
                    <input type="hidden" name="classPath" value="${boModel.classPath}" id="js_editable07_val" />
                  </p> -->
                  <input type="text" class="form-control" name="classPath" value="${boModel.classPath}" placeholder="格式:com.xx.xx">
                </div>
              </div>

            </div>
          </div>
        </div>


        <div class="form-group">
          <label class="col-sm-3 control-label"><span class="text-danger">*</span> 推送时间：</label>
          <div class="col-sm-7">
            <div class="bg-warning" style="padding: 15px;">
              <div class="layout-flex t-item-bg" style="margin-top: 8px;">
                <div style="width: 130px;">
                  <label class="i-checks checkbox-inline">
                    <input name="timeType" type="radio" value="SJLX_DAY" ${new_or_edit eq 'create' ? 'checked' : '' }
                      ${boModel.timeType eq 'SJLX_DAY' ? 'checked' : '' } required autocomplete="off" /> 每天：
                  </label>
                </div>
                <div class="layout-flex__item form-inline">
                  <div class="input-group bootstrap-timepicker timepicker">
                    <!-- <input id="timepicker1" type="text" class="form-control" > -->
                    <input name="actionTimeDay" id="actionTimeDay" class="form-control" type="text" value="${boModel.actionTimeDay}"
                      readonly="readonly" autocomplete="off">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
                  </div>
                </div>
              </div>
              <div class="layout-flex t-item-bg" style="margin-top: 8px;">
                <div style="width: 130px;">
                  <label class="i-checks checkbox-inline">
                    <input name="timeType" type="radio" value="SJLX_DATE" ${boModel.timeType eq 'SJLX_DATE' ? 'checked'
                      : '' } required autocomplete="off" /> 指定日期：
                  </label>
                </div>
                <div class="layout-flex__item form-inline">
                  <div class="input-group date" id="date_box">
                    <input name="actionTimeDate" id="actionTimeDate" class="form-control " type="text" value="${boModel.actionTimeDate}"
                      readonly="readonly" autocomplete="off" />
                    <span class="input-group-addon"><i class="tedufont tedu-icon130"></i></span>
                  </div>
                </div>
              </div>
              <div class="layout-flex t-item-bg" style="margin-top: 8px;">
                <div style="width: 130px;">
                  <label class="i-checks checkbox-inline">
                    <input name="timeType" type="radio" value="SJLX_CRON" ${boModel.timeType eq 'SJLX_CRON' ? 'checked'
                      : '' } required autocomplete="off" /> cron表达式：
                  </label>
                </div>
                <div class="layout-flex__item form-inline">
                  <input name="actionTimeCorn" id="actionTimeCorn" class="form-control " type="text" value="${boModel.actionTimeCorn}"
                    style="width: 211px;" autocomplete="off">
                </div>
              </div>

            </div>
          </div>
        </div>

      </form>
      <div style="height: 30px;"></div>

    </div>

    <%@ include file="../../../common/jsp/footer.jsp"%>
    <script type="text/javascript">
      var modeData_ = [];
      $(document).ready(function() {
        /* @lianglei */
        $.fn.editable.defaults.emptytext = '无';
        $.fn.editable.defaults.emptyclass = 'text-primary';
        $('.i-checks').iCheck({
          checkboxClass: 'icheckbox_square-green',
          radioClass: 'iradio_square-green',
        });
        $('#actionTimeDay').timepicker({
          minuteStep: 5,
          showMeridian: false,
          showInputs: false,
          //defaultTime:false
        });

        $("#date_box").datetimepicker({
          "format": "yyyy-mm-dd hh:ii",
          "minView": 0
        });
        $('#js_editable07').editable({
          mode: 'inline',
          toggle: 'manual'
        }).on('hidden', function(e) {
          console.log(arguments.length, e, arguments);
          // console.log($(this));
          if (arguments.length != 2) return
          $(this).next('.js-open-xe').show()
        }).on('save', function(e, p) {
          $('#js_editable07_val').val($.trim(p.newValue));
        });
        $(document).on('click.open', '.js-open-xe', function(e) {
          e.stopPropagation();
          $(this).hide().prev('.js-item-xe').editable('show');
        })
        /* @lianglei */

        if ("${new_or_edit}" == "edit") {
          modeData_ = ${empty boModel.modeData ? '[]' : boModel.modeData};
          refreshMode();
        }
        //表单验证
        $('#dataForm').validate({
          submitHandler: function(form) {
            var data_ = COM_TOOLS.serializeObject(form);
            if (data_.ruleType == 'GZLX_RULE' && !data_.rule) {
              COM_TOOLS.alert2('请绑定数据来源的规则！');
              return false;
            } else if (data_.ruleType == 'GZLX_GROUP' && !data_.groupId) {
              COM_TOOLS.alert2('请绑定数据来源的群！');
              return false;
            } else if (data_.actionType == 'ZXDZ_MB' && modeData_.length == 0) {
              COM_TOOLS.alert2('请绑定业务模板');
              return false;
            } else if (data_.actionType == 'ZXDZ_API' && !data_.classPath) {
              COM_TOOLS.alert2('请绑定API模式需要执行的执行类');
              return false;
            }

            var actionTime = "";
            if ($("input[name='timeType']:checked").val() == "SJLX_DAY") {
              actionTime = dateStr_TO_Cron(data_.actionTimeDay);
            } else if ($("input[name='timeType']:checked").val() == "SJLX_DATE") {
              actionTime = dateStr_TO_Cron(data_.actionTimeDate);
            } else if ($("input[name='timeType']:checked").val() == "SJLX_CRON") {
              actionTime = data_.actionTimeCorn;
            }
            if (!actionTime) {
              COM_TOOLS.alert2('请设置推送时间！');
              return false;
            }
            data_.modeData = modeData_;
            data_.actionTime = actionTime;

            console.log('# submit', data_);

            COM_TOOLS.ajaxFn({
              type: "post",
              url: "${contextPath}/${action}",
              data: data_,
              success: function(data, status) {
                if (data >= 1) {
                  cumCheckPwin(window.parent).COM_TOOLS.alert(
                    '<ta:local key="platform.common.msg.success"/>');
                  //关闭弹出层
                  cumParentCallValue();
                } else if (data = -2) {
                  COM_TOOLS.alert('时间范围限制【0:30 —— 23:30】', {
                    time: 5000
                  });
                } else {
                  COM_TOOLS.alert('<ta:local key="platform.common.msg.defeated"/>', {
                    time: 5000
                  });
                }

              },
              error: function() {
                COM_TOOLS.alert('<ta:local key="platform.common.msg.exception"/>');
              }
            }, 1); // 1:全屏loading遮罩；2:button loading遮罩;
          }
        });
        //模板事件
        $('#modeTable').on('click', '.js-btn-del, .js-btn-open', function(){
          var data_ = $(this).closest('tr').data();
          if(data_ && data_.mode_id){
            if($(this).hasClass('js-btn-del')){ //删除
              delMode(data_.mode_id);
            }else if($(this).hasClass('js-btn-open')){ //查看模板详情
              cumParentWinModal('选择', '${contextPath}/mission/toChooseRulePage');
            }
          }
        });

      });

      function addMode(d_) {
        for (var i = modeData_.length - 1; i >= 0; i--) {
          if (modeData_[i].modeId == modeId) {
            return false;
          }
        }
        modeData_.push({
          "modeId": d_.modeId,
          "modeType": d_.modeType,
          "modeName": d_.modeName,
          "modeTypeName": d_.modeTypeName
        });
        refreshMode();
      }

      function delMode(modeId) {
        for (var i = modeData_.length - 1; i >= 0; i--) {
          if (modeData_[i].modeId == modeId) {
            modeData_.splice(i, 1);
          }
        }
        refreshMode();
      }
      

      function refreshMode() {
        var text = '';
        for (var i = 0; i < modeData_.length; i++) {
          text += '<tr data-mode_id="'+ modeData_[i].modeId +'" data-mode_type="'+ modeData_[i].modeType +'">'+
          '<td>' + modeData_[i].modeName + '</td><td>' + modeData_[i].modeTypeName + '</td>' +
          '<td>' + modeData_[i].modeId + '</td><td>' + 
          '<span class="cus-mo-btn text-success js-btn-open">查看模板</span> <span class="cus-mo-btn text-danger js-btn-del">删除</span></td></tr>';
            
        }
        $('#modeTable').html(text);
      }
      //选择短信模板
      function chooseSms() {
        cumParentWinModal('选择短信模板', '${contextPath}/mission/toChooseRulePage');
      }
      //选择企业微信消息模板
      function chooseWxmsg() {
        cumParentWinModal('选择企业微信消息模板', '${contextPath}/mission/toChooseRulePage');
      }
      //选择邮件模板
      function chooseEmail() {
        cumParentWinModal('选择邮件模板','${contextPath}/mission/toChooseRulePage');
      }
      //选择群模板
      function chooseGroup() {
        if ($("input[name='ruleType']:checked").val() == "GZLX_GROUP") {
          COM_TOOLS.alert('规则来源于群，无法绑定建群', {
            time: 5000
          });
          return;
        }
        cumParentWinModal('选择现有群',
          '${contextPath}/mission/toChooseGroupPage', {
            callback: {
              fn2: function(d) { //回显值
                console.log(d);
                addMode(d);
              }
            }
          }
        );
      }
      //选择标签模板
      function chooseTag() {
        cumParentWinModal('选择标签','${contextPath}/mission/toChooseRulePage');
      }
      //选择规则
      function chooseRule() {
        /* if ($("input[name='ruleType']:checked").val() != "GZLX_RULE") {
          return;
        } */
        cumParentWinModal('选择规则',
          '${contextPath}/mission/toChooseRulePage', {
            end: function() {},
            other: {
              "noTriEnd": true
            },
            callback: {
              fn1: function(d) {
                $('#ruleName').text('(请绑定一个规则)');
                $('#rule').val('');
              },
              fn2: function(d) { //回显值
                $('#ruleName').text(d.name + "（" + d.id + "）");
                $('#rule').val(d.id);
              }
            }
          }
        );
      }
      //选择群
      function chooseGroupRule() {
        /* if ($("input[name='ruleType']:checked").val() != "GZLX_GROUP") {
          return;
        } */
        cumParentWinModal('选择群',
          '${contextPath}/mission/toChooseGroupRulePage', {
            end: function() {},
            other: {
              "noTriEnd": true
            },
            callback: {
              fn1: function(d) {
                $('#groupName').text('(请绑定一个群)');
                $('#groupId').val('');
              },
              fn2: function(d) { //回显值
                $('#groupName').text(d.name);
                $('#groupId').val(d.id);
              }
            }
          }
        );
      }
      //表单提交
      function save() {
        $('#dataForm').submit();
      }
      /**
       * 时间字符串转Cron表达式
       * @param {Object} str 时间字符串 格式 yyyy-mm-dd hh:MM 或 hh:MM
       */
      function dateStr_TO_Cron(str) {
        if (!str) {
          return '';
        }
        var cronStr = '';
        var arr_ = [];
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(str)) { //yyyy-mm-dd hh:MM
          arr_ = str.split(/[:| |-]/g); //转为数组
        } else if (/^\d{2}:\d{2}$/.test(str)) {
          arr_ = ['', '*', '*'].concat(str.split(":"));
        }
        var _check_fn = function(index) {
          return arr_[index] ? arr_[index].replace(/^0/g, "") : arr_[index];
        }
        if (arr_.length) {
          //cron : 秒 分钟 小时 日 月 星期 年(可选)
          var r_ = ['0'];
          r_.push(_check_fn(4)); //分钟
          r_.push(_check_fn(3)); //小时
          r_.push(_check_fn(2)); //日
          r_.push(_check_fn(1)); //月
          r_.push('?'); //星期
          _check_fn(0) && r_.push(_check_fn(0)); //年(可选)
          cronStr = r_.join(' ');
        }
        return cronStr;
      }
    </script>

  </body>
</html>
