var mongoose = require("mongoose");
var ProductsModel = require('../models/product');

module.exports = {
    addProduct: async function (request) {
        try {
            var product = {

                _id: new mongoose.Types.ObjectId,
                name: request.body.name,
                price: request.body.price,
                stock: request.body.stock,
                description: request.body.description,
                DateOfEntry: new Date(),
                specifications: request.body.specifications,
                SellerID: request.body.SellerID,
                rating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, T: 0 }
            };
            return(await ProductsModel.create(product))

        } catch (error) {
            console.log(error)
            return error;
        }
    }
}