const jwt = require('jsonwebtoken');

//Allow only auth routes to post modifications
module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_secret");
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}; //116 for Authorization
    next();
    } catch (err) {
        res.status(401).json({ message: "Auth failedd!"});
    }
};