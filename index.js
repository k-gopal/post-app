const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const cors = require('cors');
const logger = require('morgan');
const { connect } = require('./database/database');

//env config express initialization
env.config();
const app = express();

//db connection
if (typeof client === "undefined") var client = connect();


// importing routes
const authRoute = require('./routes/authentication');
const postRoute = require('./routes/posts');

// getting data in JSON format
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//using cookie parser
app.use(cookieParser());

//Setting up cors
var corsOption = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

//using morgan logger
app.use(logger('combined'));

// using routes
app.use('/auth', authRoute);
app.use('/post', postRoute);


// listening app on port
app.listen(process.env.PORT, () => {
    console.log('Post App listening on port: ', process.env.PORT);
});