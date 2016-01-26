/* global angular */

(function (module) {
    'use strict';

    module.factory('githubFactory', githubFactory);
    githubFactory.$inject = ['$http'];

    function githubFactory($http) {
        var factory = {
            getUser: getUser,
            getRepos: getRepos
        };

        return factory;

        function getUser(username) {
            var githubApiUrl = "https://api.github.com/users/";
            return $http.get(githubApiUrl + username)
                .then(function (response) {
                    return response.data;
                });
        };

        function getRepos(user) {
            return $http.get(user.repos_url)
                .then(function (response) {
                    return response.data;
                });
        };
    }
} (angular.module("app.githubViewer2")));