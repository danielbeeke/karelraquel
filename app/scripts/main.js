require.config({
    baseUrl: "scripts",
    paths: {
        jquery: '../bower_components/jquery/jquery',
        twig: '../bower_components/twig.js/twig',
        cookie: '../bower_components/jquery.cookie/jquery.cookie',
        crossroads: '../bower_components/crossroads.js/dist/crossroads',
        signals: '../bower_components/js-signals/dist/signals',
        hasher: '../bower_components/hasher/dist/js/hasher',
        localstoragedb: '../bower_components/localStorageDB/localstoragedb',
        bigtext: '../bower_components/bigtext/dist/bigtext'

    },
    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },
        'twig': {
            deps: [],
            exports: 'twig'
        },
        'cookie': {
            deps: [
                'jquery'
            ],
            exports: 'cookie'
        },
        'crossroads': {
            deps: [
                'signals'
            ],
            exports: 'crossroads'
        },
        'signals': {
            deps: [],
            exports: 'signals'
        },
        'hasher': {
            deps: [
                'signals'
            ],
            exports: 'hasher'
        },
        'localstoragedb': {
            deps: [],
            exports: 'localstoragedb'
        },
        'bigtext': {
            deps: [
                'jquery'
            ],
            exports: 'bigtext'
        }
    }
})

require(['twigloader', 'jquery', 'router', 'menu', 'database'], function (twigloader, $, router, menu, database) {
    'use strict';

    database.init()
    menu.init()
    router.init()
})
