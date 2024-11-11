const express = require('express');
const router = express.Router();
const Announcement = require('../model/announcements.model.js');
const Comment = require('../model/comment.model.js');
const verifyToken = require('../middleware/verifyToken.js');
const isAdmin = require('../middleware/isAdmin.js');

// Create an announcement
router.post("/create-announcement", verifyToken, isAdmin, async (req, res) => {
    try {
        // Check for required fields
        if (!req.body.title || !req.body.content) {
            return res.status(400).send({ message: "Title and content are required" });
        }

        const newAnnouncement = new Announcement({
            ...req.body,
            author: req.userId // Ensure `req.userId` is set by `verifyToken`
        });

        await newAnnouncement.save();
        res.status(201).send({
            message: "Announcement Created Successfully",
            post: newAnnouncement
        });

    } catch (error) {
        console.error("Error Creating Announcement:", error);
        res.status(500).send({ message: "Error Creating Announcement" });
    }
});

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const announcements = await Announcement.find(query)
            .populate('author', 'email')
            .sort({ createdAt: -1 });

        res.status(200).send(announcements);

    } catch (error) {
        console.error("Error Fetching Announcements:", error);
        res.status(500).send({ message: "Error Fetching Announcements" });
    }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
    try {
        const announcementId = req.params.id;
        const announcement = await Announcement.findById(announcementId)
            .populate('author', 'email');

        if (!announcement) {
            return res.status(404).send({ message: "Announcement Not Found" });
        }

        const comments = await Comment.find({ announcementId: announcementId })
            .populate('user', "username email");

        res.status(200).send({
            message: "Announcement Retrieved Successfully",
            announcement: announcement,
            comments: comments
        });

    } catch (error) {
        console.error("Error Fetching Single Announcement:", error);
        res.status(500).send({ message: "Error Fetching Single Announcement" });
    }
});

// Delete an announcement
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const announcementId = req.params.id;
        const announcement = await Announcement.findByIdAndDelete(announcementId);

        if (!announcement) {
            return res.status(404).send({ message: "Announcement Not Found" });
        }

        // Delete related comments
        await Comment.deleteMany({ announcementId: announcementId });

        res.status(200).send({
            message: "Announcement Deleted Successfully",
            announcement: announcement
        });

    } catch (error) {
        console.error("Error Deleting Announcement:", error);
        res.status(500).send({ message: "Error Deleting Announcement" });
    }
});

module.exports = router;
