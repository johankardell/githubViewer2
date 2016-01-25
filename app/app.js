/* global angular */
(function (module) {
    'use strict';

    module.config(function ($routeProvider) {
        $routeProvider
            .when("/main", {
                templateUrl: "main.html",
                controller: "MainController"
            })
            .when("/user/:username", {
                templateUrl: "user.html",
                controller: "UserController"
            })
            .otherwise({ redirectTo: "/main" });
    });

} (angular.module("githubViewer2", ["ngRoute"])));

