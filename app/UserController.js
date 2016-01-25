(function (module) {
    'use strict';

    var UserController = function ($scope, $routeParams, $log, githubFactory) {
        var onUsersComplete = function (data) {
            $scope.user = data;
            githubFactory.getRepos($scope.user).then(onReposComplete, onError);
        };

        var onReposComplete = function (data) {
            $scope.repos = data;
        };

        var onError = function (message) {
            $scope.errorMessage = "Error!";
            $log.log(message);
        };

        githubFactory.getUser($routeParams.username).then(onUsersComplete, onError);
    };

    module.controller("UserController", UserController);
} (angular.module("githubViewer2")));