const express = require('express');
const { postListFunc, addPostFunc, addCommentFunc, addLikeFunc, deletePostFunc, getComments } = require('../controllers/post');
const router = express.Router();
const { authenticate } = require('../services/authenticate');


// to fetch list of all posts
router.post('/list', authenticate, postListFunc);

// to add a new post
router.post('/add', authenticate, addPostFunc);

// add comment to a post
router.post('/comment', authenticate, addCommentFunc);

//like a post
router.post('/like', authenticate, addLikeFunc);

// to delete a post
router.post('/delete', authenticate, deletePostFunc);

//get comments by post id
router.post('/getComments', authenticate, getComments);

module.exports = router;