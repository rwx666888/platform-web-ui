/*
 * 2018-03-16 @ccj
 * 创建带有 id 及 特殊属性 的 h1~h3 标题
 * 用于帮助系统锚点标记
 */
(function(){
    CKEDITOR.plugins.add( 'cusanchor', {
        requires: 'dialog,format', // 注意这里如果需要其他 组件 或 元素 关联，之前的 images 的问题估计是这
        icons: 'cusanchor',
        hidpi: true,
        init: function( editor ) {
            editor.addCommand( 'cusanchor', new CKEDITOR.dialogCommand( 'cusanchorDialog' ,{
                allowedContent: 'h1[*]; h2[*]; h3[*]', // 注意这里如果需要其他 组件 或 元素 关联，之前的 images 的问题估计是这
                requiredContent: 'h1; h2; h3'
            }) );
            
            editor.ui.addButton && editor.ui.addButton('Cusanchor', {
                label: '自定义标题锚点',
                command: 'cusanchor',
                toolbar: 'insert,50'
            });
            
            CKEDITOR.dialog.add( 'cusanchorDialog', this.path + 'dialogs/cusanchor.js' );
        }
    });
})();
