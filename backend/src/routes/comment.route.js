const express = require('express');
const router = express.Router();
const Comment = require('../model/comment.model.js');
const Post = require('../model/post.model.js');
const verifyToken = require('../middleware/verifyToken.js');

// Create a Comment
router.post('/post-comment', async (req, res) => {
  try {
    console.log(req.body)
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(200).send({
      message: "Comment created successfully",
      comment: newComment
    });
  } catch (error) {
    console.error("An Error Occured While Posting Comment.", error);
    res.status(500).send({
      message: "An error occurred while posting new comment"
    });

  }
})

// Get  comment count 
router.get('/total-comments', async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments({});
    res.status(200).send({
      message: "Total comments Count",
      totalComments
    })

  } catch (error) {
    console.error("An Error Occured While Comment Count.", error);
    res.status(500).send({
      message: "An error occurred while Comment Count"
    });

  }
})

router.delete('/delete-comment/:id', verifyToken, async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const isAdminOrModerator = ["admin", "moderator"].includes(req.user.role);
    const isCommentOwner = comment.user.toString() === req.user._id.toString();

    if (!isAdminOrModerator && !isCommentOwner) {
      return res.status(403).json({
        message: "Not authorized to delete this comment"
      });
    }

    await Comment.findByIdAndUpdate(commentId, {
      isDeleted: true,
      deletedAt: new Date()
    });

    return res.status(200).json({
      message: "Comment moved to deleted section"
    });
  } catch (error) {
    console.error("An Error Occurred While Deleting Comment.", error);
    res.status(500).send({
      message: "An error occurred while deleting comment"
    });
  }
});

// Get deleted comments 
router.get('/deleted-comments', verifyToken, async (req, res) => {
  try {
    const isAdminOrModerator = ["admin", "moderator"].includes(req.user.role);
    
    if (!isAdminOrModerator) {
      return res.status(403).json({
        message: "Not authorized to view deleted comments"
      });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const deletedComments = await Comment.find({
      isDeleted: true,
      deletedAt: { $gte: thirtyDaysAgo }
    })
    .populate('user', 'username')
    .sort({ deletedAt: -1 });

    return res.status(200).json({
      deletedComments
    });
  } catch (error) {
    console.error("Error fetching deleted comments:", error);
    res.status(500).send({
      message: "An error occurred while fetching deleted comments"
    });
  }
});

// Permanently delete comment 
router.delete('/permanent-delete/:id', verifyToken, async (req, res) => {
  try {
    const isAdminOrModerator = ["admin", "moderator"].includes(req.user.role);
    
    if (!isAdminOrModerator) {
      return res.status(403).json({
        message: "Not authorized to permanently delete comments"
      });
    }

    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Comment permanently deleted"
    });
  } catch (error) {
    console.error("Error permanently deleting comment:", error);
    res.status(500).send({
      message: "An error occurred while permanently deleting comment"
    });
  }
});

module.exports = router;
