(function (module) {
    'use strict';

    var UserController = function ($scope, $routeParams, $log, githubFactory) {
        var onComplete = function (data) {
            $scope.user = data;
        };

        var onError = function (message) {
            $scope.message = "Error!"
            $log.log(message);
        }

        githubFactory.getUser($routeParams.username).then(onComplete, onError);
    }

    module.controller("UserController", UserController);
} (angular.module("githubViewer2")));