const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcryptjs");
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');

//---------- Middleware ----------
const cookieSession = require('cookie-session')
app.use(express.urlencoded({ extended: false}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

//---------- URL Database ----------
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

//---------- User Database ----------
const randomID = generateRandomString();
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: "a@a.com",
    password: bcrypt.hashSync("123", 10),
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: "b@b.com",
    password: bcrypt.hashSync("camel", 10),
  },
};

//---------- Front Page Directs ----------
app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login');
  }  else {
    return res.redirect('/urls')
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//---------- POST Login ----------
app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (!user) {
    return res.status(403).send("User doesn't exist");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(403).send('Incorrect password');
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});


//---------- POST Logout ----------
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

//---------- POST Register ----------
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
  req.session.user_id = randomID;
  res.redirect('/urls');
});

//---------- POST Edit ----------
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login')
  }
  const shortUrl = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[shortUrl] = {
    longURL,
    userID
  }
  res.redirect(`/urls/${shortUrl}`);
});



//---------- Main page ----------
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID]
  if (!userID) {
    res.send("You need to login")
  };
  const templateVars = {
    urls: urlsForUser(userID, urlDatabase),
    user: user,
  };
  res.render("urls_index", templateVars);
});

//---------- GET Login ----------
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    res.redirect("/urls");
  }
  const user = users[req.session.user_id]
    const templateVars = {
      urls: urlDatabase,
      user: user,
    };
  res.render("login", templateVars);
});

//---------- GET register ----------
app.get('/register', (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    return res.redirect('/urls');
  } 
  const user = {}
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
    res.render("register", templateVars);
});

//---------- GET new url ----------
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    return res.render('login',{user:false});
  } 
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_new", templateVars);
});

//---------- GET generated URL ----------
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.send('Please login first');
  }
  const user = users[userID]
  const shortID = req.params.id;
  const longURL = urlDatabase[shortID].longURL;
  const templateVars = {
    id: shortID,
    longURL,
    user: user,
  };
  res.render("urls_show", templateVars);
});

//---------- Post ShortURL ----------
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL];
  const userID = req.session.user_id;
  const longURL = req.body.longURL
  if (urlObj.userID !== userID) {
    return res.send('This does not belong to you!');
  }
  urlDatabase[shortURL] = {
    longURL,
    userID
  };
  res.redirect('/urls');
});

//---------- DELETE function ----------
 app.post('/urls/:shortUrl/delete', (req, res) => {
  if (!urlsForUser(req.session.user_id, urlDatabase)) {
    res.send("You are not the owner")
  } else {
    delete urlDatabase[req.params.shortUrl];
    res.redirect("/urls");   
  }
  });
