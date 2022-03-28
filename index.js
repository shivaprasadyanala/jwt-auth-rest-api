PORT = 3000;
var express = require('express');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const verifytoken = require('./middleware/authJWT')
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
const cors = require('cors')
app.use(cors())

const User = require('./models/userModel.js')
const Product = require('./models/productModel.js')
const auth = require('./auth')

//get all the products
app.get('/user', verifytoken, async(req, res) => {
        const products = await Product.find();
        res.send(products)
    })
    //get the product by user using id
app.get('/user/:id', verifytoken, async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.send(product)
})

//adding products by admin
app.post('/admin/addproducts', async(req, res) => {
        var newProduct = new Product(req.body);
        try {
            const savedProduct = await newProduct.save();
            res.status(200).json(savedProduct);
        } catch (err) {
            res.status(500).json(err)
        }
    })
    //updating the product by admin
app.put('/admin/:id', async(req, res) => {
    var id = req.params.id;
    var product = Product.findById(id);
    if (product) {
        await product.updateOne(req.body);
        res.status(200).json("the post has been updated");
    } else {
        res.status(403).json("error while updating");
    }


    //delete a product using the id by admin
    app.delete('/admin/:id', async(req, res) => {
        const { id } = req.params;
        var product = Product.findById(id);
        if (product) {
            await product.deleteOne();
            res.status(200).json("the post has been deleted");
        } else {
            res.status(403).json("error while deleting");
        }
    })
})


app.use("/auth", auth);
mongoose
    .connect("mongodb://localhost:27017/testDB")
    .then(() => {
        app.listen("3000", () => {
            console.log("Server is listening on port 3000");
        });
    })
    .catch((err) => {
        console.log("Error Occured");
    });