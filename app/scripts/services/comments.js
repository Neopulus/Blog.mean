'use strict';

angular.module('meanApp')
    .service('commentSvc', ['$http', function ($http) {
        $http.defaults.headers.put = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;

        this.getComments = function (URL) {
            return ( $http({
                    method: 'GET',
                    url: URL + 'comments',
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

        this.getCommentById = function (URL, id) {
            return ( $http({
                    method: 'GET',
                    url: URL + 'comments/' + id,
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

        this.createComment = function (URL, titre, contenu, article, token) {
            return ( $http({
                    method: 'POST',
                    url: URL + 'comments/add',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: {title: titre, content: contenu, id: article}
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        this.deleteComment = function (URL, id, token) {
            return ( $http({
                    method: 'DELETE',
                    url: URL + 'comments/delete/' + id,
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

        this.updateComment = function (URL, id, contenu, token) {
            return ( $http({
                    method: 'PUT',
                    url: URL + 'comments/update/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: {content: contenu}
                }).then(function successCallback(response) {
                    return response.status;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        return this;
    }]);
