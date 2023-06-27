/*
 * 2018-03-16 @ccj
 * 创建带有 id 及 特殊属性 的 h1~h3 标题
 * 用于帮助系统锚点标记
 */
(function() {
    CKEDITOR.plugins.add('cus_anchor', {
        requires: 'format', // 注意这里如果需要其他 组件 或 元素 关联
        icons: 'cus_anchor',
        hidpi: false,
        init: function(editor) {
            editor.addCommand('cus_anchor', {
                exec: function(editor) {
                    var JSTREE_ = null;
                    var jstree_box = $('#the_jstree_box');
                    var jstree_box_msg = $('#the_jstree_box_msg');
                    jstree_box.hide();
                    cumCurWinModal('自定义锚点', $('#the_jstree_box_dig'), self, {
                        area: ['400px', '200px'],
                        type: 1,
                        success: function(lay, ind) {
                            var sel_element = editor.elementPath().lastElement;
                            var sel_etagName = sel_element.getName();
                            var check_flag = !sel_etagName || $.inArray(sel_etagName, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']) == -1;
                            if(check_flag) {
                                console.log('@@-body', sel_etagName, JSTREE_);
                                jstree_box_msg.show();
                                return false;
                            }
                            jstree_box.show();
                            jstree_box_msg.hide();
                            console.log('@@-body-22', sel_etagName, JSTREE_)
                            var sel_node = $(sel_element.$);
                            var cur_id = sel_node.attr('id') || '';
                            JSTREE_ = COM_TOOLS.jstree_init('the_jstree_box', {
                                url: '/jstree7/api',
                                other: {
                                    core: {
                                        multiple: false
                                    }
                                },
                                ids: cur_id ? [cur_id] : '',
                                initCallback: function() {

                                    JSTREE_.changeCallback(function() {
                                        var t_node = JSTREE_.get_selected(true)[0];
                                        console.log(t_node)
                                        var style_ = new CKEDITOR.style({
                                            element: 'h' + t_node.li_attr.lever,
                                            attributes: {
                                                'id': t_node.id, // 注:使用 id 字段时,只有第一个添加成功
                                                'cus-lever': t_node.li_attr.lever,
                                                'data-target': 'thisboox'
                                            }
                                        });
                                        editor.applyStyle(style_);
                                    });
                                }
                            });
                            console.log('@@-22', cur_id, sel_node)

                            cur_id && JSTREE_.select_node([cur_id], true);

                            window.yyy = JSTREE_;

                        },
                        end: function() {
                            JSTREE_ && JSTREE_.deselect_all(true);
                        }
                    });
                },
                allowedContent: 'h1[*]; h2[*]; h3[*]; p[*]'
            });
            editor.ui.addButton && editor.ui.addButton('cus_anchor', {
                label: '自定义标题锚点2',
                command: 'cus_anchor',
                toolbar: 'insert,51'
            });

        }
    });
})();