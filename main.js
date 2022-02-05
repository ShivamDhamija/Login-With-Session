const express = require('express')
const session = require('express-session')
const fs=require('fs');
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
  }))

app.get("/",function(req,res){
	//if not login
	//call login page
	///else
	if(req.session.is_logged_in)
	{
		res.sendFile(__dirname+"/public/home/index.html")
 	}
	 else
	{
		res.redirect("/root");//("/login");//
	}
});

app.get("/login",function(req,res){
	if(req.session.is_logged_in)
	{
		res.sendFile(__dirname+"/public/home")
	}
	else
	{
	res.sendFile(__dirname+"/public/logIn/index.html");
	}
})
app.post("/login",function(req,res){
 
	fs.readFile(__dirname+"/data.txt","utf-8",function(err,data){
		
		if(data.length===0)
		{
			res.sendFile(__dirname+"/public/signIn/index.html");
		}
		else
		{
			let text=[];
			text = JSON.parse(data);
			
			let name=req.body.loginName;
			let pass=req.body.loginPassword;


			text.forEach(e => {
				if(e.nameValue===name&&e.passValue===pass)
				{	
					notfound=false;
					req.session.is_logged_in = true;
					res.sendFile(__dirname+"/public/home/index.html");
				}
			});
			res.sendFile(__dirname+"/public/illegal/index.html")
		}
	
	});
	//if match
	//else
	//call illegal file
})
app.get("/signin",function(req,res){
	res.sendFile(__dirname+"/public/signIn/index.html");
})
app.post("/signin",function(req,res){
	//if find in data 
	//send already page exist html
	//if not find in data then 

	fs.readFile(__dirname+"/data.txt","utf-8",function(err,data){
		
		let name=req.body.signinName;
		let pass=req.body.signPassword;
		let email=req.body.signinEmail;

		let tobeenter=false
		if(data.length===0)
		tobeenter=true;
		else
		tobeenter=false;
		let text=[];
		if(data.length>2)
		{
			
			text = JSON.parse(data);
			let no=0;
			let exist=false;
			text.forEach(e => {
			if(e.nameValue===name&&e.passValue===pass)
			{ 
				res.sendFile(__dirname+"/public/alredyExist/index.html");
				exist=!exist;
			}
			if(exist===true)
			return;
			no++;
			
		    });
			let m=0;
				text.forEach(e=>{m++;});
			let dataLength=m;
			
			if(no===dataLength)
			{tobeenter=true;}
		}
     if(tobeenter)
	 {
		text.push({nameValue:name,passValue:pass,email:email});
		
	   fs.writeFile(__dirname+"/data.txt", JSON.stringify(text) ,function(err)
		{
			res.sendFile(__dirname+"/public/logIn/index.html");
			
		});
	 }	
	});
	

	})

app.post("/myaccount",function(req,res){
	if(req.session.is_logged_in)
		res.redirect("/logind");
	else
	 res.redirect("/logIn");
})

app.get("/logout", function(req, res)
{
	req.session.destroy();

	res.redirect("/")
})

app.listen(3000,function(){
    console.log("working on port 3000")
})
