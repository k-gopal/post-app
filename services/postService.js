const Post = require('../models/Post');

//function to save post to db
const addPost = async (data) => {
    try {
        let post = await Post(data);
        let result = post.save();

        if (result) {
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in add post: ", error);
        return false;
    }
}

//function to add comment to a post
const addComment = async (id, data) => {
    try {
        let result = await Post.updateOne({ _id: id, isDeleted: false }, {
            $push: {
                comments: data
            }
        });

        if (result?.modifiedCount) {
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in add post: ", error);
        return false;
    }
}

//function to like a particular post
const addLike = async (id, email) => {
    try {
        let result = await Post.updateOne({ _id: id, isDeleted: false }, {
            $addToSet: {
                likes: email
            }
        });

        if (result?.modifiedCount) {
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in add post: ", error);
        return false;
    }
}

//function to delete a post
const deletePost = async (id, email) => {
    try {
        let result = await Post.updateOne({ _id: id, createdBy: email, isDeleted: false }, {
            $set: {
                isDeleted: true
            }
        });

        if (result?.modifiedCount) {
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in add post: ", error);
        return false;
    }
}

//function to list all posts with pagination and sorting
const listPosts = async (data) => {
    try {
        let result = await Post.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },{
                $sort: {
                    [data.sort]: data.sortStyle
                }
            },
            {
                $facet: {
                    total: [
                        { $count: "total" },
                    ],
                    data: [
                        { $skip: (data.page - 1) * data.limit },
                        { $limit: data.limit },
                        { $project: {
                            "isDeleted":0
                        }}
                    ]
                },
            }
        ]);

        if (result) {
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in list post: ", error);
        return false;
    }
}

//get comments by post id
const getCommentsByPostId = async (id) => {
    try {
        let result = await Post.findOne({_id: id, isDeleted: false},{
            "_id":1,
            "comments": 1
        });

        if(result){
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in getCommentsByPostId: ", error);
        return false;
    }
}

module.exports = {
    addPost,
    addComment,
    addLike,
    deletePost,
    listPosts,
    getCommentsByPostId
}