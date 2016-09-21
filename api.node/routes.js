var mongoose = require('mongoose');
var user = require("./controller/user");
var article = require("./controller/articles");
var comments = require("./controller/comments");

module.exports = {
    configure: function(app) {
	app.get('/', function(req, res){
	    res.writeHead(200, {'Content-Type' : 'application/json'});
	    res.end(JSON.stringify({'Code': 'OK '}, null, 2));
	});
	// URL for aricles
	app.get('/articles/:id', function(req, res){
	    article.getById(req.params.id, res);
	});
	app.post('/articles/add', function(req, res) {
	    var token = getToken(req.headers);
	    article.addArticle(req.body.title, req.body.content, token, res);
	});

	app.get('/articles', function(req, res){
	    article.getAllArticle(res);
	});

	app.delete('/articles/delete/:id', function(req, res){
	    var token = getToken(req.headers);
	    article.remove(req.params.id, token, res);
	});
	
	app.put('/articles/update/:id', function(req, res){
	    var token = getToken(req.headers);
	    article.update(req.params.id, req.body.title, req.body.content, token, res);
	});

	//URL for Users
	app.post('/users/create', function(req, res) {
	    user.create(req.body.username, req.body.password, req.body.role, res);
	});

	app.get('/users/:id', function(req, res) {
	    user.getUserById(req.params.id, res);
	});

	app.get('/users',  function(req, res){
	    user.getAllUser(res);
	});

	app.put('/users/update/:id', function(req, res){
	    var token = getToken(req.headers);
	    user.update(req.params.id, req.body.username, req.body.password, token,res);
	});

	app.put('/users/role/update/:id', function(req, res){
	    var token = getToken(req.headers);
	    user.changeRole(req.params.id, req.body.role, token, res);
	});

	app.post('/users/auth', function(req, res){
	    user.auth(req.body.username, req.body.password, res);
	});

	app.delete('/users/delete/:id', function(req, res){
	    var token = getToken(req.headers);
	    user.remove(req.params.id, token, res);
	});

	app.post('/users/isAdmin', function(req, res){
	    var token = getToken(req.headers);
	    user.isAdmin(token, res);
	});

	//URL for comments
	app.get('/comments/:id', function(req, res) {
	    comments.getById(req.params.id, res)
	});

	app.get('/comments', function(req, res){
	    comments.getAllComments(res);
	});

	app.post('/comments/add', function(req, res){
	    var token = getToken(req.headers);
	    comments.create(req.body.id, req.body.title, req.body.content, token, res);
	});

	app.put('/comments/update/:id', function(req, res){
	    var token = getToken(req.headers);
	    comments.update(req.params.id, req.body.content, token, res);
	});

	app.put('/comments/rate/:id', function(req, res){
	    var token = getToken(req.headers);
	    comments.rating(req.params.id, req.body.rating, token, res);
	});

	app.delete('/comments/delete/:id', function(req, res){
	    var token = getToken(req.headers);
	    comments.remove(req.params.id, token, res);
	});
    }
};

getToken = function (headers) {
    if (headers && headers.authorization) {
	var parted = headers.authorization.split(' ');
	if (parted.length === 2) {
	    return parted[1];
	} else {
	    return null;
	}
    } else {
	return null;
    }
};
