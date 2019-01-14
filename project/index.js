var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var mongoose = require('mongoose');
var session = require('express-session');
var popupTools=require('popup-tools');
mongoose.connect('mongodb://localhost/myproject');
var path = require('path');
var bodyparser = require('body-parser');
app.use(bodyparser.json());
var cookieParser = require('cookie-parser')
  var datetime = new Date();

app.use(cookieParser())
app.use(bodyparser.urlencoded({ extended: true}));
   app.use(session({
    secret: 'cookie_secret',
    name: 'cookie_name',
   
    resave: true,
    saveUninitialized: true
}));

var userSchema=mongoose.Schema({
	_id: String,
	name: String,
    pass: String,
	college: String,
	department: String,
	type: Number
});
var users = mongoose.model("users", userSchema);

var csSchema = mongoose.Schema({
	testName: String,
	que: String,
	op1: String,
	op2: String,
	op3: String,
	op4: String,
	ans: String
});
var cquestions=mongoose.model("cquestions",csSchema);

var sSchema=mongoose.Schema({
	name: String,
	email: String,
	time: String
});
var peoples=mongoose.model("peoples",sSchema);

var sess;
app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});
app.get('/test', function(req, res) {
  res.render('test');
});

app.get('/teacher', function(req, res) {
  res.render('teacher');
});
app.get('/newuser', function(req, res) {
	sess=req.session;
	if(sess._id)
  res.render('newuser');
else
	res.render('login');
});
app.get('/admin', function(req, res) {
	sess=req.session;
	if(sess._id)
  res.render('admin');
else
	res.render('login');
});

app.get('/student', function(req, res) {
	sess=req.session;
	if(sess._id)
  res.render('student');
else
	res.render('login');
});
app.get('/prac', function(req, res) {
	sess=req.session;
	if(sess._id)
  res.render('prac');
else
	res.render('login');
});
app.post('/insert',function(req,res){                           //signup
	var userInfo=req.body; 
	
	
	if(!userInfo.name || !userInfo.email || !userInfo.psw || !userInfo.college || !userInfo.dept){
		//res.send('insufficient data');
      res.redirect('/signup');
   } else{
	   var newuser=new users({
		   name:userInfo.name,
		   _id:userInfo.email,
		   pass:userInfo.psw,
		   college:userInfo.college,
		   department:userInfo.dept,
		   type:2
	   });
	   
	   newuser.save(function(err,users){
		   if(err)
            res.send('<script>alert("error")</script>');
         else
		 {
            //res.send('<script>alert("Success")</script>');
		res.render('login');
		 }
      });
   }
});
		   
	app.post('/log',function(req,res){                        //login
		var userInfo=req.body; 
		sess=req.session;
		sess._id=req.body.email;
		users.findOne({_id:userInfo.email},function(err,response){
			if(err)
				throw err;
			if(response)
			{
			    if(response.pass ===userInfo.psw)
				{
					if(response.type ===0)
						res.render('admin');
					else if(response.type ===1)
						res.render('teacher');
					else if(response.type ===2)
						res.render('student');
				}
				else
				{
					res.render('login');
				}
			}
				else
				{
					res.render('login');
				}
		});
	});
	
	
	app.post('/new',function(req,res){                   //adding a new user
	var userInfo=req.body;
	
	
	if(!userInfo.name || !userInfo.email || !userInfo.psw || !userInfo.dept){
		//res.send('insufficient data');
      res.redirect('/newuser');
   } else{
	   var newuser=new users({
		   name:userInfo.name,
		   _id:userInfo.email,
		   pass:userInfo.psw,
		   college:' ',
		   department:userInfo.dept,
		   type:userInfo.type
	   });
	   
	   newuser.save(function(err,users){
		   if(err)
            res.send('<script>alert("error")</script>');
         else
		 {
            //res.send('<script>alert("Success")</script>');
		res.render('admin');
		 }
      });
   }
});
	
	app.get('/logout',function(req,res){              //logout
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/login');
  }
});
	});
	
	
	app.get('/tlist',function(req,res){                   //teacher list print
		sess=req.session;
	if(sess._id)
	{
		users.find({type:1},function(err,docs){
			if(err)
				res.json(err);
			else
				res.render('tlist',{users:docs});
		});
	}
	else
		res.render('login');
	}); 
	app.get('/slist',function(req,res){                       //student list print
		sess=req.session;
	if(sess._id)
	{
		users.find({type:2},function(err,docs){
			if(err)
				res.json(err);
			else
				res.render('slist',{users:docs});
		});
	}
	else
		res.render('login');
	});
	
	
	app.get('/remove', function(req, res) {                         //remove page route
	sess=req.session;
	if(sess._id)
  res.render('remove');
else
	res.render('login');
});

app.post('/rem',function(req,res){                      //to remove a user
	var userInfo=req.body;
	users.findOneAndDelete({_id:userInfo.email},function(err,response){
			if(err)
				throw err;
			else
				res.render('admin');
	});
});


app.post('/ttest',function(req,res){
	var quesInfo=req.body;
	//if(!quesInfo.title || !quesInfo.ques || !quesInfo.a ||  !quesInfo.b ||  !quesInfo.c ||  !quesInfo.d ||  !quesInfo.ans){
		if(!quesInfo){
		res.send('insufficient');
		//res.redirect('/teacher');
	}
	else{
		var newques=new cquestions({
			testName:quesInfo.name,
			que: quesInfo.ques,
	        op1: quesInfo.a,
	        op2: quesInfo.b,
	        op3: quesInfo.c,
	        op4: quesInfo.d,
	        ans: quesInfo.ans
		});
		newques.save(function(err,cquestions){
		if(err)
			res.send('error');
		else
			res.render('test');
		});
	}
});

app.get('/vque',function(req,res){                       //questions
		sess=req.session;
	if(sess._id)
	{
		cquestions.find({},function(err,docs){
			if(err)
				res.json(err);
			else
				res.render('vque',{cquestions:docs});
		});
	}
	else
		res.render('login');
	});
	
	
	app.post('/cquestion/:que/delete',function(req,res){
		cquestions.remove({que:req.params.que},function(err){
			if(err)
			{
				res.json(err);
			}
			else
			res.redirect('/vque');
		});
	});
	
	
	app.get('/java',function(req,res){                       // java questions on student panel
		sess=req.session;
	if(sess._id)
	{
		cquestions.find({testName:"Java"},function(err,docs){
			if(err)
				res.json(err);
			else
				res.render('java',{cquestions:docs});
		});
	}
	else
		res.render('login');
	});
	
	
	
	
	app.get('/end',function(req,res){
		
	
		users.findOne({_id:sess._id},function(err,response){
			if(err)
				res.json(err)
		
		var n=new peoples({
			name:response.name,
			email:response._id,
		time:datetime
		});
		n.save(function(err,peoples){
			
		   if(err)
            res.send('<script>alert("error")</script>');
         else
		 {
            //res.send('<script>alert("Success")</script>');
		res.render('student');
		 }
      });
		});	
			
	});
	
	
	
	app.get('/cq',function(req,res){                       // java questions on student panel
		sess=req.session;
	if(sess._id)
	{
		cquestions.find({testName:"C"},function(err,docs){
			if(err)
				res.json(err);
			else
				res.render('cq',{cquestions:docs});
		});
	}
	else
		res.render('login');
	});
	
	
	app.get('/on',function(req,res){                       //student list print
		sess=req.session;
	if(sess._id)
	{
		peoples.find({},function(err,docs){
			if(err)
				res.json(err);
			else
				res.render('on',{peoples:docs});
		});
	}
	else
		res.render('login');
	});
	
app.listen(3000);