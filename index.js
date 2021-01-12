
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


app.post('/', function(req, res) {
    var nom = req.body.nom
    res.send("Hello " + nom);
})


app.get("/login", function(req, res){
    res.render('login',{})
})

app.post("/login", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;
  var exist = false;

  for (var i = 0; i < localStorage.length; i++) {
    if (usuari == (localStorage.key(i)) && contrasenya == localStorage.getItem(localStorage.key(i))){
      exist = true;
      res.send("WILLKOMMEN")
    };
  }
  if (exist == false) {
    res.send("Usuari i/o contrasenya incorrectes. Torna a intentar-ho<br><a href='./login'>Inicia sessió</a>")
  }
})

app.get("/signup", function(req, res){
  res.render('signup',{})
})

app.post("/signup", function(req, res){
  var usuari = req.body.usuari;
  var contrasenya = req.body.contrasenya;

  localStorage.setItem(usuari, contrasenya);
  console.log(localStorage)
  res.send("El usuari ha estat registrat correctament <br><a href='./login'>Inicia sessió</a>")
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
