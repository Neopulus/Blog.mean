'use strict';

/**
 * @ngdoc overview
 * @name meanApp
 * @description app.js [Mean application]
 */

angular.module('meanApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
]).config(
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
            })
            .when('/article/:id', {
                templateUrl: 'views/article.html',
                controller: 'ArticleCtrl'
            })
            .when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'AdminCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: ''
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
