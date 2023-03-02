const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./public/helpers/fsUtils.js');

// const { ppid } = require('process');
// TODO: create api const?
// const api = require('./public/assets/js/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: api middleware?
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for api/notes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

// POST Route for api/notes
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  // destructure assignment of object
  const { title, text } = req.body;

  if (req.body.title) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.json('Error in adding note');
  }
});

// GET Route for homepage. "wildcard"
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
