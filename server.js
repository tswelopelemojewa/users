// import  Sequelize from 'sequelize';

import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';


const app = express();
app.use(bodyParser.json());

app.use(express.static('public'))
app.use(express.json())


const db = new sqlite3.Database('./database.sqlite');


db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, role TEXT, email TEXT, password TEXT)'
    );
  });
  
  class User {
    constructor(firstName, lastName, role, email, password) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.role = role;
      this.email = email;
      this.password = password;
    }
  }


  app.post('/signup', (req, res) => {
    const { firstName, lastName, role, email, password } = req.body;
  
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({ error: 'Error hashing password' });
      } else {
        const user = new User(firstName, lastName, role, email, hash);
        db.run(
          'INSERT INTO users (firstName, lastName, role, email, password) VALUES (?, ?, ?, ?, ?)',
          [user.firstName, user.lastName, user.role, user.email, user.password],
          (err) => {
            if (err) {
              res.status(500).json({ error: 'Error creating user' });
            } else {
              
              res.status(201).json({ 
                message: 'User created successfully',
                email: `${email}`
            });
            }
          }
        );
      }
    });
  });

  

  app.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else if (!row) {
        res.status(401).json({ error: 'User not found' });
      } else {
        bcrypt.compare(password, row.password, (err, result) => {
          if (err) {
            res.status(500).json({ error: 'Error comparing passwords' });
          } else if (!result) {
            res.status(401).json({ error: 'Incorrect password' });
          } else {
            
            res.json({ 
              message: 'Signin successful',
              email: `${email}`
          });
          }
        });
      }
    });
  });
  

//   app.get('/signup/', async (req, res) => {

//     res.render("signup.ejs")
//  })
 
 
 // ...
 
 // Login route (GET request to display the login form)
//  app.get('/signin', (req, res) => {
//     res.render('signin.ejs'); // Render your login form (e.g., login.ejs)
//  });


//  app.get('/', (req, res) => {
//   res.render('index.ejs'); // Render your login form (e.g., login.ejs)
// });







app.listen(3000, () => {
  console.log('Server started on port 3000');
});
