/*
 * 2018-03-16 @ccj
 * 添加自定义的HTML模板
 */
(function() {
    CKEDITOR.plugins.add('cushtml', {
        requires: 'fakeobjects',
        icons: 'cushtml',
        hidpi: true,
        onLoad: function() {
            CKEDITOR.addCss('img.cke_cus_div' +
                '{' +
                'background-image: url(' + CKEDITOR.getUrl(this.path + 'images/placeholder.png') + ');' +
                'background-position: center center;' +
                'background-repeat: no-repeat;' +
                'border: 1px solid #dddd;' +
                'margin-right: 10px;' +
                'width: 310px;' +
                'height: 160px;' +
                '}'
            );
        },
        init: function(editor) {
            var config_ = editor.config;
            var cushtmldom = config_.cushtmldom;

            editor.addCommand('cushtml', {
                allowedContent: 'div(*)[*];ul(*)[*];li(*)[*];a(*)[*];h4(*)[*];span(*)[*];img(*)[*];em(*)[*]', // 注意这里
                exec: function(editor) {
                    // 方法调用
                    COM_TOOLS.private_obj_.ck_cushtml && COM_TOOLS.private_obj_.ck_cushtml(editor);
                }
            });

            editor.ui.addButton && editor.ui.addButton('Cushtml', {
                label: 'HTML模板',
                command: 'cushtml',
                toolbar: 'insert,60'
            });

            editor.on('doubleclick', function(evt) {
                var ele = evt.data.element;
                if (ele.is('img') && ele.hasClass('cke_cus_div') && ele.data('cke-real-element-type') == 'div') {
                    var r_ele = editor.restoreRealElement(ele);
                    COM_TOOLS.private_obj_.ck_cushtml && COM_TOOLS.private_obj_.ck_cushtml(editor, r_ele);
                }
            });
        },
        afterInit: function(editor) {
            var dataProcessor = editor.dataProcessor,
                dataFilter = dataProcessor && dataProcessor.dataFilter;
            if (dataFilter) {
                dataFilter.addRules({
                    elements: {
                        div: function(element) {
                            return editor.createFakeParserElement(element, 'cke_cus_div', 'div', true);
                        }
                    }
                });
            }
        }
    });
})();

// 
var CUSHTML_TOOLS = {
    /**
     * 按 name 时间戳 随机数 生成唯一 ID
     */
    getRandomID: function(name) {
        return (name + '_' + new Date().getTime() + '_' + COM_TOOLS.get_random_fun(5));
    },
    /**
     * 构建 CK 的 FakeImage 对象
     * @param  {[type]} editor    [CK 实例]
     * @param  {[type]} ck_ele    [以生成的旧的 div 对象]
     * @param  {[type]} cachename [div 的名称，用于数据缓存和构造 class]
     * @param  {[type]} s_data    [所选择的 DT 数据源]
     */
    creatCKelement: function(editor, ck_ele, cachename, s_data, create_fn) {
        var r_html = '';
        if (ck_ele && !$.isEmptyObject(ck_ele)) { // 修改
            r_html = create_fn && create_fn(s_data, ck_ele); // 这里是 对象形势
        } else {
            r_html = create_fn && create_fn(s_data);
        }

        var d_node = new CKEDITOR.dom.element('div');
        d_node.setAttributes({ 'class': cachename });
        var fake_img = editor.createFakeElement(d_node, 'cke_cus_div', 'div', true);
        if (r_html.length) {
            r_html = '<div class="cus_ts_01">' + r_html + '</div>'; // 注意这里
            fake_img.data('cke-realelement', encodeURIComponent(r_html));
            editor.insertElement(fake_img);
        } else {
            console.warn('realhtml 构建失败！');
        }
    },
    /**
     * 安装传入的方法，构造实际的 HTML 结构
     * @param  {[type]} ckeditor   [CK 实例]
     * @param  {[type]} cachename  [div 的名称，用于数据缓存和构造 class]
     * @param  {[type]} cache_data [用于缓存的 DT 数据的对象]
     * @param  {[type]} create_fn  [实际生成 HTML 的方法]
     */
    replaceHTML: function(ckeditor, cachename, cache_data, create_fn) {
        if (create_fn && $.type(create_fn) != 'function') {
            console.warn('缺少构建 HTML 结构的 create_fn 方法');
            return false;
        }
        var s_html = ckeditor.getData();
        var div_ = $('<div></div>');
        if (s_html.length > 7) {
            var $html = div_.append($(s_html));
            var t_ = $html.find('.' + cachename);
            if (t_.length) {
                $.each(t_, function(i, n) {
                    var t_ = $(n);
                    if (t_.children().length == 1) {
                        var t_sobj = $(n).find('.js-ck-cache-obj');
                        var t_id = t_sobj.attr('id');
                        if (t_id && cache_data[t_id] && cache_data[t_id].length) {
                            create_fn && t_sobj.before(create_fn(cache_data[t_id]));
                        }
                    }
                });
            }
        }
        s_html = ($html && $html.html().replace(/(<p><\/p>|<p>\n<\/p>|<p>&nbsp;<\/p>)/g, '')) || '';
        return s_html;
    }
};