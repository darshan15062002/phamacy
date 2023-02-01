const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const encoder = bodyparser.urlencoded({ extended: true });

const app = express();

app.use(express.static("public"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "$$dar$$123",
  database: `userlogindb`,
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", encoder, function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const quary =
    "insert into userlogin (user_name,user_pass,email )values(?,?,?);";

  connection.query(
    quary,
    [username, password, email],
    function (error, result) {
      if (error) {
        res.redirect("/");
      } else {
        res.redirect("/login.html");
      }
    }
  );
});
app.post("/login", encoder, function (req, res) {
  const quary = "select * from userlogin ";
  connection.query(quary, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      const email = req.body.email;
      const password = req.body.password;
      const mysqldata = result;
      mysqldata.forEach(function (data) {
        if (data.email == email && data.user_pass == password) {
          res.redirect("/home");
        }
      });
    }
  });
});
app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/public/home.html");
});


app.listen(4000, function () {
  console.log("server is up on port 3000");
});
