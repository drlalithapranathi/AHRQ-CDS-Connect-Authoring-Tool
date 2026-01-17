const path = require('path');
const bcrypt = require('bcryptjs');

// Load the username/passwords that will be authenticated using the local authentication strategy
let users = {};
try {
  users = require(path.join(process.cwd(), 'config', 'local-users.json'));
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log('No users specified.');
  }
}

const userNames = Object.keys(users);

/**
 * Find a user by username and verify password.
 * Supports both bcrypt hashed passwords (recommended) and plain text (legacy/dev only).
 * Bcrypt hashes start with '$2a$' or '$2b$'.
 */
async function findByUsername(name, password, cb) {
  for (let i = 0; i < userNames.length; i++) {
    if (userNames[i] === name) {
      const storedPassword = users[userNames[i]];
      let isValid = false;

      // Check if password is bcrypt hashed (starts with $2a$ or $2b$)
      if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
        isValid = await bcrypt.compare(password, storedPassword);
      } else {
        // Legacy plain text comparison (for development only)
        // Log a warning in production
        if (process.env.NODE_ENV === 'production') {
          console.warn(`WARNING: User "${name}" has a plain text password. Use bcrypt hashes in production.`);
        }
        isValid = storedPassword === password;
      }

      if (isValid) {
        // Set up user object to mirror LDAP structure
        const user = { uid: userNames[i] };
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    }
  }
  return cb(null, null);
}

/**
 * Helper function to generate a bcrypt hash for a password.
 * Use this to create hashed passwords for local-users.json.
 * Example: node -e "require('./src/auth/localAuthUsers').hashPassword('mypassword').then(console.log)"
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

module.exports = {
  findByUsername,
  hashPassword
};
