const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
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

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({})
  res.render('index', {
    photos
  })});

app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');
});

const port = 3000;
app.listen(port, (err) => {
  if (err) return console.log('Error', err);
  console.info(`Server listening on port ${port}`);
});
