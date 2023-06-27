(function(){
    CKEDITOR.dialog.add( 'cusanchorDialog', function ( editor ) {
        var _source_data = {};
        function createOpt(obj, val, s_data){
            for(var k in s_data){
                obj.add(s_data[k].name, k);
            }
            obj.enable();
        }
        return {
            title: '标题锚点',
            minWidth: 400,
            minHeight: 200,
            contents: [{
                id: 'cus_anchor',
                label: '标题锚点',
                title: '标题锚点',
                elements: [{
                    id: 'title_id_first',
                    type: 'select',
                    label: '第一级资源',
                    style: 'width: 390px !important',
                    items: data_anchor_first,
                    onChange: function(evt){
                        var id_second = this.getDialog().getContentElement( 'cus_anchor', 'title_id_second' );
                        var id_thirdly = this.getDialog().getContentElement( 'cus_anchor', 'title_id_thirdly' );
                        
                        id_second.clear();
                        id_thirdly.clear();
                        id_second.add('','');
                        
                        var o_data = data_anchor[evt.data.value] || {};
                        createOpt(id_second, evt.data.value, o_data.child);
                    },
                    setup: function( data ){
                        this.setValue(data.first_id);
                    },
                    commit: function( data ){
                        data.select_text = editor.getSelection().getSelectedText() || '';
                        data.first_id = this.getValue();
                    }
                },{
                    id: 'title_id_second',
                    type: 'select',
                    label: '第二级资源',
                    style: 'width: 390px !important',
                    items: [],
                    onChange: function(evt){
                        
                        var id_fisrt = this.getDialog().getContentElement( 'cus_anchor', 'title_id_first' );
                        var id_thirdly = this.getDialog().getContentElement( 'cus_anchor', 'title_id_thirdly' );
                        
                        id_thirdly.disable();
                        id_thirdly.clear();
                        id_thirdly.add('', '');
                        
                        var o_data = data_anchor[id_fisrt.getValue()].child[evt.data.value] || {};
                        createOpt(id_thirdly, evt.data.value, o_data.child);
                    },
                    setup: function( data ){
                        this.setValue(data.second_id);
                    },
                    commit: function( data ){
                        data.second_id = this.getValue();
                    }
                },{
                    id: 'title_id_thirdly',
                    type: 'select',
                    label: '第三级资源',
                    style: 'width: 390px !important',
                    items: [],
                    setup: function( data ){
                        this.setValue(data.thirdly_id);
                    },
                    commit: function( data ){
                        data.thirdly_id = this.getValue();
                    }
                }]
            }],
            onShow: function(){
                var editor = this.getParentEditor(), // 获取打开此对话框的编辑器实例
                    selection = editor.getSelection();
                var range_  = selection.getRanges()[0];
                
                this.getContentElement( 'cus_anchor', 'title_id_second' ).clear();
                this.getContentElement( 'cus_anchor', 'title_id_thirdly' ).clear();
                range_ && range_.shrink( CKEDITOR.SHRINK_ELEMENT );
                elements = editor.elementPath( range_.getCommonAncestor() ).contains( ['h1', 'h2', 'h3'], true );
                if(elements && !range_.collapsed){
                    var s_data = elements.getAttribute('sourcedata');
                    if(s_data){
                        _source_data = s_data;
                        s_data = s_data.split(',');
                        var data = {
                            first_id: s_data[0] || '',
                            second_id: s_data[1] || '',
                            thirdly_id: s_data[2] || ''
                        }
                        this.setupContent( data );
                    }
                }
            },
            onOk: function(){
                var data = {}; // 提交是数据存储用
                this.commitContent( data ); // 触发各元素的数据提交
                
                var ranges_ = editor.getSelection().getRanges();
                var rangesToSelect = [];
                
                for(var i = 0, len = ranges_.length; i < len; i++){
                    var c_range = ranges_[ i ];
                    
                    if( !c_range.collapsed && data.select_text && data.first_id){ // 选中了
                        var s_type = 'h1',
                            c_id = data.first_id;
                            
                        if(data.thirdly_id){
                            s_type = 'h3';
                            c_id = data.thirdly_id;
                        }else if(data.second_id){
                            s_type = 'h2';
                            c_id = data.second_id;
                        }
                        
                        var s_html = data.first_id;
                        if(data.second_id){
                            s_html += ',' + data.second_id;
                        }
                        if(data.thirdly_id){
                            s_html += ',' + data.thirdly_id;
                        }
                        console.log('c_id', c_id);
                        var style_ = new CKEDITOR.style({
                            element: s_type,
                            attributes: {
                                cid: c_id, // 注:使用 id 字段时,只有第一个添加成功
                                pid: data.first_id,
                                sourcedata: s_html
                            }
                        });
                        
                        var text_ = new CKEDITOR.dom.text( data.select_text, editor.document );
                        c_range.shrink( CKEDITOR.SHRINK_TEXT );
                        editor.editable().extractHtmlFromRange( c_range );
                        
                        c_range.insertNode( text_ );
                        style_.applyToRange( c_range, editor );
                        
                        rangesToSelect.push(c_range);
                    }
                }
                editor.getSelection().selectRanges( rangesToSelect );
            }
        };
    });
})();
