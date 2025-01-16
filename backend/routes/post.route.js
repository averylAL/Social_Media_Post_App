const express = require('express');
const router = express.Router();
const postModel = require('../db/post.model');
const jwtHelpers = require('../helpers/jwt');

// Get: Retrieve all posts (sorted by timestamp in descending order)
// http://localhost:8000/api/post/
router.get('/', async function (req, res) {
    try {
        const posts = await postModel.getAllPosts(); 
        res.status(200).send(posts); 
    } catch (error) {
        res.status(500).send('Error retrieving posts: ' + error.message); 
    }
});

// Get: Retrieve a specific post by its ID
// http://localhost:8000/api/post/:postId
router.get('/:postId', async function (req, res) {
    const postId = req.params.postId; 
    try {
        const post = await postModel.findPostById(postId); 
        if (!post) {
            res.status(404).send(`Post with ID ${postId} not found`); 
            return;
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send('Error fetching post: ' + error.message); 
    }
});

// POST
router.post('/', async function (req, res) {
    const { content } = req.body; 

    // Validate required fields
    if (!content) {
        res.status(400).send('Post content is missing'); 
        return;
    }

    const username = jwtHelpers.decrypt(req.cookies.userToken).username; 
    if (!username) {
        res.status(401).send('Unauthorized: Please log in');
        return;
    }

    const newPost = {
        username, 
        content,
        timestamp: new Date(), 
    };

    try {
        const savedPost = await postModel.insertPost(newPost); 
        res.status(201).send(savedPost); 
    } catch (error) {
        res.status(500).send('Error creating post: ' + error.message); 
    }
});

// PUT: Update a post by its ID
router.put('/:postId', async function (req, res) {
    const postId = req.params.postId; 
    const { content } = req.body; 

    if (!content) {
        res.status(400).send('Post content is required to update'); 
        return;
    }
    const username = jwtHelpers.decrypt(req.cookies.userToken).username; 
    if (!username) {
        res.status(401).send('Unauthorized: Please log in');
        return;
    }

    try {
        const post = await postModel.findPostById(postId); 
        if (!post) {
            res.status(404).send(`Post with ID ${postId} not found`); 
            return;
        }

        if (post.username !== username) {
            res.status(403).send('You do not have permission to edit this post');
            return;
        }

        const updatedPost = await postModel.updatePost(postId, content); 
        res.status(200).send(updatedPost); 
    } catch (error) {
        res.status(500).send('Error updating post: ' + error.message); 
    }
});

// Delete
router.delete('/:postId', async function (req, res) {
    const postId = req.params.postId;

    const username = jwtHelpers.decrypt(req.cookies.userToken).username; 
    if (!username) {
        res.status(401).send('Unauthorized: Please log in');
        return;
    }

    try {
        const post = await postModel.findPostById(postId); 
        if (!post) {
            res.status(404).send(`Post with ID ${postId} not found`); 
            return;
        }

        if (post.username !== username) {
            res.status(403).send('You do not have permission to delete this post');
            return;
        }

        await postModel.deletePost(postId); 
        res.status(200).send(`Post with ID ${postId} deleted successfully`); 
    } catch (error) {
        res.status(500).send('Error deleting post: ' + error.message); 
    }
});

module.exports = router;