module.exports = (type, err) => {
  if (type === 'unhandledRejection') {
    console.log('Unhandled rejection! Shutting down server...');
    console.log(err.name, err.message);
    process.exit(1);
  } else if (type === 'uncaughtException') {
    console.log('Uncaught exception! Shutting down server...');
    console.log(err.name, err.message);
    process.exit(1);
  }
};
