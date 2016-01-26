/* global angular */

(function (module) {
    'use strict';

    module.controller('UserController', UserController);
    UserController.$inject = ['$scope', '$routeParams', '$log', 'githubFactory'];

    function UserController($scope, $routeParams, $log, githubFactory) {
        activate();

        function activate() {
            getUsers();
        }

        function getUsers() {
            function onUsersComplete(data) {
                $scope.user = data;
                githubFactory.getRepos($scope.user).then(onReposComplete, onError);
            }

            function onReposComplete(data) {
                $scope.repos = data;
            }

            function onError(message) {
                $scope.errorMessage = 'Error!';
                $log.log(message);
            }

            githubFactory.getUser($routeParams.username)
                .then(onUsersComplete, onError);
        }
    }
} (angular.module('app.githubViewer2')));