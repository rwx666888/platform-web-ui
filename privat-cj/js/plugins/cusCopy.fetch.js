;(function (window) {
  function selectFack(text, cb) {
    // select
    function select(element) {
      var selectedText

      if (element.nodeName === 'SELECT') {
        element.focus()

        selectedText = element.value
      } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly')

        if (!isReadOnly) {
          element.setAttribute('readonly', '')
        }

        element.select()
        element.setSelectionRange(0, element.value.length)

        if (!isReadOnly) {
          element.removeAttribute('readonly')
        }

        selectedText = element.value
      } else {
        if (element.hasAttribute('contenteditable')) {
          element.focus()
        }

        var selection = window.getSelection()
        var range = document.createRange()

        range.selectNodeContents(element)
        selection.removeAllRanges()
        selection.addRange(range)

        selectedText = selection.toString()
      }

      return selectedText
    }
    // copy
    function copyText(action) {
      var succeeded

      try {
        succeeded = document.execCommand(action)
        cb && cb()
      } catch (err) {
        console.error(succeeded)
      }
      return succeeded
    }

    var isRTL = document.documentElement.getAttribute('dir') == 'rtl'

    var fakeElem = document.createElement('textarea')
    // Prevent zooming on iOS
    fakeElem.style.fontSize = '12pt'
    // Reset box model
    fakeElem.style.border = '0'
    fakeElem.style.padding = '0'
    fakeElem.style.margin = '0'
    // Move element out of screen horizontally
    fakeElem.style.position = 'absolute'
    fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px'
    // Move element to the same position vertically
    var yPosition = window.pageYOffset || document.documentElement.scrollTop
    fakeElem.style.top = yPosition + 'px'

    fakeElem.setAttribute('readonly', '')
    fakeElem.value = text
    // create dom
    document.getElementsByTagName('body')[0].appendChild(fakeElem)
    // 调用 select
    select(fakeElem)

    var res_ = ''
    if (document.queryCommandSupported('copy')) {
      // 调用 copy 命令
      res_ = copyText('copy')
    } else {
      res_ = '-浏览器不支持-'
    }
    return res_
  }
  window.copyText = selectFack
})(window)
