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
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: false}));
app.set("view engine", "ejs")
app.use(cookieParser())

//url database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
app.get("/urls", (req, res) => {
  userID = req.cookies["user_id"]
  const templateVars = { 
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

//Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log(req.body)
  let cookie = req.body.username
  res.cookie("user_id", cookie)
  res.redirect('/urls');
})

//logout
app.get('/logout', (req, res) => {
  res.render('logout');
});

app.post('/logout', (req, res) => {
  console.log(req.body)
  res.clearCookie("user_id")
  res.redirect('/urls');
})

//user database
const randomID = generateRandomString();
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: "a@a.com",
    password: "123",
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: "b@b.com",
    password: "456",
  },
};


//Registration
// app.get('/register', (req, res) => {
  //   const templateVars = { 
    //     email: users.userRandomID.email,
    //     password: users.userRandomID.password
    //   };
    //   console.log(templateVars)
    //   res.render("register", templateVars);
    // });
    app.get('/register', (req, res) => {
      userID = req.cookies["user_id"]
      const templateVars = { 
        urls: urlDatabase,
        email: users.userRandomID.email,
        password: users.userRandomID.password,
        user: null
      };
      res.render("register", templateVars)
    })
    
app.post('/register', (req, res) => {
  const randomID = generateRandomString();
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', randomID)
  console.log(users);
  res.redirect('/urls')
});
  // if (!email || !password) {
  //   console.log("working")
// }
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
  const longURL = req.params.longUrl

  const templateVars = {
    longURL: urlDatabase[longURL],
    username: req.cookies["username"]
  }
return res.render('urls_show', templateVars)
})

app.post('/urls/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  return res.redirect("/urls");
});