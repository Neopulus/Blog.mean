var mongoose = require('mongoose');
var User = require("../schemas/user.js");
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require("../config/config");
require("../passport.js")(passport);

function UserManager() {
    this.create = function(username, password, role,res){
	User.findOne({username:username}, function (err, result) {
	    if (err) {
		res.writeHead(500, {'Content-Type':'application/json'});
	        res.end(JSON.stringify({'Error' : 'Internal Server Error'}, null, 2));
	    }
	    else if (result !== null)
	    {
		res.writeHead(400, {'Content-Type':'application/json'});
		res.end(JSON.stringify({'Message' : 'User already exist'}, null, 2));
	    }
	    else {
		var newUser = new User();
		newUser.username = username;
		newUser.password = password;
		newUser.role = role;
		newUser.save(function(err, doc) {
		    if (err) {
			res.writeHead(500, {'Content-Type':'application/json'});
			res.end(JSON.stringify({'Error' : 'User add failed'}, null, 2));
		    }
		    res.writeHead(201,{'Content-Type':'application/json'});
		    res.end(JSON.stringify(doc, null,2));
		});
		
	    }
	});
    };

    this.getUserById = function (id, res) {
	User.findById(id, function(err, doc) {
	    if (err) {
		res.writeHead(500, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'Error fetching data'}));
	    }
	    res.json(doc);
	});
    };

    this.getAllUser = function (res) {
	User.find({}, function(err, docs){
	    if (err) {
		res.writeHead(500, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'Error fetching data'}));
	    }
	    res.json(docs);
	});
    };

    this.update = function (id,username, password, tokenUserAuth, res) {
	if (tokenUserAuth != null){
	    User.findById(id, function(err, doc){
		if (err){
		    res.writeHead(500, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify({'Message': 'Error updtating data'}));
		}
		else if (doc === null)
		{
		    res.writeHead(404, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Message' : 'User not found'}, null, 2));
		}
		else {
		    if (username !== undefined)
		    {
			doc.username = username;
		    }
		    if (password !== undefined) {
			doc.password = password;
		    }
		    doc.save(function(err){
			if (err){
			    res.writeHead(500, {'Content-Type' : 'application/json'});
			    res.end(JSON.stringify({'Message': 'Error updtating data'}));
			}
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({'Message': 'User updtating successfuly'}, null, 2));
		    });
		}
	    }); 	    
	}
	else{
	    res.writeHead(403, {'Content-Type' : 'application/json'});
	    res.end(JSON.stringify({'Message': 'No token provided'}));
	}
    };
	
    this.auth =  function (username, password, res) {
	User.findOne({username:username}, function(err, doc){
	    if (err){
		res.writeHead(500, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'Internal Server Error'}));
	    }
	    else if (doc === null){
		res.writeHead(404, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message': 'Authentification failed'}));
	    }
	    else {
		if (doc.password === password)
		{
		    var token = jwt.encode(doc, config.secret);
		    res.json({success: true, token: 'JWT ' + token});
		}
		else {
		    res.writeHead(400, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify({'Message': 'Wrong password.'}));
		}
	    }
	});
    };

    this.changeRole = function (id, role, tokenUserAuth, res) {
	if (tokenUserAuth != null)
	{
	    try{
		var decoder = jwt.decode(tokenUserAuth, config.secret);
	    }
	    catch (err){
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
	    }
	    
	    if (decoder.role !== 'admin')
	    {
		res.writeHead(401, {'Content-Type':'application/json'});
		res.end(JSON.stringify({'Message':'Not authorized for this action'}));
	    }
	    else
	    {
		User.findOne(id, function (err, doc){
		    if (err){
			res.writeHead(500, {'Content-Type':'application/json'});
			res.end(JSON.stringify({'Message':'Error updtating role'}));
		    }
		    else if (doc === null) {
			res.writeHead(404, {'Content-Type':'application/json'});
			res.end(JSON.stringify({'Message':'User not found'}));
		    }
		    else {
			if (role !== undefined){
			    doc.role = role;
			}
			doc.save(function(err){
			    if (err){
				res.writeHead(500, {'Content-Type':'application/json'});
				res.end(JSON.stringify({'Message':'Error updating role'}));
			    }
			    res.writeHead(200, {'Content-Type':'application/json'});
			    res.end(JSON.stringify({'Message':'Role update successfuly'}));
			});
		    }
		});
	    }
	}
	else {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({'Message':'No token provided'}));
	}
    };

    this.remove = function(id, tokenUserAuth, res){
	if (tokenUserAuth != null){
		try{
		    var decoder = jwt.decode(tokenUserAuth, config.secret);
		}
		catch (err){
		    res.writeHead(400, {'Content-Type' : 'application/json'});
		    res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
		}
	    if (decoder.role === 'admin'){
		User.remove({_id:id}, function(err, doc){
		    if (err){
			res.writeHead(500, {'Content-Type':'application/json'});
			res.end(JSON.stringify({'Message':'Error while deleting User'}, null, 2));
		    }
		    res.writeHead(200, {'Content-Type':'application/json'});
		    res.end(JSON.stringify({'Message':'User delete successfuly'}, null, 2));
		});
	    }
	    else {
		res.writeHead(401, {'Content-Type':'application/json'});
		res.end(JSON.stringify({'Message':'You must to be admin'}, null, 2));
	    }
	}
	else {
	    res.writeHead(403, {'Content-Type':'application/json'});
	    res.end(JSON.stringify({'Message':'No token provided'}, null, 2));
	}
    };

    this.isAdmin = function(tokenUserAuth, res){
	if (tokenUserAuth != null){
	    try {
		var decoder = jwt.decode(tokenUserAuth, config.secret);
	    }
	    catch (err) {
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'Message' : 'token may be incorrect'}, null, 2));
	    }
	    if (decoder.role === 'admin'){
		res.writeHead(200, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'is_admin' : 'true'}, null, 2));
	    }
	    else {
		res.writeHead(200, {'Content-Type' : 'application/json'});
		res.end(JSON.stringify({'is_admin' : 'false'}, null, 2));
	    }
	}
    };
}

module.exports = new UserManager();
