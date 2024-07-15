const { validationResult } = require('express-validator');
const Post = require('../models/Post');


exports.getPostCounts = async (req, res) => {
  try {
    const activeCount = await Post.countDocuments({ createdBy: req.user.id, active: true });
    const inactiveCount = await Post.countDocuments({ createdBy: req.user.id, active: false });

    res.json({ activeCount, inactiveCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByLocation = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ msg: 'Latitude and Longitude are required' });
  }

  try {
    const posts = await Post.find({
      'geoLocation.latitude': latitude,
      'geoLocation.longitude': longitude,
      createdBy: req.user.id
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, body, geoLocation } = req.body;

  try {
    const newPost = new Post({
      title,
      body,
      geoLocation,
      createdBy: req.user.id
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user.id });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, body, active, geoLocation } = req.body;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { title, body, active, geoLocation } },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    console.log(req.params.id);
    let post = await Post.findById(req.params.id);
    console.log("post: ", post);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);


    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
