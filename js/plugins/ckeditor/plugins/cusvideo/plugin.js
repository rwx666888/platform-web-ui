CKEDITOR.tools.createImageData = function(dimensions) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"></svg>');
};

CKEDITOR.plugins.add('cusvideo', {
  requires: 'dialog,fakeobjects',
  lang: 'zh-cn',
  icons: 'video',
  hidpi: true,
  onLoad: function() {
    if (!$('#upmp4-ck-dialog').length) {
      $('head').append('<style id="upmp4-ck-dialog">\n' +
        '        .upmp4box {padding: 20px;box-sizing: border-box}\n' +
        '        .upmp4box .d1,.upmp4box .d2{\n' +
        '            display: flex;\n' +
        '            height: 30px;\n' +
        '            overflow: hidden;\n' +
        '        }\n' +
        '        .upmp4box input {\n' +
        '            height: 100%;\n' +
        '            border: 1px solid #ccc;\n' +
        '            box-sizing: border-box;\n' +
        '            padding: 0 10px;\n' +
        '        }\n' +
        '        .upmp4box .d1 {\n' +
        '            margin-bottom: 20px;\n' +
        '        }\n' +
        '        .upmp4box .d2 input {\n' +
        '            width: 100px;\n' +
        '        }\n' +
        '        .upmp4box .btnbn {\n' +
        '            background: #23c6c8;\n' +
        '            color: #fff;\n' +
        '            padding: 8px;\n' +
        '        }\n' +
        '        .upmp4box .p-div {\n' +
        '            display: flex;\n' +
        '        }\n' +
        '    </style>')
    }
    var url = CKEDITOR.getUrl(this.path + 'images/placeholder.png');
    CKEDITOR.addCss('img.cke-video{background:#f8f8f8 url(' + url +
      ') center center no-repeat;background-size:100% 100%;outline:1px solid #ccc;outline-offset:-1px;min-width:92px;min-height:50px;max-width:100%;width:auto!important;height:auto!important;}'
    );
  },

  init: function(editor) {
    editor.addCommand('cusvideo', new CKEDITOR.dialogCommand('cusvideo', {
      allowedContent: 'video[autoplay,controls,height,loop,muted,preload,!src,width]'
    }));
    editor.ui.addButton('Cusvideo', {
      label: editor.lang.cusvideo.button,
      command: 'cusvideo',
      icon: this.path + 'icons/video.png',
      toolbar: 'insert,67'
    });
    // CKEDITOR.dialog.add('video', this.path + 'dialogs/video.js');
    var clearPreview = function(dialog) {
      mp4dom()
      p_.find('input').val('');
    };

    var p_, ipt1, ipt2, ipt3, ipt4;
    var isupd = true;

    function mp4dom() {
      p_ = $('#mp4box');
      ipt1 = p_.find('.js-ipt1');
      ipt2 = p_.find('.js-ipt2');
      ipt4 = p_.find('.js-inp-file');
      ipt3 = p_.find('.js-ipt3');
    }
    CKEDITOR.dialog.add('cusvideo', function(editor) {
      return {
        title: editor.lang.cusvideo.title,
        width: 300,
        height: 125,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [{
          id: 'info',
          label: editor.lang.common.generalTab,
          elements: [{
            id: 'preview',
            type: 'html',
            html: '<div id="mp4box" class="upmp4box">\n' +
              '        <div class="d1">\n' +
              '            <div>选择：</div>\n' +
              '            <div class="p-div"><input class="js-inp-file hidden" type="file"/><input class="js-ipt1" type="text" style="background:#ddd;width: 191px;cursor:pointer;" readonly><span class="btnbn js-btn-add" style="cursor: pointer;">选择视频</span></div>\n' +
              '        </div>\n' +
              '        <div class="d2">\n' +
              '            <div style="margin-right: 20px;">宽度：<input  class="js-ipt2" type="text"></div>\n' +
              '            <div>高度：<input class="js-ipt3" type="text"></div>\n' +
              '        </div>\n' +
              '    </div>',
            setup: function(ele) {
              mp4dom();
              ipt2.val($(ele).attr('width'));
              ipt1.val($(ele).attr('src'));
              ipt3.val($(ele).attr('height'));
            }
          }]
        }],
        onLoad: function() {
          mp4dom();
          $('#mp4box').off().on('click.upmp4', '.js-btn-add', function(e) {
            e.preventDefault();
            ipt4.trigger('click');
          }).on('change.ck-inp', '.js-inp-file', function(event) {
            event.preventDefault();
            var t_files = this.files[0];
            this.value = ''; // 清除

            var filesize = (editor.config.fileUploadMaxSize || 3 * 1024) * 1024, // KB
              filetype_arr = ["mp4"], // 文件类型
              filetype = t_files.name.split('.')[(t_files.name.split('.').length - 1)];

            if (t_files) {
              // 错误判断
              if (filesize < t_files.size) {
                COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.size_exceed', Math.ceil(
                  filesize / 1024)));
                return false;
              } else if (!new RegExp('^(' + filetype_arr.join('|') + ')$', 'i').test(filetype)) {
                COM_TOOLS.alert2(TEDU_MESSAGE.get('platform.plugin.com_msg.type_err', filetype_arr.join(
                  '|')));
                return false;
              }

              var f_formData = new FormData();
              f_formData.append('upload', t_files);
              COM_TOOLS.loadingShade.open();
              $.ajax({
                type: "post",
                dataType: "json",
                url: editor.config.imageUploadUrl,
                data: f_formData,
                processData: false,
                contentType: false,
                cache: false,
                success: function(res) {
                  COM_TOOLS.loadingShade.close();
                  if (!$.isEmptyObject(res)) {
                    // res_obj = res;
                    // 文件名
                    ipt1.val(res.url);
                    console.log('/*/*/*/*', res)
                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_success']);
                  } else {
                    COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
                  }
                }
              }).fail(function() {
                COM_TOOLS.loadingShade.close();
                COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
              });
            } else {
              COM_TOOLS.alert(LOCAL_MESSAGE_DATA['platform.plugin.com_msg.up_error']);
            }
          })

        },
        onShow: function() {
          var element = this.getSelectedElement();
          if (element && element.data('cke-real-element-type') == 'video') {
            var realElement = editor.restoreRealElement(element);
            this.setupContent(realElement);
            // updatePreview(this);
          }
        },
        onOk: function() {
          mp4dom();
          var dialog = this;
          if (ipt1.val()) {
            var realElement = CKEDITOR.dom.element.createFromHtml('<cke:video></cke:video>', editor.document);
            realElement.setAttributes({
              // preload: 'metadata',
              // width: metadata.width,
              // height: metadata.height
              src: ipt1.val(),
              width: ipt2.val(),
              height: ipt3.val()
            });
            dialog.commitContent(realElement);
            var element = editor.createFakeElement(realElement, 'cke-video', 'video', false);
            editor.insertElement(element);
            dialog.hide();
            return;
          } else {
            COM_TOOLS.alert(editor.lang.cusvideo.invalidSrc);

          }
          return false;
        },
        onHide: function() {
          clearPreview(this);
        },
      };
    });
    editor.on('doubleclick', function(e) {
      var element = e.data.element;
      if (element && element.is('img') && !element.isReadOnly() && element.data('cke-real-element-type') ==
        'video') {
        e.data.dialog = 'cusvideo';
      }
    });
    if (editor.addMenuItems) {
      editor.addMenuGroup('cusvideo', 11);
      editor.addMenuItems({
        cusvideo: {
          label: editor.lang.cusvideo.title,
          command: 'cusvideo',
          group: 'cusvideo'
        }
      });
    }
    if (editor.contextMenu) {
      editor.contextMenu.addListener(function(element) {
        if (element && element.is('img') && !element.isReadOnly() && element.data('cke-real-element-type') ==
          'video') {
          return {
            video: CKEDITOR.TRISTATE_OFF
          };
        }
      });
    }
    editor.filter.addElementCallback(function(element) {
      if (element.name == 'cke:video') {
        return CKEDITOR.FILTER_SKIP_TREE;
      }
    });
    editor.lang.fakeobjects.video = editor.lang.cusvideo.button;
  },
  afterInit: function(editor) {
    editor.on('toHtml', function(e) {
      var html = e.data.dataValue;
      html = html.replace(/(<\/?)video\b/gi, '$1cke:video');
      e.data.dataValue = html;
    }, null, null, 1);
    var dataProcessor = editor.dataProcessor;
    var dataFilter = dataProcessor && dataProcessor.dataFilter;
    if (dataFilter) {
      dataFilter.addRules({
        elements: {
          'cke:video': function(element) {
            console.log('eeeeee=', element)
            var attributes = CKEDITOR.tools.extend({}, element.attributes);
            element = editor.createFakeParserElement(element, 'cke-video', 'video', false);
            element.attributes.src = CKEDITOR.tools.createImageData(attributes);
            return element;
          }
        }
      });
    }
  }
});
