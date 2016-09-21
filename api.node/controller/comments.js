var Comments = require("../schemas/comment.js");
var Article = require("../schemas/article.js");
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require("../config/config");
require("../passport.js")(passport);


function CommentsManager() {
    this.getById = function(id, res) {
	Comments.findById(id, function(err, doc) {
	    if (err) {
		res.writeHead(500, {'Content-Type':'application/json'});
		res.end(JSON.stringify({'Message' : 'Error fetching data'}, null, 2));
	    }
	    res.json(doc);
	});
    };

    this.create = function(idArticle, title, content, tokenUserAuth, res) {
	if (tokenUserAuth != null){
	    try{
		var decoder = jwt.decode(tokenUserAuth, config.secret);
	    }
	    catch (err){
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
	    }
	    var newComment = new Comments();
	    newComment.content = content;
	    newComment.title = title;
	    newComment.author = decoder._id;
	    newComment.save(function(err, doc) {
		if (err){
		    res.writeHead(500, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Error' : 'Comments add failed'}, null, 2));
		}
		
	    });
	    Article.findById(idArticle, function(err, doc){
		if (err) {
		    res.writeHead(500, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Error' : 'Comments add failed when we found article'}, null,2));
		} 
		if (doc !== undefined || doc != null) {
		    doc.comments.push(newComment._id);
		    doc.save(function(err, doc){
			if (err){
			    res.writeHead(500, {'Content-Type':'application/json'});
			    res.end(JSON.stringify({'Error' : 'Comments add to article failed'}, null, 2));
			}
		    });
		    res.writeHead(201,{'Content-Type':'application/json'});
		    res.end(JSON.stringify(doc, null,2));
		}
		else {
		    res.writeHead(404, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Error' : 'Article with id '+idArticle+' not found' }, null, 2));
		}
	    });
	}
	else {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({'Error' : 'No token provided'}, null, 2));
	}
    };

    this.update = function (id, content, tokenUserAuth, res) {
	if (tokenUserAuth != null){
	    Comments.findById(id, function (err, doc){
		if (err){
		    res.writeHead(500, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify({'Message': 'Error updtating data'}));
		}
		else if (doc === null){
		    res.writeHead(404, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Message' : 'Comments to update not found'}, null, 2));
		}
		else {
		    if (content !== undefined)
		    {
			doc.content = content;
			doc.update_at = new Date();
		    }
		    doc.save(function (err){
			if (err){
			    res.writeHead(500, {'Content-Type' : 'application/json'});
			    res.end(JSON.stringify({'Message': 'Error updtating data'}));
			}
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({'Message' : 'Comment updtating successfuly'}, null, 2));
		    });
		}
	    });
	}
	else {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({'Error' : 'No token provided'}, null, 2));
	}
    };

    this.rating = function (id, rating, tokenUserAuth, res) {
	if (tokenUserAuth != null){
	    Comments.findById(id, function (err, doc){
		if (err)
		{
		    res.writeHead(500, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify({'Message': 'Internal Server Error'}));
		}
		else if (doc === null){
		    res.writeHead(404, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Message' : 'Comments to rating not found'}, null, 2));
		}
		else {
		    if (rating !== undefined) {
			doc.rating = rating;
			doc.update_at = new Date();
		    }
		    doc.save(function(err){
			if (err){
			    res.writeHead(500, {'Content-Type' : 'application/json'});
			    res.end(JSON.stringify({'Message': 'Internal Server Error'}));
			}
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({'Message': 'Comment rate successfuly'}));
		    });
		}
	    });
	}
	else {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({'Error' : 'No token provided'}, null, 2));
	}
    };

    this.getAllComments = function (res) {
	Comments.find({}, function(err, docs){
	    if(err){
		res.writeHead(500, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'Error fetching data'}));
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
		Comments.remove({_id:id}, function(err){
		    if (err){
			res.writeHead(500, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({'Message': 'Error deleting comment'}));
		    }
		    res.writeHead(200, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify({'Message': 'Comment deleting successfuly'}));
		});
	    }
	    else {
		res.writeHead(401, {'Content-Type':'application/json'});
		res.end(JSON.stringify({'Error' : 'You must to be admin'}, null, 2));
	    }
	}
	else {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({'Error' : 'No token provided'}, null, 2));
	}
    };
    
}

module.exports = new CommentsManager();
