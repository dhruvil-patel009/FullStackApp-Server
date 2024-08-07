const postModel = require("../models/postModel");

// create post
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    //validate input data
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // create post
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id, // assuming user is logged in and req.user has a _id property
    }).save();

    res.status(200).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
    console.log(req);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Post API",
      error,
    });
  }
};

const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data Fetched Successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Posts API",
      error,
    });
  }
};

const getUserPostsController = async (req, res) => {
  try {
    const userposts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "user Posts",
      userposts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in User Posts API",
      error,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Your Post been Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete Post API",
      error,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //post find
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide post title or description",
      });
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in update post api",
      error,
    });
  }
};
module.exports = {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
