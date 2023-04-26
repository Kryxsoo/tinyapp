const express = require("express");
const app = express();
const PORT = 3000; // default port 8080
const bcrypt = require("bcryptjs");
// const password = "purple-monkey-dinosaur"; // found in the req.body object
// const hashedPassword = bcrypt.hashSync(password, 10);
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');
// Middleware
const cookieSession = require('cookie-session')
app.use(express.urlencoded({ extended: false}));
app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

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
    password: bcrypt.hashSync("camel", 10),
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: "b@b.com",
    password: bcrypt.hashSync("camel", 10),
  },
};

app.get("/", (req, res) => {
  const userID = req.cookies["user_id"];
  if (!userID) {
    return res.render('login');
  }  else {
    return res.render('urls')
  }
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

  if (!bcrypt.compareSync(req.body.password, user.password)) {
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
    password: bcrypt.hashSync(req.body.password, 10),
  };
  console.log(users[randomID]);
  res.cookie('user_id', randomID);
  res.redirect('/urls');
});

//POST route to receive form submissions
app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString();
  const userID = req.cookies["user_id"];
  const longURL = req.body.longURL
  urlDatabase[shortUrl] = {
    longURL,
    userID
  }
  console.log(urlDatabase);
  res.redirect(`/urls/${shortUrl}`);
});



// Main page
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  if (!userID) {
    return res.render('urls_index');
  } 
  const user = users[userID]
  const templateVars = {
    urls: urlsForUser(userID, urlDatabase),
    user:user,
  };
  res.render("urls_index", templateVars);
});

//GET Login
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  if (userID) {
    res.redirect("/urls");
  }
    const user = {}
    const templateVars = {
      urls: urlDatabase,
      user:user,
    };
  res.render("login", templateVars);
});

//GET Logout
app.get('/logout', (req, res) => {
  res.render('logout');
});

//GET register
app.get('/register', (req, res) => {
  const userID = req.cookies["user_id"];
  if (userID) {
    return res.redirect('/urls');
  } 
  const user = {}
  const templateVars = {
    urls: urlDatabase,
    user:user,
  };
    res.render("register", templateVars);
});

//GET new url
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  if (!userID) {
    return res.send('Please login first');
  } 
  const user = users[userID]
  const templateVars = {
    urls: urlDatabase,
    user:user,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.cookies["user_id"];
  if (!userID) {
    return res.send('Please login first');
  }
  const user = users[userID]
  const shortID = req.params.id;
  const longURL = urlDatabase[shortID].longURL;
  const templateVars = {
    id: shortID,
    longURL,
    user:user,
  };
  res.render("urls_show", templateVars);
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