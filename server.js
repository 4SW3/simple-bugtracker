const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rejectionHandler = require('./utils/globalRejectionHandler');

process.on('unhandledRejection', err =>
  rejectionHandler('unhandledRejection', err)
);
process.on('uncaughtException', err =>
  rejectionHandler('uncaughtException', err)
);

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successfull!'));

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runnnig on port ${port}...`);
});
