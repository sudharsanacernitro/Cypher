/*const express = require('express');
var mysql = require('mysql');
const app = express();
 
//app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(express.static('public')); // Assuming HTML file is in the 'public' directory

app.get("/", (req, res) => {
  res.sendFile( __dirname + '/index.html');

});
 
 app.get("/index1.html", (req, res) => {
  res.sendFile( __dirname + '/index1.html');

});

app.post("/index.html", (req, res) => {
  const username = req.body.dname;
  console.log("Username: " + username);
  //res.send(username);
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wifi"
});
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var query = 'INSERT INTO commands (commands) VALUES (?)';
  con.query(query,[username],(error, result) => {
  if (error) {
    console.error('Error inserting item:', error);
    return;
  }
  console.log('Item inserted successfully!');
  con.end();  

});

});
});
app.get("/index1.html", (req, res) => {
  res.sendFile( __dirname + '/index1.html');

});

app.listen(8080);*/
const express = require('express');
const app = express();
var mysql = require('mysql');
// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); 
// Route for the first HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.post("/1", (req, res) => {
  const username = req.body.dname;
  console.log("Username: " + username);
  //res.send(username);
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wifi"
});
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var query = 'INSERT INTO commands (commands) VALUES (?)';
  con.query(query,[username],(error, result) => {
  if (error) {
    console.error('Error inserting item:', error);
    return;
  }
  console.log('Item inserted successfully!');
  con.end();  

});

});
});
// Route for the second HTML page
/*app.get('/1', (req, res) => {
  res.sendFile(__dirname + '/1.html');
});
*/
// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
