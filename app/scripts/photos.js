define(['twigloader', 'database', 'imagelightbox'], function (twigloader, database) {
    'use strict';

    var cacheToken
    var photos = {
      init: function (filter) {
        cacheToken = null
        photos.getItems(filter)

        window.photosInterval = setInterval(function () {
          photos.getItems(filter)
        }, 10000)
      },

      getItems: function (filter) {
        var config = database.getConfig()

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
                url: config.api + "/" + config.language + "/api/photos/view",
                data: {
                  cache_token: cacheToken,
                  filter: filter
                },
                xhrFields: {
                    withCredentials: true
                },
                type: 'GET',
                beforeSend: function (xhr) {
                  xhr.setRequestHeader("X-CSRF-Token", token);
                },
                crossDomain: true,
                success: function (data) {

                  cacheToken = data.cache_token

                  if (data && data.photos) {
                    $.each(data.photos, function (id, mail) {
                      $.each(mail.photos, function (delta, photo) {
                        var fragment = $('<div class="item">' + photo + '</div>')

                        $('.photos-wrapper').append(fragment)
                      })
                    })

                    $('.item a').imageLightbox(
                    {
                        selector:       'id="imagelightbox"',   // string;
                        allowedTypes:   'png|jpg|jpeg|gif',     // string;
                        animationSpeed: 250,                    // integer;
                        preloadNext:    true,                   // bool;            silently preload the next image
                        enableKeyboard: true,                   // bool;            enable keyboard shortcuts (arrows Left/Right and Esc)
                        quitOnEnd:      false,                  // bool;            quit after viewing the last image
                        quitOnImgClick: false,                  // bool;            quit when the viewed image is clicked
                        quitOnDocClick: true,                   // bool;            quit when anything but the viewed image is clicked
                        onStart:        function () {
                          $('body').addClass('has-active-lightbox')
                        },                  // function/bool;   calls function when the lightbox starts
                        onEnd:          function () {
                          $('body').removeClass('has-active-lightbox')
                        },                  // function/bool;   calls function when the lightbox quits
                        onLoadStart:    false,                  // function/bool;   calls function when the image load begins
                        onLoadEnd:      false                   // function/bool;   calls function when the image finishes loading
                    });

                  }
                }
              })
            }
        })

      }
    }

    return photos

})
