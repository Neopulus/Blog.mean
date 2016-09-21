'use strict';

/**
 * @ngdoc function
 * @name meanApp.controller:NavCtrl
 * @description Nav controller
 */

angular.module('meanApp')
    .controller('NavCtrl', ['$scope', '$timeout', 'userSvc', '$cookies',
        function ($scope, $timeout, userSvc, $cookies) {
            (function initController() {
                // reset cookies
                $scope.session = $cookies.get("_session_") ? true : false;
                $scope.is_admin = ($cookies.get("is_admin") == "true") ? true : false;
            })();
        }]);
