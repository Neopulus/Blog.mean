'use strict';

/**
 * @ngdoc function
 * @name meanApp.controller:MainCtrl
 * @description Main controller
 */

angular.module('meanApp')
    .controller('MainCtrl', ['$scope', 'userSvc', 'articleSvc', '$cookies', 'apiSvc',
        function ($scope, userSvc, articleSvc, $cookies, api) {
            /* SERVER URL */
            var URL = api.url;
            $scope.nav = "views/nav.html";

            articleSvc.getArticles(URL).then(function (data) {
                $scope.articles = data;
                angular.forEach(data, function(val, key) {
                    var date = new Date(val.create_at);
                    $scope.articles[key].create_at = date.toLocaleDateString();
                    $scope.articles[key].content = val.content.substring(0, 100);
                    $scope.articles[key].content += " ...";
                    userSvc.getUserById(URL, data[key].author).then( function(res) {
                        $scope.articles[key].author = res.username;
                    });
                });
            });
        }]);
