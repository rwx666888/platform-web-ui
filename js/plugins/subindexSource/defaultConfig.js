/*
 * 通用配置信息
 * 需要依赖COM_TOOLS
 */
var COM_DEFAULT = {
    /* --功能配置start-- */
    /*是否开启调试模式*/
    "_debug": false,
    /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
    "_customMenus": 6,
    /*控制主页tab标签打开个数,必须为数字*/
    "_tabSingle": 3,
    /* contextPath webxml项目包名、路径 */
    "_contextPath": "",
    /* 系统默认标签主页地址 */
    "_tabHomePage": "index_default.html", //废弃 2018-8-15
    /* 系统默认404页面地址 */
    "_404Page": "404.html",
    /* 系统默认帮助页面地址 */
    "_helpPage": "help.html",
    /* 当前版本默认语言 */
    "_language": "zh-CN", //禁止修改，改了也不生效！！！ O(∩_∩)O ！！！
    /* 是否开启帮助信息 */
    "_isOpenHelpMsg": {
        "helpBtn": true, //帮助按钮
        "helpMsgTips": true, //提示信息tips
        "helpMsgDefVal": true //提示信息text-placeholder
    },
    /* 公告信息 */
    "_isOpenNotice": {
        "geturl": "", //获取数据接口地址
        "seturl": "", //发送数据接口地址
        "infoPageUrl": "help.html", //详情页地址
        "infoListUrl": "", //消息列表页地址
        "isDisplay": false, //控制是否显示公告
        "delayTime": 5, //控制弹出时长 单位:s
        "requestTime": 300, //控制每次请求的时长 单位:s; 不能小于10；
        "isNew": true //是否采用新版系统消息 【A: 3.9.3,兼容旧版本】
    },
    /* 自定义模块——国际化模块 */
    "_modelI18nOpt": {
        "geturl": "", //获取数据接口地址
        "seturl": "" //发送数据接口地址
    },
    /*是否启用开关控制tab导航条显隐*/
    "_isOpenSwitch": true,
    /* --功能配置end-- */
    /* --组件配置start（谨慎修改）-- */
    /* 数据表格默认配置 */
    "_dataTableOpt": {
        "scrollX": true, //可选是否显示水平滚动条；默认false;
        "paging": true, //是否显示分页组件
        "pageLength": 11, //每页显示条数；
        "lengthChange": false, //是否允许用户改变表格每页显示的记录数，显示条数组件
        "ordering": false, //是否启用排序组件，优先级高于columns中的排序控制；
        "searching": false, //是否启用自带搜索组件;
        "serverSide": true, //服务器模式，排序、搜索、分页均在服务器端实现
        "processing": true //显示加载中，serverSide=true时生效
    },
    /* 日历默认配置 */
    "_dateTimePickerOpt": {
        "minView": 2, //只能选择到天
        //"format": "yyyy-mm-dd", //默认
        "todayBtn": true, //显示今日按钮
        "autoclose": true,
        "pickerPosition": "bottom-left",
        "clearBtn": true,
        "forceParse": false //当选择器关闭的时候，是否强制解析输入框中的值
    },
    /* 日历默认配置 */
    "_dateRangePickerOpt": {
        opens: 'left',
        singleDatePicker: true, //仅显示一个日历，而不是并排的两个；
        showDropdowns: false, //显示年份和月份选择列表
        minYear: new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getFullYear(), //最小年份，对应showDropdowns
        maxYear: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).getFullYear(), //最大年份，对应showDropdowns
        timePicker: false, // 设为true, 启用时间视图,但自动填写将无效;
        timePickerIncrement: 5, //分钟选择列表的增量(0~30)
        timePicker24Hour: true, //使用24小时而不是12小时
        autoUpdateInput: false, //指示日期范围选择器是否应<input>在初始化时以及所选日期更改时自动更新其附加元素的值。
        linkedCalendars: true //是否开启双表联动,
    },
    /* 树型组件默认配置 */
    "_jsTreeOpt": {
        "root": "0" //树形组件根节点ID，谨慎修改；注意历史数据的影响；
    },
    /* 文件服务相关配置 */
    "_fileServeOpt": {
        "fileUploadUrl": "", //文件上传接口
        "defaultFileSize": 40 * 1024, // 一般文件允许上传的大小，单位：kb
        "imgFileSize": 10 * 1024, // 图片文件允许上传的大小，单位：kb
        "fileType": ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf", "jpg", "jpeg", "png", "gif", "rar", "zip"], // 文件类型
        "imgType": ["jpg", "jpeg", "png", "gif"] // 支持预览的文件类型
    },
    /* 通讯录组件 */
    "_orgTreeOpt": {
        "treeUrl": "", //组织树接口地址
        "searchUrl": "", //搜索接口地址
        "getDataUrl": "" //根据id与id类型获取资源信息
    },
    /* 强制退出系统配置 */
    "_forcedExit": {
        "time": "-1", // -1：无限制；按本次登录持续时长执行,范围[1-24]，数值型，前后包含；按指定时间执行,格式 (01:05),24小时制字符串，凌晨1点05分；
        "ajaxForm": false //是否全局监听ajax请求是否会话超时,并强制跳转到登录页面;
    }
    /* --组件配置end-- */
};
