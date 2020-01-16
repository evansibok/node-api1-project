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
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  } else {
    insert(newUser)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(error => {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
      });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const replacement = req.body;

  const user = await findById(id);

  // Does userWithId exist? No - Return 400
  // Does req.body.name || req.body.bio exist?  No - Return 400
  // Error? Return 500
  // User is found and new information exist? Return 200

  // SOLUTION 1

  // if (!user) {
  //   res.status(404).json({ message: "The user with the specified ID does not exist." });
  // } else {
  //   if (!replacement.name || !replacement.bio) {
  //     res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  //   } else {
  //     update(user.id, replacement)
  //       .then(data => {
  //         res.status(200).json({ message: "User information update successful!"});
  //       })
  //       .catch(error => {
  //         res.status(500).json({
  //           errorMessage: "The user information could not be modified.",
  //           stack: error.stack,
  //         })
  //       });
  //   }
  // }


  // SOLUTION 2
  if (!user) {
    res.status(404).json({ message: "The user with the specified ID does not exist." });
  } else {
    if (!replacement.name || !replacement.bio) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      try {
        await update(user.id, replacement);
        res.status(200).json({ message: "User information update successful!" });
      } catch (error) {
        res.status(500).json({
          errorMessage: "The user information could not be modified.",
          stack: error.stack,
        });
      }
    }
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
      res.status(500).json({
        errorMessage: "The user could not be removed",
        stack: error.stack,
      });
    });
});

// Start server to listen to changes
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// GET ALL - done
// GET SINGLE - done
// POST - done
// PUT
// DELETE - done