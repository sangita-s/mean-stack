const express = require('express');
const Post = require('../models/post')
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// file extension mime type
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    //executed when multler tries to save a file
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]; //79
        console.log('Mimetype is ' + isValid);
        let error = new Error("Invalid mime type"); //79
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});
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

//Adding checkAuth to allow only verified identity to create
//multer tries to find a single file of type image in body
router.post('/createpost', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    // const post = req.body; 
    //Mongoose Post object
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        //SInce checkAuth called above, all info will be passed to middleware here
        creator: req.userData.userId
    });
    console.log(post);
    //Mongoose provides 'save'
    post.save().then(createdPost => {
        console.log("app.js: Saved post returned: " + createdPost);
        //Everything ok, new resource created
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });;
});

router.put('/editpost/:id', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    // console.log(req.file); // undefined for string
    let imagePath = req.body.imagePath;;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    // console.log("Updating post with : "+post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        // console.log(result);
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Update successful" });
        } else {
            res.status(401).json({ message: "Not authorized to edit" });
        }

    });
});

//Collection named 'posts' for 'Post'
// router.use('', (req, res, next) => {
router.get("", (req, res, next) => {
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
    // console.log('Req query : '+req.query);
    const pageSize = +req.query.pagesize; //+ to convert to number
    const currentPage = +req.query.page;
    const postQuery = Post.find(); //Added 89
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.countDocuments();
        }).then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        });
});

router.delete('/deletepost/:id', checkAuth, (req, res, next) => {
    console.log("App.js: Going to delete from mongo" + req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId})
        .then(result => {
            console.log(result);
            if (result.deletedCount === 1) {
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

module.exports = router;

// Also use result.deletedCount 
//instead of result.n (in the deleteOne method).

// Also, for lecture 135, 
//in the updateOne method, 
//you should use result.matchedCount instead of result.n.