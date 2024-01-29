const express = require('express');
const Post = require('../models/post')
const router = express.Router();

// Order is important !!
// GET /api/posts/getpost/:id: Fetch a single post by ID.
// PUT /api/posts/editpost/:id: Edit an existing post.
// DELETE /api/posts/deletepost/:id: Delete a post by ID.
// POST /api/posts/createpost: Create a new post.
// GET /api/posts: Fetch all posts.

//For edit page reload - 68
router.get('/getpost/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            console.log('Inside app.js Sending post:' + post);
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    });
});

router.put('/editpost/:id', (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({ message: "Update successful" });
    });
});

router.delete('/deletepost/:id', (req, res, next) => {
    console.log("App.js: Going to delete from mongo" + req.params.id);
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount === 1) {
                console.log("Result from deleteOne" + result);
                res.status(200).json({ message: 'Post deleted.' });
            } else {
                res.status(404).json({ message: 'Post not found.' });
            }
        })
        .catch(error => {
            console.error("Error deleting post:", error);
            res.status(500).json({ message: 'Failed to delete post.' });
        });
});

router.post('/createpost', (req, res, next) => {
    // const post = req.body; 
    //Mongoose Post object
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    //Mongoose provides 'save'
    post.save().then(createdPost => {
        console.log("app.js: Saved post returned: " + createdPost);
        //Everything ok, new resource created
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        });
    });;
});

//Collection named 'posts' for 'Post'
router.use('', (req, res, next) => {
    // res.send('Hello from Express');
    // const posts = [
    //     {
    //         id: 'fdf43',
    //         title: 'First server side post',
    //         content: 'THis is first post'
    //     },
    //     {
    //         id: 'fdf44',
    //         title: 'Second server side post',
    //         content: 'THis is second post'
    //     }
    // ];
    // res.json(posts);
    Post.find()
        .then(documents => {
            console.log('Finding posts' + documents)
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        });
    // res.status(200).json({
    // message: 'Posts fetched successfully',
    // posts: posts
    // });
});

module.exports = router;