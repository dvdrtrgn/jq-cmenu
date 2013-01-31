/**
    jQuery plugin for Pretty looking right click context menu.
    Requires popup.js and popup.css to be included in your page. And jQuery, obviously.
    Icon needs to be 16x16. I recommend the Fugue icon set from: http://p.yusukekamiyamane.com/

    Usage:
    $('.something').contextPopup({
        title: 'Some title',
        items: [
            {label:'My Item', icon:'/some/icon1.png', action:function() { alert('hi'); }},
            {label:'Item #2', icon:'/some/icon2.png', action:function() { alert('yo'); }},
            null, <<< divider
            {label:'Blahhhh', icon:'/some/icon3.png', action:function() { alert('bye'); }},
        ],
    });


    - Joe Walnes, 2011
        http://joewalnes.com/
        https://github.com/joewalnes/jquery-simple-context-menu

    MIT License: https://github.com/joewalnes/jquery-simple-context-menu/blob/master/LICENSE.txt

*/
(function ($) {
    $.fn.contextPopup = function (menuData) {                                   // Build popup menu HTML

        function createMenu() {
            var menu = $('<ul class=contextMenuPlugin><div class=gutterLine></div></ul>').appendTo(document.body);
            if (menuData.title) {
                $('<li class=header></li>').text(menuData.title).appendTo(menu);
            }
            $.each(menuData.items, function (x, item) {
                if (item) {
                    var row = $('<li><a href="#">'
                        + (item.icon ? '<img>' : '')
                        + '<span></span></a></li>').appendTo(menu);
                    row.find('img').attr('src', item.icon);
                    row.find('span').text(item.label);
                    if (item.action) {
                        row.find('a').click(item.action);
                    }
                } else {
                    $('<hr>').appendTo(menu);
                }
            });
            menu.find('.header').text(menuData.title);
            return menu;
        }

        // On contextmenu event (right click)
        this.bind('contextmenu', function (e) {

            var menu = createMenu().show().css({                                // Create and show menu
                zIndex: 1000001,
                left: e.pageX + 5,
                /* nudge to the right, so the pointer is covering the title */
                top: e.pageY
            }).bind('contextmenu', function () {
                return false;
            });

            var bg = $('<div></div>').css({                                     // Cover rest of page with invisible div that when clicked will cancel the popup.
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1000000,
            }).appendTo(document.body).bind('contextmenu click', function () {  // If click or right click anywhere else on page: remove clean up.
                bg.remove();
                menu.remove();
                return false;
            });

            menu.find('a').click(function () {                                  // When clicking on a link in menu: clean up (in addition to handlers on link already)
                bg.remove();
                menu.remove();
            });
            return false;                                                       // Cancel event, so real browser popup doesn't appear.
        });

        return this;
    };

})(jQuery);
