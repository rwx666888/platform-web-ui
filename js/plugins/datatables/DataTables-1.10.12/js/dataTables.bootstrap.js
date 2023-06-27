/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/**
 * 分页插件添加跳转至控件 2018-3-30 
 * @lianglei
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm",
	sProcessing:   "dataTables_processing panel panel-default"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;
	
	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			var page_ = e.data.action; //添加页码跳转框事件  @lianglei
			if($(e.currentTarget).is('.js-btn') && (page_ == 'cusPageInput' || page_ == 'cusPageInputAndPages')){
			    var curPage_ = Number($.trim($(e.currentTarget).parent('a').children('.js-input').val())) || 1;
			    if(!/^[0-9]+$/.test(curPage_)){
			        curPage_ = 1
			    }
			    if(curPage_ > pages){
			        curPage_ = pages;
			    }
			    if(curPage_ < 1){
                    curPage_ = 1;
                }
			    $(e.currentTarget).parent('a').children('.js-input').val(curPage_);
			    page_ = curPage_-1;
			}
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != page_ ) {
				api.page( page_ ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;
				    
				    case 'cusPageInput': //添加页码跳转框  @lianglei
                        btnDisplay = lang.btnToPage;
                        btnClass = 'cus-page-input';
                        break;
                    
                    case 'cusPageInputAndPages': //添加页码跳转框  @lianglei
                        btnDisplay = lang.btnToPage;
                        btnClass = 'cus-page-input';
                        break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
				    
				    //添加页码跳转框  @lianglei
			        var isPageInput_ = button == 'cusPageInput' || button == 'cusPageInputAndPages',
			            $thisBtn_ = '',
			            $thisInput = '';
			        if(isPageInput_){ //如果是跳转页按钮
			            $thisBtn_ = $('<button type="button" class="btn btn-default btn-xs js-btn"/>').text(btnDisplay);
			            $thisInput = $('<input type="text" maxlength="10" value="'+ (1 + Number(page) )+'" class="form-control input-sm js-input"/>')
			                         .focus(function(){
			                             if(this.defaultValue == $(this).val()){
			                                 $(this).val('');
			                             }
			                         }).blur(function(){
			                             if($(this).val() == ''){
                                             $(this).val(this.defaultValue);
                                         }
			                         }).on('keypress',function(e){ //回车事件
			                             if(e.which == 13){
			                                 $thisBtn_.trigger('click');
			                             }
			                         });
			        }
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( !isPageInput_ ? btnDisplay : (button == 'cusPageInputAndPages' ? 
							     $thisInput.add('<span>&nbsp;/&nbsp;' + pages + '&nbsp;</span>').add($thisBtn_) : $thisInput.add($thisBtn_))
							).click(function(e){ //禁用A的默认行为 @lianglei
							    e.preventDefault();
							}).on('dragstart',function(){ //禁用链接拖拽 @lianglei
							    return false;
							})
						)
						.appendTo( container );
				    
					settings.oApi._fnBindAction(
						!isPageInput_ ? node : $thisBtn_, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


return DataTable;
}));