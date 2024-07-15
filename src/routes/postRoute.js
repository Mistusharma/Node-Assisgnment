const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
require('../../config/passport')

const postController = require('../controllers/postController');


router.post('/', passport.authenticate('jwt', { session: false }),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('body', 'Body is required').not().isEmpty(),
    check('geoLocation.latitude', 'Latitude is required').not().isEmpty(),
    check('geoLocation.longitude', 'Longitude is required').not().isEmpty()
  ],
  postController.createPost
);


router.get('/counts', passport.authenticate('jwt', { session: false }), postController.getPostCounts);

router.get('/location', passport.authenticate('jwt', { session: false }), postController.getPostsByLocation);


router.get('/', passport.authenticate('jwt', { session: false }), postController.getPosts);


router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('body', 'Body is required').not().isEmpty(),
    check('geoLocation.latitude', 'Latitude is required').not().isEmpty(),
    check('geoLocation.longitude', 'Longitude is required').not().isEmpty()
  ],
  postController.updatePost
);

router.delete('/:id', passport.authenticate('jwt', { session: false }), postController.deletePost);

module.exports = router;
