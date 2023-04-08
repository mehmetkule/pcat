const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 3;
  const skip = (page - 1) * perPage;
  const photosPromise = Photo.find({})
    .skip(skip)
    .limit(perPage)
    .sort('-date');
  const countPromise = Photo.countDocuments();
  const [photos, count] = await Promise.all([photosPromise, countPromise]);
  const pages = Math.ceil(count / perPage);
  if (!photos.length && skip) {
    res.redirect(`/photos/page/${pages}`);
    return;
  }
  res.render('index', {
    photos,
    page,
    pages,
    count,
  });
};

exports.createPhoto = async (req, res) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  
    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadPath, async () => {
      await Photo.create({
        ...req.body,
        image: '/uploads/' + uploadedImage.name,
      });
      res.redirect('/');
    });
  };

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deleteImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deleteImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
