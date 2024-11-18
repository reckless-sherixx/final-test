const express  = require('express');
const router  = express.Router();
const Post =  require('../model/post.model.js');
const Comment = require('../model/comment.model.js');
const verifyToken = require('../middleware/verifyToken.js');
const isAdmin = require('../middleware/isAdmin.js');


// Create A post
router.post("/create-post",verifyToken, isAdmin, async (req, res) => {
    try  {
        // console.log("Post Data From API:",req.body)
        const newPost =  new Post({...req.body, author: req.userId}); // use author: req.userId after making verify token
        await newPost.save();
        res.status(201).send({
            message: "Post Created Successfully",
            post: newPost
         })
        }

    catch(error){
        console.error("Error Creating Post:", error);
        res.status(500).send({message: "Error Creating Post"})
    }

})
// Get all Posts
router.get('/', async (req, res) => {
    try {
        const {search, category} = req.query;
        console.log(search);

        let query = {}

        if(search) {
            query = {
                ...query,
                $or: [
                    {title: {$regex:  search, $options: 'i'} },
                    {content: {$regex:  search, $options: 'i'} }
                ]
            }
        }

        if(category){
            query = {
                ...query,
                category:  category
            }
        }



        const  posts = await Post.find(query).populate('author', 'email').sort({createdAt: -1});
        res.status(200).send(posts);

    } catch(error) {
        console.error("Error Creating Post:", error);
        res.status(500).send({message: "Error Creating Post"})
    }
});

// Get Post by ID
router.get('/:id', async (req, res) => {
    try {
        // console.log(req.params.id);
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).send({message: "Post Not Found"})
        }

        const comment = await Comment.find({postId: postId}).populate('user', "username email");
        res.status(200).send({
            message: "Post Retrieved Successfully",
            post: post
        })
    } catch(error){
        console.error("Error Fetching Single Post:", error);
        res.status(500).send({message: "Error Fetching Single Post"});
    }
})


// Update a post
router.patch("/update-post/:id", verifyToken, async (req, res) => {

    try {
        const postId = req.params.id;
        const updatedPost = await  Post.findByIdAndUpdate(postId, {
            ...req.body
        },{new: true});
        if(!updatedPost){
            return res.status(404).send({message: "Post Not Found"})
        }
        res.status(200).send({
            message: "Post Updated Successfully",
            post: updatedPost
        })

    } catch (error) {
        console.error("Error Updating Post:", error);
        res.status(500).send({message: "Error Updating Post"});
    }
}) 

// Delete a post
router.delete("/:id", verifyToken,async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await  Post.findByIdAndDelete(postId);
        if(!post){
            return  res.status(404).send({message: "Post Not Found"})
        }

        // Delete related comments
        await Comment.deleteMany({postId: postId});

        res.status(200).send({
            message: "Post Deleted Successfully",
            post: post
        })

    } catch (error) {
        console.error("Error Deleting Post:", error);
        res.status(500).send({message: "Error Deleting Post"});
    }
})

// Related Posts
router.get("/related/:id", async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send({message: "Post Id Is Required."})
        }
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).send({message: "Post is not found."})
        }
        const titleRegex = new  RegExp(post.title.split(' ').join('|'), 'i');
        const relatedQuery = {
            _id: {$ne: id},
            title: {$regex: titleRegex}
        }
        const relatedPost = await Post.find(relatedQuery);
        res.status(200).send(relatedPost);


    } catch (error) {
        console.error("Error Fetching Related Post:", error);
        res.status(500).send({message: "Error Fetching Related Post"});
    }
})


module.exports = router;

