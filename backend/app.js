const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

//npm install cors
const cors = require('cors');

app.use(cors());

// const Post = require('./models/post')
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://shoppingacc2422:ausGtpWJeBNWAT8t@mean-stack-cluster.olzi89f.mongodb.net/mean-stack?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed!')
    });

//Parsing body data from post requests
app.use(bodyParser.json());
//Parse url encoded data
app.use(bodyParser.urlencoded({ extended: false }));
//Allow access to images folder
app.use("/images", express.static(path.join("backend/images")));

// For CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;