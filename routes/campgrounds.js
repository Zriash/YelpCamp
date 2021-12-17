const express = require('express');
const router = express.Router();
const campgrounds = require('../controlers/campgrounds');
const { isLogin, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.index)
    .post(isLogin, upload.array('image'), validateCampground, campgrounds.newCampground)
    .put(campgrounds.searchCampground)

router.get('/new', isLogin, campgrounds.renderNewForm);

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLogin, isAuthor, upload.array('image'), validateCampground, campgrounds.updateCampground)
    .delete(isLogin, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLogin, isAuthor, campgrounds.renderEditForm);

module.exports = router;