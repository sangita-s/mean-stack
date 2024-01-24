const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// app.use((req, res, next) => {
//     console.log('First Middleware');
//     next();
// });

//Parsing body data from post requests
app.use(bodyParser.json());
//Parse url encoded data
app.use(bodyParser.urlencoded({extended: false}));

// For CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = req.body; 
    console.log(post);
    //Everything ok, new resource created
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.use('/api/posts', (req, res, next) => {
    // res.send('Hello from Express');
    const posts = [
        {
            id: 'fdf43',
            title: 'First server side post',
            content: 'THis is first post'
        },
        {
            id: 'fdf44',
            title: 'Second server side post',
            content: 'THis is second post'
        }
    ];
    // res.json(posts);
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;