const path = require('path');

module.exports = {
  mode: 'production',
  entry: './test/sha1.test.js',
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'sha1.bundle.js',
  },
};