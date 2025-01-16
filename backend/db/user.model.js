const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UserSchema } = require('./user.schema');

const UserModel = mongoose.model('User', UserSchema);

// Create a new user
async function createUser(userData) {
  const user = new UserModel(userData);
  return await user.save(); 
}

// Find a user by username (only one record)
function findUserByUsername(username) {
  return UserModel.findOne({ username }).exec();
}

// Validate user password
async function validatePassword(username, inputPassword) {
  const user = await findUserByUsername(username);
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(inputPassword, user.password);
  if (!isValid) throw new Error('Invalid password');
  return user; // return the user if the password is valid
}

// Update user description
function updateUserDescription(username, description) {
  return UserModel.findOneAndUpdate(
    { username },
    { description },
    { new: true } // return the updated document
  ).exec();
}

// Promote a user to admin
// if needed for testing or admin management
async function promoteToAdmin(username) {
  return UserModel.findOneAndUpdate(
      { username },
      { isAdmin: true }, 
      { new: true } 
  ).exec();
}

// Delete
async function deleteUser(username) {
  return UserModel.findOneAndDelete({ username }).exec();
}

// Extra Credit: Search for users (case-insensitive, partial match)
async function searchUsersByName(searchQuery) {
  const regex = new RegExp(searchQuery, 'i'); 
  return UserModel.find({ username: { $regex: regex } }, { username: 1 }).exec();
}


module.exports = {
  createUser,
  findUserByUsername,
  validatePassword,
  updateUserDescription,
  promoteToAdmin,
  deleteUser,
  searchUsersByName,
};