var COM_THISAPP = {
  version: '6.1.1' //年index|月index|本月内版本index
};

/*多个tab方法*/
function jumpFactive(this_, type) {
  var itemId_, href_, text_;
  if (!type) {
    itemId_ = this_.parent('li').data('itemid');
    href_ = this_.attr('href');
    text_ = this_.children('span').text();
  } else {
    itemId_ = this_.itemid || '';
    href_ = this_.itemurl;
    text_ = this_.itemtext;
  }
  var flag = true;
  if (href_ == '' || href_ == '#') {
    if (type ? $('#side-menu li a[data-itemid=' + itemId_ + ']').next().is('ul') : this_.next().is('ul')) {
      return;
    }
    href_ = COM_DEFAULT._404Page;
  }

  /* 查询标签是否已创建，如果存在则显示 */
  $('#t_tabBox li>a').each(function() {
    var p_ = $(this).parent();
    if ($(this).data('itemid') == itemId_) {
      if (!p_.hasClass('active')) {
        $('#t_tabBox li a[data-itemid=' + itemId_ + ']').tab('show');
        COM_TOOLS._view.tabScrollFn.scrollToTab(p_);
      }
      flag = false;
      return false;
    }
  });
  if (flag) {
    create_tab_iframe(itemId_, href_, text_);
    $('#t_tabBox>li:last a').tab('show');
    COM_TOOLS._view.tabScrollFn.scrollToTab($('#t_tabBox > li:last'));
  }
}

var jumpFone = jumpFactive; //[3.9.1] 兼容补丁，后续版本中移除；

//创建 tab 及 iframe
function create_tab_iframe(itemId_, url_, text_) {
  /* 如果已达最大标签数，则置换最后一个标签 */
  if ($('#t_tabBox li').length > COM_DEFAULT._tabSingle) {
    $('#t_tabBox>li:last').remove();
    $('#tab_contBox>div:last').remove();
  }
  var str = '<li role="presentation"><a href="#tab' + (itemId_ || 'One') + '" aria-controls="tab' + (itemId_ || 'One') +
    '" role="tab" data-toggle="tab" ' + (itemId_ && ('data-itemid="' + itemId_ + '"')) + '>' + (text_ || '') +
    '<i class="fa fa-times-circle"></i></a></i></li>';
  var str1 = '<div id="tab' + (itemId_ || 'One') + '" role="tabpanel" class="tab-pane">' +
    '<iframe class="js-iframe-comwin" width="100%" height="100%" frameborder="0"  ' + (url_ && ('src="' + url_ + '"')) +
    ' name="mainPiframe' + (itemId_ || 'One') + '" allowtransparency="yes"></iframe></div>';
  $('#t_tabBox').append(str); // 添加tab
  $('#tab_contBox').append(str1); //添加iframe
}

/**
 * 刷新指定的tab标签
 * @param {String} tabid (可选)需要刷新的标签id，为空则刷新当前活动标签；
 * @param {Boolean} nocache  (可选)是否强制禁用缓存，默认false,使用客户端缓存；
 * @param {Boolean} toTarget (可选)是否跳转到目标刷新页面，默认始终跳转到本次刷新的窗口；例如刷新非当前活动窗口时，可默认跳转到，刷新的窗口；
 */
function reloadTab(tabid, nocache, toTarget) {
  if (tabid) {
    //tabid = tabid == 'index-default' ? 'welPiframe' : tabid;
    var thisTab = $('#t_tabBox a[data-itemid="' + tabid + '"]');
    if (thisTab.length) {
      thisTab.tab('show');
      window.setTimeout(function() { //这里用延时，降低可能导致的页面渲染问题概率，及无法区别shown.bs.tab事件的问题；
        window[tabid == 'index-default' ? 'welPiframe' : 'mainPiframe' + tabid].location.reload(nocache ? true :
          false);
      }, 600);
    }
  } else {
    tabid = $('#t_tabBox > li.active > a').data('itemid');
    tabid && window[tabid == 'index-default' ? 'welPiframe' : 'mainPiframe' + tabid].location.reload(nocache ? true :
      false);
  }
}

// 关闭选项卡菜单
function closeTab() {
  var closeTabId = $(this).parent().data('itemid');
  var currentWidth = $(this).parent().width();
  var li_ = $(this).closest('li');
  // 当前元素处于活动状态
  if ($(this).closest('li').hasClass('active')) {
    // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
    if (li_.next('li').size()) {
      li_.next().children('a').tab('show');
      //  移除当前选项卡
      li_.remove();
      // 移除tab对应的内容区
      $('#tab_contBox #tab' + closeTabId).remove();
    }
    // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
    else if (li_.prev('li').size()) {
      li_.prev().children('a').tab('show');
      //  移除当前选项卡
      li_.remove();
      // 移除tab对应的内容区
      $('#tab_contBox #tab' + closeTabId).remove();
    }
  }
  // 当前元素不处于活动状态
  else {
    //  移除当前选项卡
    li_.remove();
    // 移除相应tab对应的内容区
    $('#tab_contBox #tab' + closeTabId).remove();
  }
  COM_TOOLS._view.tabScrollFn.scrollToTab('#t_tabBox > li.active');
}

/**
 * 弹窗行为过滤器
 * @param {Object} t_ 菜单中A标签的jQuery对象；
 * @param {Boolean} b_ 为true是，可解决mini菜单下，点击子菜单导致大菜单被打卡的问题；
 */
function activeTabs(t_, b_) {
  if ($('body').hasClass('mini-navbar') && !b_) {
    return false;
  }
  if (t_.attr('href') && t_.attr('href') != '#' && t_.attr('target') == '_blank') {
    window.open(t_.attr('href'))
  } else {
    if (COM_DEFAULT._tabSingle > 0) {
      setTimeout(function() {
        jumpFactive(t_);
      }, 300)
    }
  }
}

/* 获取按钮权限 */
function getPermission() {
  $.ajax({
    type: "get",
    url: "",
    cache: false,
    dataType: 'json',
    success: function(d) {
      if (d && d.result == 1) {
        if (COM_TOOLS.sessionStorageSupport()) {
          COM_TOOLS.save_toSession('TEDU-checkbtn', JSON.stringify(d['crmCodes']));
          //COM_TOOLS.check_Abtn();
        } else {
          COM_TOOLS.alert(TEDU_MESSAGE.get('checkWinVer'));
        }
      } else {
        COM_TOOLS.alert(TEDU_MESSAGE.get('noGetPermission'));
      }
    },
    error: function() {
      COM_TOOLS.alert(TEDU_MESSAGE.get('networkError'));
    }
  });
}

$(document).ready(function() {
  // 关闭页面提示
  window.beforeunload_flag = true; // 提示锁
  window.onbeforeunload = function(evt) {
    if (beforeunload_flag) {
      var tips = "您确定要离开本窗口吗？";
      evt.returnValue = tips;
      return tips;
    }
  };
  // 退出登录
  $('#js_login_out').click(function() {
    window.beforeunload_flag = false;
  });
  //个人中心菜单 -临时 2018-1-30
  $('[data-submenu]').submenupicker();
  /*个人中心下拉菜单气泡*/
  $('#dropdown_indexmenux').tooltip({
    container: 'body',
    selector: '.js-indexmenu-tips',
    trigger: 'hover',
    placement: 'left',
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 300px;"></div></div>'
  });
  if (COM_DEFAULT._isOpenSwitch) { //tab导航条显隐开关
    $("#switch-checkbox").parent().removeClass("hidden");
  }
  //tab标签显示个数校验
  if (isNaN(COM_DEFAULT._tabSingle) || COM_DEFAULT._tabSingle < 1) {
    COM_DEFAULT._tabSingle = 1
  }

  $('.navbar-minimalize').click(function() {
    if ($('body').hasClass('mini-navbar')) {
      $("body").removeClass("mini-navbar");
      $('#side-menu').removeAttr('style').metisMenu();
    } else {
      $("body").addClass("mini-navbar");
      $('#side-menu').metisMenu('dispose').hide();
      setTimeout(function() {
        $('#side-menu').fadeIn(400);
      }, 200);
    }
  });
  $(window).bind("load resize", function() {
    if ($(this).width() < 993) {
      $('body').addClass('mini-navbar')
    } else {
      $('body').removeClass('mini-navbar')
    }
  });
  /*根据tabs个数判断是否显示关闭全部按钮*/
  COM_DEFAULT._tabSingle > 1 && $('#tab_header_x').addClass('metistabs');
  /*左侧菜单点击*/
  $('#side-menu li a').on('click.data-api', function(e, r) {
    e.preventDefault();
    if (r == 'API') {
      /* 如果是API模式则只触发定位联动，不打开标签，防止死循环 */
      return false; //必须
    }
    activeTabs($(this));
  });
  /*tab关闭*/
  $('#t_tabBox').on('click', 'li>a>i', closeTab);
  /*关闭全部tabs*/
  $('.tabs-close-all-btn').click(function() {
    $('#t_tabBox li>a>i').trigger('click');
  });
  /*初始化左侧菜单*/
  $('#side-menu').metisMenu();
  /*tab切换回调*/
  $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
    var itemId_ = $(this).data('itemid');
    $('#side-menu li a').removeClass('x-highlight');
    /* 触发定位联动 */
    $('#side-menu li[data-itemid=' + itemId_ + '] > a').addClass('x-highlight').parentsUntil('#side-menu').each(
      function() {
        /*if($(this).is('li:has(ul)')){
            $(this).children('a').trigger('click.data-api',['API']);
        }*/
      });
  });
  /* 初始化左侧菜单自定义滚动条 */
  $('.sidebar-collapse').mCustomScrollbar({
    axis: 'xy',
    scrollbarPosition: 'outside',
    theme: "light-2",
    advanced: {
      //autoExpandHorizontalScroll: 'x' // 有一定的问题
      //autoUpdateTimeout:6000
    }
  });
  /* 初始化左侧菜单，小视图下子菜单自定义滚动条 */
  $('.minibar-menu').mCustomScrollbar({
    scrollbarPosition: 'outside',
    theme: "light-2"
  });
  var miniNav_timer = null;
  $(document).on('mouseenter', '.mini-navbar #side-menu li', function() {
    if (miniNav_timer) {
      window.clearTimeout(miniNav_timer);
    }
    $('#minibar_menu').html("");
    var top_ = $(this).position().top;
    var top_2 = -($(this).closest('.mCSB_container').position().top);
    var btm_ = $(window).height() - (top_ + 60 - top_2);
    var str_ = $(this).prop('outerHTML');
    $('#minibar_menu').html('<ul class="block-menu nav">' + str_ + '</ul>');
    $('#minibar_menu .block-menu>li').removeClass('active');
    $('#minibar_menu .block-menu>li>a>.fa.arrow').remove();
    if ($('#minibar_menu .block-menu>li>ul').length > 0) {
      $('#minibar_menu .block-menu>li>ul').metisMenu();
    }
    if ($('.minibar-menu').height() < btm_) {
      $('.minibar-menu').removeAttr('style').css({
        top: (top_ + 60 - top_2)
      })
    } else {
      var b_ = btm_ < 50 ? 0 : btm_ - 50;
      $('.minibar-menu').removeAttr('style').css({
        bottom: b_
      })
    }
    $('.minibar-menu').show();
  });
  $(document).on('click', '#minibar_menu .block-menu>li a', function(e) {
    e.preventDefault();
    activeTabs($(this), true);
    if ($(this).next('ul.nav').length == 0) {
      $('.minibar-menu').hide();
      $('#minibar_menu').html("");
    }
  });
  $(document).on('mouseenter', '.minibar-menu', function() {
    if (miniNav_timer) {
      window.clearTimeout(miniNav_timer);
    }
  });
  $(document).on('mouseleave', '.mini-navbar #side-menu li, .minibar-menu', function(e) {
    miniNav_timer = window.setTimeout(function() {
      $('.minibar-menu').hide();
      $('#minibar_menu').html("");
    }, 200);
  });
  $('.custem_select_mod > .dropdown-menu a').click(function() {
    var t = $(this);
    var p = t.closest('.custem_select_mod');
    var b = p.find('.cus_selval');
    b.text($.trim(t.text())).data('itemval', t.data('itemval'));
    (typeof p.data('callback') == 'function') && (p.data('callback'))(t, p, b);
  });
  $('.custem_select_mod').each(function(i, n) {
    $(this).find('a:eq(0)').trigger('click');
  });
  if (COM_DEFAULT._customMenus > 0) {
    window.setTimeout(function() {
      if (!cusMenu_initData) {
        cusMenu_initData = [];
      }
      var colorA_ = ['btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger']; //默认样式
      var jstreeData_ = createJStreeData('#side-menu', false);
      $('.shortcut-menu-open').removeClass('shortcut-menu-open'); //显示自定义区域

      // 自循环生成 jstree 数据数组
      function createJStreeData(obj, pobj) {
        var data_ = [];
        var $obj = (typeof obj == 'string' ? $(obj) : obj);
        $obj.children('li').each(function(i, n) {
          var $t = $(this);
          var $a = $t.children('a');
          var $nextUl = $a.next('ul');
          data_.push({
            id: 'cus_m_' + $t.data('itemid'),
            parent: (pobj === false ? COM_DEFAULT._jsTreeOpt.root : 'cus_m_' + pobj.data('itemid')),
            text: $.trim($a.text()),
            icon: $a.children('i').first().attr('class')
          });
          if ($nextUl.length > 0) {
            $.merge(data_, createJStreeData($nextUl, $t));
          }
        });
        return data_;
      }

      function make_topbar_menu(data) { //初始化topbar菜单
        var str_ = [];
        $.each(data, function(i, n) {
          str_.push('<li data-itemid="', n.id, '"><a class="btn ', n.color,
            '" data-toggle="tooltip" data-placement="bottom" data-original-title="', n.tit,
            '"><i class="', n.icon, '"></i></a></li>')
        });
        $('#cumBopbarMenu').html(str_.join(''));
      }

      $('#cumBopbarMenu').tooltip({
        selector: 'li>a',
        trigger: 'hover'
      });

      function make_init_topbarD() { //页面加载初始化 topbar数据
        var arr_ = [];
        $.each(cusMenu_initData, function(i, n) {
          $.each(jstreeData_, function(j, m) {
            if (m.id.replace('cus_m_', '') == n) {
              arr_.push({
                id: n,
                icon: m['icon'],
                tit: m['text'],
                color: colorA_[(i % 5)]
              });
              return false;
            }
          });
        });
        return arr_;
      }

      make_topbar_menu(make_init_topbarD());

      var color_i_ = 0; //根据下标定义颜色
      /*自定义滚动条*/
      $('#carousel-bianji .btn-box-shortcut').mCustomScrollbar({
        theme: "dark-3"
      });
      var treeScrollBar = $('.tree-menu-box').mCustomScrollbar({
        theme: "dark-3"
      });

      /*jstree搜索*/
      $('#menu_search_input,#menu_search_btn').keypress(function() {
        $('#tree_box_menu').jstree(true).search($(this).val());
        treeScrollBar.mCustomScrollbar('scrollTo', '.jstree-search');
      });
      $('#menu_search_btn').click(function() {
        $('#tree_box_menu').jstree(true).search($('#menu_search_input').val());
        treeScrollBar.mCustomScrollbar('scrollTo', '.jstree-search');
      });
      /*删除选中菜单项*/
      $('#carousel-bianji').on('click', '.btn-box-shortcut button', function() {
        var id_ = $(this).data('itemid');
        var ref = $('#tree_box_menu').jstree(true);
        $(this).parent().remove();
        ref.uncheck_node('cus_m_' + id_);
      }).on('click', '#r_shortcut_menu', function() { /*删除全部*/
        var ref = $('#tree_box_menu').jstree(true);
        $('#carousel-bianji .btn-box-shortcut .mCSB_container').html("");
        ref.deselect_all();
        color_i_ = 0;
      }).on('click', '#save_shortcut_menu', function(ev, param) { /*点击保存*/
        var menuData_ = [],
          sendData = [];
        $('#carousel-bianji .btn-box-shortcut .mCSB_container button').each(function() {
          var id_ = $(this).data('itemid');
          menuData_.push({
            id: id_,
            icon: $(this).data('icon_'),
            tit: $(this).next().text(),
            color: $(this).data('color_')
          });
          sendData.push(id_);
        });
        saveCusMenuData && saveCusMenuData(sendData, function() {
          cusMenu_initData = sendData;
          make_topbar_menu(menuData_);
          layer.close(cur_lay_ind);
        });
      });
      /*打开弹框*/
      var modal = $('#index_cus_menus'),
        cur_lay_ind = 0;
      $('#customMenu_btn').click(function() {
        COM_TOOLS.requireJsFn(['jstree'], [], function() {
          var ref_menuTree = $('#tree_box_menu').jstree(true);
          if (!ref_menuTree) {
            /*初始化jstree*/
            $('#tree_box_menu').jstree({
              "checkbox": {
                "three_state": false //此属性选择是否级联,默认为true。
              },
              'core': {
                'data': jstreeData_,
                'themes': {
                  dots: false
                }
              },
              'plugins': ['checkbox', 'search'] //search:搜索组件,checkbox:多选框
            }).on("changed.jstree", function(e, d) {
              var ref = $(this).jstree(true);
              if (d.action == "deselect_all") {
                return;
              }
              var node_ = d.node.id;
              var n_text = ref.get_text(node_);
              var tit_ = $.trim(ref.get_text(node_)),
                id_ = node_.replace('cus_m_', ''),
                icon_ = d.node.icon;
              if (ref.is_selected(node_)) {
                if ($('#carousel-bianji>.btn-box-shortcut .mCSB_container button.cuschecked').length >
                  (COM_DEFAULT._customMenus - 1)) {
                  ref.deselect_node(node_);
                  COM_TOOLS.alert(TEDU_MESSAGE.get('platform.plugin.com_msg.choose_max', [
                    COM_DEFAULT._customMenus
                  ])); //最多选择N个；
                  return false;
                }
                var color_btnc = (colorA_[(color_i_ % 5)]);
                $('#carousel-bianji>.btn-box-shortcut .mCSB_container').append(
                  '<div class="col-xs-4 text-center">' +
                  '<button data-color_="' + color_btnc + '" data-icon_="' + icon_ +
                  '" data-itemid="' + id_ +
                  '" type="button" class="btn btn-circle btn-lg cuschecked ' + color_btnc + '">' +
                  '<em><i class="glyphicon glyphicon-minus"></i></em>' +
                  '<i class="' + icon_ + '"></i></button><p>' + tit_ + '</p>' +
                  '</div>');
                color_i_++;
              } else {
                $('#carousel-bianji button[data-itemid=' + id_ + ']').parent().remove();
              }
            }).on('ready.jstree', function() {
              var ref_menuTree = $(this).jstree(true);
              /*初始化默认选择*/
              var id_tree_arr = [];
              $.each(cusMenu_initData, function(i, n) {
                id_tree_arr.push('cus_m_' + n);
              });
              ref_menuTree.select_node(id_tree_arr, false, false);
            });
            ref_menuTree = $('#tree_box_menu').jstree(true);
          }
          $('#carousel-bianji .btn-box-shortcut .mCSB_container').html("");
          ref_menuTree.deselect_all();
          color_i_ = 0;
          var id_list_arr = cusMenu_initData;
          if (id_list_arr) {
            var id_tree_arr = [];
            $.each(id_list_arr, function(i, n) {
              id_tree_arr.push('cus_m_' + n);
            });
            ref_menuTree.select_node(id_tree_arr, false, false);
          }
          cur_lay_ind = cumParentWinModal(TEDU_MESSAGE.get('platform.plugin.com_msg.zdy_menu'), modal, { //自定义菜单设置
            'type': 1,
            'area': ['770px', '430px'],
            'end': function() {
              $('#menu_search_input').val('');
            }
          });
        });
      });
      /*点击保存后的菜项*/
      $('#cumBopbarMenu').on('click', 'li>a', function() {
        var itemid = $(this).parent().data('itemid');
        //单独触发a标签无效，通过内部冒泡实现
        $('#side-menu li[data-itemid=' + itemid + ']>a').trigger('click');
      });
    }, 1500);
  }
  //首页快捷入口
  $('#welPiframe').load(function() {
    $(this).contents().find('body').on('click', 'a.cus-evt-link', function(ev) {
      var t_data = {};
      t_data.itemid = $(this).data('itemid') || '';
      t_data.itemtext = $.trim($(this).text());
      t_data.itemurl = $(this).attr('href');
      if (t_data.itemid) { //有资源ID则认为是系统内资源链
        ev.preventDefault();
        if (COM_DEFAULT._tabSingle > 0) {
          setTimeout(function() {
            jumpFactive(t_data, true);
          }, 300);
        }
      }
    });
  });

  /**
   * 加载客服消息 【M：3.9.2，后续版本中移除】
   * @param {Object} url_ 消息接口地址
   */
  function getUserMsg(url_) {
    var _xhr = null;

    function _callee() {
      if (_xhr) {
        _xhr.abort();
      }
      _xhr = $.ajax({
        type: "get",
        url: url_,
        async: true,
        cache: false,
        timeout: 3000, //3秒超时
        dataType: 'json',
        success: function(d) {
          if (d && d.code == 1) {
            $.each(d.boList, function(i, n) {
              COM_TOOLS._model.msg_fn(n, {
                cancel: function() {
                  if (COM_DEFAULT._isOpenNotice["seturl"] && n.id) {
                    $.get(COM_DEFAULT._isOpenNotice["seturl"], {
                      id: n.id
                    }, function(dd) {}, 'json');
                  }
                }
              });
            });
          }
        },
        complete: function() {
          window.setTimeout(function() {
            _callee();
          }, Math.max(COM_DEFAULT._isOpenNotice["requestTime"], 10) * 1000);
        }
      });
    }

    _callee();
  }

  /**
   * 加载客服消息（新） 【A：3.8.6】
   * @param {Object} url_ 消息接口地址
   */
  function getUserMsg2(url_) {
    var _xhr = null;

    function _callee() {
      if (_xhr) {
        _xhr.abort();
      }
      _xhr = $.ajax({
        type: "get",
        url: url_,
        async: true,
        cache: false,
        timeout: 3000, //3秒超时
        dataType: 'json',
        success: function(d) {
          if (d && d.code == 1) {
            var arr_normal = [];
            var arr_must = [];
            $.each(d.boList, function(i, n) {
              if (n.force == '1') { //0:非强制 1强制
                arr_must.push(n);
              } else {
                arr_normal.push(n);
              }
            });
            if (arr_must.length) {
              COM_TOOLS._model.msg_fn2(arr_must, {
                area: ['380px', 'auto'],
                other: {
                  offset: 'auto', // 位置：右下角
                  cusOffsetLeft: 0, //据右侧偏移量
                  shade: 0.3,
                  id: 'cus_msg_wid_must'
                }
              });
            }
            if (arr_normal.length) {
              COM_TOOLS._model.msg_fn2(arr_normal);
            }
          }
          if (d && $.trim(d.userNum) != '') { //在线人数
            $('#online_unum').text(d.userNum);
          }
        },
        complete: function() {
          window.setTimeout(function() {
            _callee();
          }, Math.max(COM_DEFAULT._isOpenNotice.requestTime, 10) * 1000);
        }
      });
    }
    _callee();
  }


  if (COM_DEFAULT._isOpenNotice.isDisplay && COM_DEFAULT._isOpenNotice.geturl) {
    if (COM_DEFAULT._isOpenNotice.version == '1.0') { //2020-11-09 【add】
      $(document).on('click', '.js-cusmsg-hander', function(e) {
        e.preventDefault();
        var url = $(this).data('acturl');
        if (url) {
          if (/^http/.test(url)) {
            window.open(url);
          } else {
            /* if ($(this).data('contentflag')) {
              cumParentWinModal('消息', url);
            } else {
              cumParentWinModal('消息', COM_DEFAULT._contextPath + url);
            } */
            url = !!$(this).data('contentflag') ? url : COM_DEFAULT._contextPath + url;
            if ($(this).data('win_type') == 'tab') { //打开框架中的新标签；
              jumpFactive({
                itemid: 'B00000100000A',
                itemurl: url,
                itemtext: '待办事项'
              }, true);
            } else { //弹窗
              cumParentWinModal('消息', url);
            }
          }
        }
      });
      //系统消息回调方法 队列；使用方法： window.__MSG_CALLBACK__.add(fn=>(data,type));
      window.__MSG_CALLBACK__ = $.Callbacks();
    }
    window.setTimeout(function() {
      if (COM_DEFAULT._isOpenNotice.version == '1.0') { //2020-11-09 【add】
        _initTopMsgFun_();
      } else if (COM_DEFAULT._isOpenNotice.isNew) { //使用新版系统消息
        getUserMsg2(COM_DEFAULT._isOpenNotice.geturl);
      } else { //兼容旧版本方法，后续版本移除
        getUserMsg(COM_DEFAULT._isOpenNotice.geturl);
      }
    }, (COM_DEFAULT._isOpenNotice.delayTime || 5) * 1000);
  }
  /* 强制退出系统 */
  if (COM_DEFAULT._forcedExit && COM_DEFAULT._forcedExit.time != -1) {
    if (COM_DEFAULT._forcedExit.time.indexOf(':') != -1) {
      /* 按指定时间执行,格式 (01:05),24小时制，凌晨1点05分 */
      window.setInterval(function() {
        var now_ = new Date();
        var nowStr_ = (now_.getHours() < 10 ? '0' + now_.getHours() : now_.getHours()) + ':' + (now_.getMinutes() <
          10 ? '0' + now_.getMinutes() : now_.getMinutes());
        if (nowStr_ == COM_DEFAULT._forcedExit.time) {
          var num_ = 10;
          var title_ = function() {
            return '系统即将于（' + num_ + '）秒后强制退出！';
          };
          var timer = null; //习惯性回收资源
          var index_ = COM_TOOLS.confirm(title_(), {
            btn: ['终止退出', '立即退出'],
            btnStyleArr: ['btn-warning', 'btn-danger'],
            closeBtn: 0,
            end: function() {
              if (timer) {
                window.clearInterval(timer);
              }
              window.location.href = COM_DEFAULT._contextPath + '/logout';
            },
            id: 'box_forcedexit_1'
          }, function(ind) {
            layer.close(ind, true);
            if (timer) { //清楚定时器
              window.clearInterval(timer);
            }
          });
          var $cont_ = $('#box_forcedexit_1');
          timer = window.setInterval(function() {
            num_--;
            $cont_.html(title_());
            if (num_ == 0) {
              layer.close(index_);
            }
          }, 1000);
        }
      }, 50 * 1000); //这里的时间必须大于倒计时的秒数，默认10秒。安全值为 大于12秒的时间；
    } else if (Number(COM_DEFAULT._forcedExit.time) == COM_DEFAULT._forcedExit.time && COM_DEFAULT._forcedExit.time >=
      1 && COM_DEFAULT._forcedExit.time <= 24) {
      /* 按本次登录持续时长执行,范围[1-24]，前后包含； */
      window.setTimeout(function() {
        var num_ = 10;
        var title_ = function() {
          return '系统即将于（' + num_ + '）秒后强制退出！';
        };
        var timer = null; //习惯性回收资源
        var index_ = COM_TOOLS.confirm(title_(), {
          btn: ['终止退出', '立即退出'],
          btnStyleArr: ['btn-warning', 'btn-danger'],
          closeBtn: 0,
          end: function() {
            if (timer) {
              window.clearInterval(timer);
            }
            window.location.href = COM_DEFAULT._contextPath + '/logout';
          },
          id: 'box_forcedexit_1'
        }, function(ind) {
          layer.close(ind, true);
          if (timer) { //清楚定时器
            window.clearInterval(timer);
          }
        });
        var $cont_ = $('#box_forcedexit_1');
        timer = window.setInterval(function() {
          num_--;
          $cont_.html(title_());
          if (num_ == 0) {
            layer.close(index_);
          }
        }, 1000);
      }, COM_DEFAULT._forcedExit.time * 3600 * 1000);
    }
  }
});

function _initTopMsgFun_() {
  var $wrap_ = $(
    '<div class="msgbox-left layout-flex"><div class="text-hidden-box"><p class="ani-scrolltoleft"><span class="js-cusmsg-hander js-scroll-tbox"></span></p></div></div>' +
    '<div class="msgbox-right layout-flex">' +
    (COM_DEFAULT._isOpenNotice.showWait == 1 ? ('<div class="menubox-item2 dropdown">' +
      '<div class="dropdown-btn js-cinit-dropdown" data-contentflag="1" data-acturl="' +
      COM_DEFAULT._isOpenNotice.processListUrl + '">' +
      '<i class="tedufont tedu-icon134 tt-icon"></i>待办事项<i class="js-wait-tip msg-tip">0</i>' +
      '</div>' +
      '<div class="dropdown-menu panel panel-default"><div class="panel-heading">待办统计</div><div class="panel-body dropdown-cc-box">' +
      '<div class="dropdown-cbox layout-flex js-wait-cont"></div></div></div></div>') : '') +
    (COM_DEFAULT._isOpenNotice.showNotice == 1 ? (
      '<div class="menubox-item2"><div class="dropdown-btn js-cusmsg-hander" data-contentflag="1" data-acturl="' +
      COM_DEFAULT._isOpenNotice.infoListUrl + '">' +
      '<i class="tedufont tedu-icon135 tt-icon"></i>系统通知<i class="js-notice-tip msg-tip">0</i>' +
      '</div></div>') : '') +
    '</div>');
  var $online_unum_ = $('#online_unum'), //在线人数
    $waitTip_ = $wrap_.find('.js-wait-tip'), //待办数
    $noticeTip_ = $wrap_.find('.js-notice-tip'), //系统通知数
    $waitCont_ = $wrap_.find('.js-wait-cont'), //待办列表容器
    $topBarMsgBox_ = $wrap_.find('.js-scroll-tbox'); //顶部走马灯容器

  $('#topbar_msg_box').html($wrap_);
  $wrap_.find('.js-cinit-dropdown').dropdownHover();

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
  /*
   * 格式化日期
   */
  function _dateformat(date) {
    return date ? date.replace(/\d{4}-(\d{2}-\d{2} \d{2}:\d{2}):\d{2}/, '$1') : '';
  }
  /*
   * 常规消息接口
   */
  function _getUserMsg3() {
    var _xhr = null;

    function _callee() {
      if (_xhr) {
        _xhr.abort();
      }
      _xhr = $.ajax({
        type: "get",
        url: COM_DEFAULT._isOpenNotice.getNewurl + '?type=0',
        async: true,
        cache: false,
        timeout: 3000, //3秒超时
        dataType: 'json',
        success: function(d) {
          _structureDom(d);
        },
        complete: function() {
          window.setTimeout(function() {
            _callee();
          }, Math.max(COM_DEFAULT._isOpenNotice.requestTime, 10) * 1000);
        }
      });
    }
    _callee();
  }

  function _getUserMsg4() {
    var _xhr = null;

    function _callee(t) {
      if (_xhr) {
        _xhr.abort();
      }
      _xhr = $.ajax({
        type: "get",
        url: COM_DEFAULT._isOpenNotice.getNewurl + '?type=' + (t || 0), //t=4 只请求在线人数  t=0 请求全量
        async: true,
        cache: false,
        timeout: 3000, //3秒超时
        dataType: 'json',
        success: function(d) {
          _structureDom(d, t);
        },
        complete: function() {
          window.setTimeout(function() {
            _callee(4);
          }, Math.max(COM_DEFAULT._isOpenNotice.requestTime, 10) * 1000);
        }
      });
    }
    _callee();
  }

  /**
   * 构造消息弹窗数据
   * @param {Object} obj
   * @param {Object} isarr 是否是数组  融云推送每次单条   接口拉取每次拉取集合
   */
  function _openRbmod(obj, isarr) {
    if (!obj) {
      return false;
    }
    var arr_normal = [];
    var arr_must = [];
    if (isarr) {
      $.each(obj, function(i, n) {
        if (n.forceFlag == '1') { //0:非强制 1强制
          arr_must.push(n);
        } else {
          arr_normal.push(n);
        }
      });
    } else {
      obj.title = obj.msgTitle;
      if (obj.forceFlag == '1') { //0:非强制 1强制
        arr_must.push(obj);
      } else {
        arr_normal.push(obj);
      }
    }
    if (arr_must.length) {
      COM_TOOLS._model.msg_fn2(arr_must, {
        area: ['380px', 'auto'],
        other: {
          offset: 'auto',
          cusOffsetLeft: 0,
          shade: 0.3,
          id: 'cus_msg_wid_must'
        }
      });
    }
    if (arr_normal.length) {
      COM_TOOLS._model.msg_fn2(arr_normal);
    }
  }

  /**
   * 构建融云消息通讯
   */
  function _openRongclould() {

    var im = RongIMLib.init({ //初始化
      appkey: COM_DEFAULT._isOpenNotice.appKey
    });
    var user = {
      token: ""
    };
    var gettokenlen = 1, //计数器，获取token 最多补偿5次
      getmin = 100; // 延时 时长，单位毫秒；首次 100MS  每次递增10秒；

    $.ajax({
      url: COM_DEFAULT._contextPath + '/userLink/resetAccountLogin?type=' + gettokenlen,
      success: function(res) {
        user.token = res;
      },
      complete: function(XHR, textStatus) {
        linkRongClould();
      }
    });

    function linkRongClould() {
      im.connect(user).then(function(user) {
        // console.log('链接成功, 链接用户 id 为: ', user.id);
        gettokenlen = 1;
        getmin = 10000;
        _getUserMsg4();
      }).catch(function(error) {
        // console.log('链接失败: ', error.code, error.msg);
        if (error.code == '31004') {
          $.get(COM_DEFAULT._contextPath + '/userLink/resetAccountLogin?type=' + gettokenlen,
            function(res) {
              gettokenlen++;
              user.token = res;
              if (gettokenlen < 6) {
                setTimeout(linkRongClould, getmin);
              }
              getmin += 10000;
            });
        }
      });
    }

    var conversationList = [];

    im.watch({
      conversation: function(event) {},
      message: function(event) {
        var msg = $.parseJSON(event.message.content.content);
        // console.log('收到新消息:', msg.type * 1);
        switch (msg.type * 1) {
          case 1: //系统通知消息
            if (COM_DEFAULT._isOpenNotice.showNotice == 1) { //系统通知
              $noticeTip_.text(_msg_tip_format($.trim($noticeTip_.text()) * 1 + (msg.msgReduce * 1)));
            }
            if (COM_DEFAULT._isOpenNotice.showRbnotice == 1 && msg.msgReduce * 1 > 0) { //弹窗
              _openRbmod(msg);
            }
            break;
          case 2: //通知(TOP msg)
            if (COM_DEFAULT._isOpenNotice.showNotice == 1) { //系统通知
              $noticeTip_.text(_msg_tip_format($.trim($noticeTip_.text()) * 1 + (msg.msgReduce * 1)));
            }
            if (COM_DEFAULT._isOpenNotice.showMsg == 1) { //走马灯
              $topBarMsgBox_.text(_dateformat(msg.publishTime) + "：" + msg.msgTitle.replace(/<.*?>/g, "")).data(
                'acturl', msg.linkUrl);
            }
            if (COM_DEFAULT._isOpenNotice.showRbnotice == 1 && msg.msgReduce * 1 > 0) { //弹窗
              _openRbmod(msg);
            }
            break;
          case 3: //代办
            if (COM_DEFAULT._isOpenNotice.showWait == 1) {
              $waitTip_.text(_msg_tip_format($.trim($waitTip_.text()) * 1 + (msg.msgReduce * 1)));
              var d = $waitCont_.find('[data-type=' + msg.processType + '] .c-item-icon');
              d.text(_msg_tip_format($.trim(d.text()) * 1 + (msg.msgReduce * 1)));
            }
            break;
          case 4: //在线人数
            $online_unum_.text(msg.userNum);
            break;
        }
      },
      status: function(event) {},
      expansion: function(event) {},
      chatroom: function(event) {}
    });

  }
  /**
   * 构建消息
   * @param {Object} d 数据
   * @param {Object} t 类型请求消息接口传参，值为：undefined 或 4   0代表全量  4代表在线人数
   */

  function _structureDom(d, t) {
    if (d) {
      window.__MSG_CALLBACK__.fire(d, t); //获取到消息后，触发外部回调队列；队列中的回调会依次被触发；
      if (d && $.trim(d.userNum) != '') { //在线人数
        $online_unum_.text(d.userNum);
      }
      if (!t) {
        if (COM_DEFAULT._isOpenNotice.showNotice == 1) { //系统通知
          $noticeTip_.text(_msg_tip_format(d.msgTotal));
        }
        if (COM_DEFAULT._isOpenNotice.showWait == 1) { //待办事项
          $waitTip_.text(_msg_tip_format(d.processTotal));
          var str = '';
          $.each(d.processList, function(i, n) {
            str += '<div class="c-item text-ellipsis js-cusmsg-hander" data-win_type="tab" data-acturl="' + n.url +
              '" data-type="' + n
              .type + '">' +
              '<span class="c-txt">' + n.typeName + ' </span>' +
              '(<i class="c-item-icon">' + (_msg_tip_format(n.number)) + '</i>)' +
              '</div>';
          });
          $waitCont_.html(str);
        }
        if (COM_DEFAULT._isOpenNotice.showRbnotice == 1 || COM_DEFAULT._isOpenNotice.showMsg == 1) { //弹出窗、走马灯
          var arrMsg_model_ = [];
          if (d.newMsg) {
            $.each(d.newMsg, function(i, n) {
              n.title = n.msgTitle;
              if (n.type == 2) {
                arrMsg_model_.push(n)
              }
            });
          }
          // 弹窗消息
          if (COM_DEFAULT._isOpenNotice.showRbnotice == 1) {
            _openRbmod(d.newMsg, true);
          }
          // 顶部消息
          if (COM_DEFAULT._isOpenNotice.showMsg == 1) {
            if (arrMsg_model_.length) {
              var frist_ = arrMsg_model_[0];
              $topBarMsgBox_.text(_dateformat(frist_.publishTime) + "：" + (frist_.msgTitle.replace(/<.*?>/g, ""))).data(
                'acturl',
                frist_.linkUrl);
            }
          }
        }

      }
    }
  }

  if (COM_DEFAULT._isOpenNotice.rongcoudflag == '1') {
    _openRongclould();
  } else {
    _getUserMsg3();
  }
}
