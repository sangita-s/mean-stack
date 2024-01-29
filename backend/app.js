const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

// const Post = require('./models/post')
const postsRoutes = require('./routes/posts');

mongoose.connect("mongodb+srv://shoppingacc2422:ausGtpWJeBNWAT8t@mean-stack-cluster.olzi89f.mongodb.net/mean-stack?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed!')
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;