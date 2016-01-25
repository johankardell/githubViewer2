(function (module) {
    'use strict';

    var githubFactory = function ($http) {
        var getUser = function (username) {
            var githubApiUrl = "https://api.github.com/users/";
            return $http.get(githubApiUrl + username)
                .then(function (response) {
                    return response.data;
                });
        };

        var getRepos = function (user) {
            return $http.get(user.repos_url)
                .then(function(response){
                   return response.data; 
                });
        };

        return {
            getUser: getUser,
            getRepos: getRepos
        };
    };

    module.factory("githubFactory", githubFactory);
} (angular.module("githubViewer2")));