/**
 * jQuery number plug-in 1.0
 *
 * 借鉴 jQuery.number组件；input
 *
 * @author  lianglei 
 * @time 2017-12-22
 */
(function($) {
    "use strict";

    function check_input_num(number) { //非法格式返回true; 最多支持12位整数，或4组千分位 ：***,***,***,***.**
        number = number + '';
        return !/^(?:-?\d{1,12}|-?\d{1,3}(?:,\d{3}){1,3})?(?:\.\d+)?$/.test(number);
    }
    /*
     * 非法格式返回true; 支持整数位数（params[1]）及小数位数（params[0]）配置,最多支持12位整数，或4组千分位 ：***,***,***,***.***
     * 注意：必须与validate 中 ck-number-len规则校验方式一致；
     */
    function check_input_num2(number, params) {
        number = number + '';
        params = $.isArray(params) ? params : [];
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
        return !reg_.test(number);
    }
    $.validator && $.validator.addMethod("ck-number-forjqnum", function(value, element, params) {
        return this.optional(element) || !check_input_num2(value, params);
    }, LOCAL_MESSAGE_DATA["platform.plugin.validate.valid_wrongnumber"]);

    $.fn.number = function(number, decimals, dec_point, thousands_sep) {
        thousands_sep = (typeof thousands_sep === 'undefined') ? ',' : ',';
        dec_point = (typeof dec_point === 'undefined') ? '.' : '.';
        decimals = (typeof decimals === 'undefined') ? 0 : decimals;

        var u_dec = ('\\u' + ('0000' + (dec_point.charCodeAt(0).toString(16))).slice(-4)),
            u_sep = ('\\u' + ('0000' + (thousands_sep.charCodeAt(0).toString(16))).slice(-4)),
            regex_sep = new RegExp(u_sep, 'g'),
            regex_dec_num = new RegExp('[^' + u_dec + '0-9]', 'g'),
            regex_dec = new RegExp(u_dec, 'g');

        if(number === true) {
            if(this.is('input:text')) {
                return this.on({
                    'focus.numformat': function(e) { //获取焦点
                        var $this = $(this);
                        this.value = $this.val();
                    },
                    'blur.numformat': function(e) { //失去焦点
                        var $this = $(this),
                            num = this.value;
                        if(check_input_num2(num, [$this.data('num_format')['decimals']])) { //如何含有非法字符或非法格式，则返回原值
                            $this.val(num);
                        } else {
                            $this.val($.number(num, decimals, dec_point, thousands_sep));
                        }
                    }
                }).each(function() {
                    var $this = $(this).data('num_format', {
                        decimals: decimals,
                        thousands_sep: thousands_sep,
                        dec_point: dec_point,
                        regex_dec_num: regex_dec_num,
                        regex_dec: regex_dec,
                        regex_sep: regex_sep
                    });
                    var $form = $(this.form);
                    if($form.data('validator')) { //validate 已初始化
                        var rulesObj = $this.rules() || {};
                        if(!('ck-number-forjqnum' in rulesObj)) { //如果当前没有 number校验规则，则添加
                            $this.rules("add", {
                                'ck-number-forjqnum': [decimals]
                            });
                        }
                    } else {
                        if(!($this.attr('ck-number-forjqnum'))) {
                            $this.attr('ck-number-forjqnum', '[' + decimals + ']');
                        }
                    }
                    // Return if the element is empty.
                    if(this.value === '') return;
                    // Otherwise... format!!
                    $this.val($this.val());
                });
            } else {
                // 不是 input:text 元素
                return this.each(function() {
                    var $this = $(this);
                    $this.number($.trim($this.text()), decimals, dec_point, thousands_sep);
                });
            }
        }
        return this.text($.number.apply(window, arguments));
    }

    //
    // Create .val() hooks to get and set formatted numbers in inputs.
    //

    // We check if any hooks already exist, and cache
    // them in case we need to re-use them later on.
    var origHookGet = null,
        origHookSet = null;

    // Check if a text valHook already exists.
    if($.isPlainObject($.valHooks.text)) {
        if($.isFunction($.valHooks.text.get)) {
            origHookGet = $.valHooks.text.get;
        }
        if($.isFunction($.valHooks.text.set)) {
            origHookSet = $.valHooks.text.set;
        }
    } else {
        $.valHooks.text = {};
    }

    $.valHooks.text.get = function(el) {

        // Get the element, and its data.
        var $this = $(el),
            num, negative,
            data = $this.data('num_format');
        // Does this element have our data field?
        if(!data) {
            // Check if the valhook function already existed
            if($.isFunction(origHookGet)) {
                // There was, so go ahead and call it
                return origHookGet(el);
            } else {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
            }
        } else {
            // Remove formatting, and return as number.
            if(el.value === '') return '';
            // Convert to a number.
            if(check_input_num2(el.value, [data['decimals']])) { //如何含有非法字符或非法格式，则返回原值
                return el.value;
            }

            num = (el.value
                .replace(data.regex_sep, '')
                .replace(data.regex_dec, '.'));
            return num;
        }
    };

    $.valHooks.text.set = function(el, val) {
        // Get the element, and its data.
        var $this = $(el),
            data = $this.data('num_format');

        // Does this element have our data field?
        if(!data) {

            // Check if the valhook function already exists
            if($.isFunction(origHookSet)) {
                // There was, so go ahead and call it
                return origHookSet(el, val);
            } else {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
            }
        } else {
            var num = val;
            if(!check_input_num2(val, [data['decimals']])) { //格式验证通过，则调用格式化API
                num = $.number(val, data.decimals, data.dec_point, data.thousands_sep);
            }
            return $.isFunction(origHookSet) ? origHookSet(el, num) : el.value = num;
        }
    };

    $.number = function(number, decimals, dec_point, thousands_sep) {
        if(number === '') { //修正  $([]).val('') 时out:0.00 不能为 ''的问题
            return '';
        }

        decimals = (typeof decimals === 'undefined') ? 0 : decimals;
        dec_point = (typeof dec_point === 'undefined') ? '.' : '.';
        thousands_sep = (typeof thousands_sep === 'undefined') ? ',' : ',';

        var u_dec = ('\\u' + ('0000' + (dec_point.charCodeAt(0).toString(16))).slice(-4));
        var u_sep = ('\\u' + ('0000' + (thousands_sep.charCodeAt(0).toString(16))).slice(-4));
        number = number + '';
        if(check_input_num(number)) { //如何含有非法字符或非法格式，则返回原值
            return number;
        }

        number = number
            .replace('\.', dec_point)
            .replace(new RegExp(u_sep, 'g'), '')
            .replace(new RegExp(u_dec, 'g'), '.');

        var n = !isFinite(+number) ? 0 : +number,
            s = '',
            toFixedFix = function(n, decimals) {
                return '' + (+(Math.round(('' + n).indexOf('e') > 0 ? n : n + 'e+' + decimals) + 'e-' + decimals));
            };

        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
        if(s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
        }
        if((s[1] || '').length < decimals) {
            s[1] = s[1] || '';
            s[1] += new Array(decimals - s[1].length + 1).join('0');
        }
        return s.join(dec_point);
    }
})(jQuery);