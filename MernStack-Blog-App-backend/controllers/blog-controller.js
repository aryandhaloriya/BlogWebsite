const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("user");
    return res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  try {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "Unable to find user by this ID" });
    }

    const blog = new Blog({
      title,
      description,
      image,
      user,
    });

    await blog.save();
    existingUser.blogs.push(blog);
    await existingUser.save();

    return res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findByIdAndRemove(id).populate("user");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.user.blogs.pull(blog);
    await blog.user.save();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getByUserId = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const userBlogs = await User.findById(userId).populate("blogs");

    if (!userBlogs) {
      return res.status(404).json({ message: "User blogs not found" });
    }

    return res.status(200).json({ user: userBlogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
