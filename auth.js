const express = require('express')
const router = require('express').Router();

var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const User = require('./models/userModel');
const { response } = require('express');
//user signup
router.post("/signup", async(req, res, next) => {
        //generate new password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create new user

        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword
        })

        try {

            //save user and respond
            const user = await newUser.save();
            // res.status(200).json(user);
            // return
        } catch (err) {
            const error = new Error("Error! Something went wrong.");
            return next(error);
        }
        let token;
        try {
            token = jwt.sign({ userId: newUser.id, email: newUser.email },
                "secretkeyappearshere", { expiresIn: "1h" }
            )
        } catch (err) {
            const error = new Error("Error! something went wrong");
            return next(error);
        }
        res
            .status(201)
            .json({
                success: true,
                data: { userId: newUser.id, email: newUser.email, token: token },
                message: "signup succesful",
                accessToken: token,
            });
    })
    //user login
router.post('/login', async(req, res) => {
    let existinguser;
    try {
        existinguser = await User.findOne({ email: req.body.email });
        !existinguser && res.status(400).json("user not found");
        const validPassword = await bcrypt.compare(req.body.password, existinguser.password);
        !validPassword && res.status(400).json("invalid password");
    } catch (err) {
        const error = Error("Wrong details please check at once");
        return next(error);
    }
    let token;
    try {
        token = jwt.sign({ userId: existinguser.id, email: existinguser.email },
            "secretkeyappearshere", { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
    res
        .status(201)
        .json({
            success: true,
            data: {
                userId: existinguser.id,
                email: existinguser.email,
                token: token,
            },
            message: "login succesful"
        });
})



module.exports = router;