const _ = require('lodash');
const User = require("../models/user");

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

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .exec((err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: "user not found"
                });
            }
            req.profile = user //adds profile object in req object with user info
            next();
        });
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized){
        return res.status(403).json({
            error: "User is not authorized to perform this action."
        });
    }
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        }
        res.json({users: users});
    }).select("name email updated created");
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body); //extend -mutate the source object
    user.updated = Date.now();

    user.save((err) => {
        if(err){
            return res.status(400).json({
                error: "You are not authorized to perform this action."
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user: user});
    })
}

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user: user});
    })
}