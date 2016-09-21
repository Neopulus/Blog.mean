'use strict';

angular.module('meanApp')
    .service('articleSvc', ['$http', function ($http) {
        $http.defaults.headers.put = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;

        this.getArticles = function (URL) {
            return ( $http({
                    method: 'GET',
                    url: URL + 'articles',
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

        this.getArticleById = function (URL, id) {
            return ( $http({
                    method: 'GET',
                    url: URL + 'articles/' + id,
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

        this.createArticle = function (URL, title, content, token) {
            return ( $http({
                    method: 'POST',
                    url: URL + 'articles/add',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: {title: title, content: content}
                }).then(function successCallback(response) {
                    return response.data;
                }, function errorCallback(response) {
                    return response;
                })
            );
        };

        this.deleteArticle = function (URL, id, token) {
            return ( $http({
                    method: 'DELETE',
                    url: URL + 'articles/delete/' + id,
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

        this.updateArticle = function (URL, id, titre, contenu, auteur, token) {
            return ( $http({
                    method: 'PUT',
                    url: URL + 'articles/update/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: {title: titre, content: contenu, author: auteur}
                }).then(function successCallback(response) {
                    return response.status;
                }, function errorCallback(response) {
                    return response.status;
                })
            );
        };

        return this;
    }]);
