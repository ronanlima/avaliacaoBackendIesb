const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Trabalho!'));
app.listen(3000, () => console.log('Server Started on port 3000!'));