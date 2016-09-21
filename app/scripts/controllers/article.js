'use strict';

/**
 * @ngdoc function
 * @name meanApp.controller:ArticleCtrl
 * @description Article controller
 */

angular.module('meanApp')
    .controller('ArticleCtrl', ['$location', '$scope', '$routeParams', 'userSvc', 'articleSvc', 'commentSvc', '$cookies', 'apiSvc',
        function ($location, $scope, $routeParams, userSvc, articleSvc, commentSvc, $cookies, api) {
            /* SERVER URL */
            var URL = api.url;
            var id = $routeParams.id;
            $scope.is_auth = $cookies.get('_session_') ? true : false;
            var token = $cookies.get('_session_');
            $scope.nav = "views/nav.html";

            articleSvc.getArticleById(URL, id).then(function (data) {
                $scope.article = data;
                var date = new Date(data.create_at);
                $scope.article.create_at = date.toLocaleDateString();

                userSvc.getUserById(URL, data.author).then(function (data) {
                    $scope.article.author = data.username;
                });

                var comments = [];
                angular.forEach(data.comments, function(val, key) {
                    commentSvc.getCommentById(URL, val).then(function (data) {
                        var date = new Date(data.create_at);
                        data.create_at = date.toLocaleDateString();
                        userSvc.getUserById(URL, data.author[0]).then( function(res) {
                            data.author = res.username;
                        });
                        comments[key] = data;
                    });
                });
                $scope.comments = comments;
            });

            $scope.comment = function () {
                var t = this.title;
                var c = this.content;
                commentSvc.createComment(URL, this.title, this.content, id, token).then(function (response) {
                    if (response.status == 201) {
                        Materialize.toast('Comment added successfully !!', 3000);
                        var date = new Date();
                        $scope.comments.push({
                            'title': t,
                            'content': c,
                            'author': "You",
                            'create_at': date.toLocaleDateString()
                            }
                        );
                    } else {
                        Materialize.toast('Error adding comment', 3000);
                    }
                });
                this.title = "";
                this.content = "";
            };

        }]);
