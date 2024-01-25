const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const Post = require('./models/post')

mongoose.connect("mongodb+srv://shoppingacc2422:ausGtpWJeBNWAT8t@mean-stack-cluster.olzi89f.mongodb.net/mean-stack?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Conection failed!')
    });

// app.use((req, res, next) => {
//     console.log('First Middleware');
//     next();
// });

//Parsing body data from post requests
app.use(bodyParser.json());
//Parse url encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// For CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    next();
});

app.post('/api/posts', (req, res, next) => {
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
app.use('/api/posts', (req, res, next) => {
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

app.delete("/api/posts/:id", (req, res, next) => {
    console.log("App.js: Going to delete from mongo" + req.params.id);
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post deleted.' });
        });
});

module.exports = app;