//random 6 key generator
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
// Email checker
const getUserByEmail = function(email, users) {
  for (const id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return undefined;
};

const urlsForUser = function(id, urlDatabase) {
  let urls = {};
  for (const index in urlDatabase) {
    if (urlDatabase[index].userID === id) {
      urls[index] = urlDatabase[index];
    }
  }
  return urls; 
}

module.exports = { generateRandomString, getUserByEmail, urlsForUser };