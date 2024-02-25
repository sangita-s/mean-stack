const jwt = require('jsonwebtoken');

//Allow only auth routes to post modifications
module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_secret");
    next();
    } catch (err) {
        res.status(401).json({ message: "Auth failedd!"});
    }
};