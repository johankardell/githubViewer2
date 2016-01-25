/* global app */

app.controller("UserController", function ($scope, $routeParams, $log, githubFactory) {
    'use strict';
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
}); 