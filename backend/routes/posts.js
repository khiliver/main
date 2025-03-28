const express = require("express");
const multer = require("multer"); 

const router = express.Router();

router.post("/api/posts", (req, res) => {
    console.log("Received post request:", req.body);
    res.status(201).json({ message: "Post added successfully!" });
});

const PostModel = require("../models/post");

const MIME_TYPE_MAP = {  
    'image/png': 'png',  
    'image/jpeg': 'jpg',  
    'image/jpg': 'jpg'  
  };

const storage = multer.diskStorage({

    destination: (req, file, cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime Type");  
        if(isValid){  
            error = null;  
        }  
    cb(error, "backend/images"); 
        cb(null, "backend/images");
    },
    filename: (req, file, cb)=>{  
        const name = file.originalname.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+ '-'+ Date.now()+ '.'+ ext);  
    }
});  

router.post("/api/posts", async (req, res) => {  
    try {
        const post = new PostModel({  
            title: req.body.title,  
            content: req.body.content  
        });

        const savedPost = await post.save();  
        res.status(201).json({  
            message: "Post added successfully",  
            postId: result._id  
        });
    } catch (error) {
        res.status(500).json({ message: "Creating post failed!", error: error.message });
    }
});  

router.put("/api/posts/:id", async (req, res) => {  
    try {
        const result = await PostModel.updateOne(
            { _id: req.params.id },
            { title: req.body.title, content: req.body.content }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Post not found!" });
        }

        res.status(200).json({ message: "Update Successful!" });
    } catch (error) {
        res.status(500).json({ message: "Updating post failed!", error: error.message });
    }
});  

router.get("/api/posts", async (req, res) => {  
    try {
        const documents = await PostModel.find();
        res.status(200).json({  
            message: "Posts fetched successfully",  
            posts: documents  
        });
    } catch (error) {
        res.status(500).json({ message: "Fetching posts failed!", error: error.message });
    }
});  
router.get("/api/posts/:id", async (req, res) => {  
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Fetching post failed!", error: error.message });
    }
});  

router.delete("/api/posts/:id", async (req, res) => {  
    try {
        const result = await PostModel.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found!" });
        }

        res.status(200).json({ message: "Post deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Deleting post failed!", error: error.message });
    }
});  

module.exports = router;