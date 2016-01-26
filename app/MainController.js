/* global angular */

(function (module) {
    'use strict';
    module.controller('MainController', MainController);
    MainController.$inject = ['$scope', '$interval', '$location', '$log']

    function MainController($scope, $interval, $location, $log) {
        $scope.timerEnabled = timerEnabled;
        $scope.search = search;
        $scope.stopTimer = stopTimer;
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

        function timerEnabled() {
            return timerInterval !== null;
        };

       function search (username) {
            $log.log('Searching for ' + username);
            $location.path("/user/" + username);
        };

        function stopTimer() {
            $interval.cancel(timerInterval);
            timerInterval = null;
        };

        startTimer();
    };
} (angular.module("app.githubViewer2")));