const HTTP_CODE = require('../util/constants');
const postSchema = require('../schemas/postSchema');
const commentSchema = require('../schemas/commentSchema');
const likeSchema = require('../schemas/likeSchema');
const deleteSchema = require('../schemas/deleteSchema');
const listPostSchema = require('../schemas/listPostSchema');
const { addPost, addComment, addLike, deletePost, listPosts, getCommentsByPostId } = require('../services/postService');
const { sendResponseObject } = require('../util/commonFunctions');


// function to add post
const addPostFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = postSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to post, please try again. Bad request."));
        }

        body.createdBy = req.user;

        let addPostResult = await addPost(body);

        if (addPostResult) {
            let resp = {
                id: addPostResult._id
            }
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [resp], "Post is created succesfully."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to post, please try again."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to post, please try again."));
    }
}

//function to add comment to a post
const addCommentFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = commentSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to add comment, please try again. Bad request."));
        }

        let addCommentResult = await addComment(body.id, {
            commentedBy: req.user,
            comment: body.comment
        })

        if (addCommentResult) {
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [{ postId: body.id }], "Comment added successfully."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to add comment, please try again."));
        }

    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to add comment, please try again."));
    }
}

//function to like a post
const addLikeFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = likeSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to add comment, please try again. Bad request."));
        }

        let addLikeResult = await addLike(body.id, req.user);
        if (addLikeResult) {
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [{ postId: body.id }], "You have successfully liked the post."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to like the post, please try again."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to like the post, please try again."));
    }
}

//function to list all the posts
const postListFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = listPostSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Unable fetch posts. Bad request."));
        }

        let listPostResult = await listPosts(body);
        if (listPostResult) {
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [listPostResult], "Posts fetched successfully."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Unable fetch posts, please try again."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Unable fetch posts, please try again."));
    }
}

//function to delete a post
const deletePostFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = deleteSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to delete post, please try again. Bad request."));
        }

        let deletePostResult = await deletePost(body.id, req.user);
        if (deletePostResult) {
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [{ postId: body.id }], "You have successfully deleted the post."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to delete the post, please try again."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to delete the post, please try again."));
    }
}

//get comments by post id
const getComments = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = deleteSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Bad request."));
        }

        let getCommentsResult = await getCommentsByPostId(body.id);
        if (getCommentsResult) {
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [getCommentsResult], "You have successfully fetched comments for the post."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to fetch comments for the post, please try again."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to fetch comments for the post, please try again."));
    }
}
//functions are exported
module.exports = {
    addCommentFunc,
    addLikeFunc,
    addPostFunc,
    postListFunc,
    deletePostFunc,
    getComments
}