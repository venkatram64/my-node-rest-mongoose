const Post = require('../models/post');

exports.getPosts = (req, res) => {
    /*const posts = Post.find()
        .then(results => {
            res.status(200).json({posts: results});
        })
        .catch(err => console.log(err));*/

    const posts = Post.find()
        .select("_id title body")
        .then(results => {
            res.json({posts: results});
        })
        .catch(err => console.log(err));
}

exports.createPost = (req, res) => {
    const post = Post(req.body);
    //console.log("CREATING POST: ", req.body);
    /*post.save((err, result) =>{
        //express-validator is used so comment below error handling code
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            post: result
        })
    });*/

    post.save()
        .then(result  => {
            res.status(200).json({
                post: result
            });
        });

}