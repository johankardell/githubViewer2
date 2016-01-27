/* global angular */

(function (module) {
    'use strict';
    module.controller('MainController', mainController);
    mainController.$inject = ['$scope', '$interval', '$location', '$log'];

    function mainController($scope, $interval, $location, $log) {
        var timerInterval = null;

        $scope.search = search;
        $scope.stopTimer = stopTimer;
        $scope.timerEnabled = timerEnabled;
        $scope.timeout = 10;

        activate();

        function activate() {
            startTimer();
        }

        function timerCountDown() {
            $scope.timeout -= 1;

            if ($scope.timeout <= 0) {
                $scope.search($scope.username);
            }
        }

        function startTimer() {
            timerInterval = $interval(timerCountDown, 1000, $scope.timeout);
        }

        function timerEnabled() {
            return timerInterval !== null;
        }

        function search(username) {
            $log.log('Searching for ' + username);
            $location.path('/user/' + username);
        }

        function stopTimer() {
            $interval.cancel(timerInterval);
            timerInterval = null;
        }
    }
} (angular.module('app.githubViewer2')));