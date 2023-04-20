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
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

// Main page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//form submission page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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
  const longURL = req.params.longUrl;
  const templateVars = {
    longURL: urlDatabase[longURL]
  };
  return res.render('urls_show', templateVars);
});

app.post('/urls/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  return res.redirect("/urls");
});