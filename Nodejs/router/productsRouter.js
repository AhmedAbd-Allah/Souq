var express = require("express");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({extended:true});
var router = express.Router();
//var multer = require("multer");
var fs = require("fs");
var mongoose = require("mongoose");
var ProductsModel = mongoose.model("products");
const productsController = require('../controllers/productsController')


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
    next();
});


/****************** Add Product ******************/

// New Refactored Code
router.post("/add", urlEncodedMid, productsController.addProduct)


// Old code 


// router.post("/add", urlEncodedMid, function (request, response) {
//     var product = new ProductsModel({

//         _id: new mongoose.Types.ObjectId,
//         name: request.body.name,
//         price: request.body.price,
//         //offer:request.body.offer,
//         stock: request.body.stock,
//         description: request.body.description,
//         //category:request.body.category,
//         //subcategory:request.body.subcategory,
//         DateOfEntry: new Date(),
//         specifications: request.body.specifications,
//         SellerID: request.body.SellerID,
//         //image:request.body.image,
//         rating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, T: 0 }

//     });
//     product.save(function (err, doc) {
//         if (!err) {
//             console.log("entry success");
//             response.send("added");
//         }
//         else
//             response.json(err);
//     });
// });



module.exports = router;