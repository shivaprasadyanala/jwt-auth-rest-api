const jwt = require('jsonwebtoken');
User = require('../models/userModel')

//verifying the token
const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
    //decodering the token

    const decodedToken = jwt.verify(token, "secretkeyappearshere");

    if (decodedToken != null) {
        res.status(200).json({
            success: true,
            data: {
                userId: decodedToken.userId,
                email: decodedToken.email
            }
        })
    } else {
        res.sendStatus(403);
    }

    res.status(201)
        .json({
            success: true,
            data: {
                userId: existinguser.id,
                email: existinguser.email,
                token: token,
            },
            message: "login succesful"
        })

}

module.exports = verifytoken;