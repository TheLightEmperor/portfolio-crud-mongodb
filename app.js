const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const Biodata = require('./models/biodata');

let isMongoConnected = false;

mongoose.connect('mongodb://localhost:27017/portfolioDB')
  .then(() => {
    console.log('Connected to MongoDB');
    isMongoConnected = true; // Set flag to true when connected
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the application if MongoDB is not running
  });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware to check MongoDB connection
app.use((req, res, next) => {
  if (!isMongoConnected) {
    return res.status(500).send('Database error: MongoDB is not connected');
  }
  next();
});

app.get('/', async (req, res) => {
  try {
    const people = await Biodata.find();
    res.render('index', { people });
  } catch (err) {
    res.status(500).send('Database error: Unable to fetch data');
  }
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  try {
    const { name, age, bio } = req.body;
    await Biodata.create({ name, age, bio });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Database error: Unable to add data');
  }
});

app.get('/edit/:id', async (req, res) => {
  try {
    const person = await Biodata.findById(req.params.id);
    res.render('edit', { person });
  } catch (err) {
    res.status(500).send('Database error: Unable to fetch data for editing');
  }
});

app.post('/edit/:id', async (req, res) => {
  try {
    const { name, age, bio } = req.body;
    await Biodata.findByIdAndUpdate(req.params.id, { name, age, bio });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Database error: Unable to update data');
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    await Biodata.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Database error: Unable to delete data');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});