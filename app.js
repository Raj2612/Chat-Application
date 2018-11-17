'use strict'
const express=require('express');
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
const Users=require('./models/user.js');
const Messages=require('./models/message.js');
const mongoose=require('mongoose');
const md5=require('md5');
const ObjectId=mongoose.Types.ObjectId;
const session=require('express-session');
mongoose.connect('mongodb://127.0.0.1:20015/ChatApp3090807');
const credentials = require('./credentials.js');


const handlebars=require('express-handlebars').create({
	defaultLayout:'main',
	helpers:{
	   section: function(name, options){ 
			if(!this._sections) this._sections = {}; 
			this._sections[name] = options.fn(this); 
			return null;
		    } 		
	}
});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');


Users.find(function(err,users){
	if(users.length) return;
	new Users({
		_id:ObjectId(),
		username:'admin',
		password:md5('admin'),
		role:'Administrator',
		postStatus:true,
		
	}).save();
});

app.use(express.static(path.resolve(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
	secret:credentials.cookieSecret,
	saveUninitialized:false,
	resave:true,
}));


app.get('/',function(req,res){
	if(req.signedCookies.remember){
		req.session.user=JSON.parse(req.signedCookies.user);
		res.render('login',req.session.user);
	} 
	else res.render('login');
});
app.get('/register',function(req,res){
	if(req.session.user && req.session.user.role=="Administrator"){
		res.render('register');
	}
	else res.render('401');
	
});
app.get('/myposts',function(req,res,next){
	if(req.session.user && req.session.user.role=="Regular"){
		Messages.find({username:req.session.user.username},function(err,messages){
			if(err) next(err);
			var userMessages={};
			if(req.signedCookies.post) userMessages.messages=messages.reverse();
			else userMessages.messages=messages;
			res.render('myposts',userMessages);
		});
	}
	else res.render('401');
	
});
app.get('/chat',function(req,res,next){
	if(req.session.user){
		Messages.find(function(err,messages){
			if(err) next(err);
			var contextMessages={};
			contextMessages.messages=messages;
			if(req.session.user.postStatus) contextMessages.canPost=true;
			if(req.session.user.role=='Regular') res.render('chat',contextMessages);
			else res.render('adminchat',contextMessages);
		});
	}
	else res.redirect('/');
});
app.get('/Users',function(req,res){
	if(req.session.user && req.session.user.role=="Administrator"){
		Users.find(function(err,users){
			var contextUsers={};
			users.forEach(function(user){
				if(user.postStatus) user.status="RW";
				else user.status="R";
			});
			contextUsers.users=users;
			res.render('users',contextUsers);
		});
	}
	else res.render('401');
	
});
app.get('/settings',function(req,res){
	if(req.session.user && req.session.user.role=="Regular"){
		var context={};
		if(req.signedCookies.post) context.postOn=true;
		if(req.signedCookies.remember) context.rememberOn=true;
		res.render('settings',context);
	}
	else res.render('401');
	
});
app.get('/logout',function(req,res){
	delete req.session.user;
	res.redirect('/');
});
app.post('/loginUser',function(req,res,next){
	Users.find({username:req.body.username},function(err,users){
		if(err) next(err);
		if(users.length==1){
			var obj=users[0];
		    	var validUser=obj.checkPassword(req.body.password);
			if(obj && validUser){
				var user={};
				user["_id"]=obj["_id"];
				user.username=obj.username;
				user.role=obj.role;
				user.postStatus=obj.postStatus;
				user.pass=req.body.password;
				req.session.user=user
				res.redirect('/chat');
			} 
			else res.render('401');
		}
		else res.render('401');
	});
});
app.post('/registerUser',function(req,res){
	if(req.session.user && req.session.user.role=="Administrator"){
		new Users({
		_id:ObjectId(),
		username:req.body.username,
		password:md5(req.body.password),
		role:req.body.role,
		postStatus:true,
		
		}).save();
		res.redirect('/register');
	}
	else res.send(JSON.stringify({sucess:false}));
	
	
});
app.post('/chat',function(req,res){
	if(req.session.user){
		var obj={}
		obj.username=req.session.user.username;
		obj.message=req.body.message;
		obj.id=ObjectId();
		res.send(JSON.stringify(obj));
		new Messages({
			_id:obj.id,
			username:req.session.user.username,
			message:req.body.message,
		}).save();
	}
	else res.send(JSON.stringify({sucess:false}));
	
});
app.get('/data',function(req,res,next){
	if(req.session.user){
		Messages.find(function(err,messages){
			if(err) next(err);
			res.send(JSON.stringify(messages))
		});
	}
	else res.send(JSON.stringify({sucess:false}));
});
app.post('/deletePost',function(req,res,next){
	if(req.session.user){
		Messages.remove({_id:req.body.id},function(err){
			if(err) next(err);
			else res.send(JSON.stringify({sucess:true}));
		});
	}
	else res.send(JSON.stringify({sucess:false}));
	
});
app.post('/deleteUser',function(req,res,next){
	if(req.session.user && req.session.user.role=="Administrator"){
		Users.remove({_id:req.body.id},function(err){
			if(err) next(err);
			else res.send(JSON.stringify({sucess:true}));
		});
	}
	else res.send(JSON.stringify({sucess:false}));
});
app.post('/changeStatus',function(req,res,next){
	if(req.session.user && req.session.user.role=="Administrator"){
		Users.update({ _id:req.body.id }, { $set: { postStatus:req.body.status }},function(err){
			if(err) next(err);
			else res.send(JSON.stringify({sucess:true}));
		});
	}
	else res.send(JSON.stringify({sucess:false}));
});
app.post('/settings',function(req,res){
	if(req.session.user){
		var age=360*24*60*60*1000;
		if(req.body.id=="post"){
			if(req.signedCookies.post) res.clearCookie('post');
			else res.cookie('post',true,{signed:true,maxAge:age});
		}
		else{		
			if(req.signedCookies.remember){
				res.clearCookie('remember');
				res.clearCookie('user');
			}
			else{
				res.cookie('remember',true,{signed:true,maxAge:age});
				res.cookie('user',JSON.stringify(req.session.user),{signed:true,maxAge:age});
			} 
		}
		res.send(JSON.stringify({sucess:true}));
	}
	else res.send(JSON.stringify({sucess:false}));
	
});
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});
app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

app.listen(3014,function(){
	console.log('Server up and running on port 3014');
})

