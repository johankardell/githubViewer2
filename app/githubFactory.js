/* global angular */

(function (module) {
    'use strict';

    module.factory('githubFactory', githubFactory);
    githubFactory.$inject = ['$http'];

    function githubFactory($http) {
        var getUser = function (username) {
            var githubApiUrl = "https://api.github.com/users/";
            return $http.get(githubApiUrl + username)
                .then(function (response) {
                    return response.data;
                });
        };

        var getRepos = function (user) {
            return $http.get(user.repos_url)
                .then(function (response) {
                    return response.data;
                });
        };

        return {
            getUser: getUser,
            getRepos: getRepos
        };
    }
} (angular.module("app.githubViewer2")));