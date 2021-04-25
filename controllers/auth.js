const jwt = require('jsonwebtoken');
const User = require("../models/user");
const expressJwt = require('express-jwt');

const JWT_SECRET="ABCDXYZVENKAT";

/*
    Step 1:
    A request is sent to profile update
    this is what the url will look like
    http://localhost:8080/profile/userid323232

    when there is userId in the incoming request url
    based on that userId
    our backend will make a query to database and load that
    user information(name, email etc) then we will ad that information to the request
    object like
    req.profile = user information
    Step 2:
    add a property called auth in requireSignin()
    so that we know the user is authenticated

    Step 3:
    create hasAutorization()
    to make sure the req object has
    req.profile aa77 req.auth && req.profile._id == req.auth._id;

*/

exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email});
    if(userExists){
        return res.status(403).json({
            error: "Email is taken"
        });
    }
    const user = await new User(req.body); //req.body will have json object
    await user.save();
    //res.status(200).json({user: user});
    res.status(200).json({message: "Signup successful! Please login."});
}

exports.signin = (req, res) => {
    //find the user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        //if error or no user
        if(err || !user){
            return res.status(401).json({
                error: "User with that email does not exist. Please signin"
            });
        }
        //if user, authenticate
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Eamil and password do not match"
            });    
        }
        //generate a token with user id and secret
        const token = jwt.sign({_id: user._id},JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire: new Date() + 9999});

        //return response with user and token to frontend client
        const {_id, name, email} = user;
        return res.json({token, user: {_id, email, name}});        
    });    
}

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({
        message: "Signout success!"
    });
};

exports.requireSignin = expressJwt({
    //if the token is valid, express jwt appends the verified users id
    //in an auth key to the request object
    secret: JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth" //by using this auth._id is checked for signed in user
});