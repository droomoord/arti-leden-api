const mongoose = require('mongoose');

const { Schema } = mongoose;

const whitelistSchema = new Schema(
  {
    email: String,
  },
  {
    collection: 'whitelist',
  }
);

const Whitelist = mongoose.model('whitelist', whitelistSchema);

module.exports = Whitelist;
