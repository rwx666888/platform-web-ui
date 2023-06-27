<%@ page language="java" pageEncoding="UTF-8"
         import="com.tarena.platform.common.properties.ConstancesMap,com.tarena.platform.login.model.PlatformMenuVO,com.tarena.platform.util.LocalUtil" %>
<%@ page import="java.io.IOException" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<%
    String ldap = ConstancesMap.getItemDefaultValue("system", "ldap.status", "0");
    // AD:1,TMP:2, colse:0, test:3
    boolean isAdOpen = (Integer.parseInt(ldap) == 1 || Integer.parseInt(ldap) == 2);
    String modifyPassUrl = "https://tmp.tedu.cn/api/na/modifyPass.html";
%>
<c:set var="isAdOpen" value="<%=isAdOpen %>"/>
<c:set var="modifyPassUrl" value="<%=modifyPassUrl %>"/>
<html>
<head>
    <link href="${STATIC_PATH}/common/css/plugins/customScrollbar/jquery.mCustomScrollbar.min.css" rel="stylesheet">
    <%@ include file="header.jsp" %>
    <title><ta:local key="platform.common.project.name"/></title>

    <style>
        body {
            background-color: #2f4050;
            overflow-x: hidden;
        }

        html,
        body {
            height: 100%;
        }

        /*tab标签新增样式*/

        .navbar-top-links .dropdown-menu .link-block a:hover {
            color: #299BE4;
        }

        .logo_box {
            background: #299be4;
            height: 60px;
        }

        .nav-third-level li.active {
            border: none;
        }

        .navbar-default .nav > li > a:focus {
            /*background-color: #293846;*/
            color: #a7b1c2;
        }

        .navbar-default .nav > li > a.x-highlight {
            /*background-color: #293846;*/
            color: white !important;
        }

        .navbar-default .nav > li.active > a {
            color: #a7b1c2;
        }

        #cumBopbarMenu > li > a {
            width: 35px;
            padding: 5px 0;
            height: 35px;
            font-size: 16px;
            text-align: center;
            border-radius: 10px;
        }

        .menu-search-box {
            position: absolute;
            top: 60px;
            left: 0;
            overflow: hidden;
            z-index: 10;
            right: 0;
            height: 42px;
            padding: 6px 8px 0 8px;
            background: #299be4;
        }
    </style>

    <script type="text/javascript">
        //自定义菜单初始化数据
        cusMenu_initData = ${menuIds};
    </script>

</head>

<body class="height-100-x has-menu-sear-box">
<div id="wrapper">
    <div class="page-left-box">
        <div class="logo_box">
            <div class="profile-element text-center p-xs">
                <img alt="image" src="${STATIC_PATH}/common/images/logo.png"/>
            </div>
            <div class="logo-element"><ta:local key="platform.common.project.logo"/></div>
        </div>
        <!--菜单搜索框-->
        <div class="menu-search-box">
            <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="搜索菜单" id="menu_search_b_inp" autocomplete="off">
                <span class="input-group-addon" id="menu_search_b_cbtn" style="cursor: pointer;"><i
                        class="glyphicon glyphicon-remove"></i></span>
            </div>
        </div>
        <!--页面左侧菜单-->
        <nav class="navbar-default navbar-static-side" role="navigation">
            <div class="navbar-static-side-cb" style="height: 100%; position: relative;">

                <div class="sidebar-collapse">
                    <ul class="nav metismenu" id="side-menu">
                        <%!
                            public void outputMenu(PlatformMenuVO menu, HttpServletRequest request, JspWriter out) throws IOException {
                                String menuUrl = "#";
                                if (menu.getUrl() != null && !"".equals(menu.getUrl().trim())) {
                                    menuUrl = menu.getUrl();
                                }
                                //	删除无用	(menu.getHasNext() == 0 ? "target='mainPiframe'" : "")+
                                out.println("<li class='item' data-itemid='" + menu.getId() + "'>\n" + "<a href='" + menuUrl + "' " + (menu.isNewWindow() ? "target='_blank'" : "target='_self'") + ">\n" + (menu.getHasNext() == 0 ? "" : "<span class='fa arrow'></span>\n") + "	<i class='" + menu.getIcon() + "'></i> \n" + "	<span class='nav-label'>" + LocalUtil.getLoclValue("platform.common.menu." + menu.getCode(), (String) request.getSession().getAttribute("local.language")) + "</span>" + "</a>\n");
                                if (menu.getHasNext() == 1) {
                                    out.println("<ul class='nav nav-second-level collapse'>\n");
                                    for (PlatformMenuVO item : menu.getChildren()) {
                                        outputMenu(item, request, out);
                                    }
                                    out.println("</ul>\n");
                                }
                                out.println("</li>\n");
                            }%>
                        <%
                            PlatformMenuVO root = (PlatformMenuVO) request.getAttribute("resourceMenus");
                            if (root != null && root.getChildren() != null && root.getChildren().size() > 0) {
                                for (PlatformMenuVO item : root.getChildren()) {
                                    outputMenu(item, request, out);
                                }
                            }
                        %>
                    </ul>
                </div>
                <!-- searche-box -->
                <div class="menu-search-rbox" id="menu_search_rbox"></div>
                <!-- searche-box -->
            </div>
        </nav>
        <div class="cus-online-box">
            <i class="t-icon"></i><span id="online_unum">0</span>人
        </div>
    </div>
    <!--页面右侧区域-->
    <div id="page-wrapper" class="gray-bg dashbard-1">
        <!--右侧页面头部区域-->
        <div class="row border-bottom nav-top-x">
            <nav class="navbar navbar-static-top layout-flex" role="navigation"
                 style="margin-bottom: 0">
                <div class="topbar-leftbox clearfix">
                    <a class="navbar-minimalize minimalize-styl-2 btn btn-warning " href="#"><i
                            class="tedufont icon-minimalize tedu-icon38"></i><i
                            class="tedufont icon-minimalize tedu-icon39"></i> </a>
                    <%@ include file="/private/common/jsp/include.jsp" %>
                </div>
                <div class="topbar-centerbox layout-flex">
	            <!-- 消息容器 -->
	            <div class="md-2020111101 layout-flex__item layout-flex hidden-xs hidden-sm" id="topbar_msg_box"></div>
	        </div>
		<div class="topbar-rightbox layout-flex">
                <div class="clearfix visible-lg-block" style="margin-top: 12.5px;">
                    
                    <div class="pull-right visible-md-block visible-lg-block shortcut-menu-open">
                        <ul class="cumtopbarmenu pull-left" id="cumBopbarMenu"></ul>
                        <button id="customMenu_btn" class="btn btn-circle btn-success pull-left"
                                style="margin-top: 2.5px;"><i class="fa fa-plus" style="font-size: 20px;"></i></button>
                    </div>
		    <!--switch开关-->
                    <div class="switch-on-off pull-right hidden visible-md-block visible-lg-block"
                         style="margin: 2.5px 15px 0 0;">
                        <input type="checkbox" id="switch-checkbox" checked/>
                        <label class="switch-box" for="switch-checkbox">
                            <div class="track">
                                <div class="knob"></div>
                            </div>
                        </label>
                    </div>
                </div>
		
		
		<ul class="nav navbar-top-links navbar-right">
                    <li id="dropdown_indexmenux" class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" id="js-step-trigger" data-submenu
                           data-hover="dropdown" href="#">
                            <img src="${userSession.headPortrait}" data-src="${STATIC_PATH}/${defultImg}" height='32'
                                 class="img-circle" alt="image" id="head_image">
                        </a>
                        <ul class="dropdown-menu dropdown-messages animated fadeInRight" id="js-step-box" style="left: auto; right: 0;">
                            <li>
                                <a>${userSession.name}</a>
                            </li>
                            <li id="cus-step2">
                                <a href="JavaScript:info()"><ta:local key="platform.common.label.user_data"/></a>
                            </li>
                            <li>
                                <a href="JavaScript:msginfo()">我的消息</a>
                            </li>
                            <li class="dropdown-submenu">
                                <a><ta:local key="platform.common.label.choose_language"/></a>
                                <ul class="dropdown-menu">
                                    <c:forEach var="item" items="${localList}">
                                        <li><a href="${contextPath}/index?local=${item.code}">${item.name}</a></li>
                                    </c:forEach>
                                </ul>
                            </li>
                            <li class="dropdown-submenu role">
                                <a><ta:local key="platform.common.label.change_role"/></a>
                                <ul class="dropdown-menu">
                                    <c:forEach var="item" items="${userRole}">
                                        <li class="js-indexmenu-tips" title="${item.organizationName}"><a
                                                href="${contextPath}/changeRole?roleId=${item.roleId}&organizationId=${item.organizationId}"
                                                <c:if test="${item.roleId==roleId && item.organizationId==organizationId}">onclick="return false;"</c:if>>${item.roleName}</a>
                                        </li>
                                    </c:forEach>
                                </ul>
                            </li>
                            <li>
                                <a href="JavaScript:chgPwd()"><ta:local key="platform.common.label.update_pwd"/></a>
                            </li>
                            <li>
                                <a href="${contextPath}/logout"><ta:local key="platform.common.label.quit"/></a>
                            </li>
                        </ul>
                    </li>
                    <li style="margin-right: 0; padding-right: 30px;">
                        <a id="js_cushelpbtn"
                           style="margin: 1px 7px 0 10px; padding: 0; min-height: auto; color: #f8ac59; font-size: 32px !important; font-weight:400;"
                           class="glyphicon glyphicon-question-sign cushelpbtn js-helpbtn js-helpmsg"
                           data-helpmsg="noGetPermission"></a>
                    </li>
                </ul>
            
	      </div>
            </nav>
        </div>
        <!--页面主体内容开始-->
        <div class="row  border-bottom gray-bg dashboard-header" id="tab_pannel_box">
            <div class="tab-header-x" id="tab_header_x">
                <div class="tab-list-box">
                    <button class="roll-nav roll-left tab-roll-btn tab-left-btn"><i class="fa fa-backward"></i></button>
                    <div class="tab-list-overflow">
                        <div class="tab-list-bar">
                            <ul class="nav nav-tabs tab-list-ul" role="tablist" id="t_tabBox" style="float: left;">
                                <li role="presentation" class="active"><a href="#t_home" aria-controls="t_home"
                                                                          role="tab" data-toggle="tab"
                                                                          data-itemid="satyhomeever"><ta:local
                                        key="platform.common.project.home_page"/></a></li>
                                <!-- <li role="presentation" class="hidden"><a href="#t_subpage" aria-controls="t_subpage" role="tab" data-toggle="tab" data-itemid=""></a></li>  -->
                            </ul>
                        </div>
                    </div>
                    <button class="roll-nav roll-right tab-roll-btn tab-right-btn"><i class="fa fa-forward"></i>
                    </button>
                </div>
                <div class="tab-btns">
                    <span class="tabs-close-all-btn">关闭全部</span>
                </div>
            </div>
            <!-- Tab panes -->
            <div id="tab_contBox" class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="t_home">
                    <iframe class="js-iframe-comwin" width="100%" height="100%" frameborder="0"
                            src="${contextPath}<ta:config key='html.welcome.url' file='html'/>" name="welPiframe"
                            id="welPiframe" allowtransparency="yes"></iframe>
                </div>
            </div>
        </div>
        <!--页面主体内容结束-->
    </div>
</div>

<!-- tools弹窗开始 -->
<div id="index_cus_menus" class="carousel slide index-cus-menus" data-wrap="false" data-pause="true"
     style="height: 400px;min-height:400px; width: 770px;overflow: auto; display: none;">
    <div class="menu-left pull-left">
        <div class="tree-box-search">
            <div class="input-group input-group-sm">
                <input id="menu_search_input" type="text" class="form-control input-sm">
                <span id="menu_search_btn" class="input-group-btn"><button class="btn btn-primary" type="button"><i
                        class="glyphicon glyphicon-search"></i></button></span>
            </div>
        </div>
        <div class="tree-menu-box">
            <div id="tree_box_menu"></div>
        </div>
    </div>
    <div class="menu-right pull-right carousel-bianji" id="carousel-bianji">
        <div class="btn-box-header">
            <button id="save_shortcut_menu" class="btn btn-sm btn-success">保存 <i
                    class="glyphicon glyphicon-floppy-disk"></i></button>
            <button id="r_shortcut_menu" class="btn btn-sm btn-danger">清空 <i class="glyphicon glyphicon-trash"></i>
            </button>
        </div>
        <div class="btn-box-shortcut"></div>
    </div>
</div>
<div class="minibar-menu">
    <div id="minibar_menu"></div>
</div>
<!-- tools弹窗结束 -->

<!-- Mainly scripts -->
<!-- Custom and plugin javascript -->
<script src="${STATIC_PATH}/common/js/jquery-2.1.1.js"></script>
<script src="${STATIC_PATH}/common/js/bootstrap.min.js"></script>
<script src="${STATIC_PATH}/common/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="${STATIC_PATH}/common/js/plugins/customScrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="${STATIC_PATH}/common/js/plugins/layer/layer.js?v=<ta:cache key="platform.common.file.v_layer"/>"></script>
<script src="${I18N_PATH}/i18n/${baseLocal}.js?v=<ta:cache key="platform.common.file.v_baseLocal"/>"></script>
<script src="${STATIC_PATH}/common/js/bootstrap-plugins-custom.min.js?v=<ta:cache key="platform.common.file.v_custom"/>"></script>
<!-- Custom and plugin javascript -->
<script src="${STATIC_PATH}/common/js/subindex.min.js?v=<ta:cache key="platform.common.file.v_subindex"/>" type="text/javascript"></script>
<script src="${STATIC_PATH}/common/js/inspinia.min.js"></script>
<script src="${STATIC_PATH}/common/js/pinyin.js"></script>
<script src="${STATIC_PATH}/common/js/plugins/jsTree/jstree.min.js"></script>
<%
if("<ta:config key='platform.im.rongcloud.appkey' file='platform-im'/>" !=""){
%>
<script src="${STATIC_PATH}/common/js/plugins/rongyun/RongIMLib-3.0.7.1-dev.min.js"></script>
<%
}
%>
<script type="text/javascript">
    //自定义菜单保存方法
    function saveCusMenuData(arr, sucfn) {
        $.post('${contextPath}/userResource/save', {'ids': JSON.stringify(arr)}, function (res) {
            if (res) {
                sucfn && sucfn();
            } else {
                COM_TOOLS.alert(TEDU_MESSAGE.get('platform.common.msg.defeated'));
            }
        });
    }

    // 左侧快捷搜索
    $('.custem_select_mod').data('callback', function (t_, parent, target) {
        target.removeData().data('itemurl', t_.data('itemurl'))
            .data('itemval', t_.data('itemval'))
            .data('itemtext', t_.text())
    });

    function sc_search() {
        var tar = $('#demo_index_search');
        var t_data = {};
        t_data.itemid = tar.data('itemval') || '';
        t_data.itemtext = tar.data('itemtext');
        t_data.itemurl = tar.data('itemurl');
        if (t_data.itemid) { //有资源ID则认为是系统内资源链
            if (COM_DEFAULT._tabSingle > 0) {
                setTimeout(function () {
                    jumpFactive(t_data, true);
                }, 300);
            }
        }
    }

    $(function () {
        // 头像赋默认值
        var src_img = $('#head_image').attr('src');
        var defult_img = $('#head_image').attr('data-src');
        if (!src_img) {
            $('#head_image').attr('src', defult_img);
        }
        //初始化 tab 滚动
        COM_TOOLS._view.tabScrollFn.init('#tab_header_x');

        $('#switch-checkbox').change(function () {
            if ($('#switch-checkbox').is(':checked')) {
                $('#tab_pannel_box').removeClass('hide-cus-tab-header');
            } else {
                $('#tab_pannel_box').addClass('hide-cus-tab-header');
            }
        })

        /* 搜索框 */
        var $menu_search_rbox_ = $('#menu_search_rbox');
        var side_menu_Arr = [];
        /* 这里延时，防止阻塞 */
        window.setTimeout(function () {
            /* 构造菜单数组，防止每次查询都对dom进行操作 */
            $('#side-menu li > a').each(function () {
                var $t_ = $(this);
                var tit_ = $t_.children('.nav-label').text();
                side_menu_Arr.push({
                    title: tit_,
                    itemid: String($t_.parent('li').data('itemid')),
                    titleCode: tit_.toPinYin()
                });
            });
        }, 1000);
        /* 菜单搜索框事件处理 */
        $('#menu_search_b_inp').on('input', function () {
            var $val = $.trim($(this).val());
            if ($val.length > 0) {
                var res = $.map(side_menu_Arr, function (n) {
                    return (n.titleCode.indexOf($val.toUpperCase()) >= 0) ||
                    (n.title.toUpperCase().indexOf($val.toUpperCase()) >= 0) ? n : null;
                });
                var html_ = [];
                html_.push('<ul class="t-ser-list">');
                $.each(res, function (i, n) {
                    html_.push('<li data-itemid="', n.itemid, '">', n.title, '</li>');
                });
                html_.push('</ul>');
                $menu_search_rbox_.show();
                $menu_search_rbox_.html(html_.join(''));
            } else {
                $menu_search_rbox_.hide();
                $menu_search_rbox_.html('');
            }
        });
        $menu_search_rbox_.on('click', 'li', function () {
            $('#side-menu li[data-itemid=' + $(this).data('itemid') + ']>a').trigger('click');
            $('#menu_search_b_inp').val('').trigger('input');
        });
        $('#menu_search_b_cbtn').click(function () {
            $('#menu_search_b_inp').val('').trigger('input');
        });
    });

    /*打开 用户信息 窗口  */
    function info() {
        cumParentWinModal('<ta:local key="platform.common.label.user_data"/>', '${contextPath}<ta:config key='html.userinfo.url' file='html'/>', {
            "scrollbar": true,
            "area": [<ta:config key='html.userinfo.size' file='html'/>]
        });
    };

    function msginfo() {
        cumParentWinModal('我的消息', '${contextPath}<ta:config key='html.isOpenNotice.infoListUrl' file='html'/>', {"scrollbar": true, "area": ["800px", "800px"]});
    }

    /*打开 修改密码 窗口  */
    function chgPwd() {
        console.log(${isAdOpen});
        <c:choose>
        <c:when test="${isAdOpen}">
        window.open('${modifyPassUrl}?username=${userSession.loginName}');
        </c:when>
        <c:otherwise>
        cumParentWinModal('<ta:local key="platform.common.label.update_pwd"/>', '${contextPath}/user/toUpdatePassword', {
            "scrollbar": true,
            "area": ["600px", "400px"]
        });
        </c:otherwise>
        </c:choose>
    };

    <%--function searchCustomer() {--%>
    <%--	$('#mainPiframe').attr('src', '${contextPath}/customer/index?queryLikes=' + $.trim($('#queryLikes').val()));--%>
    <%--	$('#t_tabBox a[href="#t_subpage"]').tab('show').text('信息量').parent().removeClass('hidden');--%>
    <%--};--%>

    $(function () {
        if ('${roleId}' == '') {
            $(".role").addClass("hidden");
        }
        $(document).on('click', '.cus-step-popover-box .popover-navigation', function (e) {
            return false;
        });
    });
</script>
</body>
</html>


<!-- Mainly scripts -->