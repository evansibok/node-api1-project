// implement your API here

// Import Express and Cors
const express = require('express');
const cors = require('cors');

//Import Actions from db file
const { find, findById, insert, update, remove } = require('./data/db');

// Instantiate Server App and Port
const app = express();
const port = 9000;

// Plug extra functionality needed to use req and res body
app.use(express.json());

// Enable cors so app work for all origins
app.use(cors());

// Endpoints
app.get('/api/users', (req, res) => {
  find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(404).json({
        message: error.message,
        stack: error.stack,
      });
    });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `User not found!` });
      }
    })
    .catch(error => {
      res.status(404).json({
        message: error.message,
        stack: error.stack,
      });
    })
});

app.post('/api/users', (req, res) => {

});

app.put('/api/users/:id', async (req, res) => {

});

app.delete('/', (req, res) => {

});

// Start server to listen to changes
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});