/* global app */

app.factory("githubFactory", function ($http) {
    'use strict';
    
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
});