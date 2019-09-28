const Joi=require("joi");
const jwt=require("jsonwebtoken");
//JWT private key, in production we will store the key in enviorment variable

const JWTPrivateKey = "jwt_secret_key";


//function to validate the User according to defined schema
function validateUser(user) {
    const schema = {
        username: Joi.string()
            .min(4)
            .required(),
        password: Joi.string()
            .min(4)
            .required()
    };

    return Joi.validate(user, schema);
}

//function to generate JWT token for a user
function generateAuthToken(user) {
    const token = jwt.sign(
        { username: user.username, password: user.password },
        JWTPrivateKey
    );
    return token;
}

//middleware function to check is the user is authorixed or not

module.exports={
  generateAuthToken,validateUser
}
