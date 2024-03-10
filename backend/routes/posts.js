const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/multer');

const router = express.Router();

const PostController = require('../controllers/posts');

// Order is important !!
// GET /api/posts/getpost/:id: Fetch a single post by ID.
// PUT /api/posts/editpost/:id: Edit an existing post.
// DELETE /api/posts/deletepost/:id: Delete a post by ID.
// POST /api/posts/createpost: Create a new post.
// GET /api/posts: Fetch all posts.

//For edit page reload - 68
router.get('/getpost/:id', PostController.getPost);

//Adding checkAuth to allow only verified identity to create
//multer tries to find a single file of type image in body
router.post('/createpost', checkAuth, 
extractFile, 
PostController.createPost
);

router.put('/editpost/:id', checkAuth, 
extractFile, 
PostController.updatePost
);

//Collection named 'posts' for 'Post'
// router.use('', (req, res, next) => {
router.get("", PostController.getPosts);

router.delete('/deletepost/:id', checkAuth, PostController.deletePost);

module.exports = router;

// Also, for lecture 135, 
//in the updateOne method, 
//you should use result.matchedCount instead of result.n.