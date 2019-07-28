var express = require("express");
var session = require("express-session");
var https = require("https");
var fs = require("fs");
var server = express();
var path = require('path');
var flash = require("connect-flash");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require('cors')
server.use(bodyParser.json({limit: "5mb"}))

var corsOptions = {
  "Access-Control-Allow-Origin":"*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

server.use(cors(corsOptions))
server.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next();
});
mongoose.connect("mongodb://localhost:27017/Souq");

var options = {
  key: fs.readFileSync(__dirname+"/httpslicense/server.key"),
  cert: fs.readFileSync(__dirname+"/httpslicense/server.crt")
};

var httpsServer = https.createServer(options,server);


// // server.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
// server.use(bodyParser.json()); // to support JSON-encoded bodies
// // app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
// //     extended: true
// // }))

fs.readdirSync(path.join(__dirname,"models")).forEach(function(filename){
    require('./models/'+filename);
});


var itemRouter = require("./controllers/items");
server.use("/items",itemRouter);

var catRouter = require("./controllers/categories");
server.use("/categories",catRouter);

var productsRouterMid  = require("./router/productsRouter");
server.use("/products" , productsRouterMid);

server.use(express.static('public'));

server.use(flash());


var userRouter = require("./controllers/users");

server.use("/users",userRouter);

server.set("view engine","ejs");
server.set("views","./views");

var forgPwRouter = require("./controllers/forgetPw");
server.use("/forgetPw",forgPwRouter);

var authRouter = require("./controllers/Auth");
server.use("/auth",authRouter);
server.use("/signUp",authRouter);

//Auth Mid
// server.use(function(req,res,next){
//   if(req.session.logged){
//     res.locals={
//       //save suer id
//       username:req.session.username,
//       userimage:req.session.image
//     }
//     res.json(res.locals)
//   }
//   else
//   res.redirect("/auth/login/GooglePlusLogin");
// });
// Auth Mid
// server.use(function(req,resp,next){
//   if(req.session.logged){
//     resp.locals={
//       email:req.session.email
//     }
//     next();
//   }
//
//   else
//     resp.redirect("/auth/userlogin");
// });

httpsServer.listen(9090,function(){
  console.log("Starting listen...");
});
