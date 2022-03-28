PORT = 3000;
var express = require('express');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const verifytoken = require('./middleware/authJWT')
const User = require('./models/userModel');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
const cors = require('cors')
app.use(cors())

const indexUser = require('./models/userModel.js')
const Product = require('./models/productModel.js')
const auth = require('./auth');
const { findById } = require('./models/userModel.js');

//get all the products
app.get('/user', verifytoken, async(req, res) => {
        console.log(req.user.userId);
        preuser = await indexUser.findById(req.user.userId);
        console.log(preuser.role);
        if (preuser.role == "user" || preuser.role == "admin") {
            try {
                const products = await Product.find();
                res.send(products)
            } catch (error) {
                res.status(500).json(error)
            }

        } else {
            res.status(403)
                .send({
                    message: "Unauthorised access"
                })
        }

    })
    //get the product by user using id
app.get('/user/:id', verifytoken, async(req, res) => {
    preuser = await indexUser.findById(req.user.userId);
    console.log(preuser.role);
    if (preuser.role == "user" || preuser.role == "admin") {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if (product == null) {
                res.status(200).send("the product is not availble")
            } else {
                console.log(product);
                res.send(product)
            }


        } catch (err) {
            res.status(500).json(err)
        }


    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            })
    }

})

//adding products by admin
app.post('/admin/addproducts', verifytoken, async(req, res) => {
        preuser = await indexUser.findById(req.user.userId);
        console.log(preuser.role);
        if (preuser.role == "admin") {
            var newProduct = new Product(req.body);
            try {
                const savedProduct = await newProduct.save();
                res.status(200).json(savedProduct);
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(403)
                .send({
                    message: "Unauthorised access"
                })
        }

    })
    //updating the product by admin
app.put('/admin/:id', verifytoken, async(req, res) => {
        preuser = await indexUser.findById(req.user.userId);
        console.log(preuser.role);
        if (preuser.role == "admin") {
            var id = req.params.id;
            var product = Product.findById(id);
            if (product) {
                await product.updateOne(req.body);
                res.status(200).json("the post has been updated");
            } else {
                res.status(403).json("error while updating");
            }
        } else {
            res.status(403)
                .send({
                    message: "Unauthorised access"
                })
        }

    })
    //delete a product using the id by admin
app.delete('/admin/:id', verifytoken, async(req, res) => {
    preuser = await indexUser.findById(req.user.userId);
    console.log(preuser.role);
    if (preuser.role == "admin") {
        const { id } = req.params;
        var product = Product.findById(id);
        if (product) {
            await product.deleteOne();
            res.status(200).json("the post has been deleted");
        } else {
            res.status(403).json("error while deleting");
        }
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            })
    }
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