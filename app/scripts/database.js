define(['localstoragedb', 'jquery'], function (localStorageDB, $) {
    'use strict';

    var database_cursor = null

    var database = {
      init: function () {
        database_cursor = new localStorageDB('library', localStorage)

        database_cursor.drop()
        database_cursor = new localStorageDB('library', localStorage)

        if ($.cookie('api')) {
          database.setConfig({
            api: $.cookie('api'),
          })
        }
        else {
          database.setConfig({
            api: 'http://app.karelraquel.com',
          })
        }
      },

      getAccount: function () {
        if (database_cursor && database_cursor.tableExists('account')) {
          return database_cursor.query('account', { ID: 1 })[0];
        }
      },

      setAccount: function (account) {
        if (!database_cursor.tableExists('account')) {
          if (!account.cors_token) { account.cors_token = null }
          database_cursor.createTableWithData('account', [account])
        }
        else {
          database_cursor.update('account', { ID: 1}, function(row) {
            $.each(account, function (key, value) {
              row[key] = value
            })

            return row;
          })
        }

        database_cursor.commit()
      },

      getConfig: function () {
        if (database_cursor && database_cursor.tableExists('config')) {
          return database_cursor.query('config', { ID: 1 })[0];
        }
      },

      setConfig: function (config) {
        if (!database_cursor.tableExists('config')) {
          config.cache_token = null
          if (!config.language) {
            config.language = 'en'
          }

          database_cursor.createTableWithData('config', [config])
        }
        else {
          database_cursor.update('config', { ID: 1}, function(row) {
            $.each(config, function (key, value) {
              row[key] = value
            })

            return row;
          })
        }
      },

      insert: function (table, rows) {
        if (!database_cursor.tableExists(table)) {
          if (!rows[0].body) { rows[0].body = null }
          if (!rows[0].image) { rows[0].image = false }

          database_cursor.createTableWithData(table, rows)
        }
        else {
          // database_cursor.truncate(table)

          $.each(rows, function (delta, row) {
            database_cursor.insertOrUpdate(table, { id: row.id }, row)
          })
        }
      },

      get: function (table, query, sort) {
        if (database_cursor.tableExists(table)) {
          return database_cursor.queryAll(table, { query: query, sort: sort });
        }
      },

      drop: function () {
        database_cursor.drop()
        database.init()
      },
    }

    return database
})
