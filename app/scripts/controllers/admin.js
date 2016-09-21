'use strict';

/**
 * @ngdoc function
 * @name meanApp.controller:AdminCtrl
 * @description Admin controller
 */

angular.module('meanApp')
    .controller('AdminCtrl', ['$location', '$scope', '$route', 'userSvc', 'articleSvc', 'commentSvc', '$cookies', 'apiSvc',
        function ($location, $scope, $route, userSvc, articleSvc, commentSvc, $cookies, api) {
            /* SERVER URL */
            var URL = api.url;
            var U = this;
            var token = $cookies.get("_session_");
            var is_admin = ($cookies.get("is_admin") == "true") ? true : false;
            $scope.nav = "views/nav.html";

            $scope.roles = {
                admin: 'admin',
                normal: 'normal'
            };

            if (token) {
                if (is_admin) {
                    $('.tooltipped').tooltip({delay: 50});
                    userSvc.getUsers(URL).then(function (data) {
                        $scope.users = data;
                    });
                    articleSvc.getArticles(URL).then(function (data) {
                        $scope.articles = data;
                        angular.forEach(data, function (val, key) {
                            userSvc.getUserById(URL, data[key].author).then(function (res) {
                                $scope.articles[key].author = res.username;
                            });
                            $scope.articles[key].content = val.content.substring(0, 100);
                            $scope.articles[key].content += " ...";
                        });
                    });
                    commentSvc.getComments(URL).then(function (data) {
                        $scope.comments = data;
                        angular.forEach(data, function (val, key) {
                            userSvc.getUserById(URL, data[key].author).then(function (res) {
                                $scope.comments[key].author = res.username;
                            });
                            $scope.comments[key].content = val.content.substring(0, 100);
                            $scope.comments[key].content += " ...";
                        });
                    });
                } else {
                    console.log("test");
                    Materialize.toast('You have to be admin !', 3000);
                    $location.path("/login");
                }
            } else {
                Materialize.toast('You have to be log !', 3000);
                $location.path("/login");
            }
            //Function Articles
            $scope.createArticle = function () {
                articleSvc.createArticle(URL, U.title, U.content, token).then(function (data) {
                    $scope.CAresponse = data;
                });
            };

            $scope.modifyUser = function (user) {
                $('#modal1').openModal();
                $scope.user = user;
                $scope.roles = this.roles;
            };

            $scope.modifyRole = function (user) {
                $('#modal2').openModal();
                $scope.user = user;
            };

            $scope.modifyArticle = function (article) {
                $('#modal3').openModal();
                $scope.article = article;
                $scope.content = article.content;
            };

            $scope.modalDeleteArticle = function (article) {
                $('#modal4').openModal();
                $scope.article = article;
            };

            $scope.modifyCommentary = function (commentary) {
                $('#modal5').openModal();
                $scope.commentary = commentary;
                $scope.content = commentary.content;
            };

            $scope.modalDeleteComment = function (commentary) {
                $('#modal6').openModal();
                $scope.commentary = commentary;
            };

            $scope.newArticleModal = function () {
                $('#modal7').openModal();
            };

            $scope.submitPassword = function (user) {
                userSvc.updateUser(URL, user._id, user.username, this.password, user.role, token)
                    .then(function (response) {
                        if (response == 200) {
                            $('#modal1').closeModal();
                            $route.reload();
                            Materialize.toast('Password modified!', 3000);
                        } else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    });
            };

            $scope.submitRole = function (user) {
                userSvc.changeRole(URL, user._id, this.role, token)
                    .then(function (response) {
                        if (response == 200) {
                            $('#modal2').closeModal();
                            $route.reload();
                            Materialize.toast('Role modified!', 3000);
                        }
                        else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    });
            };

            $scope.submitArticle = function (article) {
                articleSvc.updateArticle(URL, article._id, this.title, this.content, article.author, token)
                    .then(function (response) {
                        if (response == 200) {
                            $('#modal3').closeModal();
                            $route.reload();
                            Materialize.toast('Article modified!', 3000);
                        } else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    });
            };

            $scope.deleteArticle = function (article) {
                articleSvc.deleteArticle(URL, article._id, token)
                    .then(function (response) {
                        if (response == 200) {
                            $('#modal4').closeModal();
                            $route.reload();
                            Materialize.toast('Article deleted!', 3000);
                        } else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    })
            };

            $scope.submitCommentary = function (commentary) {
                commentSvc.updateComment(URL, commentary._id, this.content, token)
                    .then(function (response) {
                        if (response == 200) {
                            $('#modal5').closeModal();
                            $route.reload();
                            Materialize.toast('Comment modified!', 3000);
                        } else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    });
            };

            $scope.deleteCommentary = function (commentary) {
                commentSvc.deleteComment(URL, commentary._id, token)
                    .then(function (response) {
                        if (response == 200) {
                            $('#modal6').closeModal();
                            $route.reload();
                            Materialize.toast('Comment deleted!', 3000);
                        } else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    })
            };

            $scope.newArticle = function () {
                articleSvc.createArticle(URL, this.title, this.content, token)
                    .then(function (response) {
                        if (response != 500) {
                            $('#modal7').closeModal();
                            $route.reload();
                            Materialize.toast('Article created!');
                        } else {
                            Materialize.toast('Oops server error.', 3000);
                        }
                    })
            };

        }]);
