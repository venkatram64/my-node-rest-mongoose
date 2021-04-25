const {check, validationResult} = require('express-validator');
//all are middleware functions
exports.createPostValidator =  async (req, res, next) => {
    //title
    await check('title', "Write a title").notEmpty().run(req);
    await check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    }).run(req);
    //body
    await check('body', "Write a body").notEmpty().run(req);
    await check('body', 'Body must be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
    }).run(req);

    //check for errors
    const errors = validationResult(req);
    if(errors.isEmpty()){
        //proceed to next middleware
        return next();
    }
    //if error show the first one as they happen
    if(errors){
        const firstError = errors.array().map((err) => err.msg)[0];
        res.status(400).json({error: firstError});
    }
}


exports.userSignupValidator =  async (req, res, next) => {
    //name is not null and between 4-10 characters
    await check('name', "Name is required").notEmpty().run(req);

    await check('name', 'Name must be between 4 to 15 characters').isLength({
        min: 4,
        max: 15
    }).run(req);

    await check('email', "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 32
        }).run(req);

    await check('password', "Password is required").notEmpty().run(req);

    await check('password').isLength({
        min: 6,
        max: 15
    }).withMessage("Password must contain at least 6 and not greater than 15 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .run(req);    

    //check for errors
    const errors = validationResult(req);
    if(errors.isEmpty()){
        //proceed to next middleware
        return next();
    }
    //if error show the first one as they happen
    if(errors){
        const firstError = errors.array().map((err) => err.msg)[0];
        res.status(400).json({error: firstError});
    }
}