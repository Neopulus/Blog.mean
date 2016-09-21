var mongoose = require('mongoose');
var Article = require("../schemas/article.js");
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require("../config/config");
require("../passport.js")(passport);

function ArticleManager() {
    this.getById = function(id, res) {
	Article.findById(id, function(err, doc){
	    if (err) {
		res.writeHead(500, {'Content-Type':'application/json'});
		res.end(JSON.stringify({'Message':'Error fetching article'}));
	    }
	    res.json(doc);
	});
    };

    this.addArticle = function(title,content, tokenUserAuth,res) {
	if (tokenUserAuth != null){
	    try{
		var decoder = jwt.decode(tokenUserAuth, config.secret);
	    }
	    catch (err){
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
	    }
	    if (decoder.role === 'admin'){
		var newArticle = new Article();
		newArticle.title = title;
		newArticle.content = content;
		newArticle.author = decoder._id;
		newArticle.comments = [];
		newArticle.save(function(err, doc){
		    if (err){
			res.writeHead(500, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({'Message':'Add article failed'}, null, 2));
		    }
		    res.writeHead(201, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify(doc, null, 2));
		});
	    }
	    else {
		res.writeHead(401, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message':'You must to be admin'}, null, 2));
	    }
	}
	else {
	    res.writeHead(403, {'Content-Type' : 'application/json'});
	    res.end(JSON.stringify({'Message':'No token provided'}, null, 2));
	}
    };

    this.update = function(id, title, content, tokenUserAuth, res) {
	if (tokenUserAuth != null){
	    try{
		var decoder = jwt.decode(tokenUserAuth, config.secret);
	    }
	    catch (err){
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
	    }
	    if (decoder.role === 'admin'){
		Article.findById(id, function(err, doc) {
		    if (err){
			res.writeHead(500, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({'Message':'Internal Server Error'}, null, 2));
		    }
		    else if (doc === null) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify({'Message' : 'Article not found'}, null, 2));
		    }
		    else {
			if (title !== undefined)
			{
			    doc.title =  title;
			    doc.update_at = new Date();
			}
			if (content !== undefined)
			{
			    doc.content = content;
			    doc.update_at = new Date();
			}
			doc.save(function(err){
			    if (err)
			    {
				res.writeHead(500, {'Content-Type' : 'application/json'});
				res.end(JSON.stringify({'Message': 'Error updtating article'}));
			    }
			    res.writeHead(200, {'Content-Type' : 'application/json'});
			    res.end(JSON.stringify({'Message': 'Article updtating successfuly'}));
			});
		    }
		});
	    }
	    else{
		res.writeHead(401, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'You must to be admin'}));
	    }
	}
	else {
	    res.writeHead(403, {'Content-Type' : 'application/json'});
	    res.end(JSON.stringify({'Message': 'No token provided'}));
	}
    };

    this.getAllArticle = function(res) {
	Article.find({}, function(err, docs){
	    if (err) {
		res.writeHead(500, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message':'Internal Server Error'}, null, 2));
	    }
	    res.json(docs);
	});
    };

    this.remove = function(id, tokenUserAuth, res) {
	if (tokenUserAuth != null){
	    try{
		var decoder = jwt.decode(tokenUserAuth, config.secret);
	    }
	    catch (err){
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
	    }
	    if (decoder.role === 'admin'){
		Article.remove({_id:id}, function(err, doc){
		    if (err){
			res.writeHead(500, {'Content-Type':'application/json'});
			res.end(JSON.stringify({'Message':'Error deleting article'}, null, 2));
		    }
		    res.writeHead(200, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Message':'Article delete successfuly'}, null, 2));
		});
	    }
	    else {
		res.writeHead(401, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'You must to be admin'}));
	    }
	}
	else {
	    res.writeHead(403, {'Content-Type' : 'application/json'});
	    res.end(JSON.stringify({'Message': 'No token provided'}));
	}
    };
    
}

module.exports = new ArticleManager();
