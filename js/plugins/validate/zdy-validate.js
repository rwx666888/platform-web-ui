/*!
 * 自定义验证规则扩展
 * Last modified time :2019-01-18
 */

/*只输入字母*/
$.validator.addMethod("ck-letter", function(value, element, params) {
    var reg_ = /^[a-zA-Z]+$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_letter"]);
/*只输入字母或数字*/
$.validator.addMethod("ck-numorletter", function(value, element, params) {
    var reg_ = /^[0-9a-zA-Z]+$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_numOrLetter"]);
/*只输入字母或数字或下划线*/
$.validator.addMethod("ck-numorletteroruline", function(value, element, params) {
    var reg_ = /^[0-9a-zA-Z_]+$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_numOrLetterOrUline"]);
/*只输入汉字*/
$.validator.addMethod("ck-chinese", function(value, element, params) {
    var reg_ = /^[\u4e00-\u9fa5]+$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_chinese"]);
/*必须同时包含数字和字母(同时存在)*/
$.validator.addMethod("ck-numandletter", function(value, element, params) {
    var reg_ = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_numAndLetter"]);
/*邮箱验证*/
$.validator.addMethod("ck-email", function(value, element, params) {
    var reg_ = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_email"]);
/*手机验证*/
$.validator.addMethod("ck-phone", function(value, element, params) {
    var reg_ = /^((?!1{11})1\d{10})$|^(09\d{8})$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_phone"]);
/*身份验证*/
$.validator.addMethod("ck-idcard", function(value, element, params) {
    var len, re, type_;
    num = value;
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        type_ = false;
    } else {
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
        len = num.length;
        if(len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);

            //检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if(!bGoodDay) {
                type_ = false;
            } else {
                type_ = true;
            }
        } else if(len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);

            //检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));

            if(!bGoodDay) {
                type_ = false;
            } else {
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                for(var i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if(valnum != num.substr(17, 1)) {
                    type_ = false;
                } else {
                    type_ = true;
                }
            }
        }
    }
    return this.optional(element) || type_;
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_idCaid"]);
/*邮编验证*/
$.validator.addMethod("ck-zipcode", function(value, element, params) {
    var reg_ = /^(?!0{6})\d{6}$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_zipCode"]);
/*
 * 一组元素中至少N项被填写
 * @example
 * 两个元素中至少填写一项
 * <input class="productinfo" name="partnumber">
 * <input class="productinfo" name="description">
 * 
 * partnumber:	{require_from_group: [1,".productinfo"]},
 * description: {require_from_group: [1,".productinfo"]}
 *
 * options[0]: 组中至少填写的字段数
 * options[1]: CSS选择器，用于定义有条件的字段组
 */
$.validator.addMethod("require_from_group", function(value, element, options) {
    var $fields = $(options[1], element.form),
        $fieldsFirst = $fields.eq(0),
        validator = $fieldsFirst.data("valid_req_grp") ? $fieldsFirst.data("valid_req_grp") : $.extend({}, this),
        isValid = $fields.filter(function() {
            return validator.elementValue(this);
        }).length >= options[0];
    $fieldsFirst.data("valid_req_grp", validator);
    if(!$(element).data("being_validated")) {
        $fields.data("being_validated", true);
        $fields.each(function() {
            validator.element(this);
        });
        $fields.data("being_validated", false);
    }
    return isValid;
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_require_from_group"]);

/*
 * 一组元素中至少N项被填写 或者 都不填写
 * @example
 * 三个元素中至少填写两项或都不填写
 * <input class="productinfo" name="partnumber">
 * <input class="productinfo" name="description">
 * <input class="productinfo" name="color">
 *
 * partnumber:	{skip_or_fill_minimum: [2,".productinfo"]},
 * description: {skip_or_fill_minimum: [2,".productinfo"]},
 * color:		{skip_or_fill_minimum: [2,".productinfo"]}
 *
 * options[0]: 组中至少填写的字段数
 * options[1]: CSS选择器，用于定义有条件的字段组 *
 */
$.validator.addMethod("skip_or_fill_minimum", function(value, element, options) {
    var $fields = $(options[1], element.form),
        $fieldsFirst = $fields.eq(0),
        validator = $fieldsFirst.data("valid_skip") ? $fieldsFirst.data("valid_skip") : $.extend({}, this),
        numberFilled = $fields.filter(function() {
            return validator.elementValue(this);
        }).length,
        isValid = numberFilled === 0 || numberFilled >= options[0];
    $fieldsFirst.data("valid_skip", validator);
    if(!$(element).data("being_validated")) {
        $fields.data("being_validated", true);
        $fields.each(function() {
            validator.element(this);
        });
        $fields.data("being_validated", false);
    }
    return isValid;
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_skip_or_fill_minimum"]);
/* 非负数（正数+0） */
$.validator.addMethod("ck-non-negative", function(value, element, params) {
    var reg_ = /^(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_non-negative"]);
/*
 * 自定义数字格式化验证
 * 支持整数位数（params[1]）及小数位数（params[0]）配置,最多支持12位整数，或4组千分位 ：***,***,***,***.***
 * 注意：必须与jquery-number 中 check_input_num2规则校验方式一致；
 */
$.validator.addMethod("ck-number-len", function(value, element, params) {
    params = COM_TOOLS.parseArray(params);
    var sepL_ = (params[1] && (params[1] && 0 <= params[1] && params[1] <= 12)) ? params[1] : 12,
        depL_ = (params[0] && (params[0] && params[0] > 0)) ? params[0] : 0,
        R_sepL = Math.ceil(sepL_ / 3) - 1,
        R_depL = depL_ == 0 ? 1 : depL_;
    R_sepL = R_sepL < 1 ? 1 : R_sepL;
    if(depL_ === 0) {
        var reg_ = new RegExp(('^(?:-?\\d{1,' + sepL_ + '}|-?\\d{1,3}(?:,\\d{3}){1,' + R_sepL + '})?$'));
    } else {
        var reg_ = new RegExp(('^(?:-?\\d{1,' + sepL_ + '}|-?\\d{1,3}(?:,\\d{3}){1,' + R_sepL + '})?(?:\\.\\d{1,' + R_depL + '})?$'));
    }
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_wrongnumber"]);
/*
 * 自定义特殊字符校验 
 * 预留默认的校验规则
 * 可通过传参使用而外规则 ( 注: " -> &quot ; \ -> &slash ; , -> $com 来代替 )
 */
$.validator.addMethod("cus-specialchars", function(value, element, params) {
    var reg_ = /[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\<\>\?]/g;
    if(params != "true") {
        params = '\\' + params.match(/[^,]+/g).join('\\');
        params = params.replace(/(&quot)/g, '"'); // 双引号
        params = params.replace(/(&slash)/g, "\\"); // 反斜杠
        params = params.replace(/(&com)/g, ","); // 逗号
        reg_ = new RegExp('[' + params + ']', 'g');
    }
    return this.optional(element) || !reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_specialchars"]);
/*
 * 自定义手机号及电话号验证
 * 支持中国(包括台湾省),手机及电话号验证
 */
$.validator.addMethod("ck-phone-tel", function(value, element, params) {
    var reg_ = /^((?!1{11})1\d{10})$|^(09\d{8})$|^(0\d{1,3}-\d{6,8})$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_phone_tel"]);
/*
 * 国际化Key命名规则验证
 * 必须由4段组成，每段编码只能包含字母、数字、下划线、减号;(这里为了兼容历史数据，不强制小写 2018-3-23)
 * 能匹配 xxxx.xxxx.xxxx.xxxx 形式 或者 xxxx 形式
 */
$.validator.addMethod("ck-i18n-key", function(value, element, params) {
    var reg_ = /^(((\w|-)+(\.(\w|-)+){3})|(\w|-)+)$/;
    return this.optional(element) || reg_.test(value);
}, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_i18n_key"]);
/* 
* 域名及ip校验
* params 传IP时为IP校验其他都为域名校验
*/
$.validator.addMethod("ck-domain-ip", function(value, element, params) {
    var reg_ = '';
    switch (params) {
        case 'ip':
        reg_ = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        break;
        default:
        reg_ = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;
        break;
    }
    return this.optional(element) || reg_.test(value);
},'域名或IP格式错误（ip：xxx.xxx.xxx.xxx）');