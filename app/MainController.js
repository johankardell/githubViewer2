(function (module) {
    'use strict';

    var MainController = function ($scope, $interval, $location, $log) {
        $scope.username;
        $scope.timeout = 10;

        var timerInterval = null;

        var timerCountDown = function () {
            $scope.timeout -= 1;

            if ($scope.timeout <= 0) {
                $scope.search($scope.username);
            }
        };

        var startTimer = function () {
            timerInterval = $interval(timerCountDown, 1000, $scope.timeout);
        };
        
        $scope.timerEnabled = function(){
            return timerInterval !== null;
        }
        
        $scope.search = function (username) {
            $log.log('Searching for ' + username);
            $location.path("/user/" + username);
        };

        $scope.stopTimer = function () {
            $interval.cancel(timerInterval);
            timerInterval = null;
        };

        startTimer();
    };

    module.controller("MainController", MainController);

} (angular.module("githubViewer2")));