/* 标签滚动 */
COM_TOOLS._view.tabScrollFn = {
    dom_: {
        ul_: $(),
        overBox_: $(),
    },
    sumWidth: function (ele) { //计算元素总宽度
        var width_ = 0;
        $(ele).each(function () {
            width_ += $(this).outerWidth();
        });
        return width_;
    },
    scrollTabLeft: function () { //往左按钮
        var marginLeftVal = Math.abs(parseInt(this.dom_.ul_.css('margin-left'))),
            visibleWidth = this.dom_.overBox_.width(),
            scrollVal = 0;
        if (this.dom_.ul_.width() < visibleWidth) { //内容宽度 小于 可视宽度
            return false;
        } else {
            var tabEle = this.dom_.ul_.find("li:first"),
                offsetVal = 0; //计算距离用的
            while ((offsetVal + $(tabEle).outerWidth()) <= marginLeftVal) { //离 mar 的距离，最近的那个 dom 元素
                offsetVal += $(tabEle).outerWidth();
                tabEle = $(tabEle).next(); //大于 marginLeftVal 的那个
            } //所以 tabElement 的最后结果是 >= marginLeftVal 的那个
            offsetVal = 0;
            if (this.sumWidth($(tabEle).prevAll()) > visibleWidth) { //滚动距离大于一页时
                while ((offsetVal + $(tabEle).outerWidth()) < (visibleWidth) && tabEle.length > 0) {
                    offsetVal += $(tabEle).outerWidth();
                    tabEle = $(tabEle).prev(); //
                } //所以 tabElement 的最后结果是 > visibleWidth 的那个
                scrollVal = this.sumWidth($(tabEle).prevAll()); ////找到临界值的那个 dom 并计算它之前的距离，所有会包含它本身
            }
        }
        this.dom_.ul_.animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    },
    scrollTabRight: function () { //往右按钮
        var marginLeftVal = Math.abs(parseInt(this.dom_.ul_.css('margin-left'))),
            visibleWidth = this.dom_.overBox_.width(),
            scrollVal = 0;
        if (this.dom_.ul_.width() < visibleWidth) {
            return false;
        } else {
            var tabEle = this.dom_.ul_.find("li:first"),
                offsetVal = 0;
            while ((offsetVal + $(tabEle).outerWidth()) <= marginLeftVal) { //离 mar 的距离，最近的那个 dom 元素
                offsetVal += $(tabEle).outerWidth();
                tabEle = $(tabEle).next();
            }
            if (offsetVal < (this.dom_.ul_.outerWidth() - visibleWidth)) { //防止最后一个dom元素已经显示出来，还继续滚动
                offsetVal = 0;
                while ((offsetVal + $(tabEle).outerWidth()) < (visibleWidth) && tabEle.length > 0) {
                    offsetVal += $(tabEle).outerWidth();
                    tabEle = $(tabEle).next();
                }
            }
            scrollVal = this.sumWidth($(tabEle).prevAll()); //找到临界值的那个 dom 并计算它之前的距离，所有会包含它本身
            if (scrollVal > 0) {
                this.dom_.ul_.animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        }
    },
    scrollToTab: function (ele) { //点击tab标签
        var marginLeftVal = this.sumWidth($(ele).prevAll()),
            marginRightVal = this.sumWidth($(ele).nextAll()),
            visibleWidth = this.dom_.overBox_.width(),
            scrollVal = 0;
        if (this.dom_.ul_.outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - ($(ele).outerWidth() + $(ele).next().outerWidth()))) { //靠右边
            if ((visibleWidth - $(ele).next().outerWidth()) > marginRightVal) {
                scrollVal = marginLeftVal; //注意这里
                var tabEle = ele;
                while ((scrollVal - $(tabEle).outerWidth()) >= (this.dom_.ul_.outerWidth() - visibleWidth) /* 被隐藏的部分距离 */ ) {
                    scrollVal -= $(tabEle).prev().outerWidth();
                    tabEle = $(tabEle).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - ($(ele).outerWidth() + $(ele).prev().outerWidth()))) { //靠左边,包括中间
            scrollVal = marginLeftVal - $(ele).prev().outerWidth();
        }
        this.dom_.ul_.animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    },
    init: function (selector) { //绑定及初始化
        var cont_ = $(selector),
            that = this;
        this.dom_ = {
            ul_: cont_.find('.tab-list-ul'),
            overBox_: cont_.find('.tab-list-overflow')
        }
        cont_.on('click', '.tab-list-ul li', function () {
            that.scrollToTab($(this));
        }).on('click', '.tab-left-btn', function () {
            that.scrollTabLeft();
        }).on('click', '.tab-right-btn', function () {
            that.scrollTabRight();
        });
    }
};