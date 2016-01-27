/* global angular */

(function (module) {
    'use strict';
    
    module.config(config);
    config.$inject = ['$routeProvider'];
    
    function config($routeProvider){
        $routeProvider
            .when('/main', {
                templateUrl: 'main.html',
                controller: 'mainController'
            })
            .when('/user/:username', {
                templateUrl: 'user.html',
                controller: 'userController'
            })
            .otherwise({ redirectTo: '/main' });
    }
} (angular.module('app.githubViewer2', ['ngRoute'])));