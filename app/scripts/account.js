define(['hasher', 'cookie', 'database'], function (hasher, cookie, database) {
    'use strict';

    var account = {
      attach: function () {

        // database.init()

        $('#forgot-password').on('click touchstart', function () {
          $('body').addClass('password-visible').removeClass('login-visible')
          return false
        })

        $('#goto-login').on('click touchstart', function () {
          $('body').removeClass('password-visible').addClass('login-visible')
          return false
        })

        $('#user-password-forget-username').on('keyup change', function () {
          $('#user-password-forget-username').removeClass('error')
        })

        $('#user-password-forget-submit').on('click touchstart', function () {
          var config = database.getConfig()

          var username = $('#user-password-forget-username').val()

          if (!username) {
            $('#user-password-forget-username').addClass('error')
            return false
          }

          $('#user-password-forget-submit').addClass('is-submitting')
          $('#user-password-forget-submit').val('Sending mail...')

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
                    url: config.api + "/" + config.language + "/api/user/" + username + "/resend_welcome_email.json",
                    type:"post",
                    dataType:"json",
                    xhrFields: {
                      withCredentials: true
                    },
                    beforeSend: function (request) {
                      request.setRequestHeader("X-CSRF-Token", token);
                    },
                    crossDomain: true,
                    success: function (data) {
                      $('#user-password-forget-submit').removeClass('is-submitting')
                      $('#user-password-forget-submit').val('Mail sent!')
                    },
                    error: function () {
                      $('#user-password-forget-submit').removeClass('is-submitting')
                      $('#user-password-forget-username').addClass('error')
                      $('#user-password-forget-submit').val('Error!')
                    }
                })
              }
          })

          return false
        })

        /***********************************************************************
         * LOGIN FORM
         ***********************************************************************/

        $('#user-login').submit(function () {
          var username = $('#user-login-username').val()
          var password = $('#user-login-password').val()

          if (!username) {
            $('#user-login-username').addClass('error')
          }

          if (!password) {
            $('#user-login-password').addClass('error')
          }

          if (!username || !password) {
            return false
          }

          $('#user-login-submit').addClass('is-submitting')
          $('#user-login-submit').val('Logging in...')

          var config = database.getConfig()

          var data_string = 'username=' + encodeURIComponent(username);
          data_string += '&password=' + encodeURIComponent(password);


          $.ajax({
              url: config.api + "/" + config.language + "/api/user/token.json",
              type:"post",
              dataType:"json",
              // beforeSend: function (xhr) {
              //   xhr.withCredentials = true;
              // },
              // async: false,
              xhrFields: {
                  withCredentials: true
              },
              crossDomain: true,
              success: function (data) {
                var token = data.token

                $.ajax({
                    url: config.api + "/" + config.language + "/api/user/login.json",
                    type: 'post',
                    data: data_string,
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: function (xhr) {
                      xhr.setRequestHeader("X-CSRF-Token", token);
                    },
                    // async: false,
                    crossDomain: true,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                      account.error(XMLHttpRequest, textStatus, errorThrown)
                    },
                    success: function (data) {
                      account.success(data)
                    }
                })
              }
          })

          return false
        })
      },

      is_logged_in: function (callback) {
        var config = database.getConfig()
        var account = database.getAccount()

        $.ajax({
          url: config.api + "/" + config.language + "/api/user-status",
          type:"post",
          dataType:"json",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: function (data) {
            if (data.status) {
              $('body').removeClass('not-logged-in').addClass('is-logged-in')
              callback(data.status)
            }
            else {
              $('body').addClass('not-logged-in').removeClass('is-logged-in')
              callback(false)
            }
          }
        })
      },

      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $('#user-login-submit').removeClass('is-submitting')
        $('#user-login-submit').val('Login →')
        $('#user-login-username').addClass('error')
        $('#user-login-password').addClass('error')
      },

      success: function (data) {
        var config = database.getConfig()

        database.setAccount(data)

        database.setConfig({
          language: data.user.language
        })

        $('#user-login-submit').removeClass('is-submitting')
        $('#user-login-submit').val('Logged in')
        $('#user-login-username').removeClass('error')
        $('#user-login-password').removeClass('error')
        $('html').trigger('user_login')

        $.ajax({
            url: config.api + "/" + config.language + "/api/user/token.json",
            type:"post",
            dataType:"json",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
              database.setAccount({
                cors_token: data.token
              })
            }
        })
      },

      validateEmail: function (emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
      },

      attachMyAccount: function () {
        $('#email').on('keyup change', function () {
          $('#email').removeClass('error')
        })

        $('#password, #password-confirm').on('keyup change', function () {
          $('#password').removeClass('error')
          $('#password-confirm').removeClass('error')
        })

        $('form.my-account .form-submit').on('click touchstart', function () {
          var config = database.getConfig()

          var data = $('form.my-account').serialize()
          var accountData = database.getAccount()

          var error = false

          if (!account.validateEmail($('#email').val())) {
            $('#email').addClass('error')
            error = true
          }

          if ($('#password-current').val() == '') {
            $('#password-current').addClass('error')
            error = true
          }

          if ($('#password').val() == '') {
            $('#password').addClass('error')
            error = true
          }

          if ($('#password-confirm').val() == '') {
            $('#password-confirm').addClass('error')
            error = true
          }

          if ($('#password').val() != $('#password-confirm').val()) {
            $('#password').addClass('error')
            $('#password-confirm').addClass('error')
            error = true
          }

          if (!error) {
            $(this).addClass('is-submitting').html('<span>Saving...</span>')

            $.ajax({
                url: config.api + "/" + config.language + "/api/user/token.json",
                type:"post",
                dataType:"json",
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                  $.ajax({
                    type: "PUT",
                    dataType: 'json',
                    url: config.api + "/" + config.language + "/api/user/" + accountData.user.uid + ".json",
                    data: {
                      name: $('#email').val(),
                      current_pass: $('#password-current').val(),
                      pass: $('#password').val(),
                      sessid: accountData.sessid
                    },
                    beforeSend: function (request) {
                      request.setRequestHeader("X-CSRF-Token", data.token)
                    },
                    xhrFields: {
                      withCredentials: true
                    },
                    crossDomain: true,
                    success: function (data) {
                      $('#email').removeClass('error')

                      database.setAccount(data)

                      $('.my-account .form-submit').html('<span>Saved!</span>')

                      setTimeout(function () {
                        $('.my-account .form-submit').removeClass('is-submitting').html('<span>Save</span>')

                        $('#password').val('')
                        $('#password-current').val('')
                        $('#password-confirm').val('')
                      }, 1000)
                    },
                  })
                }
            })
          }

          return false
        })
      }
    }

    return account
})
