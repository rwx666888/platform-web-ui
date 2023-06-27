'use strict';

( function() {
    CKEDITOR.plugins.add( 'cusplaceholder', {
        requires: 'widget,dialog',
        lang: 'zh,zh-cn', // %REMOVE_LINE_CORE%
        icons: 'cusplaceholder', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%

        onLoad: function() {
            // Register styles for cusplaceholder widget frame.
            CKEDITOR.addCss( '.cke_cusplaceholder{background-color:#ff0}' );
        },

        init: function( editor ) {

            var lang = editor.lang.cusplaceholder;

            // Register dialog.
            CKEDITOR.dialog.add( 'cusplaceholder', this.path + 'dialogs/cusplaceholder.js' );

            // Put ur init code here.
            editor.widgets.add( 'cusplaceholder', {
                // Widget code.
                dialog: 'cusplaceholder',
                pathName: lang.pathName,
                // We need to have wrapping element, otherwise there are issues in
                // add dialog.
                template: '<span class="cke_cusplaceholder">${}</span>',

                downcast: function() {
                    return new CKEDITOR.htmlParser.text( '${' + this.data.name + '}' );
                },

                init: function() {
                    // Note that cusplaceholder markup characters are stripped for the name.
                    this.setData( 'name', this.element.getText().slice( 2, -1 ) );
                },

                data: function() {
                    this.element.setText( '${' + this.data.name + '}' );
                },

                getLabel: function() {
                    return this.editor.lang.widget.label.replace( /%1/, this.data.name + ' ' + this.pathName );
                }
            } );

            editor.ui.addButton && editor.ui.addButton( 'Cusplaceholder', {
                label: lang.toolbar,
                command: 'cusplaceholder',
                toolbar: 'insert,6',
                icon: 'cusplaceholder'
            } );
        },

        afterInit: function( editor ) {
            var placeholderReplaceRegex = /\$\{([^\{\}\$])+\}/g;

            editor.dataProcessor.dataFilter.addRules( {
                text: function( text, node ) {
                    var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];

                    // Skip the case when cusplaceholder is in elements like <title> or <textarea>
                    // but upcast cusplaceholder in custom elements (no DTD).
                    if ( dtd && !dtd.span )
                        return;

                    return text.replace( placeholderReplaceRegex, function( match ) {
                        // Creating widget code.
                        var widgetWrapper = null,
                            innerElement = new CKEDITOR.htmlParser.element( 'span', {
                                'class': 'cke_cusplaceholder'
                            } );

                        // Adds cusplaceholder identifier as innertext.
                        innerElement.add( new CKEDITOR.htmlParser.text( match ) );
                        widgetWrapper = editor.widgets.wrapElement( innerElement, 'cusplaceholder' );

                        // Return outerhtml of widget wrapper so it will be placed
                        // as replacement.
                        return widgetWrapper.getOuterHtml();
                    } );
                }
            } );
        }
    } );

} )();
