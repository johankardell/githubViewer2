/* global app */

app.controller("MainController", function ($scope, $interval, $location, $log) {
    'use strict';
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

    $scope.timeout = 10;
    $scope.timerEnabled = function () {
        return timerInterval !== null;
    };

    $scope.search = function (username) {
        $log.log('Searching for ' + username);
        $location.path("/user/" + username);
    };

    $scope.stopTimer = function () {
        $interval.cancel(timerInterval);
        timerInterval = null;
    };

    startTimer();
});
