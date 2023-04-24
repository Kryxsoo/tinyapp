const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const password = "purple-monkey-dinosaur"; // found in the req.body object
const hashedPassword = bcrypt.hashSync(password, 10);

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
// Middleware
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: false}));
app.set("view engine", "ejs");
app.use(cookieParser());

//url database
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//user database
const randomID = generateRandomString();
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: "a@a.com",
    password: bcrypt.hashSync(password, 10),
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: "b@b.com",
    password: bcrypt.hashSync(password, 10),
  },
};

app.get("/", (req, res) => {
  console.log('Cookies: ', req.cookies);
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

//POST Login
app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (!user) {
    return res.status(403).send("User doesn't exist");
  }
  if (user.password !== req.body.password) {
    return res.status(403).send('Incorrect password');
  }
  let cookie = req.body.email;
  res.cookie("user_id", cookie);
  res.redirect('/urls');
});


//POST logout
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

//POST register
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Error 400: Missing E-mail or password');
  }
  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send('Error 400: Already in use');
  }
  const randomID = generateRandomString();
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: bcrypt.hashSync(password, 10),
  };
  console.log(users[randomID].password);
  res.cookie('user_id', req.body.email);
  res.redirect('/urls');
});

//POST route to receive form submissions
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortUrl}`);
});



// Main page
app.get("/urls", (req, res) => {
  userID = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

//GET Login
app.get("/login", (req, res) => {
  userID = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("login", templateVars);
});

//GET Logout
app.get('/logout', (req, res) => {
  res.render('logout');
});

//GET register
app.get('/register', (req, res) => {
  userID = req.cookies["user_id"];
  if (userID) {
    return res.render('urls_index');
  }
  const templateVars = {
    urls: urlDatabase,
    email: users.userRandomID.email,
    password: users.userRandomID.password,
    user: null
  };
  res.render("register", templateVars);
});

//GET new url
app.get("/urls/new", (req, res) => {
  userID = req.cookies["user_id"];
  if (!userID) {
    return res.render('login');
  }
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get('/urls/:shortUrl', (req, res) => {
  const longURL = req.params.longUrl;
  const templateVars = {
    longURL: urlDatabase[longURL],
    username: req.cookies["username"]
  };
  return res.render('urls_show', templateVars);
});



app.post('/urls/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  return res.redirect("/urls");
});

//delete
app.post('/urls/:shortUrl/delete', (req, res) => {
  console.log(req.params.shortUrl);
  delete urlDatabase[req.params.shortUrl];
  res.redirect("/urls");
});