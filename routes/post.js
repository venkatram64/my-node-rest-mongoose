
/*
const express = require('express');
const postController = require('../controllers/post');
//index file will be loaded automatically, no need to specify the file name '../validator/index'
const validator = require('../validator'); 

const router = express.Router();

router.get("/", postController.getPosts);
router.post("/post",validator.createPostValidator, postController.createPost);
*/

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

const express = require('express');
const {getPosts, createPost} = require('../controllers/post');
const {userById} = require('../controllers/user');
const{requireSignin} = require("../controllers/auth");
//index file will be loaded automatically, no need to specify the file name '../validator/index'
const validator = require('../validator'); 

const router = express.Router();

router.get("/", getPosts); 
// for testing pupose I am using the requireSignin middleware
router.post("/post", requireSignin, validator.createPostValidator, createPost);

router.param("userId", userById);

module.exports = router;

