define(['hasher', 'twigloader', 'account', 'cookie', 'database'], function (hasher, twigloader, account, cookie, database) {
    'use strict';

    var cache = {
      init: function () {
        // database.init()
      },

      drop: function () {
        database.drop()
      },

      get: function (path, type, query, sort, callback) {

        var data = {}
        var token

        if (sort === undefined) {
          sort = {}
        }

        var config = database.getConfig()

        if (config.cache_token) {
          // data.cache_token = config.cache_token
        }

        if (path) {

          $.ajax({
              url: config.api + "/" + config.language + "/api/user/token.json",
              type:"post",
              dataType:"json",
              xhrFields: {
                  withCredentials: true
              },

              cache: false,
              crossDomain: true,
              success: function (data) {
                var token = data.token

                $.ajax({
                  dataType: "json",
                  type: "POST",
                  url: config.api + "/" + config.language + '/api/' + path,
                  crossDomain: true,
                  xhrFields: {
                      withCredentials: true
                  },
                  error: function (error) {
                    console.log(error)
                  },
                  success: function (json) {
                    database.setConfig({
                      cache_token: json.cache_token
                    })

                    $.each(json, function (typeInner, objects) {
                      if(Object.prototype.toString.call(objects) === '[object Object]') {
                        var rows = $.map(objects, function(value, index) {
                            value.id = index

                            if (value.languages) {
                              var languages = value.languages.split(',')
                              value.languages = languages
                            }

                            return [value]
                        })

                        database.insert(typeInner, rows);
                      }
                    })

                    if (typeof callback === 'function') {
                      callback(database.get(type, query, sort))
                    }
                  }
                })

              }
          })

        }
      }
    }

    return cache
})
