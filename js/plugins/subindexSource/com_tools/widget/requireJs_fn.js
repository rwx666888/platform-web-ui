/**
 * 动态加载JS\CSS并执行,并完成所加载组件的默认配置信息初始化(COM_TOOLS.initjSDefaultOpt)
 * 注意前置组件加载完成后不进行初始化，所有组件都加载完成的后才统一初始化;已显试加载的js，不好再次加载其js和css，即使其CSS没有被加载过；
 * 只以组件名称KEY作为排重依据，CSS动态加载时，会进行二次排重验证（在校验head内的，无论显试还是隐试）；
 * @param {Array} arr 需要加载的组件数组；
 * @param {Array} def 前置依赖的组件数组；
 * @param {Function} cb 加载完成后组件的初始化回调方法；
 */
COM_TOOLS.requireJsFn = function (arr, def, cb) {
    var _obj_ = {};
    _obj_.loadFile = function (u, callback) {
        if (COM_TOOLS['_jsFileList'][u]['js']) {
            COM_TOOLS.cache_obj['_jsfileArr'].push(u);
            $.ajax({
                type: "get",
                url: COM_TOOLS['_jsPath'] + COM_TOOLS['_jsFileList'][u]['js'],
                dataType: "script",
                cache: true,
                success: function () {
                    //COM_TOOLS.cache_obj['_jsfileArr'].push(u); //update 2019-7-8 控制器上移，不在判断是否加载成功；
                    callback && callback();
                },
                error: function () {
                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA["platform.plugin.com_msg.1102"]);
                    /*系统异常 请联系管理员*/
                }
            });
        }
        if (COM_TOOLS['_jsFileList'][u]['css']) {
            if (!_obj_.checkCssIsLoad(COM_TOOLS['_jsFileList'][u]['css'])) {
                var thatLink_ = $('#cus_app_link');
                if (thatLink_.length == 0) { //对历史版本兼容补丁
                    thatLink_ = $('head link[rel="stylesheet"]').filter(function () {
                        return $(this).attr('href').indexOf('css/style.css') != -1;
                    });
                }
                thatLink_.before($('<link rel="stylesheet" type="text/css" href="' + COM_TOOLS['_jsPath'].replace('/js/', '/css/') + COM_TOOLS['_jsFileList'][u]['css'] + '"/>'));
            }
        }
    };
    _obj_.checkCssIsLoad = function (p_) {
        return !!$('head link[rel="stylesheet"]').filter(function () {
            return p_.substring(p_.indexOf('css/')) == $(this).attr('href').substring($(this).attr('href').indexOf('css/'));
        }).length;
    };
    _obj_.forCheck = function (a_, c_) {
        for (var i = 0, l_ = a_.length; i < l_; i++) {
            if (COM_TOOLS['_jsFileList'][a_[i]] && $.inArray(a_[i], COM_TOOLS.cache_obj['_jsfileArr']) === -1) {
                c_ && c_(a_[i]);
            }
        }
    };
    _obj_.ready_check = function (a_) {
        for (var i2 = 0, l2_ = a_.length; i2 < l2_; i2++) {
            if (COM_TOOLS['_jsFileList'][a_[i2]] && $.inArray(a_[i2], COM_TOOLS.cache_obj['_jsfileArr']) === -1) {
                return false;
            }
        }
        return true;
    };
    _obj_.fn1 = function () {
        _obj_.forCheck(arr, function (u2) {
            _obj_.loadFile(u2, function () {
                if (_obj_.ready_check(arr)) {
                    cb && window.setTimeout(function () {
                        COM_TOOLS.initjSDefaultOpt(arr.concat(def) || 'ALL'); //初始化相关组件默认配置
                        cb(); //执行组件回调
                    }, 4);
                }
            });
        });
    };
    if (jQuery.type(def) === "array" && def.length > 0 && !_obj_.ready_check(def)) {
        _obj_.forCheck(def, function (u) {
            _obj_.loadFile(u, function () {
                if (_obj_.ready_check(def)) {
                    if (jQuery.type(arr) === "array" && arr.length > 0 && !_obj_.ready_check(arr)) {
                        _obj_.fn1();
                    } else {
                        cb && cb();
                    }
                }
            });
        });
    } else if (jQuery.type(arr) === "array" && arr.length > 0 && !_obj_.ready_check(arr)) {
        _obj_.fn1();
    } else {
        cb && cb();
    }
};