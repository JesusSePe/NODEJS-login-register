
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

// GLOBAL CONFIG
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


// root o "home page"
app.get('/', (req, res) => {
  res.render('home', {})
})

// Home page post. Returns Hello + name if the home page is on POST with a name given.
app.post('/', function(req, res) {
    var nom = req.body.nom
    res.send("Hello " + nom);
})

// Renders the login page.
app.get("/login", function(req, res){
    res.render('login',{})
})

// Login Page. Checks if the user exists in LocalStorage. If the user exists, a welcome message is shown.
// Otherwise, if the user does not exist, or password does not match, an error message is shown.
app.post("/login", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;
  var exist = false;
  for (var i = 0; i < localStorage.length; i++) {
    if (usuari == localStorage.key(i)){
      user_info = JSON.parse(localStorage.getItem(usuari));
      console.log(user_info);
      if (contrasenya == user_info['password']){
        exist = true;
        res.send("WILLKOMMEN")
      }
    };
  }
  if (exist == false) {
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho<br><a href='./login'>Inicia sessió</a>")
  }
})

// A signup page is rendered. 
app.get("/signup", function(req, res){
  res.render('signup',{})
})

// The data provided for signup is processed, and the user is added to the database with the password and username provided. 
app.post("/signup", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;
  var token = "";
  var data = {password: contrasenya, token: token};

  localStorage.setItem(usuari, JSON.stringify(data));
  res.send("El usuari ha estat registrat correctament <br><a href='./login'>Inicia sessió</a>")
})

// The API login works from console with curl [url] -X POST -d "user=name" -d "pass=password"
// If the user is found at the database, then the password is checked.
// If both matches, a session token is generated, and the user can acces using it instead of sending user and password.
// If the user is not found, or password does not match, an error is shown.
app.post("/api/login", function(req, res){
  var usuari = req.body.user;
  var contrasenya = req.body.pass;
  var exist = false;
  for (var i = 0; i < localStorage.length; i++) {
    if (usuari == localStorage.key(i)){
      user_info = JSON.parse(localStorage.getItem(usuari));
      if (contrasenya == user_info['password']){
        exist = true;
        var token = require('crypto').randomBytes(64).toString('hex');
        var data = {password: contrasenya, token: token};
        localStorage.setItem(usuari, JSON.stringify(data));
        res.send("WILLKOMMEN")
      }
    };
  }
  if (exist == false) {
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho")
  }
})

// The API logout works from console like the login, but only the token is nedded.
// If the token is found at the database, then it is deleted from the database, and the user gets a logout message.
// If the token is not found, an error message is shown. 
app.post("/api/logout", function(req, res){
  var token = req.body.token;
  for (var i = 0; i < localStorage.length; i++) {
    user = localStorage.key(i);
    user_data = JSON.parse(localStorage.getItem(user));
    if (token == user_data['token']){
      new_data = {password: user_data['password'], token: ""};
      localStorage.setItem(user, JSON.stringify(new_data));
      res.send('Logged out.');
    } else {
      res.send('There was an error logging out. Check if the token is correct.');
    }
  };
})

// The app listens to the 3000 port in localhost.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
