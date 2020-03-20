const path = require('path');

module.exports = {
  mode: 'production',
  watch: true,
  entry: './public/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public/js')
  },
  performance: {
    hints: false // Temporary
  }
};
