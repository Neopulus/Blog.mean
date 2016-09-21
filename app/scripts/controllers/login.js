'use strict';

/**
 * @ngdoc function
 * @name meanApp.controller:LoginCtrl
 * @description Login controller
 */

angular.module('meanApp')
    .controller('LoginCtrl', ['$location', '$scope', '$timeout', '$route', 'userSvc', '$cookies', 'apiSvc',
        function ($location, $scope, $timeout, $route, userSvc, $cookies, api) {
            /* SERVER URL */
            var URL = api.url;
            $scope.nav = "views/nav.html";

            (function initController() {
                // reset cookies
                $cookies.remove('_session_');
                $cookies.remove('is_admin');
            })();

            $scope.login = function () {
                var u = this.username;
                var p = this.password;
                if (u == undefined || p == undefined) {
                    Materialize.toast('Please don\'t leave blank field', 3000);
                } else {
                    userSvc.loginUser(URL, u, p).then(function (response) {
                        if (response.status == 200) {
                            $cookies.put('_session_', response.data.token);
                            userSvc.isAdmin(URL, response.data.token).then(function (rep) {
                                if (rep.status == 200 && rep.data.is_admin == "true") {
                                    $cookies.put("is_admin", "true");
                                    Materialize.toast('Welcome ' + u + ' !', 3000);
                                    $location.path("/");
                                } else {
                                    $cookies.put("is_admin", "false");
                                    Materialize.toast('Welcome ' + u + ' !', 3000);
                                    $location.path("/");
                                }
                            });
                        } else {
                            var msg = 'Oops : ' + response.data.Message + ", Please retry.";
                            Materialize.toast(msg, 3000);
                        }
                    });
                }
            }
            $scope.sign = function () {
                var u = this.username_n;
                var p = this.password_n;
                if (p != this.password_t) {
                    Materialize.toast('Password confim isn\'t valid', 3000);
                } else if (u == undefined || p == undefined) {
                    Materialize.toast('Please don\'t leave blank field', 3000);
                } else {
                    userSvc.createUser(URL, u, p, "normal").then(function (response) {
                        if (response.statusText == "Created") {
                            userSvc.loginUser(URL, u, p).then(function (response) {
                                if (response.data.success) {
                                    $cookies.put('_session_', response.data.token);
                                    userSvc.isAdmin(URL, response.data.token).then(function (rep) {
                                        if (rep.status == 200 && rep.data.is_admin == "true") {
                                            $cookies.put("is_admin", "true");
                                            Materialize.toast('Welcome ' + u + ' !', 3000);
                                            $location.path("/");
                                        } else {
                                            $cookies.put("is_admin", "false");
                                            Materialize.toast('Welcome ' + u + ' !', 3000);
                                            $location.path("/");
                                        }
                                    });
                                } else {
                                    var msg = 'Oops : ' + response.data.Message + ", Please retry.";
                                    Materialize.toast(msg, 3000);
                                }
                            });
                        } else {
                            var msg = 'Oops : ' + response.data.Message + ", Please retry.";
                            Materialize.toast(msg, 3000);
                        }
                    });
                }
            }
        }]);
