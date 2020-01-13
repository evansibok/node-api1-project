// implement your API here

// Export Express and Cors
const express = require('express');
const cors = require('cors');

// Instantiate Server App and Port
const app = express();
const port = 9000;

// Plug extra functionality needed to use req and res body
app.use(express.json());

// Enable cors so app work for all origins
app.use(cors());

// Endpoints
app.get('/', () => {

});

app.get('/', () => {

});

app.post('/', () => {

});

app.put('/', () => {

});

app.delete('/', () => {

});

// Start server to listen to changes
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})