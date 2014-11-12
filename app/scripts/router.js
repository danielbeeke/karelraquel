define(['crossroads', 'hasher', 'menu', 'twigloader', 'cache', 'jquery', 'database', 'checkbox', 'account', 'photos', 'bigtext', 'cookie'], function (crossroads, hasher, menu, twigloader, cache, $, database, checkbox, account, photos) {
    'use strict';

    var backgroundImage
    var router = {
      init: function () {
        backgroundImage = '/images/backgrounds/married.jpeg'

        setTimeout(function () {
          $('body').removeClass('no-transitions')
        }, 1200)

        crossroads.routed.add(function(request, data){
          var request_splitted = request.split('/')

          $('body').attr('data-section', request_splitted[0])
          $('a.active').removeClass('active')
          $('a[href="#' + request + '"]').addClass('active')

          if (window.photosInterval && request != 'page/photos') {
            clearInterval(photosInterval)
          }
        })

        /***************************************************************************
         * ROUTES
         ***************************************************************************/

        crossroads.addRoute('set-api/{api}', function (api) {
          $.cookie('api', 'http://' + api)
          database.drop()

          alert('Done, the site is now attached to: http://' + api)
        })

        crossroads.addRoute('logout', function () {
          var account = database.getAccount()
          var config = database.getConfig()

          router.loadPage()
          database.drop()
          hasher.setHash('start')

          $.ajax({
              url: config.api + "/" + config.language + "/api/user/token.json",
              type:"post",
              dataType:"json",
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              success: function (data) {
                var token = data.token

                $.ajax({
                  dataType: "json",
                  xhrFields: {
                      withCredentials: true
                  },
                  type: 'POST',
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRF-Token", token);
                  },
                  crossDomain: true,
                  url: config.api + '/en/api/user/logout.json',
                  error: function (jqXHR, textStatus, errorThrown) {

                  },
                  success: function () {
                    database.drop()
                    menu.render()
                  }
                })

              }
          })
        })

        crossroads.addRoute('page/save-date', function (slug) {
          var account = database.getAccount()
          var config = database.getConfig()

          var accounts = null

          $.ajax({
              url: config.api + "/" + config.language + "/api/user/token.json",
              type:"post",
              dataType:"json",
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              success: function (data) {
                var token = data.token

                $.ajax({
                  dataType: "json",
                  xhrFields: {
                      withCredentials: true
                  },
                  type: 'POST',
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRF-Token", token);
                  },
                  crossDomain: true,
                  url: config.api + '/api/save-the-date',
                  error: function (jqXHR, textStatus, errorThrown) {

                  },
                  success: function (json) {
                    accounts = json

                    var saveTheDate = cache.get('pages/save-date', 'info', {
                      slug: 'save-date'
                    }, {}, function (saveTheDate) {

                      saveTheDate[0].accounts = accounts

                      router.loadPage('save-the-date', saveTheDate[0], function () {

                        $('.bigtext').bigtext()
                        // checkbox.init()

                        $('.save-the-date .form-submit').on('click touchstart', function () {
                          $(this).addClass('is-submitting').html('<span>Saving...</span>')

                          var data = $('form.save-the-date').serialize()

                          $.ajax({
                            type: "POST",
                            url: config.api + '/api/save-the-date',
                            data: data,
                            success: function () {
                              $('.save-the-date .form-submit').html('<span>Saved!</span>')

                              setTimeout(function () {
                                $('.save-the-date .form-submit').removeClass('is-submitting').html('<span>Save</span>')
                              }, 1000)
                            },
                          })

                          return false
                        })
                      })

                    })


                  }
                })

              }
          })
        })

        crossroads.addRoute('set-language/{langcode}', function (langcode) {
          database.setConfig({
            language: langcode
          })

          menu.render()
        })

        crossroads.addRoute('page/official-photos-es', function () {
          var photosInfo = cache.get('pages/photos', 'info', {
            slug: 'photos'
          }, {}, function (photosInfo) {

            router.loadPage('photos', photosInfo[0], function () {
              $('.bigtext').bigtext()
              photos.init('off_es')
            })
          })
        })

        crossroads.addRoute('page/official-photos-nl', function () {
          var photosInfo = cache.get('pages/photos', 'info', {
            slug: 'photos'
          }, {}, function (photosInfo) {

            router.loadPage('photos', photosInfo[0], function () {
              $('.bigtext').bigtext()
              photos.init('off_nl')
            })
          })
        })

        crossroads.addRoute('page/sent-photos-nl', function () {
          var photosInfo = cache.get('pages/photos', 'info', {
            slug: 'photos'
          }, {}, function (photosInfo) {

            router.loadPage('photos', photosInfo[0], function () {
              $('.bigtext').bigtext()
              photos.init('sent_nl')
            })
          })
        })

        crossroads.addRoute('page/sent-photos-es', function () {
          var photosInfo = cache.get('pages/photos', 'info', {
            slug: 'photos'
          }, {}, function (photosInfo) {

            router.loadPage('photos', photosInfo[0], function () {
              $('.bigtext').bigtext()
              photos.init('sent_es')
            })
          })
        })

        crossroads.addRoute('page/my-account', function () {
          var myAccount = cache.get('pages/my-account', 'info', {
            slug: 'my-account'
          }, {}, function (myAccount) {
            var accountData = database.getAccount()

            myAccount[0].user = accountData.user

            router.loadPage('my-account', myAccount[0], function () {
              $('.bigtext').bigtext()
              account.attachMyAccount()
            })
          })
        })

        crossroads.addRoute('page/{slug}', function (slug) {
          var currentPage = cache.get('pages/view', 'info', {
            slug: slug
          }, {}, function (currentPage) {

            router.loadPage('page', currentPage[0], function () {
              $('.bigtext').bigtext()
            })
          })
        })

        hasher.initialized.add(router.parseHash)
        hasher.changed.add(router.parseHash)
        hasher.init()
      },

      parseHash: function (newHash, oldHash){
        crossroads.parse(newHash)
      },


      loadPage: function(route, data, callback_function) {
        $('body').addClass('fadeOut').removeClass('fadeIn')


        $('.overlay').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
          if (route) {
            var renderedHtml = twigloader.get(route, data)
            $('.main-content').html(renderedHtml)

          }
          else {
            $('.main-content').html('<div class="main-inner"><div class="page-outer-wrapper" ' + "style='background-image: url(" + backgroundImage + ");'></div></div>")
          }

          $('body').addClass('fadeIn').removeClass('fadeOut').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            $('body').removeClass('fadeIn')
          })


          if (callback_function) {
            callback_function()
          }
        })
      }

    }

    return router
})
