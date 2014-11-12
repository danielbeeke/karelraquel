define(['hasher', 'twigloader', 'account', 'cache', 'database'], function (hasher, twigloader, account, cache, database) {
    'use strict';

    var menu = {
      init: function () {
        cache.init()

        $('.menu-toggle').on('click touchstart', function () {
          $('body').toggleClass('has-active-menu')
          return false
        })

        $('.overlay').on('click touchstart', function () {
          if ($('body').hasClass('has-active-menu')) {
            $('body').removeClass('has-active-menu')
            return false
          }
        })

        menu.render()

        $('html').on('user_login', function () {
          menu.render()
        })
      },

      attach: function () {
        $('.main-menu a').on('click' , function () {
          if (window.location.hash == $(this).attr('href')) {
            $('body').toggleClass('show-only-image')
          }
          else {
            $('a.active').removeClass('active')

            if ($(this).attr('href') != '#logout') {
              menu.close()
            }

            setTimeout(function () {
              $('body').removeClass('show-only-image')
            }, 500)
          }
        })
      },

      open: function () {
        $('body').addClass('has-active-menu')
      },

      close: function () {
        setTimeout(function () {
          $('body').removeClass('has-active-menu')
        }, 1000)
      },

      render: function () {
        var config = database.getConfig()

        account.is_logged_in(function(sessid) {
          if (sessid) {
            database.setAccount({ sessid: sessid })

            var info = cache.get('pages/view', 'info', function (row) {
              if ($.inArray(config.language, row.languages) != -1) {
                return true
              }
            }, {}, function (info) {

              $('.side-menu').html(twigloader.get('menu-logged-in', {
                salutation: 'Henk Jansen',
                pages: info
              }))

              menu.attach()
            })
          }
          else {
            var info = cache.get('pages/view', 'info', function (row) {
              if ($.inArray(config.language, row.languages) != -1) {
                return true
              }
            }, {}, function (info) {

              $('.side-menu').html(twigloader.get('menu-logged-out', {
                pages: info
              }))
              menu.attach()
              account.attach()
            })
          }

        })
      }
    }

    return menu
})
