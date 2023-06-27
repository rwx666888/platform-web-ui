///<jscompress sourcefile="bootstrap-hover-dropdown.js" />
/**
 * @preserve
 * Project: Bootstrap Hover Dropdown
 * Author: Cameron Spear
 * Version: v2.2.1
 * Contributors: Mattia Larentis
 * Dependencies: Bootstrap's Dropdown plugin, jQuery
 * Description: A simple plugin to enable Bootstrap dropdowns to active on hover and provide a nice user experience.
 * License: MIT
 * Homepage: http://cameronspear.com/blog/bootstrap-dropdown-on-hover-plugin/
 */
;(function ($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();

    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function (options) {
        // don't do anything if touch is supported
        // (plugin causes some issues on mobile)
        if('ontouchstart' in document) return this; // don't want to affect chaining

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(function () {
            var $this = $(this),
                $parent = $this.parent(),
                defaults = {
                    delay: 500,
                    hoverDelay: 0,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    hoverDelay: $(this).data('hover-delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                showEvent   = 'show.bs.dropdown',
                hideEvent   = 'hide.bs.dropdown',
                // shownEvent  = 'shown.bs.dropdown',
                // hiddenEvent = 'hidden.bs.dropdown',
                settings = $.extend(true, {}, defaults, options, data),
                timeout, timeoutHover;

            $parent.hover(function (event) {
                // so a neighbor can't open the dropdown
                if(!$parent.hasClass('open') && !$.contains($this[0], $(event.target)[0])) { //@edit LL lianglei 修正触发元素含有子元素时，偶发不弹出的BUG
                //if(!$parent.hasClass('open') && !$this.is(event.target)) {
                    // stop this event, stop executing any code
                    // in this callback but continue to propagate
                    return true;
                }

                openDropdown(event);
            }, function () {
                // clear timer for hover event
                window.clearTimeout(timeoutHover)
                timeout = window.setTimeout(function () {
                    $this.attr('aria-expanded', 'false');
                    $parent.removeClass('open');
                    $this.trigger(hideEvent);
                }, settings.delay);
            });

            // this helps with button groups!
            $this.hover(function (event) {
                // this helps prevent a double event from firing.
                // see https://github.com/CWSpear/bootstrap-hover-dropdown/issues/55
                if(!$parent.hasClass('open') && !$.contains($parent[0], $(event.target)[0])) { //@edit LL lianglei 修正触发元素含有子元素时，偶发不弹出的BUG
                //if(!$parent.hasClass('open') && !$parent.is(event.target)) {
                    // stop this event, stop executing any code
                    // in this callback but continue to propagate
                    return true;
                }

                openDropdown(event);
            });

            // handle submenus
            $parent.find('.dropdown-submenu').each(function (){
                var $this = $(this);
                var subTimeout;
                $this.hover(function () {
                    window.clearTimeout(subTimeout);
                    $this.children('.dropdown-menu').show();
                    // always close submenu siblings instantly
                    $this.siblings().children('.dropdown-menu').hide();
                }, function () {
                    var $submenu = $this.children('.dropdown-menu');
                    subTimeout = window.setTimeout(function () {
                        $submenu.hide();
                    }, settings.delay);
                });
            });

            function openDropdown(event) {
                if($this.parents(".navbar").find(".navbar-toggle").is(":visible")) {
                    // If we're inside a navbar, don't do anything when the
                    // navbar is collapsed, as it makes the navbar pretty unusable.
                    return;
                }

                // clear dropdown timeout here so it doesnt close before it should
                window.clearTimeout(timeout);
                // restart hover timer
                window.clearTimeout(timeoutHover);
                
                // delay for hover event.  
                timeoutHover = window.setTimeout(function () {
                    $allDropdowns.find(':focus').blur();

                    if(settings.instantlyCloseOthers === true)
                        $allDropdowns.removeClass('open');
                    
                    // clear timer for hover event
                    window.clearTimeout(timeoutHover);
                    $this.attr('aria-expanded', 'true');
                    $parent.addClass('open');
                    $this.trigger(showEvent);
                }, settings.hoverDelay);
            }
        });
    };

    $(document).ready(function () {
        // apply dropdownHover to all elements with the data-hover="dropdown" attribute
        $('[data-hover="dropdown"]').dropdownHover();
    });
})(jQuery, window);
;
///<jscompress sourcefile="bootstrap-submenu.js" />
/*!
 * Bootstrap-submenu v2.0.4 (https://vsn4ik.github.io/bootstrap-submenu/)
 * Copyright 2014-2018 Vasilii A. (https://github.com/vsn4ik)
 * Licensed under the MIT license
 */

/**
 * $.inArray: friends with IE8. Use Array.prototype.indexOf in future.
 * $.proxy: friends with IE8. Use Function.prototype.bind in future.
 */

'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function($) {
  function Item(element) {
    this.$element = $(element);
    this.$menu = this.$element.closest('.dropdown-menu');
    this.$main = this.$menu.parent();
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  Item.prototype = {
    init: function() {
      this.$element.on('keydown', $.proxy(this, 'keydown'));
    },
    close: function() {
      this.$main.removeClass('open');
      this.$items.trigger('hide.bs.submenu');
    },
    keydown: function(event) {
      // 27: Esc

      if (event.keyCode == 27) {
        event.stopPropagation();

        this.close();
        this.$main.children('a, button').trigger('focus');
      }
    }
  };

  function SubmenuItem(element) {
    this.$element = $(element);
    this.$main = this.$element.parent();
    this.$menu = this.$main.children('.dropdown-menu');
    this.$subs = this.$main.siblings('.dropdown-submenu');
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  $.extend(SubmenuItem.prototype, Item.prototype, {
    init: function() {
      this.$element.on({
        click: $.proxy(this, 'click'),
        keydown: $.proxy(this, 'keydown')
      });

      this.$main.on('hide.bs.submenu', $.proxy(this, 'hide'));
    },
    click: function(event) {
      // Fix a[href="#"]. For community
      event.preventDefault();

      event.stopPropagation();

      this.toggle();
    },
    hide: function(event) {
      // Stop event bubbling
      event.stopPropagation();

      this.close();
    },
    open: function() {
      this.$main.addClass('open');
      this.$subs.trigger('hide.bs.submenu');
    },
    toggle: function() {
      if (this.$main.hasClass('open')) {
        this.close();
      }
      else {
        this.open();
      }
    },
    keydown: function(event) {
      // 13: Return, 32: Spacebar

      if (event.keyCode == 32) {
        // Off vertical scrolling
        event.preventDefault();
      }

      if ($.inArray(event.keyCode, [13, 32]) != -1) {
        this.toggle();
      }
    }
  });

  function Submenupicker(element) {
    this.$element = $(element);
    this.$main = this.$element.parent();
    this.$menu = this.$main.children('.dropdown-menu');
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  Submenupicker.prototype = {
    init: function() {
      this.$menu.off('keydown.bs.dropdown.data-api');
      this.$menu.on('keydown', $.proxy(this, 'itemKeydown'));

      this.$menu.find('li > a').each(function() {
        new Item(this);
      });

      this.$menu.find('.dropdown-submenu > a').each(function() {
        new SubmenuItem(this);
      });

      this.$main.on('hidden.bs.dropdown', $.proxy(this, 'hidden'));
    },
    hidden: function() {
      this.$items.trigger('hide.bs.submenu');
    },
    itemKeydown: function(event) {
      // 38: Arrow up, 40: Arrow down

      if ($.inArray(event.keyCode, [38, 40]) != -1) {
        // Off vertical scrolling
        event.preventDefault();

        event.stopPropagation();

        var $items = this.$menu.find('li:not(.disabled):visible > a');
        var index = $items.index(event.target);

        if (event.keyCode == 38 && index !== 0) {
          index--;
        }
        else if (event.keyCode == 40 && index !== $items.length - 1) {
          index++;
        }
        else {
          return;
        }

        $items.eq(index).trigger('focus');
      }
    }
  };

  var old = $.fn.submenupicker;

  // For AMD/Node/CommonJS used elements (optional)
  // http://learn.jquery.com/jquery-ui/environments/amd/
  $.fn.submenupicker = function(elements) {
    var $elements = this instanceof $ ? this : $(elements);

    return $elements.each(function() {
      var data = $.data(this, 'bs.submenu');

      if (!data) {
        data = new Submenupicker(this);

        $.data(this, 'bs.submenu', data);
      }
    });
  };

  $.fn.submenupicker.Constructor = Submenupicker;
  $.fn.submenupicker.noConflict = function() {
    $.fn.submenupicker = old;
    return this;
  };

  return $.fn.submenupicker;
});
;
