/*
 * 2018-03-16 @ccj
 * 创建带有 id 及 特殊属性 的 h1~h3 标题
 * 用于帮助系统锚点标记
 */
(function () {
    CKEDITOR.plugins.add('cus_anchor', {
        requires: 'format', // 注意这里如果需要其他 组件 或 元素 关联
        icons: 'cus_anchor',
        hidpi: false,
        init: function (editor) {
            editor.addCommand('cus_anchor', {
                exec: function (editor) {
                    if ($('#the_jstree_box_dig').length) {
                        cumCurWinModal('自定义锚点', $('#the_jstree_box_dig'), self, {
                            area: ['400px', '200px'],
                            type: 1,
                            success: function (lay, ind) {
                                var sel_element = editor.elementPath().lastElement;
                                var sel_etagName = sel_element.getName();
                                var check_flag = !sel_etagName || $.inArray(sel_etagName, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'em', 's', 'u', 'span', 'strong']) == -1;
                                if (!check_flag) {
                                    var sel_node = $(sel_element.$); //当前选中节点dom
                                    var cur_id = sel_node.attr('id') || '';
                                    $('#t_jstree_box_val').val(cur_id);
                                    $('#the_jstree_box_btn').on('click.cus', function () {
                                        sel_element.setAttribute('id', $('#t_jstree_box_val').val() || '');
                                        layer.close(ind);
                                    });
                                } else {
                                    COM_TOOLS.alert('该类型元素，不能设置锚点！');
                                }
                            },
                            end: function () {
                                $('#the_jstree_box_btn').off('click.cus');
                                $('#t_jstree_box_val').val('');
                            }
                        });
                    } else {
                        COM_TOOLS.alert('私有定制插件，当前场景不可用！');
                    }
                },
                allowedContent: 'h1[id]; h2[id]; h3[id];h4[id]; h5[id]; h6[id]; p[id];s[id];u[id];em[id];strong[id]; span[id]'
            });
            editor.ui.addButton && editor.ui.addButton('cus_anchor', {
                label: '自定义锚点',
                command: 'cus_anchor',
                toolbar: 'insert,51'
            });

        }
    });
})();