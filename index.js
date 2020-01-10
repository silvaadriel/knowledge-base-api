const app = require('express')();
const consign = require('consign');
const db = require('./config/db.js');

app.db = db;

consign()
  .then('./config/middlewares.js')
  .into(app);

app.listen(3000, () => console.log('Server running'));
