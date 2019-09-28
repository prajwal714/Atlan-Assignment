const jwt = require("jsonwebtoken");
//JWT private key, in production we will store the key in enviorment variable

const JWTPrivateKey = "jwt_secret_key";

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, JWTPrivateKey);
    console.log(decoded);
    req.user = decoded;
    console.log("User authenticated");
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
