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
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(500).json({ errorMessage: `The users information could not be retrieved.` })
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.errorMessage,
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
  // 1. No content
  // 2. Partial Content
  const newUser = req.body;

  insert(newUser)
    .then(data => {
      console.log(data);
      if (data) {
        res.status(201).json(data);
      } else if (!data) {
        res.status(400).json({ message: `Please provide name and bio for the user.` })
      } else {
        res.status(500).json({ message: "There was an error while saving the user to the database" })
      }
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({
        message: error.message,
        stack: error.stack,
      })
    });
}); // NOT DONE!

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { replacement } = req.body;

  try {
    const updatedUser = await update(id, replacement);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: `The user with the specified ID ${id} does not exist.` });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  remove(id)
    .then(data => {
      if (data) {
        res.status(202).json({ message: `User with ID ${id} got deleted.` })
      } else {
        res.status(404).json({ message: `The user with the specified ID ${id} does not exist.` });
      }
    })
    .catch(error => {
      res.status(500).json(error.errorMessage);
    });
});

// Start server to listen to changes
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});