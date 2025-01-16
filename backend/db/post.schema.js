const Schema = require('mongoose').Schema;

exports.PostSchema = new Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: () => Date.now() },
  }, { collection: 'Posts' });
  
  