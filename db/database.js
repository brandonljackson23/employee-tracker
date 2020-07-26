const mysql = require('mysql2')

// Connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'He15man07!',
  database: 'employees_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected as id: ' + connection.threadId);
});

module.exports = connection;