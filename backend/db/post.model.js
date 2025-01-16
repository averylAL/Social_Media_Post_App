const mongoose = require("mongoose")

const PostSchema = require("./post.schema").PostSchema

const PostModel = mongoose.model("Post", PostSchema);

// Insert a new post into the database
async function insertPost(post) {
    return PostModel.create(post);
}

// Retrieve all posts in descending order of timestamp
async function getAllPosts() {
    return PostModel.find().sort({ timestamp: -1 }).exec();
}

// Retrieve all posts by a specific owner (username)
async function findPostsByOwner(owner) {
    return PostModel.find({ owner: owner }).exec();
}

// Retrieve a post by postID
async function findPostById(postId) {
    return PostModel.findById(postId).exec();
}

// Update a post's content by its ID
async function updatePost(postId, content) {
    return PostModel.findByIdAndUpdate(postId, { content, timestamp: Date.now() }, { new: true }).exec();
}

async function deletePost(postId) {
    return PostModel.findByIdAndDelete(postId).exec();
}

module.exports = {
    getAllPosts,
    findPostById,
    findPostsByOwner,
    insertPost,
    updatePost,
    deletePost,
};