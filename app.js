const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const Photo = require('./models/Photo');

const app = express();

//Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pcat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//View Engine
app.set('view engine', 'ejs');

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-date');
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
});

app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {

  const uploadDir = "public/uploads"
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});

const port = 3000;
app.listen(port, (err) => {
  if (err) return console.log('Error', err);
  console.info(`Server listening on port ${port}`);
});
