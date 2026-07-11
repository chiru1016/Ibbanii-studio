const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection with Mongoose (no options)...');
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Mongoose: SUCCESSFULLY CONNECTED!');
  process.exit(0);
})
.catch(err => {
  console.error('Mongoose CONNECTION FAILED:', err);
  process.exit(1);
});
