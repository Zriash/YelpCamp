const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken});
// const cloudinary = require('cloudinary').v2;
const { cloudinary }  = require('../cloudinary');


module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.newCampground = catchAsync(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully made a new campground!');
    res.redirect(`campgrounds/${campground._id}`);
});

module.exports.showCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
         populate: {path: 'author'}
        }).populate('author');
    if (!campground) {
        req.flash('error', 'cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
});

module.exports.renderEditForm =  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
});

module.exports.updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const imgs = campground.images
    if (imgs) {
    for (let i=0; i<imgs.length; i++) {
        await cloudinary.uploader.destroy(imgs[i].filename);
    }}
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground!');
    res.redirect('/campgrounds');
});






module.exports.searchCampground = catchAsync(async (req, res) => {
    const search = req.body.search
    const campgrounds = await Campground.find({location: /search/i});
    console.log(search)
    res.render('campgrounds/searchIndex', {campgrounds, search});
});