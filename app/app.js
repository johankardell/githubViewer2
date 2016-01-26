/* global angular */

(function (module) {
    'use strict';
    
    module.config(config);
    config.$inject = ['$routeProvider'];
    
    function config($routeProvider){
        $routeProvider
            .when('/main', {
                templateUrl: 'main.html',
                controller: 'MainController'
            })
            .when('/user/:username', {
                templateUrl: 'user.html',
                controller: 'UserController'
            })
            .otherwise({ redirectTo: '/main' });
    }
} (angular.module('app.githubViewer2', ['ngRoute'])));