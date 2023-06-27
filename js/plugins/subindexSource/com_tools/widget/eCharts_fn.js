/**
 * eChart组件数据类似转换工具类
 * 详见that_.initOpt
 */
COM_TOOLS.eChartsTools = function () {
    var that_ = {};

    function getData(ele, data, fopt, dopt) {
        var d_ = {
                dnames: [], //子数据项名称集合
                series: [], //数据项对象
                legends: [] //数据项名称集合
            },
            fopt = fopt || ele.data('js_fopt') || {},
            dopt = dopt || ele.data('js_dopt') || {},
            _ismake = true;
        $.each(data || [], function (i, n) {
            var _data = $.extend(true, {}, n, {})['data'];
            $.each(_data || [], function (i2, n2) {
                var _name = dopt[n2['name']] ? dopt[n2['name']] : n2['name'];
                _data[i2]['name'] = _name;
                if (_ismake) {
                    d_['dnames'].push(_name);
                }
            });
            _ismake = false;
            var _series = $.extend(true, {}, fopt[n['cname']], {}) || {};
            _series['data'] = _data;
            d_['series'].push(_series);
            d_['legends'].push(_series['name']);
        });
        return d_;
    }

    function getOpt(ele, type, data, fopt, dopt, opt) {
        var opt_ = {};
        var d_ = getData(ele, data, fopt, dopt);
        opt_['series'] = d_['series'];
        var type = type || ele.data('js_type');
        if (type == 'bar' || type == 'line') { //柱状或折线
            opt_['yAxis'] = {
                type: 'value'
            };
            opt_['xAxis'] = {
                data: d_['dnames']
            };
            opt_['tooltip'] = {
                trigger: 'axis'
            };
            opt_['legend'] = {
                data: d_['legends']
            };
        } else if (type == 'pie' || type == 'funnel') { //饼状或漏斗图
            opt_['tooltip'] = {
                trigger: 'item'
            };
            opt_['legend'] = {
                data: d_['dnames']
            };
        }
        return $.extend(true, opt_, (opt || ele.data('js_opt') || {}));
    };

    function initData(dom_, myChart, type, data, fopt, dopt, opt) {
        var opt_ = {};
        if ($.type(data) == 'array') {
            opt_ = getOpt(dom_, type, data, fopt, dopt, opt);
            myChart.setOption(opt_);
        } else if ($.type(data) == 'string') {
            myChart.showLoading();
            $.ajax({
                type: data.split('||')[1] || "get",
                url: data.split('||')[0],
                async: true,
                cache: false,
                dataType: 'json',
                success: function (d_) {
                    myChart.hideLoading();
                    opt_ = getOpt(dom_, type, d_, fopt, dopt, opt);
                    myChart.setOption(opt_);
                }
            });
        } else if ($.type(data) == 'object') {
            myChart.showLoading();
            $.ajax({
                type: data.type || "get",
                url: data.url,
                data: data.data || {},
                async: true,
                cache: false,
                dataType: 'json',
                success: function (d_) {
                    myChart.hideLoading();
                    opt_ = getOpt(dom_, type, d_, fopt, dopt, opt);
                    myChart.setOption(opt_);
                }
            });
        } else {
            console.log('error');
        }
    };
    /**
     * @param {String} ele 图表容器选择器：'#demo01'
     * @param {String} type 图表类型  bar:柱状；pie:饼状;funnel:漏斗图;gauge:仪表盘;line:折线图
     * @param {Object} data 图标数据 data([array])或url,默认get请求，如需使用post,写成url||'post'形式
     * @param {Object} fopt 数据模型配置
     * @param {Object} dopt 数据项配置
     * @param {Object} opt 图表配置
     */
    that_.initOpt = function (ele, type, data, fopt, dopt, opt) {
        var dom_ = $(ele);
        var myChart = echarts.init(dom_[0]);
        dom_.data({
            'js_type': type,
            'js_fopt': fopt,
            'js_dopt': dopt,
            'js_opt': opt
        });
        initData(dom_, myChart, type, data, fopt, dopt, opt);
        return myChart;
    };
    that_.updateData = function (ele, data) {
        var dom_ = $(ele);
        initData(dom_, echarts.getInstanceByDom(dom_[0]), false, data, false, false, false);
    };
    return that_;
}();