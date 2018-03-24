const GOOGLE_CREDENTIALS = require("./GOOGLE_CREDENTIALS");
const FACEBOOK_CREDENTIALS = require("./FACEBOOK_CREDENTIALS");
var express = require("express");
var fs = require("fs");
var multer  = require("multer");
var mongoose = require("mongoose");
var fileUploadMid = multer({dest:"./public/images"});
var UserModel = mongoose.model("users");
var bodyParser = require("body-parser");
bodyParser.json();
var urlEncodedMid = bodyParser.urlencoded({extended:true});
var curl = require('curlrequest');

var jwt=require("jsonwebtoken");
var graph = require('fbgraph');

var {google} = require('googleapis');
var plus = google.plus('v1');

var router = express.Router();

//google+ information
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  GOOGLE_CREDENTIALS.web_client_id,
  GOOGLE_CREDENTIALS.web_client_secret,
  GOOGLE_CREDENTIALS.web_redirect_uris[0]
);
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];


////////////////////////////////////////////////////////////////////////////////////

router.post("/userlogin",urlEncodedMid,function(req,resp){

  UserModel.findOne({email:req.body.email,password:req.body.password},function(err,data){
   if(data != null && !err)
   {
     const payload = {email: data.email};
     const token=jwt.sign(payload,'myscret');
     resp.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user:data
        });
  }
  else
  {
    resp.json({"error":"invalid Username or password"});
  }
  });
});

//////////jwt//////////////////////////////////////////

router.get('/verify',verifyJWToken,function(req,res){
  jwt.verify(req.token,'myscret',(err,data)=>{
    if(!err)
      res.json({"success":"valid"});
    else
    res.json({"error":"invalid"})
  });
});

///////////////////////////////////////////////
router.get('/api/protected',verifyJWToken,function(req,res){
  jwt.verify(req.token,'myscret',(err,data)=>{
    if(!err)
      res.json({"success":data.email});
    else
    res.json({"error":err})
  });
});

///// jwt Mw verifyJWToken
function verifyJWToken(req,res,next){
  const authHeader=req.headers['authorization'];
  if( typeof authHeader!=="undefined"){
     req.token=authHeader;
     next();
  }
  else
    res.json({"error":"not verified"})
}

///////////////////////////////////////////////////
/*****User Logout******/
router.get("/logout",function(req,resp){
  req.session.destroy();
  resp.redirect("/auth/login");
});

////////////////////////////////////////////////////////////////////////////////////////////////
function isUserExist(Useremail,cb){
  UserModel.findOne({email:Useremail},function(err,data){
    if(!err)
      if(data==null)
         cb(false);
      else
        cb(true);
    else
      cb({"error":err});

    });
}

/*****User Register******/
router.get("/register",function(req,resp){
  resp.render("auth/register");
});

router.post("/register",bodyParser.json(),function(req,resp){
console.log(req.body);
  //fs.renameSync("./public/images/"+req.file.filename,"./public/images/"+req.file.originalname)
  var user = new UserModel({
    name:req.body.username,
    password:req.body.password,
    email:req.body.email,
    address:req.body.address,
    //image:req.body.imag,
  });
  saveProfile(user,function(DBRes){
      resp.json(DBRes);
  });
});

/*****Seller Register******/

router.get("/sellerRegister",function(req,resp){
  resp.render("auth/sellerRegister");
});

router.post("/sellerRegister",fileUploadMid.single('image'),function(req,resp){
  fs.renameSync("./public/images/"+req.file.filename,"./public/images/"+req.file.originalname)
  var user = new UserModel({
    name:req.body.username,
    password:req.body.password,
    email:req.body.email,
    address:req.body.address,
    image:req.file.originalname,
    nationalID:req.body.ID
  });

  saveProfile(user,function(DBRes){
      resp.json(DBRes);
  });
});

/*****Login with Google******/
router.get("/login/GooglePlusLogin",function(req,res){
  // Generate Login URL
  var urlG = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.json(urlG);
});


router.get('/login/Gmailcallback',function(req,res){

  console.log("login with call back");
  var code= req.query.code;
  oauth2Client.getToken(code, function (err, tokens) {
    if (!err) {
       oauth2Client.setCredentials(tokens);
       plus.people.get({
         userId: 'me',
         auth: oauth2Client
        }, function (err, response) {
          if(!err){
            CreateProfile(response,tokens,function(addRes){
              if(addRes==true)
                res.redirect("/auth/SaveProfile");
              else
                 res.json({"error":addRes});
             });
          }
          else
               res.json({"error":err});
        });
    }
    else
       res.json({"error":"error while try login with gmail"});
  });
});


function saveProfile(user,cb){

  isUserExist(user.email,function(Udata){
    console.log(Udata)
    if(!Udata.error&&Udata==false){
      user.save(function(err,doc){
        if(!err)
          cb(true);
        else
          cb(false);
      });
    }
    else
      cb("user email exist");
  });

}
function CreateProfile(response,token,cb){//gmail

      var user=new UserModel({
        name:response.data.displayName,
        email:response.data.emails[0].value,
        image:response.data.image.url,
        tokens:{'access_token':token.access_token,'refresh_token':token.refresh_token,'expires_date':token.expiry_date}
      });
    saveProfile(user,function(DBRes){
        cb(DBRes);
    });
}

// function refreshTokenGmail(tokens){
//   oauth2Client.setCredentials(tokens);
//   //regresh token
//   oauth2Client.refreshAccessToken(function(err,tokens) {
//     // your access_token is now refreshed and stored in oauth2Client
//     // store these new tokens in a safe place (e.g. database)
//   });
// }
//
router.get("/SaveProfile",function(req,res){
   res.json("add");
});

/*****Login with Facebook******/
router.get("/facebook/login",function(req,resp){
  // Generate Login URL
  var url = graph.getOauthUrl({
    client_id: FACEBOOK_CREDENTIALS.web_client_id,
    redirect_uri: FACEBOOK_CREDENTIALS.web_redirect_uris[0],
    scope:['public_profile','email']
  });
  resp.json(url);
});


router.get('/facebook/callback',function(req,resp){
  console.log("callback");
  graph.authorize({
        "client_id":      FACEBOOK_CREDENTIALS.web_client_id,
        "redirect_uri":   FACEBOOK_CREDENTIALS.web_redirect_uris[0],
        "client_secret":  FACEBOOK_CREDENTIALS.web_client_secret,
        "code":           req.query.code
    },function (err, facebookRes) {
      graph.setAccessToken(facebookRes.access_token)
      graph.get("/me?fields=id,name,picture.width(300),email",function(err,result){
        var user = new UserModel({
          name:result.name,
          email:result.email,
          image:result.picture.data.url,
          tokens:{'access_token':facebookRes.access_token,'expires_date':facebookRes.expires_in}
        });
       saveProfile(user,function(DBRes){
          resp.json(DBRes)
        });

      });
  });
});
module.exports = router;
