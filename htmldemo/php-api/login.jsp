<%@ page import="com.tarena.platform.common.properties.ConstancesMap" %>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.tedu.cn" prefix="ta" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<%
    String path = request.getContextPath();
    String baseLocal = (String) request.getSession().getAttribute("local.language");
    String sessionid = request.getSession().getId();
    String qrcode = ConstancesMap.getItemDefaultValue("html", "html.qrcode.login", "0");
    //	String qrcode = "0";
    String ldap = ConstancesMap.getItemDefaultValue("system", "ldap.status","0");
    boolean isAdOpen=Integer.parseInt(ldap)>0;
    String channel= ConstancesMap.getItemValue("app","tmp.channel");
    String resetPassUrl="https://tmp.tedu.cn/api/na/resetPass.html?channel="+channel;
%>
<c:set var="sessionid" value="<%=sessionid %>"/>
<c:set var="contextPath" value="<%=path %>"/>
<c:set var="baseLocal" value="<%=baseLocal %>"/>
<c:set var="qrflag" value="<%=qrcode %>"/>
<c:set var="isAdOpen" value="<%=isAdOpen %>"/>
<c:set var="resetPassUrl" value="<%=resetPassUrl %>"/>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="renderer" content="webkit">
    <link href="${STATIC_PATH}/common/css/iconfont.css" type="text/css" rel="stylesheet">
    <script src="${STATIC_PATH}/common/js/jquery-2.1.1.js"></script>

    <title><ta:local key="platform.common.project.name"/></title>
    <style>
        * {
            margin: 0;
            padding: 0;
            list-style: none;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            font-family: "微软雅黑";
        }

        html, body {
            height: 100%;
            width: 100%;
            background: url("${STATIC_PATH}/common/images/crm-login_bg.jpg") no-repeat center center;
            background-size: cover;
            min-width: 1300px;
            min-height: 560px;
            position: relative;
        }

        .bg-content {
            width: 1300px;
            height: 560px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -650px;
            margin-top: -280px;
        }

        @media only screen and (max-width: 1440px) {
            html, body {
                min-width: 1200px;
            }

            .bg-content {
                width: 1200px;
                margin-left: -600px;
            }
        }

        .bg-content .pic-left {
            width: 770px;
            height: 560px;
            position: absolute;
            left: 0;
            background: url("${STATIC_PATH}/common/images/crm-pic-left-bg.png") no-repeat left center;
        }

        .bg-content .login-con {
            width: 388px;
            min-height: 410px; /*高度还要再调整*/
            border: 1px solid #d0d4fb;
            position: absolute;
            right: 33px;
            top: 44px;
            background: url("${STATIC_PATH}/common/images/crm-form_bg.png") no-repeat center center;
            background-size: cover;
            padding: 33px 28px;
        }

        .bg-content .login-con .logo-tedu {
            text-align: center;
            height: 48px;
        }

        .bg-content .login-con .logo-word {
            text-align: center;
            color: #e1e9fa;
            font-size: 22px;
            margin-bottom: 33px;
        }

        .bg-content .login-con .user-login {
            position: relative;
        }

        .bg-content .login-con .user-login i {
            color: #999999;
            font-size: 16px;
            position: absolute;
            left: 10px;
            top: 11.5px;
        }

        .bg-content .login-con .user-login input {
            padding-left: 35px;
        }

        .bg-content .login-con .user-login input,
        .bg-content .login-con .user-sub button,
        .bg-content .login-con .user-login .yzm {
            width: 100%;
            height: 40px;
            font-family: "微软雅黑";
            border-radius: 4px;
            border: 0;
            outline: 0;
        }

        .bg-content .login-con .user-login .user-yzm {
            width: 217px;
        }

        .bg-content .login-con .user-login .yzm {
            display: inline-block;
            vertical-align: bottom;
            background: #fff;
            width: 100px;
            margin-left: 8px;
            text-align: center;
        }

        .bg-content .login-con .user-sub button {
            color: #fff;
            background: #1890ff;
            cursor: pointer;
            font-size: 16px;
            transition: background .2s ease;
            -moz-transition: background .2s ease; /* Firefox 4 */
            -webkit-transition: background .2s ease; /* Safari 和 Chrome */
            -o-transition: background .2s ease; /* Opera */
        }

        .bg-content .login-con .user-sub button:hover {
            background: #0f83ee;
        }

        .copy-right {
            color: #fff;
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
            font-size: 14px;
        }

        .bg-content .login-con .compatible-info {
            color: #1890ff;
            font-size: 12px;
            padding: 5px 0;
        }

        /*左侧效果*/
        .bg-content .pic-left .little-screen {
            width: 135px;
            height: 105px;
            background: url("${STATIC_PATH}/common/images/crm-little-screen.png") no-repeat center center;
            position: absolute;
            bottom: 145px;
            left: 205px;
            opacity: 0;
            animation: fadeInLeft 1s ease-in-out .3s;
            -webkit-animation: fadeInLeft 1s ease-in-out .3s;
            animation-fill-mode: forwards;
            -webkit-animation-fill-mode: forwards;
        }

        .bg-content .pic-left .plus-line {
            width: 418px;
            height: 289px;
            background: url("${STATIC_PATH}/common/images/crm-plus-line.png") no-repeat center center;
            position: absolute;
            top: 14px;
            right: 25px;
            opacity: 0;
            animation: fadeInRight 1s ease-in-out 0.3s;
            -webkit-animation: fadeInRight 1s ease-in-out 0.3s;
            animation-fill-mode: forwards;
            -webkit-animation-fill-mode: forwards;
        }

        .bg-content .pic-left .zan-phone {
            width: 72px;
            height: 250px;
            background: url("${STATIC_PATH}/common/images/crm-zan-phone.png") no-repeat center center;
            position: absolute;
            right: 79px;
            bottom: 130px;
            opacity: 0;
            animation: fadeInUp 1s ease-in-out 0s;
            -webkit-animation: fadeInUp 1s ease-in-out 0s;
            animation-fill-mode: forwards;
            -webkit-animation-fill-mode: forwards;
        }

        .bg-content .pic-left .star {
            width: 8px;
            height: 9px;
            background: url("${STATIC_PATH}/common/images/crm-star.png") no-repeat center center;
            position: absolute;
            bottom: 70px;
            left: 340px;
            opacity: 0;
            animation: fadeInOut 1s linear 0s infinite;
            -webkit-animation: fadeInOut 1s linear 0s infinite;
        }

        .bg-content .pic-left .star.star2 {
            bottom: 76px;
            left: 410px;
            animation: fadeInOut 1s linear .4s infinite;
            -webkit-animation: fadeInOut 1s linear .4s infinite;
        }

        .bg-content .pic-left .star.star3 {
            bottom: 83px;
            left: 466px;
            animation: fadeInOut 1s linear .2s infinite;
            -webkit-animation: fadeInOut 1s linear .2s infinite;
        }

        @keyframes fadeInOut {
            0% {
                opacity: 0;
                -webkit-transform: translateY(20px);
                -ms-transform: translateY(20px);
                transform: translateY(20px);
            }
            30% {
                opacity: 1;
                -webkit-transform: translateY(10px);
                -ms-transform: translateY(10px);
                transform: translateY(10px);
            }

            70% {
                opacity: 1;
                -webkit-transform: translateY(-10px);
                -ms-transform: translateY(-10px);
                transform: translateY(-10px);
            }
            100% {
                opacity: 0;
                -webkit-transform: translateY(-20px);
                -ms-transform: translateY(-20px);
                transform: translateY(-20px);
            }
        }

        @-webkit-keyframes fadeInOut {
            0% {
                opacity: 0;
                -webkit-transform: translateY(20px);
                -ms-transform: translateY(20px);
                transform: translateY(20px);
            }
            30% {
                opacity: 1;
                -webkit-transform: translateY(10px);
                -ms-transform: translateY(10px);
                transform: translateY(10px);
            }

            70% {
                opacity: 1;
                -webkit-transform: translateY(-10px);
                -ms-transform: translateY(-10px);
                transform: translateY(-10px);
            }
            100% {
                opacity: 0;
                -webkit-transform: translateY(-20px);
                -ms-transform: translateY(-20px);
                transform: translateY(-20px);
            }
        }

        @-moz-keyframes fadeInOut {
            0% {
                opacity: 0;
                -webkit-transform: translateY(20px);
                -ms-transform: translateY(20px);
                transform: translateY(20px);
            }
            30% {
                opacity: 1;
                -webkit-transform: translateY(10px);
                -ms-transform: translateY(10px);
                transform: translateY(10px);
            }

            70% {
                opacity: 1;
                -webkit-transform: translateY(-10px);
                -ms-transform: translateY(-10px);
                transform: translateY(-10px);
            }
            100% {
                opacity: 0;
                -webkit-transform: translateY(-20px);
                -ms-transform: translateY(-20px);
                transform: translateY(-20px);
            }
        }

        @-ms-keyframes fadeInOut {
            0% {
                opacity: 0;
                -webkit-transform: translateY(20px);
                -ms-transform: translateY(20px);
                transform: translateY(20px);
            }
            30% {
                opacity: 1;
                -webkit-transform: translateY(10px);
                -ms-transform: translateY(10px);
                transform: translateY(10px);
            }

            70% {
                opacity: 1;
                -webkit-transform: translateY(-10px);
                -ms-transform: translateY(-10px);
                transform: translateY(-10px);
            }
            100% {
                opacity: 0;
                -webkit-transform: translateY(-20px);
                -ms-transform: translateY(-20px);
                transform: translateY(-20px);
            }
        }

        @keyframes fadeInUp {
            0% {
                opacity: 0;
                -webkit-transform: translateY(40px);
                -ms-transform: translateY(40px);
                transform: translateY(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateY(0);
                -ms-transform: translateY(0);
                transform: translateY(0);
            }
        }

        @-webkit-keyframes fadeInUp {
            0% {
                opacity: 0;
                -webkit-transform: translateY(40px);
                -ms-transform: translateY(40px);
                transform: translateY(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateY(0);
                -ms-transform: translateY(0);
                transform: translateY(0);
            }
        }

        @-moz-keyframes fadeInUp {
            0% {
                opacity: 0;
                -webkit-transform: translateY(40px);
                -ms-transform: translateY(40px);
                transform: translateY(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateY(0);
                -ms-transform: translateY(0);
                transform: translateY(0);
            }
        }

        @-ms-keyframes fadeInUp {
            0% {
                opacity: 0;
                -webkit-transform: translateY(40px);
                -ms-transform: translateY(40px);
                transform: translateY(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateY(0);
                -ms-transform: translateY(0);
                transform: translateY(0);
            }
        }

        @keyframes fadeInLeft {
            0% {
                opacity: 0;
                -webkit-transform: translateX(-40px);
                -ms-transform: translateX(-40px);
                transform: translateX(-40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @-webkit-keyframes fadeInLeft {
            0% {
                opacity: 0;
                -webkit-transform: translateX(-40px);
                -ms-transform: translateX(-40px);
                transform: translateX(-40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @-moz-keyframes fadeInLeft {
            0% {
                opacity: 0;
                -webkit-transform: translateX(-40px);
                -ms-transform: translateX(-40px);
                transform: translateX(-40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @-ms-keyframes fadeInLeft {
            0% {
                opacity: 0;
                -webkit-transform: translateX(-40px);
                -ms-transform: translateX(-40px);
                transform: translateX(-40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @keyframes fadeInRight {
            0% {
                opacity: 0;
                -webkit-transform: translateX(40px);
                -ms-transform: translateX(40px);
                transform: translateX(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @-webkit-keyframes fadeInRight {
            0% {
                opacity: 0;
                -webkit-transform: translateX(40px);
                -ms-transform: translateX(40px);
                transform: translateX(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @-moz-keyframes fadeInRight {
            0% {
                opacity: 0;
                -webkit-transform: translateX(40px);
                -ms-transform: translateX(40px);
                transform: translateX(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        @-ms-keyframes fadeInRight {
            0% {
                opacity: 0;
                -webkit-transform: translateX(40px);
                -ms-transform: translateX(40px);
                transform: translateX(40px);
            }
            100% {
                opacity: 1;
                -webkit-transform: translateX(0);
                -ms-transform: translateX(0);
                transform: translateX(0);
            }
        }

        .m-b-20 {
            margin-bottom: 20px;
        }

        .m-b-40 {
            margin-bottom: 40px;
        }

        .hide-l {
            display: none;
        }

        .bg-content .login-con .error-l {
            min-height: 20px;
            line-height: 20px;
        }

        .bg-content .login-con .error-l .error-info {
            color: #f43531;
            font-size: 14px;
        }

        .bg-content .login-con .user-opear .user-check {
            display: inline-block;
            width: 70px;
            height: 15px;
            position: relative;
            cursor: pointer;
        }

        .bg-content .login-con .user-opear .user-check input {
            position: absolute;
            opacity: 0;
            width: 15px;
            height: 15px;
        }

        .bg-content .login-con .user-opear .user-check .check-bg {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 3px;
            background: #fff;
            border: 1px solid #ddd;
        }

        .bg-content .login-con .user-opear .user-check input[type="checkbox"]:checked + .check-bg {
            background: #1890ff;
            border-color: #1890ff;
        }

        .bg-content .login-con .user-opear .user-check input[type="checkbox"]:checked + .check-bg + .check-mark {
            display: block;
        }

        .bg-content .login-con .user-opear .user-check .check-mark {
            position: absolute;
            top: 1px;
            left: 5px;
            width: 6px;
            height: 10px;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            border: 2px solid #fff;
            border-top: 0;
            border-left: 0;
            display: none;
        }

        .bg-content .login-con .user-opear .user-check span {
            font-size: 12px;
            color: #1890ff;
            position: absolute;
            right: 0;
        }

        .bg-content .login-con .user-opear select {
            border: 1px solid #ddd;
            float: right;
        }

        .bg-content .login-con .rember-pwd {
            -webkit-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }

        .login-con .login-tab-codebox {
            text-align: center;
            display: none;
        }

        .login-con .login-tab-imginput {
            display: none;
        }

        .login-con.j-codebox {
            padding-bottom: 5px;
        }

        .login-con.j-codebox .logo-word {
            margin-bottom: 5px;
        }

        .login-tab-navbox {
            position: absolute;
            top: 10px;
            right: 10px;
            height: 40px;
            width: 40px;
            cursor: pointer;
            opacity: 0.8;
        }

        .login-tab-navbox:hover {
            opacity: 1;
        }

        .login-tab-navbox img {
            width: 100%;
            height: 100%;
        }

        .login-con.j-codebox .login-tab-codebox,
        .login-con.j-codebox .login-tab-imginput {
            display: block;
        }

        .login-con.j-codebox .login-tab-inputbox,
        .login-con.j-codebox .login-tab-imgcode {
            display: none;
        }

        .login-con .code-msg-box {
            padding-bottom: 5px;
            color: #c7254e;
            font-size: 12px;
            text-align: center;
        }

        #login_tab_codebox > iframe {
            height: 320px;
        }

        .cus-tooltip2 {
            position: absolute;
            z-index: 1070;
            display: block;
            font-size: 12px;
            font-style: normal;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: left;
            text-decoration: none;
            text-shadow: none;
            text-transform: none;
            letter-spacing: normal;
            word-break: normal;
            word-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            line-break: auto;
        }

        .cus-tooltip2.left {
            padding: 0 5px;
            margin-left: -3px;
            right: 41px;
            top: 0;
        }

        .cus-tooltip2-inner {
            max-width: 200px;
            padding: 3px 8px;
            color: #fff;
            text-align: center;
            background-color: #737ef4;
            border-radius: 4px;
        }

        .cus-tooltip2-arrow {
            position: absolute;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
        }

        .cus-tooltip2.left .cus-tooltip2-arrow {
            top: 50%;
            right: 0;
            margin-top: -5px;
            border-width: 5px 0 5px 5px;
            border-left-color: #737ef4;
        }
    </style>
</head>
<body>
<div class="bg-content">
    <div class="pic-left">
        <div class="little-screen"></div>
        <div class="plus-line"></div>
        <div class="zan-phone"></div>
        <i class="star star1"></i>
        <i class="star star2"></i>
        <i class="star star3"></i>
    </div>
    <div class="login-con <c:if test="${qrflag == 1}">j-codebox</c:if> " id="login_con"><!--error-info控制错误信息！！-->
        <div class="logo-tedu"><img src="${STATIC_PATH}/common/images/crm-tedu-logo.png" alt=""/></div>
        <p class="logo-word"><ta:local key="platform.common.project.name"/></p>
        <!-- 下面是二维码的容器 -->
        <div class="login-tab-codebox">
            <div id="login_tab_codebox"></div>
            <div class="code-msg-box" style="display: none" id="code_msg_box"></div>
            <p class="compatible-info" style="padding-bottom: 10px;"><ta:local key="platform.common.msg.brower_alert"/></p>
        </div>
        <div class="login-tab-inputbox">
            <form id="form" action="${contextPath}/logon" method="post" onsubmit="return ajaxCheck();">
                <div class="user-login m-b-20">
                    <input class="user-num" id="loginName" name="loginName" type="text" placeholder="<ta:local key="platform.common.label.input_username"/>"/>
                    <i class="tedufont tedu-icon50"></i>
                </div>
                <div class="user-login m-b-20">
                    <input class="user-pwd" type="password" id="password" name="password" placeholder="<ta:local key="platform.common.label.input_pwd"/>"/>
                    <i class="tedufont tedu-icon49"></i>
                </div>
                <div class="user-login m-b-20 hide-l" id="yzmdiv">
                    <input class="user-yzm" type="text" maxlength="6" id="validateCode" name="validateCode" placeholder="<ta:local key="platform.common.label.input_validate"/>"/><i class="tedufont tedu-icon132"></i><i class="error-icon hide-l tedufont tedu-icon66"></i>
                    <span class="yzm"><img src="" id="validate" style="cursor: pointer;" onclick="refreshMe(this);" width="95" height="40"/></span>
                </div>
                <div class="error-l">
                    <div class="error-info hide-l"><i class="tedufont tedu-icon66"></i><span></span></div>
                </div>
                <!--错误提示-->
                <p class="user-sub">
                    <button type="button" id="login_btn" onclick="logon()"><ta:local key="platform.common.label.login"/></button>
                </p>
                <p class="compatible-info"><ta:local key="platform.common.msg.brower_alert"/></p>
                <div class="user-opear">
                    <select class="sel-lang pull-right" name="local" id="local" onChange="changeLocal()">
                        <c:forEach var="item" items="${localList}">
                            <option value="${item.code}" <c:if test="${item.code==local}">selected</c:if>>${item.name}</option>
                        </c:forEach>
                    </select>
                    <label for="checkbox1" class="user-check" style="vertical-align: middle;">
                        <input type="checkbox" id="checkbox1" name="rememberMe" value="1"/>
                        <i class="check-bg"></i>
                        <i class="check-mark"></i>
                        <span class="rember-pwd"><ta:local key="platform.common.label.remember_pwd"/></span>
                    </label>
                    <c:if test="${isAdOpen}">
                        <a href="${resetPassUrl}" style="margin-left: 15px; color: #1890ff; font-size: 12px; text-decoration: underline; vertical-align: middle;" target="_blank"><ta:local key="platform.common.label.foget_pwd"/>？</a>
                    </c:if>
                </div>
            </form>
        </div>
        <c:if test="${qrflag == 1}">
            <div class="login-tab-navbox" id="login_tab_navbox">
                <div class="login-tab-imginput">
                    <img class="" src="${STATIC_PATH}/common/images/crm-login-ticon01.png" data-type="input" title="账号、密码登录"/>
                    <div class="cus-tooltip2 left">
                        <div class="cus-tooltip2-arrow"></div>
                        <div class="cus-tooltip2-inner">账号、密码登录</div>
                    </div>
                </div>
                <div class="login-tab-imgcode">
                    <img src="${STATIC_PATH}/common/images/crm-login-ticon02.png" data-type="code" title="扫码登录更安全"/>
                    <div class="cus-tooltip2 left">
                        <div class="cus-tooltip2-arrow"></div>
                        <div class="cus-tooltip2-inner">扫码登录更安全</div>
                    </div>
                </div>

            </div>
        </c:if>
    </div>
</div>
<p class="copy-right">Copyright © 2017 Tedu.cn All Rights Reserved 京ICP备08000853号-56</p>
<script type="text/javascript">
    function requestParam_(strName) {
        var strHref = location.search;
        var intPos = strHref.indexOf('?');
        if (intPos === -1) {
            return '';
        }
        var strRight = strHref.substr(intPos + 1);
        var arrTmp = strRight.split('&');
        for (var i = 0; i < arrTmp.length; i++) {
            var arrTemp = arrTmp[i].split('=');
            if (arrTemp[0].toUpperCase() == strName.toUpperCase()) {
                if (i === arrTmp.length - 1) {
                    var sIndex = arrTemp[1].indexOf('#');
                    if (sIndex !== -1) {
                        arrTemp[1] = arrTemp[1].substring(0, sIndex);
                    }
                }
                return arrTemp[1];
            }
        }
        return '';
    }

    if (top != self && requestParam_('isiframe') != 'yes') {
        try {
            top.window.beforeunload_flag = false;
            top.location = self.location;
        } catch (e) {
        }
    }

    $(document).ready(function () {
        var retryCount = '${retryCount}';
        var code = '${code}';
        if (retryCount >= 2) {
            $("#yzmdiv").show();
            refreshMe($("#validate")[0]);
        }

        var errorMsg = '${errorMsg}';
        if (null != errorMsg && '' != errorMsg && null!=code && ''!=code) {
            if (code == -1009) {
                $(".error-info").show().children("span").text("<ta:local key='platform.common.msg.${code}' value='${retryCount}, 5'/>");
            } else if (code == -1007) {
                $(".error-info").show().children("span").text("<ta:local key='platform.common.msg.${code}' value='${retryTime}'/>");
            }else {
                $(".error-info").show().children("span").text("<ta:local key='platform.common.msg.${code}'/>");

            }

        }
        $('#form input').keypress(function (e) {
            if (e.keyCode === 13) {
                $('#form').submit();
            }
        });

    });

    function changeLocal() {
        var local = $("#local").val();
        window.location.href = "${contextPath}/login?local=" + local;
    }

    function logon() {
        $('#form').submit();
    }

    var xWithScroll = 0;
    var yWithScroll = 0;

    function encryptionPassword(tpwd) {
        var uPwd = $("#password");
        uPwd.val(tpwd);
    }

    function login_show_bg() {
        var login_bg = document.getElementById("crm_login_bg");
        if (login_bg) {
            login_bg.style.display = "block";
        }
    }

    function login_hide_bg() {
        login_bg.style.display = "none";
    }

    function refreshMe(obj) {
        obj.src = "${contextPath}/common/validateCode?t=" + Math.random();
    }

    function ajaxCheck() {
        var loginName = $("#loginName");
        var uPwd = $("#password");
        var validateCode = $("#validateCode");

        //初步页面校验
        if (loginName.val().trim() == '') {
            $(".error-info").show().children("span").text('<ta:local key="platform.common.msg.username_alert"/>');
            return false;
        }
        if (uPwd.val().trim() == '') {
            $(".error-info").show().children("span").text('<ta:local key="platform.common.msg.pwd_alert"/>');
            return false;
        }
        var retryCount = '${retryCount}';
        if (retryCount >= 3) {
            if (validateCode.val().trim() == '') {
                $(".error-info").show().children("span").text('<ta:local key="platform.common.msg.validate_alert"/>');
                return false;
            }
        }
        encryptionPassword(uPwd.val());
        login_show_bg();
        return true;
    }

    <c:if test="${qrflag == 1}">
    $(function () {
        $('#login_tab_navbox').on('click', function (e) {
            var $e = $(e.target);
            if ($e.data('type') == 'code') {
                $('#login_con').addClass('j-codebox');
                if (('localStorage' in window) && window['localStorage'] !== null) {
                    localStorage.setItem('c_login_tag_w', 'code');
                }
            } else {
                $('#login_con').removeClass('j-codebox');
                if (('localStorage' in window) && window['localStorage'] !== null) {
                    localStorage.setItem('c_login_tag_w', 'input');
                }
            }
        });
        if (('localStorage' in window) && window['localStorage'] !== null) {
            var type_t = localStorage.getItem('c_login_tag_w') || '';
            if (!type_t) {
                localStorage.setItem('c_login_tag_w', $('#login_con').hasClass('j-codebox') ? 'code' : 'input');
            }
            if ($('#login_con').hasClass('j-codebox') && type_t == 'input') {
                $('#login_tab_navbox [data-type="input"]').trigger('click');
            } else if (!$('#login_con').hasClass('j-codebox') && type_t == 'code') {
                $('#login_tab_navbox [data-type="code"]').trigger('click');
            }
            var errorMsg2 = '${errorMsg}';
            if (errorMsg2 && $('#login_con').hasClass('j-codebox')) {
                $('#code_msg_box').show().text(errorMsg2);
            }
        }
    });
    </c:if>
</script>
<!--[if lt IE 10]>
<div style="background: #faad14; position: fixed; left: 0; top: 0; right: 0;">
    <div style="padding: 12px; font-size: 14px; color: #fff; text-align: left; width: 1200px; margin: 0 auto; line-height: 1.3;">
        <span>您的浏览器（IE内核）版本过低，请使用IE10+、Chrome、Safari、Firefox浏览器，如使用的是360、QQ、搜狗浏览器，请切换为极速模式；</span>
        <a href="https://www.google.cn/chrome/thank-you.html">Chrome下载</a> &nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://stubdownloader.cdn.mozilla.net/builds/firefox-stub/zh-CN/win/a0835331c6d66133eda04b6135b562b4ae6b8dad90f1e80cd07016b47383288d/Firefox%20Installer.exe">Firefox下载</a>
    </div>
</div>

<script>

    document.getElementById("login_btn").setAttribute('disabled', 'disabled');
    document.getElementById("login_btn").innerHTML = '浏览器（IE内核）版本过低,禁止使用';
</script>
<![endif]-->

<!-- 加载微信start 因部分中心不能访问微信，因此延时加载，防止阻塞 -->
<c:if test="${qrflag == 1}">
    <script>
        $(function () {
            $.getScript('https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js', function () {
                window.WwLogin({
                    "id": "login_tab_codebox",
                    "appid": "wwe30b71d9e15ec010",
                    "agentid": "1000026",
                    "redirect_uri": "<ta:config key='tmp.host' file='app'/>/rest/wxauth/auth/login/<ta:config key='tmp.appCode' file='app'/>",
                    "state": "<ta:config key='tmp.channel' file='app'/>",
                    "href": "https://wecdn.tmooc.cn/test/welogincode.css"
                });
            });
        });
    </script>
</c:if>
<!-- 加载微信end -->
</body>
</html>
