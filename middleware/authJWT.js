const jwt = require('jsonwebtoken');
User = require('../models/userModel')
require('dotenv').config()

//verifying the token
const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
    //decodering the token
    jwt.verify(token, "secretkeyappearshere", (err, user) => {
            if (err) return res.sendStatus(403)
                // console.log(user);
            req.user = user
            next()
        })
        // const decodedToken = jwt.verify(token, "secretkeyappearshere");

    // if (decodedToken != null) {
    //     res.status(200).json({
    //         success: true,
    //         data: {
    //             userId: decodedToken.userId,
    //             email: decodedToken.email
    //         }
    //     })
    // } else {
    //     next();
    // }

}

module.exports = verifytoken;