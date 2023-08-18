require('dotenv').config();
const express = require("express");
const mysql = require('mysql2');

const app = express();

//Menggunakan folder public
app.use(express.static('public'));
// Untuk mengambil req.body dari ejs
app.use(express.urlencoded({extended: false}));

// Buat Koneksi data
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  port: process.env.PORTDB
});

// Validasi koneksi DB
connection.connect((err) => {
  if(err) throw err;
  console.log("Connect to Database!")
})

// Route menampilkan Homepage
app.get('/', (req, res) => {
  res.render('top.ejs')
})

// Route Menampilkan seluruh data
app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      // Teruskan object sebagai argument ke-2 res.render
      res.render('index.ejs', {items: results});
    }
  );
});

// Route Menampilkan pages tambah data
app.get('/new', (req, res) => {
  res.render('new.ejs');
});

// Route Menambahkan data 
app.post('/create', (req, res) => {
   connection.query(
    'INSERT INTO items (name) VALUES (?)', [ req.body.itemName ],
    (error, results) => {
      res.redirect('/index')
    }
  );
});

//Route untuk menghapus data
app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [ req.params.id ],
    (error, results) => {
      res.redirect('/index');
    }
  )
});

// Route untuk menampilkan data di edit pages
app.get('/edit/:id', (req, res) => {
   connection.query(
     'SELECT * FROM items WHERE id = ?',
     [ req.params.id ],
     (error, results) => {
        res.render('edit.ejs', {item: results[0]});
     }
   );
});

// Route untuk memperbaharui data
app.post('/update/:id', (req, res) => {
   connection.query(
     'UPDATE items SET name = ? WHERE id = ?',
     [ req.body.itemName, req.params.id ],
     (error, results) => {
       res.redirect('/index');
     }
     );
  
});

app.listen(3000, () => console.log('Server Running'));