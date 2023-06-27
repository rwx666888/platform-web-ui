<%@ page import="com.tarena.platform.common.properties.ConstancesMap" %>
<%@ page import="com.tarena.platform.basic.im.api.PlatformImProperties" %>
<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ta" uri="http://www.tedu.cn" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path;
    String baseLocal = (String) request.getSession().getAttribute("tedu.local.language");
    if (baseLocal == null || "".equals(baseLocal)) {
        baseLocal = "zh-CN";
    }
    String rongcloudFlag = PlatformImProperties.isRongCloud() ? "1" : "0";
    String platformStaticVersionFlag = ConstancesMap.getItemValue("version", "platform.static.version");
%>

<c:set var="basePath" value="<%=basePath %>"></c:set>
<c:set var="contextPath" value="<%=path %>"></c:set>
<c:set var="baseLocal" value="<%=baseLocal %>"></c:set>
<c:set var="platformStaticVersion" value="<%=platformStaticVersionFlag%>"/>
<c:set var="rongcloudFlag" value="<%=rongcloudFlag%>"/>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<script type="text/javascript">

    //系统配置
    var cus_default_ = {
        /* --功能配置start-- */
        /*是否开启调试模式*/
        "_debug": <ta:config key='html.debug' file='html'/>,
        /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
        "_customMenus": <ta:config key='html.customMenus' file='html'/>,
        /*控制主页tab标签打开个数,必须为数字*/
        "_tabSingle": <ta:config key='html.tabSingle' file='html'/>,
        /* contextPath webxml项目包名、路径 */
        "_contextPath": "<%=path %>",
        /* 系统默认404页面地址 */
        "_404Page": "${contextPath}<ta:config key='html.404Page' file='html'/>",
        /* 系统默认帮助页面地址 */
        "_helpPage": "<ta:config key='file.html.url' file='system'/><ta:config key='html.helpPage' file='html'/>",
        /* 是否开启帮助信息 */
        "_isOpenHelpMsg": {
            "helpBtn": <ta:config key='html.isOpenHelpMsg.helpBtn' file='html'/>, //帮助按钮
            "helpMsgTips": <ta:config key='html.isOpenHelpMsg.helpMsgTips' file='html'/>, //提示信息tips
            "helpMsgDefVal": <ta:config key='html.isOpenHelpMsg.helpMsgDefVal' file='html'/> //提示信息text-placeholder
        },
        /* 公告信息 */
        "_isOpenNotice": {
            "geturl": "${contextPath}<ta:config key='html.isOpenNotice.geturl' file='html'/>", //获取数据接口地址
            "getNewurl": '${contextPath}<ta:config key='html.isOpenNotice.geturl' file='html'/>',// 获取数据的新接口
            "seturl": "${contextPath}<ta:config key='html.isOpenNotice.seturl' file='html'/>", //发送数据接口地址
            "isDisplay": <ta:config key='html.isOpenNotice.isDisplay' file='html'/>, //控制是否显示公告
            "delayTime": <ta:config key='html.isOpenNotice.delayTime' file='html'/>, //控制弹出时长 单位:s
            "requestTime": <ta:config key='html.isOpenNotice.requestTime' file='html'/>, //控制每次请求的时长 单位:s; 不能小于10；
            "infoPageUrl": "${contextPath}<ta:config key='html.isOpenNotice.infoPageUrl' file='html'/>", //详情页地址
            "infoListUrl": "${contextPath}<ta:config key='html.isOpenNotice.infoListUrl' file='html'/>", //消息列表页地址
            "processListUrl": "${contextPath}<ta:config key='html.isOpenNotice.processListUrl' file='html'/>", //消息列表页地址
            "version": '1.0',
            "showMsg": "<ta:config key='html.isOpenNotice.showMsg' file='html'/>",//控制顶部消息轮播是否显示
            "showWait": "<ta:config key='html.isOpenNotice.showWait' file='html'/>",//控制顶部待办事项是否显示
            "showNotice": "<ta:config key='html.isOpenNotice.showNotice' file='html'/>",//控制系统通知是否显示,
            "showRbnotice": "<ta:config key='html.isOpenNotice.showRbnotice' file='html'/>",//控制右下角弹框是否启用
            "rongcoudflag": "${rongcloudFlag}",
            "appKey": "<ta:config key='platform.im.rongcloud.appkey' file='platform-im'/>",
            "isNew": true
        },
        /* 自定义模块——国际化模块 */
        "_modelI18nOpt": {
            "geturl": "${contextPath}<ta:config key='html.modelI18nOpt.geturl' file='html'/>", //获取数据接口地址
            "seturl": "${contextPath}<ta:config key='html.modelI18nOpt.seturl' file='html'/>" //发送数据接口地址
        },
        /*是否启用开关控制tab导航条显隐*/
        "_isOpenSwitch": <ta:config key='html.isOpenSwitch' file='html'/>,
        /* --功能配置end-- */
        /* --组件配置start（谨慎修改）-- */
        /* 数据表格默认配置 */
        "_dataTableOpt": {
            "scrollX": <ta:config key='html.dataTableOpt.scrollX' file='html'/>, //可选是否显示水平滚动条；默认false;
            "paging": <ta:config key='html.dataTableOpt.paging' file='html'/>, //是否显示分页组件
            "pageLength": <ta:config key='html.dataTableOpt.pageLength' file='html'/>, //每页显示条数；
            "lengthChange": <ta:config key='html.dataTableOpt.lengthChange' file='html'/>, //是否允许用户改变表格每页显示的记录数，显示条数组件
            "ordering": <ta:config key='html.dataTableOpt.ordering' file='html'/>, //是否启用排序组件，优先级高于columns中的排序控制；
            "searching": <ta:config key='html.dataTableOpt.searching' file='html'/>, //是否启用自带搜索组件;
            "serverSide": <ta:config key='html.dataTableOpt.serverSide' file='html'/>, //服务器模式，排序、搜索、分页均在服务器端实现
            "processing": <ta:config key='html.dataTableOpt.processing' file='html'/> //显示加载中，serverSide=true时生效
        },
        /* 日历默认配置 */
        "_dateTimePickerOpt": {
            "minView": <ta:config key='html.dateTimePickerOpt.minView' file='html'/>, //只能选择到天
            "todayBtn": <ta:config key='html.dateTimePickerOpt.todayBtn' file='html'/>, //显示今日按钮
            "autoclose": <ta:config key='html.dateTimePickerOpt.autoclose' file='html'/>,
            "pickerPosition": "<ta:config key='html.dateTimePickerOpt.pickerPosition' file='html'/>",
            "clearBtn": <ta:config key='html.dateTimePickerOpt.clearBtn' file='html'/>,
            "forceParse": <ta:config key='html.dateTimePickerOpt.forceParse' file='html'/> //当选择器关闭的时候，是否强制解析输入框中的值
        },
        /* 数型组件默认配置 */
        "_jsTreeOpt": {
            "root": "<ta:config key='html.jsTreeOpt.root' file='html'/>" //树形组件根节点ID，谨慎修改；
        },
        /* 文件服务相关配置 */
        "_fileServeOpt": {
            "fileUploadUrl": "${contextPath}<ta:config key='html.fileServeOpt.fileUploadUrl' file='html'/>", //文件上传接口
            "defaultFileSize": <ta:config key='html.fileServeOpt.defaultFileSize' file='html'/>, // 一般文件允许上传的大小，单位：kb
            "imgFileSize": <ta:config key='html.fileServeOpt.imgFileSize' file='html'/>, // 图片文件允许上传的大小，单位：kb
            "fileType": <ta:config key='html.fileServeOpt.fileType' file='html'/>, // 文件类型
            "imgType": <ta:config key='html.fileServeOpt.imgType' file='html'/> // 支持预览的文件类型
        },
        /* 通讯录组件 */
        "_orgTreeOpt": {
            "treeUrl": "${contextPath}/tmpOrg/getCommunicationBookInfo", //组织树接口地址
            "searchUrl": "${contextPath}/tmpOrg/searchCommunicationBook", //搜索接口地址
            "getDataUrl": "${contextPath}/tmpOrg/getOrgAndUserData" //根据id与id类型获取资源详情
        },
        /* 强制退出系统配置 */
        "_forcedExit": {
            "time": "<ta:config key='html.forcedExit.time' file='html'/>", //-1：无限制；按本次登录持续时长执行,范围[1-24]，数值型，前后包含；按指定时间执行,格式 (01:05),24小时制字符串，凌晨1点05分；
            "ajaxForm": <ta:config key='html.forcedExit.ajaxForm' file='html'/> //是否全局监听ajax请求是否会话超时,并强制跳转到登录页面;
        }
        /* --组件配置end-- */
    };
</script>
<!-- mainly css -->
<link href="${STATIC_PATH}/common/css/animate.min.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/css/bootstrap.min.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/css/iconfont.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/dataTables/datatables.min.css?v=${platformStaticVersion}"
      rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/datetimepicker/bootstrap-datetimepicker.min.css?v=${platformStaticVersion}"
      rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/daterangepicker/daterangepicker.min.css?v=${platformStaticVersion}"
      rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/iCheck/custom.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/treegrid/jquery.treegrid.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/select2/select2.min.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/font-awesome/css/font-awesome.css?v=${platformStaticVersion}" rel="stylesheet">
<link href="${STATIC_PATH}/common/css/plugins/jsTree/style.min.css?v=${platformStaticVersion}" rel="stylesheet">
<%@ include file="/private/common/jsp/header.jsp" %>
<link href="${STATIC_PATH}/common/css/style.css?v=${platformStaticVersion}" id="cus_app_link" rel="stylesheet">

