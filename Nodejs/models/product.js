

var mongoose = require("mongoose");
var mongoose_paginate= require("mongoose-paginate");
var Schema = mongoose.Schema;
var newID = Schema.Types.ObjectId;
var products = new Schema({
  _id: Schema.Types.ObjectId,
  name:{
    type:String
  },
  price:{
    type:Number
  },
  offer:{
    type:Number
  },
  stock:{
    type:Number
  },
  rating:{
    1: {type:Number},
    2: {type:Number},
    3: {type:Number},
    4: {type:Number},
    5: {type:Number},
    T: {type:Number}
  },
  description:{
    type:String
  },
  category:{
    type:String,
    ref:"category"
  },
  subcategory:{
    type:String
  },
  DateOfEntry:{
    type:Date
  },
  specifications:{
    type:Object
  },
  SellerID:{
    type:String,
    ref:"user"
  },
  image:String,

}
// ,{ _id: false }
);

products.plugin(mongoose_paginate);
// Register ...
mongoose.model("products",products);
module.exports = mongoose.model('products');
