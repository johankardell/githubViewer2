(function (module) {
    'use strict';
    
    var UserController = function($scope, $routeParams){
        $scope.username = $routeParams.username;
    }

    module.controller("UserController", UserController);
} (angular.module("githubViewer2")));