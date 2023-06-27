// 定制
$(function() {
  (function() {
    $('body').append(
      '<style>.modal-201217xx {color: #333;padding: 15px;} .modal-201217xx .c-list-box {padding: 6px 10px;display: flex;flex-wrap: wrap;} ' +
      '.modal-201217xx .c-item {width: 49%;margin-bottom: 6px;} .modal-201217xx .c-item i {font-style: normal;}' +
      'body .layui-skin-m201217 {border: 3px solid rgba(28, 132, 198, 0.4); border-radius: 5px; }' +
      'body .layui-skin-m201217 .layui-layer-title {color: #ffffff; padding: 0 60px 0 10px; }' +
      'body .layui-skin-m201217 .layui-layer-setwin { right: 5px; }' +
      'body .layui-skin-m201217 .layui-layer-setwin .layui-layer-close1 { background-position: 1px -68px;}' +
      'body .layui-skin-m201217 .layui-layer-content {padding: 0px; }' +
      'body .layui-skin-m201217 .layui-layer-btn {border-top: 1px solid #ddd; padding: 5px 8px 8px; }' +
      '</style>');
    /**
     * 格式化
     * @param {Object} num
     */
    function _msg_tip_format(num) {
      if($.isNumeric(num)){
        num = $.trim(num) || 0;
        if (num < 0) {
          num = 0;
        }
        return (num > 99 ? "99+" : num);
      }else{
        return "99+";
      }
    }
    /**
     * 构建消息
     * @param {Object} data 数据
     * @param {Object} type 类型请求消息接口传参，值为：undefined 或 4   0代表全量  4代表在线人数
     */
    var _MODAL1217OPEN_ = true; //控制只有第一次请求时打开弹框
    function listener_msg(data, type) {
      //window.__userInfo__ = {}
      //window.__userInfo__.username = 'q';

      var _COOKICE_ = {
        set: function(name, value) {
          var expire = new Date(new Date().setHours(23, 59, 59));
          expire = "; expires=" + expire.toGMTString();
          document.cookie = name + "=" + escape(value) + expire;
        },
        get: function(name) {
          var cookieValue = "";
          var search = name + "=";
          if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search);
            if (offset != -1) {
              offset += search.length;
              end = document.cookie.indexOf(";", offset);
              if (end == -1) end = document.cookie.length;
              cookieValue = unescape(document.cookie.substring(offset, end))
            }
          }
          return cookieValue;
        }
      }

      if (_MODAL1217OPEN_ && data.processTotal && (window.__userInfo__ && window.__userInfo__.username && (!_COOKICE_.get(window.__userInfo__
          .username +
          '_msgcookie')))) {
        _COOKICE_.set(window.__userInfo__.username +
          '_msgcookie', '1');
        _MODAL1217OPEN_ = false;
        var strn1_ = '';
        $.each(data.processList, function(i, n) {
          strn1_ += '<div class="c-item">' +
            '<span class="c-txt">' + n.typeName + ' </span>' +
            '(<i class="c-item-icon">' + (_msg_tip_format(n.number)) + '</i>)' +
            '</div>';
        });
        var timer_num_ = 5;
        var _wrap = '<div class="modal-201217xx"><div class="info-hn">' +
          '<h3 style="font-size:20px;">Hi,我是AI助手小童，我提醒你......</h3><p>' + (window.__userInfo__ && window.__userInfo__.name ? window.__userInfo__
            .name : '') +
          '老师：</p><p style="text-indent:2em;">您好，小童提醒您今日待办事项，截止目前，您名下数据待办如下：</p>' +
          '</div><div class="c-list-box text-success">' + strn1_ +
          '</div><p style="text-align:left; margin: 10px 0 8px; color:#999;">(~~请您尽快处理~~)</p></div>';

        var lay_index_ = cumParentWinModal('系统通知（关闭倒计时' + timer_num_ + 'S）',
          _wrap, {
            type: 1, //关键
            "ismax": false,
            area: ['560px', 'auto'],
            cancel: function(index, layero) {
              if (timer_num_ > 0) {
                COM_TOOLS.alert(timer_num_ + 'S后可关闭');
              }
              return timer_num_ < 1;
            },
            other: {
              skin: 'layui-skin-success layui-skin-m201217'
            }
          });
        var timer_ = null;
        if (timer_) {
          clearInterval(timer_);
        }
        timer_ = setInterval(function() {
          timer_num_--;
          if (timer_num_ < 1) {
            clearInterval(timer_);
          }
          cumCheckPwin(window.parent).layer.title('系统通知（关闭倒计时' + timer_num_ +
            'S）', lay_index_);
        }, 1000);

      }
    }

    //插入回调队列
    window.__MSG_CALLBACK__.add(listener_msg);
  })();
});
