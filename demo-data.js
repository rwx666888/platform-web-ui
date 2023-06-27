//系统配置 演示demo 使用，应与index.html中配置信息同步；
var cus_default_ = {
    /*自定义菜单开关级打开个数，_customMenu>0为开起菜单及设置个数，0为关闭自定义菜单功能*/
    "_customMenus": 6,
    /*控制主页tab标签打开个数,必须为数字*/
    "_tabSingle": 5,
    /*是否启用开关控制tab导航条显隐*/
    "_isOpenSwitch": true,
    "_isOpenNotice": {
        "geturl": "/message/showMessage", //获取数据接口地址
        "seturl": "/message/messageBack", //发送数据接口地址
        "infoPageUrl": "help.html", //详情页地址
        "infoListUrl": "", //消息列表页地址
        "isDisplay": false, //控制是否显示公告
        "delayTime": 5, //控制弹出时长 单位:s
        "requestTime": 300, //控制每次请求的时长 单位:s; 不能小于10；
        "isNew": true //是否采用新版系统消息 【A: 3.9.3,兼容旧版本】
    },
    "_dataTableOpt": {
        "pageLength": 7, //每页显示条数；
    },
    /* 文件服务相关配置 */
    "_fileServeOpt": {
        "fileUploadUrl": "http://lianglei.net.cn/demo-ui/platform-help/htmldemo/php-api/file-upload-api.php", //文件上传接口
        "defaultFileSize": 40 * 1024, // 一般文件允许上传的大小，单位：kb
        "imgFileSize": 10 * 1024, // 图片文件允许上传的大小，单位：kb
        "fileType": ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf", "jpg", "jpeg", "png", "gif", "rar", "zip"], // 文件类型
        "imgType": ["jpg", "jpeg", "png", "gif"] // 支持预览的文件类型
    },
    /* 通讯录组件 */
    "_orgTreeOpt": {
        "treeUrl": "/jstree6/api", //组织树接口地址
        "searchUrl": "/jstree6/searchapi1127", //搜索接口地址
        "getDataUrl": "/jstree6/org_getinfo" //根据id与id类型获取资源信息
    },
    /* 强制退出系统配置 */
    "_forcedExit": {
        "time": "-1", // -1：无限制；按本次登录持续时长执行,范围[1-24]，数值型，前后包含；按指定时间执行,格式 (01:05),24小时制字符串，凌晨1点05分；
        "ajaxForm": false //是否全局监听ajax请求是否会话超时,并强制跳转到登录页面;
    }
};

/* 美化插件配置项 */
var _BEAUFLY_OPTION_ = {
    "indent_size": "2",
    "indent_char": " ",
    "max_preserve_newlines": "1",
    "preserve_newlines": true,
    "keep_array_indentation": false,
    "break_chained_methods": false,
    "indent_scripts": "normal",
    "brace_style": "collapse",
    "space_before_conditional": true,
    "unescape_strings": false,
    "jslint_happy": false,
    "end_with_newline": true,
    "wrap_line_length": "0",
    "indent_inner_html": false,
    "comma_first": false,
    "e4x": false,
    "indent_empty_lines": true
};

//模拟交互数据
var demo_dt_data_ = {
    "draw": 1,
    "recordsTotal": 157,
    "recordsFiltered": 157,
    "data": [{
            "DT_RowId": "row_3",
            "DT_RowData": {
                "pkey": 3
            },
            "first_name": "1",
            "last_name": "Ramos",
            "position": "System Architect 111",
            "office": "London",
            "start_date": "9th Oct 09",
            "salary": 28875.11,
            "node1": "11",
            "node2": "22",
            "node3": "33",
            "node4": "44",
        "id":7789
        },
        {
            "DT_RowId": "row_17",
            "DT_RowData": {
                "pkey": 17
            },
            "first_name": "2",
            "last_name": "Cox",
            "position": "Technical Author 211",
            "office": "San Francisco",
            "start_date": "12th Jan 09",
            "salary": 4800.002,
            "node1": "11",
            "node2": "22",
            "node3": "33",
            "node4": "44",
            "id":7555
        },
        {
            "DT_RowId": "row_18",
            "DT_RowData": {
                "pkey": 17
            },
            "first_name": "2",
            "last_name": "Cox",
            "position": "Technical Author333",
            "office": "San Francisco",
            "start_date": "12th Jan 09",
            "salary": 150083003.014,
            "node1": "11",
            "node2": "22",
            "node3": "33",
            "node4": "44",
            "id":6454
        },
        {
            "DT_RowId": "row_185",
            "DT_RowData": {
                "pkey": 172
            },
            "first_name": "2t",
            "last_name": "Cosfgx",
            "position": "Technical Ausdfgthor333",
            "office": "San Fsdfgrancisco",
            "start_date": "12tsdfgh Jan 09",
            "salary": 150083003.014,
            "node1": "11sdfg",
            "node2": "dg22",
            "node3": "33",
            "node4": "44",
            "id":6987
        },
        {
            "DT_RowId": "row_1845",
            "DT_RowData": {
                "pkey": 1722
            },
            "first_name": "2t",
            "last_name": "Cosfweewgx",
            "position": "Techniwwwcal Ausdfgthor333",
            "office": "San Fsdfgreeeancisco",
            "start_date": "12tsdfgh Jan 09",
            "salary": 150083003.014,
            "node1": "11sdfg",
            "node2": "dge22",
            "node3": "3e3",
            "node4": "4e4",
            "id":5587
        }
    ]
};

var demo_dt_data_2 = {
    "draw": 1,
    "recordsTotal": 6,
    "recordsFiltered": 6,
    "data": [{
            "DT_RowId": "row_1",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "顾问A",
            "name2": "咨询顾问",
            "name3": "bjzgc101",
            "name4": "达内北京中关村中心",
            "orderNumber": "1",
            "id":77
        },
        {
            "DT_RowId": "row_2",
            "DT_RowData": {
                "pkey": 343
            },
            "name1": "主管A",
            "name2": "咨询主管",
            "name3": "bjzgc103",
            "name4": "达内北京中关村中心",
            "orderNumber": "2",
            "id":88
        },
        {
            "DT_RowId": "row_3",
            "DT_RowData": {
                "pkey": 3678
            },
            "name1": "顾问B",
            "name2": "咨询顾问",
            "name3": "bjzgc104",
            "name4": "达内北京中关村中心",
            "orderNumber": "3",
            "id":99
        },
        {
            "DT_RowId": "row_4",
            "DT_RowData": {
                "pkey": 312
            },
            "name1": "主管B",
            "name2": "咨询主管",
            "name3": "bjzgc105",
            "name4": "达内北京中关村中心",
            "orderNumber": "4",
            "id":7789
        },
        {
            "DT_RowId": "row_5",
            "DT_RowData": {
                "pkey": 3421
            },
            "name1": "主管c",
            "name2": "咨询主管",
            "name3": "bjzgc106",
            "name4": "达内北京中关村中心",
            "orderNumber": "5",
            "id":77654
        },
        {
            "DT_RowId": "row_6",
            "DT_RowData": {
                "pkey": 3444
            },
            "name1": "主管d",
            "name2": "咨询主管",
            "name3": "bjzgc107",
            "name4": "达内北京中关村中心",
            "orderNumber": "6",
            "id":7768244
        }
    ]
};
var demo_dt_data_3 = {
    "draw": 1,
    "recordsTotal": 6,
    "recordsFiltered": 6,
    "data": [{
            "DT_RowId": "row_6",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "顾问A",
            "name2": "咨询顾问",
            "name3": "bjzgc101",
            "name4": "达内北京中关村中心"
        },
        {
            "DT_RowId": "row_7",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "主管A-lty",
            "name2": "咨询主管",
            "name3": "bjzgc103",
            "name4": "达内北京中关村中心"
        },
        {
            "DT_RowId": "row_8",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "顾问B-lty",
            "name2": "咨询顾问",
            "name3": "bjzgc104",
            "name4": "达内北京中关村中心"
        },
        {
            "DT_RowId": "row_9",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "主管B-lty",
            "name2": "咨询主管",
            "name3": "bjzgc105",
            "name4": "达内北京中关村中心"
        },
        {
            "DT_RowId": "row_10",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "主管c-lty",
            "name2": "咨询主管",
            "name3": "bjzgc106",
            "name4": "达内北京中关村中心"
        },
        {
            "DT_RowId": "row_11",
            "DT_RowData": {
                "pkey": 3
            },
            "name1": "主管d-lty",
            "name2": "咨询主管",
            "name3": "bjzgc107",
            "name4": "达内北京中关村中心"
        }
    ]
};
var demo_select2_data = {
    "results": [{
            "id": "0",
            "text": "qq0000",
            "name": "who00"
        },
        {
            "id": "1",
            "text": "qq1111",
            "name": "whos11"
        },
        {
            "id": "2",
            "text": "qq2222",
            "name": "whos22"
        },
        {
            "id": "3",
            "text": "qq3333",
            "name": "whos33"
        },
        {
            "id": "4",
            "text": "qq4444",
            "name": "whos44"
        }
    ]
};
var demo_select3_data = {
    "results": [{
        "code": "1",
        "city": "北京",
        "area": ["海淀区", "朝阳区", "大兴区"]
    }, {
        "code": "2",
        "city": "上海",
        "area": ["浦东", "静安区", "宝山区"]
    }, {
        "code": "3",
        "city": "深圳",
        "area": ["福田区", "南山区", "光明新区"]
    }, {
        "code": "4",
        "city": "江苏",
        "area": []
    }]
}
$(function () {
    /*
     *  $.mockjax 此方法仅限于demo演示模拟数据使用
     */
    $.mockjax({
        url: "/dt/api",
        dataType: "json",
        response: function (settings) {
            var d_ = {
                "draw": parseInt(settings.data['draw']) || 1,
                "recordsTotal": 157,
                "recordsFiltered": 157,
                "data": []
            };
            for (var i = 0, len_ = Math.min((parseInt(settings.data['pageSize']) || 11), d_.recordsFiltered - settings.data['start']); i < len_; i++) {
                d_.data.push({
                    "DT_RowId": 'row_' + COM_TOOLS.get_random_fun(3),
                    "first_name": 'name' + COM_TOOLS.get_random_fun(3),
                    "last_name": "Cox" + COM_TOOLS.get_random_fun(2),
                    "position": "Technical Author333",
                    "office": "San Francisco",
                    "start_date": "12th Jan 09",
                    "salary": Number(COM_TOOLS.get_random_fun(5) + '.' + COM_TOOLS.get_random_fun(3)),
                    "node1": "11",
                    "node2": "22",
                    "node3": "33",
                    "node4": "44"
                });
            }
            this.responseText = d_;
        }
    });

    $.mockjax({ //测试专用
        url: "/dt/api/test",
        dataType: "json",
        response: function (settings) {
            var d_ = {
                "draw": parseInt(settings.data['draw']) || 1,
                "recordsTotal": settings.data['num'] || 500,
                "recordsFiltered": settings.data['num'] || 500,
                "data": []
            };
            for (var i = 0, len_ = settings.data['num'] || 500; i < len_; i++) {
                var oo = {};
                for (var j = 0; j < 162; j++) {
                    oo['node' + j] = j == 0 ? i + 1 : (j == 1 ? "区域" : (j == 2 ? '城市' : (j == 3 ? '中心d' : j)) + "_" + i);
                }
                d_.data.push(oo);
            }
            this.responseText = d_;
        }
    });
    $.mockjax({ //测试专用
        url: "/dt/api/test2",
        dataType: "json",
        response: function (settings) {
            var d_ = {
                data: []
            };
            for (var i = 0, len_ = settings.data['num'] || 500; i < len_; i++) {
                var oo = [];
                for (var j = 0; j < 162; j++) {
                    oo.push(j == 0 ? i + 1 : (j == 1 ? "区域" : (j == 2 ? '城市' : (j == 3 ? '中心' : j)) + "_" + i));
                }
                d_.data.push(oo);
            }
            console.log(d_, 'num', settings.data['num'])
            this.responseText = d_;
        }
    });

    $.mockjax({
        url: "/dt/api2",
        dataType: "json",
        response: function (settings) {
            demo_dt_data_2['draw'] = settings.data['draw'];
            this.responseText = demo_dt_data_2;
        }
    });
    $.mockjax({
        url: "/dt/api3",
        dataType: "json",
        response: function (settings) {
            demo_dt_data_2['draw'] = settings.data['draw'];
            this.responseText = demo_dt_data_3;
        }
    });

    $.mockjax({
        url: "/select2/api",
        dataType: "json",
        responseTime: 200,
        response: function (settings) {
            this.responseText = demo_select2_data;
        }
    });

    $.mockjax({
        url: "/select2/search/api",
        dataType: "json",
        responseTime: 200,
        response: function (settings) {
            if (!settings.data || !$.trim(settings.data.q)) {
                this.responseText = demo_select2_data;
            } else {
                var d_ = demo_select2_data.results;
                var re_ = $.map(d_, function (n) {
                    return n.text.indexOf($.trim(settings.data.q)) !== -1 ? n : null;
                });
                this.responseText = {
                    results: re_
                };
            }
        }
    });

    $.mockjax({
        url: "/select3/api/*",
        dataType: "json",
        responseTime: 200,
        response: function (settings) {
            var citys = [];
            $.each(demo_select3_data["results"], function (i, n) {
                citys.push({
                    "code": n["code"],
                    "city": n["city"]
                });
            })
            this.responseText = citys;
        }
    });

    $.mockjax({
        url: "/cusupload/api",
        dataType: "json",
        response: function (settings) {
            this.responseText = {
                "fileName": "test_01.jpg",
                "uploaded": 1,
                "url": "https://www.baidu.com/img/bd_logo1.png"
            };
        }
    });
    $.mockjax({
        url: "/file/upload/api",
        dataType: "json",
        response: function (settings) {
            this.responseText = {
                state: 1,
                path: 'https://www.baidu.com/img/bd_logo1.png',
                fileName: 'bd_logo1.png',
                uploaded: 1,
                url: 'https://www.baidu.com/img/bd_logo1.png'
            };
        }
    });

    $.mockjax({
        url: "/cusmenu/api",
        dataType: "json",
        response: function (settings) {
            this.responseText = settings.data;
        }
    });

    $.mockjax({
        url: "/i18n/api-get",
        responseTime: 2300,
        dataType: "json",
        response: function (settings) {
            this.responseText = [{
                    pid: 'plat.label.01',
                    name: '标签1',
                    child: [{
                            name: '中文',
                            value: '中文中文',
                            code: 'zh-cn',
                            required: "1"
                        },
                        {
                            name: 'English',
                            value: 'EnglishEnglish',
                            code: 'en-us',
                            required: "0"
                        }
                    ]
                },
                {
                    pid: 'plat.label.02',
                    name: '标签2',
                    child: [{
                            name: '中文',
                            value: '中文中文2',
                            code: 'zh-cn',
                            required: "1"
                        },
                        {
                            name: 'English',
                            value: 'EnglishEnglish2',
                            code: 'en-us',
                            required: "0"
                        }
                    ]
                }
            ];
        }
    });
    $.mockjax({
        url: "/i18n/api-set",
        dataType: "json",
        responseTime: 2300,
        response: function (settings) {
            this.responseText = {
                code: 1
            }
        }
    });
    $.mockjax({
        url: "/i18n/api-get2",
        responseTime: 2300,
        dataType: "json",
        response: function (settings) {
            var d = [];
            $.each($.parseJSON(settings.data['data']), function (i, n) {
                d.push({
                    pid: String(n.code.replace(new RegExp("{[\\w-.]+}"), Math.round(Math.random() * 100))),
                    oldpid: n.oldcode,
                    name: n.label,
                    child: [{
                            name: '中文',
                            value: '',
                            code: 'zh-CN',
                            required: "1"
                        },
                        {
                            name: 'English',
                            value: 'English' + n.label,
                            code: 'en-US',
                            required: "0"
                        }
                    ]
                });
            });
            console.log('$$', d)
            this.responseText = d;
        }
    });
    $.mockjax({
        url: "/datatable/lty",
        dataType: "json",
        responseTime: 300,
        response: function (settings) {
            this.responseText = {
                code: 1
            }
        }
    });

    $.mockjax({
        url: "/echarts/api",
        dataType: "json",
        response: function (settings) {
            this.responseText = [{
                "cname": "p1",
                "data": [{
                        "name": "name1",
                        "value": settings.data && settings.data.random ? Math.random()*100 : 111
                    },
                    {
                        "name": "name2",
                        "value": settings.data && settings.data.random ? Math.random()*100 : 222
                    },
                    {
                        "name": "name3",
                        "value": settings.data && settings.data.random ? Math.random()*100 : 333
                    },
                    {
                        "name": "name4",
                        "value": settings.data && settings.data.random ? Math.random()*100 : 444
                    }
                ]
            }];
        }
    });
    $.mockjax({
        url: "/getusermsg/api",
        dataType: "json",
        responseTime: 300,
        response: function (settings) {
            this.responseText = {
                code: 1,
                boList: [{
                    type: '',
                    id: '#' + Math.floor(Math.random() * 100),
                    title: '消息测试标题',
                    msg: '<p>段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1</p><p>段落2段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1</p>' +
                        '<p>段落1段落1段落1段落1段落<br>1段落1段落1段落1<br>段落1段落1段落1</p><p>段落2段落1<br>段落1段落1段落1段落1段<br>落1段落1段落1<br>段落1段落1</p>' +
                        '<p>段落1段落1段落1段落1<br>段落1段落1段落1<br>段落1段落1段落1段落1</p><p>段落2段落1段落1段<br>落1段落1段落1段落1段落1<br>段落1段落1段落1</p>' +
                        '<p>段落1段落1段落1段落1<br>段落1段落1段落1<br>段落1段落1段落1段落1</p><p>段落2段落1段落1段<br>落1段落1段落1段落1段落1<br>段落1段落1段落1</p>' +
                        '<p>段落1段落1段落1段落1<br>段落1段落1段落1<br>段落1段落1段落1段落1</p><p>段落2段落1段落1段<br>落1段落1段落1段落1段落1<br>段落1段落1段落1</p>'
                }]
            }
        }
    });
    $.mockjax({
        url: "/setusermsg/api",
        dataType: "json",
        responseTime: 300,
        response: function (settings) {
            this.responseText = {
                code: 1
            }
        }
    });
    $.mockjax({
        url: "/validate/api",
        responseTime: 800,
        response: function (settings) {
            this.responseText = (settings.data.pwd() == '123456').toString();
            console.log('ajax-response', this.responseText)
        }
    });
    $.mockjax({
        url: "/validate/api2",
        responseTime: 300,
        response: function (settings) {
            this.responseText = 'true';
        }
    });
    $.mockjax({
        url: "/dt/role/api",
        responseTime: 300,
        response: function (settings) {
            this.responseText = {
                "draw": 0,
                "recordsTotal": 2,
                "recordsFiltered": 2,
                "data": [{
                    "id": 2779,
                    "userId": 1069,
                    "name": null,
                    "roleId": 17,
                    "organizationId": "171",
                    "state": 0,
                    "isCharge": 0,
                    "userName": "王阳明",
                    "roleName": "zpq",
                    "roleCode": "zpq",
                    "organizationName": "达内杭州童程童美西湖中心"
                }, {
                    "id": 2778,
                    "userId": 1069,
                    "name": null,
                    "roleId": 46,
                    "organizationId": "171",
                    "state": 0,
                    "isCharge": 0,
                    "userName": "王阳明",
                    "roleName": "教学经理",
                    "roleCode": "0012",
                    "organizationName": "达内杭州童程童美西湖中心"
                }]
            };

        }
    });
    $.mockjax({
        url: "/jstree6/api",
        dataType: "json",
        responseTime: 200,
        response: function (settings) {
            var id_ = settings.data['id'] || settings.data['parentId'];
            this.responseText = [{
                    "text": "text" + id_ + '_' + 1,
                    "children": true,
                    "id": id_ + '_' + 1,
                    "type": '1',
                    "code": 'code_' + id_ + '_' + 1,
                    "hasauth": 1,
                    "path": '部门A/部门A01',
                    "isexternal": 1 //是否外部组织， 1是内部；2是外部；
                },
                {
                    "text": "text" + id_ + '_' + 2,
                    "children": true,
                    "id": id_ + '_' + 2,
                    "type": '0',
                    "code": 'code_' + id_ + '_' + 2,
                    "hasauth": 0,
                    "path": '部门A/部门（无权限）A02',
                    "isexternal": 2
                },
                {
                    "text": "text" + id_ + '_' + 3,
                    "children": true,
                    "id": id_ + '_' + 3,
                    "type": '0',
                    "code": 'code_' + id_ + '_' + 3,
                    "hasauth": 1,
                    "path": '部门A/外部门A03',
                    "isexternal": 2
                },
                {
                    "text": "text" + id_ + '_' + 4,
                    "children": true,
                    "id": id_ + '_' + 4,
                    "type": '0',
                    "code": 'code_' + id_ + '_' + 4,
                    "hasauth": 1,
                    "path": '部门A/部门A03',
                    "isexternal": 1
                },
                {
                    "text": "text" + id_ + '_' + 5,
                    "children": true,
                    "id": id_ + '_' + 5,
                    "type": '0',
                    "code": 'code_' + id_ + '_' + 5,
                    "hasauth": 0,
                    "path": '部门A/外部门（无权限）A03',
                    "isexternal": 2
                }
            ];
        }
    });
    $.mockjax({
        url: "/jstree6/org_getinfo",
        dataType: "json",
        responseTime: 200,
        response: function (settings) {
            var p_ = settings.data['param'];
            var arr_ = JSON.parse(p_);
            $.each(arr_, function (i, n) {
                n.id = n.code.replace('code_', '');
                n.text = n.code.replace('code_', 'text');
                n.path = '部门/' + (n.type == 0 ? '部门' : '人员');
                n.hasauth = i % 2;
                n.isexternal = i % 2 == 0 ? 1 : 2;
            });
            console.log('---', arr_);
            this.responseText = {
                code: '1',
                data: arr_
            };
        }
    });
    $.mockjax({
        url: "/jstree6/searchapi1127",
        dataType: "json",
        response: function (settings) {
            console.log('===========', settings);
            this.responseText = {
                person: [{
                        id: '0_1_2_1_2_1',
                        text: 'text0_1_2_1_2_1',
                        type: '1',
                        code: 'code_0_1_2_1_2_1',
                        path: '部门A/部门A01',
                        isexternal: '1',
                        department: '2323部门'
                    },
                    {
                        id: '0_1_2_1',
                        text: 'text0_1_2__1',
                        type: '1',
                        code: 'code_0_1_2_1',
                        path: '外部门A',
                        isexternal: '2',
                        department: 'asd34432门'
                    },
                    {
                        id: '0_2_2_1_2_1',
                        text: 'text0_2_2_1_2_1',
                        type: '1',
                        code: 'code_0_2_2_1_2_1',
                        path: '部门B/部门B01',
                        isexternal: '1',
                        department: '999f部门'
                    }
                ],
                department: [{
                        id: '0_1_2_1_2_2_1',
                        text: 'text0_1_2_1_2_1',
                        code: 'code_0_1_2_1_2_2_1',
                        path: '部门A',
                        isexternal: '1',
                        type: '0'
                    },
                    {
                        id: '0_1_2_1_1',
                        text: 'text0_1_2_1_1',
                        code: 'code_0_1_2_1_1',
                        path: '外部门B',
                        isexternal: '2',
                        type: '0'
                    },
                    {
                        id: '0_2_2_1_2_2_1',
                        text: 'text0_2_2_1_2_1',
                        code: 'code_0_2_2_1_2_2_1',
                        path: '部门C',
                        isexternal: '2',
                        type: '0'
                    }
                ],
            };

        }
    });
    $.mockjax({
        url: "/jstree6/searchapi",
        dataType: "json",
        response: function (settings) {
            var str_ = settings.data['str'].substr(0, 1) == '_' ? settings.data['str'].substr(1) : settings.data['str'];
            this.responseText = [
                '0_1',
                '0_2',
                '0_' + str_,
                '0_1_' + str_,
                '0_2_' + str_
            ];
        }
    });
    $.mockjax({
        url: "/jstree7/api",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = [{
                    "id": "a1",
                    "parent": COM_DEFAULT._jsTreeOpt.root,
                    "text": "t_a1",
                    li_attr: {
                        lever: 1
                    }
                },
                {
                    "id": "a2",
                    "parent": COM_DEFAULT._jsTreeOpt.root,
                    "text": "t_a2",
                    li_attr: {
                        lever: 1
                    }
                },
                {
                    "id": "a1_1",
                    "parent": "a1",
                    "text": "t_a1_1",
                    li_attr: {
                        lever: 2
                    }
                },
                {
                    "id": "a1_2",
                    "parent": "a1",
                    "text": "t_a1_2",
                    li_attr: {
                        lever: 2
                    }
                },
                {
                    "id": "a2_1",
                    "parent": "a2",
                    "text": "t_a2_1",
                    li_attr: {
                        lever: 2
                    }
                }
            ];
        }
    });
    $.mockjax({
        url: "/bookmark/api",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = [{
                    "id": "b1",
                    "parent": "a0",
                    "text": "t_b1",
                    li_attr: {
                        lever: 1,
                        cid: 'a1'
                    }
                },
                {
                    "id": "b2",
                    "parent": "a0",
                    "text": "t_b2",
                    li_attr: {
                        lever: 1,
                        cid: ''
                    }
                },
                {
                    "id": "b1_1",
                    "parent": "b1",
                    "text": "t_b1_1",
                    li_attr: {
                        lever: 2,
                        cid: ''
                    }
                },
                {
                    "id": "b1_2",
                    "parent": "b1",
                    "text": "t_b1_2",
                    li_attr: {
                        lever: 2,
                        cid: 'a1_2'
                    }
                },
                {
                    "id": "b2_1",
                    "parent": "b2",
                    "text": "t_b2_1",
                    li_attr: {
                        lever: 2,
                        cid: 'a2_1'
                    }
                },
                {
                    "id": "b2_2",
                    "parent": "b2",
                    "text": "t_b2_2",
                    li_attr: {
                        lever: 2,
                        cid: 'a2_2'
                    }
                }
            ];
        }
    });

    $.mockjax({
        url: "/help-adminpage/api",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            console.log('aa--', settings.data);
            this.responseText = {
                "code": 1
            };
        }
    });
    $.mockjax({
        url: "/bookmark/get-api",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            console.log('aa--', settings.data);
            this.responseText = '<p>' + settings.data.id + '测试数据 11</p>' +
                '<p>测试数据 22</p>' +
                '<p>测试数据 33</p>';
        }
    });
    $.mockjax({
        url: "/message/showMessage",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = {
                "code": 1,
                "boList": [{
                        title: '微云同步助手微云同步助手1111',
                        type: 1,
                        id: 1,
                        force: 0,
                        date: "2019-8-1"
                    },
                    {
                        title: '微云同步助手微云同步助手微云同步助手22222',
                        type: 2,
                        id: 2,
                        force: 0,
                        date: "2019-8-1"
                    },
                    {
                        title: '强制消息：微云同步助手微云同步助手33333',
                        type: 1,
                        id: 3,
                        force: 1,
                        date: "2019-8-1"
                    },
                    {
                        title: '微云同步助手微云同步助手微云同步助手44444',
                        type: 1,
                        id: 4,
                        force: 0,
                        date: "2019-8-1"
                    },
                    {
                        title: '强制消息：微云同步助手微云同步助手55555',
                        type: 2,
                        id: 5,
                        force: 1,
                        date: "2019-8-1"
                    }
                ]
            };
        }
    });
    $.mockjax({
        url: "/message/messageBack",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = {
                "code": 1
            };
        }
    });
    var aa = {
        "msgTotal":6,
        "userNum":10*10,
        loginNumber:1,
        "processList":[
            {
                "url":"/process/index",
                "type":"NEW_DISTRIBUTION",
                "typeInt":1,
                "typeName":"新分配",
                "number":4
            },
            {
                "url":"/process/index",
                "type":"FOLLOWED_UP_TODAY",
                "typeInt":2,
                "typeName":"今日待回访",
                "number":2
            },
            {
                "url":"/process/index",
                "type":"PROMISE_VOLUME",
                "typeInt":3,
                "typeName":"诺到量",
                "number":1
            },
            {
                "url":"/process/index",
                "type":"AUDITION_VOLUME",
                "typeInt":4,
                "typeName":"试听量",
                "number":1
            }
        ],
        "processTotal":8,
        "newMsg":[
            {
                "id":"aa6a00b3e7584d538d41706109ecd6e9",
                "msgTitle":"单独消息发送11",
                "forceFlag":0,
                "type":1,
                "msg":"<p>消息体内111</p>",
                "publishTime":'2088-11-11 12:55:44'
            },
            {
                "id":"aa6a00b3e7584d538d41706109ecd6e9",
                "msgTitle":"单独消息发送222",
                "forceFlag":0,
                "type":2,
                "msg":"<p>消息体内222</p>",
                "publishTime":'2088-11-22 12:55:44'
            },
            {
                "id":"aa6a00b3e7584d538d41706109ecd6e9",
                "msgTitle":"单独消息发送444",
                "forceFlag":0,
                "type":2,
                "msg":"<p>消息体内444</p>",
                "publishTime":'2088-11-22 12:55:44'
            },
            {
                "id":"aa6a00b3e7584d538d41706109ecd6e9",
                "msgTitle":"单独消息发送333",
                "forceFlag":0,
                "type":1,
                "msg":"<p>消息体内333</p>",
                "publishTime":'2088-11-22 12:55:44'
            }
        ]
    }
    $.mockjax({
        url: "/m/m",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = aa
        }
    });
    $.mockjax({
        url: "/m/m?type=0",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = aa
        }
    });
    $.mockjax({
        url: "/m/m?type=4",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            this.responseText = {
                "userNum": 10
            };
        }
    });

    var cus_panel_temp_ = {
        subdivlist: [{
                id: 'd100',
                name: '区块8+4',
                html: '<div class="row">' +
                    '<div class="col-md-8 cus-col" id="{subdivcol_0}"></div>' + //栅格与页面关系表id
                    '<div class="col-md-4 cus-col" id="{subdivcol_1}"></div>' +
                    '</div>',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAABaCAMAAADtoz8lAAABU1BMVEXu7u7////d3d1namx5nsd5amzux5/R0tLo7u5qamxvamze7u7u7ujuzqVnam+dxeju7tlnia1nbYrYqohnbX7Fnn2vjHCy7u6r2O7F0tLu7tF0mL1uj7RsiKxnbI/YsI5sdn5nbHpnanOcfG6AdG6Jc22lhGyAbWx8amzN6+7E6O7X5u6KsO6Uu+ju7uGOs9nu7sd8n8Xu7sHRyb7u2LHu6K9qgaRqeZFncpFnaoCwjnVycW+hfm2Zd2xxa2yIamzj7u7Y7u636O6t6O6j0+6dx+6/1OisyePu6N6sxt6KsN6sw9ro3tWiudPu6Mzu6MXR0sPu5MLu6L6Zrb6To7h2krTjybKInrLUwKiAlKjuyqHYu5+wu5/Nt5/oxZ1ne518h5rRupnuupbJrZa2o5ayo5Les5BtfY2smodqdIfEpIWdjICYh4Brcnepina3knSXd2y9drGYAAACU0lEQVR42u3dZ0/bYBSG4VNOndiOkyakSRsSSiZQWkYLZRRK99577737/z/VttIKpBeIFMT7GD33L7Av2efY8gfLHrYtEZKQWBFyGyEHWH/9h5Rd2MDOnRUhCUnIjSMkaIQkJFaEJCRWhCQkVoQkJFaEJCRWhCQkVoQkJFaEJCRWhCQkVoQkJFaEJCRWhCTkVj36vqy5+tNLskEQkHMd3YsNGXzzNa4xLcYgIPNlRYf85GvjcWX2y6ru3yemICCLHjrk8VNdwBFfhzNiCAEyO6bokM/GteZK2NSoDp4XQwCQMytaXwWHfOf/O8CSLl0UQ/Yhg5K3+MIBh0w5WpWooKxLF8SUdchXTnM6hQ4ZzsjBg90xNH9YDFmHvPdHaxl4yGjJLFw/c+VlG3VrB7918ZzgQ8rzjsYtXBZjtiFH/MakJABy6n1bo3Kfb7piyjLkXEerbgIg8yc9/Xq/MvvR0dwxo6RdyHxZX09IAiCLng7HO+ZuS5uTYsoqZNELR3cCIGda0dKOy46bX22sQmbHwvskCZAnTmvBlbihUT10QAzZhCzpuo7CQqYcLUi3MiH7uyIzwFfkjXS3t45W0+kjsJBDK2tnZAFuRsYlYUZGW3t+QsJut7R5TUwRsrfnSNX6g8qdD23V2lkxRMjeuvXL07jcQ/MEImSPBU9+LKv+fHPVFWOExGwXf47dPEKCRkhCYkVIQmJFSEJiRUhCYkVIQmJFSEJiRUhCYkVIQmJFSEJiRUhCYkVIQmJFSEJiRUhCYkXIJEOy/uKvqvjPL7wISUis/gI8BDuDy/133gAAAABJRU5ErkJggg=='
            },
            {
                id: 'd200',
                name: '区块6+6',
                html: '<div class="row">' +
                    '<div class="col-md-6 cus-col" id="{subdivcol_0}"></div>' +
                    '<div class="col-md-6 cus-col" id="{subdivcol_1}"></div>' +
                    '</div>',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUYAAABYCAMAAAC+oq6dAAAB0VBMVEXu7u7////d3d1namxnam/Gnn3u7uju7rKKamxqamyeyO5ujbFnbX5nan1ya2ze7u55n8hojrJofJ9na3lnbXVnanOigW6ce213a2xta2xvamzo7u661uru7uPu7t7u7tDu6MXYsI9nbo9nao2IfnR2dHCKdW7j7u7Y7u7G7u6x7u7T6+7E6O6t6O7L5u6/5u6t3e6Zwe6RuOuKsOudxeiKr9bu6NPR0tKWrcnu7sV3nMXRyb7u67mNobXu6LDu2K5qiKzu3apogqXuzqR/kqTuxZ2+qp3Csptnd5ruvpnot5Nre5DoroxwfIZnaoagkoOmlILDnoBsc329mHdqcXavjXO1kXJnbXKtimyph2yScmyMbWyFamx9amzO7u7A7u636O6w6O6j0+6jyu6bweOGrN6Zu9mRttmFqtmmwNPJ0tLC0tK8ydK2w9KApM6IqszR0smsvcno3sadxcWit8Po1MCdrb5ymL7Rw7hukbZzlLXjybLo1K+Emq5xiqpvhKXQt6R8jKTux5/Gsp/jwZ1xhptrgJt3gpbuuJTYtpRncpSsmohxdYfSp4XOpINnboHKoH6mkXyOgnu9mHlnd3mjhHR8dHKEdG9vbmyFbWx7bWy7vUOYAAACrUlEQVR42u3dR1cTYRjF8ZE7BFNIgIQSQlBCEhEQpAgqUkVAQUCKqGDvvffee+9+WqckkT0s7jne/ybPMueXSeaZdxNjhVqGxChGnizGPLW0MowGd3nkb1CMYuRJjGLkSYxi5EmMYuRJjGLkSYxi5EmMYuRJjGLkSYxi5EmMYuRJjGLkSYxi5EmMYuRJjKyM8UdffmFu58Y1rIxX3v7wYmqwippx9Xe4PWzkZHxdAafwSWLGVWXA6LXO4TTgDzEy7qhE5P65rslKBHy8jB+88NfZF2U5wi2EjFv2IdBuDzWV6AuxMlrvcqTZ/dSjKCJkfO81T2W/NonDrIyvouZxdyqYn7nDx2jhjRx0x09z746yMk5jfL0zkC48/Qu46QzUC0/1XpSstQdWxu1BtDkDNeOmchQb1ydTMEn3xjEU+uJPk1HMPCbeGwtWorgmCKcXVYSM+Si8WganyMUYMeO3YGTw/KWhJFDSyMgYTmH0xplbE0GUbiBmROCYPXXMwrzAyAj4G+zp2R+8OUTMWOSOvb+tuw0jY8JdJTxfYbbxMo4fcUfPHtSuY2S8nRm3VWAzKaN1p66t//dr7qNjHEPu2arHuh2SMi6+BKcZGRddgv0LtIxGPkpbc5t4op6OsWceAw25TbyIlXHrfvhD2akvRMfo2Y1CX3YKt7AyVs9a61jMPSgrbeVbeIwnFShpzhyUDRxgZTR60zCfX+4c/gn46wgZPbu8CHSf7fpsvbSzrt9W99JwMh80ET4MGkbccnT6eIL2mdquYygZReTl6Rjj0YTd3YkUzKnuJt6jiWy0B2XZuA/KsomRMjGKkScxipEnMYqRJzGKkScxipEnMYqRJzGKkScxipEnMYqRJzGKkScxipEnMYqRJzGKkScx/leMamnpT6D0X1pUiXFZ+gu2aFaRB6rtSAAAAABJRU5ErkJggg=='
            },
            {
                id: 'd300',
                name: '区块12',
                html: '<div class="row">' +
                    '<div class="col-md-12 cus-col" id="{subdivcol_0}"></div>' +
                    '</div>',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUYAAABZCAMAAAB1/n04AAAA81BMVEXu7u7////d3d1namyw7u5nao6wjWytrq5qamzu7uju6MXE5+5ojbFnanGefm9va2zu7sdqfZ5nbX2vjnWce2yIcWzo7u7h7u6izu6gxeju7tmUudmApNB5nsfu27Frg6Xux5/YsI9oc49qdoneqohnb4fOpIJnaoGghnaQcnFycW95amzS7u6r3e6w2O6t1Oju7uOxyeOFqt7u6NOdudPJ0tKtvM+TrcmBpMXu5MLRyb6drb7u7rjj0Ld4lLTu4bGDm67ozKjUwKjUuZ+AkJ/ouJTUro6sno2hiITBnoHEnn6Tgntrcnu3knKkimyBcmx4bmz3T7VzAAABuklEQVR42u3dx05CURRG4a3bci8CVuxdQMDee+/d938agQgY48TA4D9hrdEZfzklOZNtHdSCYIRRpzJjJzXXN6NRM8EIo04wwqgTjDDqBCOMOsEIo04wwqgTjDDqBCOMOsEIo04wwqgTjDDqBCOMOsEIo04wtgPjbKa7q7aOr19K7q+3W6aXNmMi7XXGRCHyaqnDUVNLmvEo7XXGyWH3pZO944dPT02bWsKM8c2HNxjv+n2wz8pdZTy3ZmLpMp4VIm8wxj2+PG7V8u7bJpYs48CIe+r8vcZ4WvS5Vas2v+IzJpYy49LuaE+N8aJYShqM/2d8PBgzqzL+Kusu98bIMlb6kzExUrklxQqOMX6OPDlmYgXHuNDvi+umVmiMZcWhCZMrLMb4vqw4ZXoFxbj5FGkqBsW4Mxx5TvBEh8WYSLsvbphk4TBWFAf7TLNgGCsfZXOqiuEw5iPdvRgO42zGU5e9tfZNrFAYs/6zpIkVCuMbjG0QjDDqBCOMOsEIo04wwqgTjDDqBCOMOsEIo04wwqgTjDDqBCOMOsEIo04wwqgTjDDqBCOMOsHYGkbG7rQkhkAxS0sqGGHU6QvmvSS0bThkqwAAAABJRU5ErkJggg=='
            },
            {
                id: 'd400',
                name: '区块4+4+4',
                html: '<div class="row">' +
                    '<div class="col-md-4 cus-col" id="{subdivcol_0}"></div>' +
                    '<div class="col-md-4 cus-col" id="{subdivcol_1}"></div>' +
                    '<div class="col-md-4 cus-col" id="{subdivcol_2}"></div>' +
                    '</div>',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUYAAABYCAMAAAC+oq6dAAAAhFBMVEXu7u7////d3d1namx5nsd5amzux5/R0tLYrIrGnn1qamzo7u6KsO7u7uiawuju7tl1mbzu2LHuzqVncpFna3utinKKcmyAbWxwamze7u7E6O636O7Z5O6KsNno3tXu7sd7nsXu6L5vj7Owu5/oxZ1ne53Ruplte323knRnanSffW+Xd2wbyx7AAAABfklEQVR42u3dSW6EQBBEUdxpDE2759HzPN//fvaiN14SIBNO/bjAF2+BVKpFFSesh8EIo89+GEes246MxV9tlDMFI4w+KRhh9EnBCKNPCkYYfVIwwuiTghFGnxSMMPqkYITRJwUjjD4pGGH0ScEIo08KRhh9UjDC6JOCcXDG5S5OWwdzpjowzrchBHOmOjDWjRLMmdIZV/tQgjlTMuPdZ7wdhGDOlMo4HTfrp1II5kypjM/lx82ZEsyZEhkfvuLxQgrmTGmM0/dYXxVSMGdKY6wPm1mhBXOmJMblLhYTMZgzpTDOt/FyWYjBnCmFsW42s0IN5kwJjKt93E/kYM6UwDiOXztvF8yZgnEoxtvquNcyFlV13S6YM6UeBuW/SM4UjDD6pGCE0SfFBevgF6zu3wbjf0vBCKNPCkYYfVIwwuiTghFGnxSMMPqkYITRJwUjjD4pGGH0ScEIo08KRhh9UjDC6JOCEUafFIww+qRg7CXFszu9jEegeEvLajD2sm8/piXgSjMW1AAAAABJRU5ErkJggg=='
            }
        ],
        modelist: [{
                id: 'm102',
                type: 3,
                url: '../echarts-demo-include.html',
                name: '模块模板102',
                icon: 'data:image/png;base64,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'
            },
            {
                id: 'm100',
                type: 3,
                url: 'http://lianglei.net.cn/demo-help/',
                name: '模块模板100',
                icon: 'data:image/png;base64,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'
            },
            {
                id: 'm101',
                type: 3,
                url: 'http://lianglei.net.cn/demo-help/',
                name: '模块模板101',
                icon: 'data:image/png;base64,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'
            }
        ]
    };

    $.mockjax({
        url: "/api/panel/modulelist",
        dataType: "json",
        response: function (settings) {
            if (settings.data['type'] == 'subdiv') {
                this.responseText = cus_panel_temp_.subdivlist;
            } else {
                this.responseText = cus_panel_temp_.modelist;
            }
        }
    });
    $.mockjax({
        url: "/set/panel/page",
        dataType: "json",
        response: function (settings) {
            if (COM_TOOLS.localStorageSupport()) {
                COM_TOOLS.save_toLocal('cus_panel_' + settings.data['pageid'], settings.data['modeldata']);
            }
            this.responseText = {
                code: 1
            };
        }
    });
    $.mockjax({
        url: "/datadict/api/address",
        dataType: "json",
        response: function (settings) {
            this.responseText = {
                results: demoCityData_
            };
        }
    });
    
    $.mockjax({
        url: "/datadict/api/getsource",
        dataType: "json",
        response: function (settings) {
          this.responseText = [
            {id:'1', url:'/datadict/api/address', text:'国家行政区域'},
            {id:'2', url:'/demo/sex/api', text:'性别'}
          ];
        }
    });

    $.mockjax({
        url: "/demo/sex/api",
        dataType: "json",
        response: function (settings) {
            this.responseText = {
                results: [{
                        "text": "未知",
                        "id": "-1"
                    },
                    {
                        "text": "男",
                        "id": "1"
                    },
                    {
                        "text": "女",
                        "id": "2"
                    }
                ]
            };
        }
    });

    $.mockjax({
        url: "/get/panel/page",
        dataType: "json",
        responseTime: 500,
        response: function (settings) {
            var default_ = {
                "subdiv": [{
                        id: "re_pd100", //页面与区块关系表ID
                        modelid: 'd100', //区块id
                        parent: 'page1001',
                        order: 1,
                        type: 1,
                        html: '<div class="row">' +
                            '<div class="col-md-8 cus-col" id="d101"></div>' + //栅格与页面关系表id
                            '<div class="col-md-4 cus-col" id="d102"></div>' +
                            '</div>'
                    },
                    {
                        id: "re_pd200",
                        modelid: 'd200',
                        parent: 'page1001',
                        order: 2,
                        type: 1,
                        html: '<div class="row">' +
                            '<div class="col-md-6 cus-col" id="d201"></div>' +
                            '<div class="col-md-6 cus-col" id="d202"></div>' +
                            '</div>'
                    }
                ],
                "modelist": [{
                        id: "re_md100", //模块与栅格关系表id
                        modelid: 'm100', //模块id
                        name: 'aaa',
                        parent: 'd101', //所属格栅id
                        type: 3,
                        order: 1,
                        url: '',
                        skin: {
                            className: 'cus-panel-success',
                            panelBorder: '3',
                            headHidden: 'true',
                            height: '100',
                            headBorder: '0'
                        }
                    },
                    {
                        id: "re_md101",
                        modelid: 'm101',
                        name: 'bbb',
                        parent: 'd101',
                        type: 3,
                        order: 2,
                        url: 'http://lianglei.net.cn/demo-help/',
                        skin: {
                            className: 'cus-panel-info',
                            height: '150',
                        }
                    }
                ]
            };
            if (COM_TOOLS.localStorageSupport()) {
                var data_ = {
                        "subdiv": [],
                        "modelist": []
                    },
                    strOpt_ = COM_TOOLS.get_fromLocal('cus_panel_' + settings.data['pageid']);
                if (strOpt_) {
                    var d_ = $.parseJSON(strOpt_);
                    $.each(d_, function (i, n) {
                        if (n.model_type == '1') {
                            var $subdiv = $(false);
                            $.each(cus_panel_temp_.subdivlist, function (ii, nn) {
                                if (n.model_id == nn.id) {
                                    $subdiv = $(nn.html);
                                    return false;
                                }
                            });
                            $.each(n.child_col, function (j, m) {
                                $subdiv.children('.cus-col').eq(j).attr('id', m.id);
                            });
                            data_.subdiv.push({
                                id: n.wrapitem_id, //页面与区块关系表ID
                                modelid: n.model_id, //区块id
                                parent: n.parent_id,
                                order: n.order,
                                type: n.model_type,
                                html: $subdiv[0].outerHTML
                            });
                        } else if (n.model_type == '3') {
                            var panel_data = {};
                            $.each(cus_panel_temp_.modelist, function (ii, nn) {
                                if (n.model_id == nn.id) {
                                    panel_data = nn;
                                    return false;
                                }
                            });
                            data_.modelist.push({
                                id: n.wrapitem_id,
                                modelid: n.model_id,
                                name: panel_data.name,
                                parent: n.parent_id,
                                type: n.model_type,
                                order: n.order,
                                url: panel_data.url,
                                skin: n.skin || {}
                            });
                        }
                    });
                    this.responseText = data_;
                } else {
                    this.responseText = default_;
                }
            } else {
                this.responseText = default_;
            }
            console.log(data_)
        }
    });

});

function TEXT_get_jsDoc(name, cb) {
    $.ajax({
        type: "get",
        url: "../js/subindex.js",
        async: false,
        dataType: 'text',
        success: function (d) {
            var t = d.match(/\/\*\*((.|\s)+?)\*\/\r\n.+?(?={\r\n)/gi);
            $.each(t, function (i, n) {
                if (n.indexOf(name) !== -1) {
                    cb && cb(n.replace(/ {4}/g, ''));
                }
            });
        }
    });
}

/* 转义html(wrap==true时不建议和highlight一起使用，不能正常识别) */
function _demo_htmlencode_fn(html, wrap) {
    var html = html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    return wrap ? '<ol class="cus-demo-code-ol"><li>' + html.replace(/[\r\t\n]+/g, '</li><li>') + '</li></ol>' : html;
}

$(function () {
    /* 演示demo 初始化 */
    $('.js-auto-init-demobox').each(function () {
        var $this = $(this);
        var $panelBody = $this.closest('.panel-body');
        var $htmlcode = $panelBody.find('.js-auto-init-htmlcode');
        $htmlcode.text(beautifier.html($this.html(), _BEAUFLY_OPTION_));
    });

    $('.js-auto-init-jscode').each(function () {
        var $pre = $('<pre></pre>');
        $pre.text(beautifier.js($(this).html(), _BEAUFLY_OPTION_));
        $(this).after($pre);
    });

    $('.js-auto-to-encode').each(function () {
        $(this).text($(this).html());
    });

    $('a[js-auto-ajaxdata]').on('shown.bs.tab', function (e) {
        var $this = $(this);
        var url_ = $this.attr('js-auto-ajaxdata');
        if (url_) {
            var $targetBox_ = $($this.attr('href'));
            if (!$targetBox_.is(':has(pre)')) {
                $.get(url_, function (d) {
                    var $pre = $('<pre></pre>').text(beautifier.js(d, _BEAUFLY_OPTION_));
                    $targetBox_.append($pre);
                    if (hljs) {
                        hljs.highlightBlock($pre[0]);
                    }
                }, 'text');
            }
        }
    })
});