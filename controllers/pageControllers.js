const Photo = require('../models/Photo');


exports.addPage = (req, res) => {
  res.render('add');
};

exports.aboutPage = (req, res) => {
  res.render('about');
};

exports.editPhotoPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', { photo });
};
