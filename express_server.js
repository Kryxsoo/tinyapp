const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//random 6 key generator, use for later
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
// Middleware
<<<<<<< HEAD
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
=======
//*D04 app.use(express.urlencoded({extended: true}));
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: false}));
app.set("view engine", "ejs")
app.use(cookieParser())
>>>>>>> feature/cookies

//url database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//user database
const users = {
  id: 'username',
  email: 'a@a.com',
  password: '123'
}

app.get("/", (req, res) => {
  console.log('Cookies: ', req.cookies)
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

// Main page
<<<<<<< HEAD
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
=======
 app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
>>>>>>> feature/cookies
  res.render("urls_index", templateVars);
});

//Login
app.get('/login', (req, res) => {
res.render('login');
});

app.post('/login', (req, res) => {
  console.log(req.body)
  let cookie = req.body.username
  res.cookie("username", cookie)
  res.redirect('/urls');
})

//logout
app.get('/logout', (req, res) => {
  res.render('logout');
  });
  
  app.post('/logout', (req, res) => {
    console.log(req.body)
    res.clearCookie("username")
    res.redirect('/urls');
  })


//form submission page
app.get("/urls/new", (req, res) => {
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

//post route to receive form submissions
app.post("/urls", (req, res) => {
  console.log(req.body); //log post request to console
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortUrl}`);
});
//delete
app.post('/urls/:shortUrl/delete', (req, res) => {
  console.log(req.params.shortUrl);
  delete urlDatabase[req.params.shortUrl];
  res.redirect("/urls");
});

app.get('/urls/:shortUrl', (req, res) => {
<<<<<<< HEAD
  const longURL = req.params.longUrl;
  const templateVars = {
    longURL: urlDatabase[longURL]
  };
  return res.render('urls_show', templateVars);
});
=======
  const longURL = req.params.longUrl

  const templateVars = {
    longURL: urlDatabase[longURL],
    username: req.cookies["username"]
  }
return res.render('urls_show', templateVars)
})
>>>>>>> feature/cookies

app.post('/urls/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  return res.redirect("/urls");
});