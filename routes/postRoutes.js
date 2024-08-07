const express = require("express");
const { requireSignIn } = require("../controllers/userControllers");
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postControllers");

// Router object

const router = express.Router();

// CREATE POST ||POST

router.post("/create-post", requireSignIn, createPostController);

// GET All Posts
router.get("/get-all-posts", getAllPostsController);

// GET USER Posts
router.get("/get-user-posts", requireSignIn, getUserPostsController);

// Update USER POST
router.put("/update-post/:id", requireSignIn, updatePostController);

// DELETE USER POST
router.delete("/delete-post/:id", requireSignIn, deletePostController);

//Exporting router

module.exports = router;
