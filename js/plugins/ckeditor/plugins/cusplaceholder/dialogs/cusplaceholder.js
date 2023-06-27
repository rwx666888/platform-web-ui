'use strict';

CKEDITOR.dialog.add('cusplaceholder', function(editor) {
  var lang = editor.lang.cusplaceholder,
    extradata = editor.config.cusData.cusplaceholder,
    generalLabel = editor.lang.common.generalTab;
  return {
    title: lang.title,
    minWidth: 300,
    minHeight: 80,
    contents: [{
      id: 'info',
      label: generalLabel,
      title: generalLabel,
      elements: [{
        type: 'select',
        id: 'name',
        label: extradata.label,
        items: extradata.items,
        validate: function() {
          if (!this.getValue()) {
            COM_TOOLS.alert2(lang.invalidName);
            return false;
          }
        },
        'default': '',
        setup: function(widget) {
          this.setValue(widget.data.name);
        },
        commit: function(widget) {
          widget.setData('name', this.getValue());
        }
      }]
    }],
    onShow: function(d){
      var element = this.getSelectedElement();
      console.log('$$$$', element.$);
    }
  };
});
