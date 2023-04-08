const express = require('express');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const photoControllers = require('./controllers/photoControllers');
const pageControllers = require('./controllers/pageControllers');
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
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//Routes
app.get('/', photoControllers.getAllPhotos);
app.post('/photos', photoControllers.createPhoto);
app.get('/photos/:id', photoControllers.getPhoto);
app.put('/photos/:id', photoControllers.updatePhoto);
app.delete('/photos/:id', photoControllers.deletePhoto);

app.get('/about', pageControllers.aboutPage);
app.get('/add', pageControllers.addPage);
app.get('/photos/edit/:id', pageControllers.editPhotoPage);



const port = 3000;
app.listen(port, (err) => {
  if (err) return console.log('Error', err);
  console.info(`Server listening on port ${port}`);
});
