/* global angular */

(function (module) {
    'use strict';
    
    module.controller('UserController', UserController);
    UserController.$inject = ['$scope', '$routeParams', '$log', 'githubFactory'];
    
    function UserController($scope, $routeParams, $log, githubFactory) {
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
    }
} (angular.module("app.githubViewer2")));