'use strict';

angular.module('meanApp')
    .service('userSvc', ['$http', function ($http) {
        $http.defaults.headers.put = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;

        this.getUsers = function (URL) {
            return ( $http({
                    method: 'GET',
                    url: URL + 'users',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    return response.data;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        this.getUserById = function (URL, id) {
            return ( $http({
                    method: 'GET',
                    url: URL + 'users/' + id,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    return response.data;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        this.createUser = function (URL, username, password, role) {
            return ( $http({
                    method: 'POST',
                    url: URL + 'users/create',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {username: username, password: password, role: role}
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                })
            );
        };

        this.deleteUser = function (URL, id, token) {
            return ( $http({
                    method: 'DELETE',
                    url: URL + 'delete/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                }).then(function successCallback(response) {
                    return response.status;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        this.updateUser = function (URL, id, username, password, role, token) {
            return ( $http({
                    method: 'PUT',
                    url: URL + 'users/update/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: {username: username, password: password, role: role}
                }).then(function successCallback(response) {
                    return response.status;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        this.changeRole = function (URL, id, role, token) {
            return ( $http({
                    method: 'PUT',
                    url: URL + 'users/role/update/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: {role: role}
                }).then(function successCallback(response) {
                    return response.status;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };


        this.loginUser = function (URL, username, password) {
            return ( $http({
                    method: 'POST',
                    url: URL + 'users/auth',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {username: username, password: password}
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                })
            );
        };

        this.isAdmin = function (URL, token) {
            return ( $http({
                    method: 'POST',
                    url: URL + 'users/isAdmin',
                    headers: {
                        'Authorization': token
                    }
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                })
            );
        };

        return this;
    }]);
