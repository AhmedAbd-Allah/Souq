var express = require("express");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({extended:true});
var router = express.Router();
//var multer = require("multer");
var fs = require("fs");
var mongoose = require("mongoose");
var ProductsModel = mongoose.model("products");
//var fileUploadMid = multer({dest:"./public/images"});


router.post("/add",urlEncodedMid,function(request,response)
{
    var product = new ProductsModel({
     
         _id: new mongoose.Types.ObjectId,
        name:request.body.name,
        price:request.body.price,
        offer:request.body.offer,
        stock:request.body.stock,
        description:request.body.description,
        category:request.body.category,
        subcategory:request.body.subcategory,
        DateOfEntry: new Date(),
        specifications:request.body.specifications,
        SellerID:request.body.SellerID,
        image:request.body.image,
        rating:{1:0, 2:0, 3:0, 4:0, 5:0}

      });
    product.save(function(err,doc){
    if(!err)
    {
        console.log("entry success");
        response.send("added");
    }
    else
        response.json(err);
    });
});

router.post("/update",urlEncodedMid,function(request,response)
{
    ProductsModel.findById(request.body.Id, function (err, product){
        if (err) 
        {
           var error = console.log("error here");
           return error;
        }
    
        product.name = request.body.name,
        product.price = request.body.price,
        product.offer = request.body.offer,
        product.stock = request.body.stock,
        product.description = request.body.description,
        product.category = request.body.category,
        product.subcategory = request.body.subcategory,
        product.specifications = request.body.specifications,
        product.image = request.body.image;
   
    product.save(function(err, updatedProduct){
          if (err) 
          {
            console.log("error here2");
            response.json(err);
          }
          console.log("update success");
          response.send("updated");
        });
    });
});



router.get("/update/:Id",function(request,response)
{
    ProductsModel.findOne({_id:request.params.Id},function(err,data){
   // response.product = data;
    response.json(data);
});
});

router.post("/delete",urlEncodedMid,function(request,response)
{
    ProductsModel.remove({_id:request.body.Id},function(err,data){
        if(!err)
        {
            console.log("success");
            response.send("delete success");
        }
          
        else
          response.json(err);
      });
});


router.get("",function(request,response)
{
    ProductsModel.find({},function(err,data){
        // response.product = data;
        response.send(data)
});
});

router.post("/rate",urlEncodedMid,function(request,response)
{
    ProductsModel.findById(request.body.Id, function (err, product) {
        if (err) 
        {
           var error = console.log("error here");
           return error;
        }
        
      

        var myrate = request.body.myRating
        
        console.log(product.rating[myrate]);

       product.rating.myrate = product.rating[myrate]++
        


        product.save(function (err, updatedProduct) {
          if (err) 
          {
            console.log("error here2");
            // return error2;
            response.send("er")
          }
          else
          {
          console.log("update success");
          response.send("update success");
          }
        });
      });
});



module.exports = router;

// router.get("/products/add",function(request,response)
// {
    
// });
