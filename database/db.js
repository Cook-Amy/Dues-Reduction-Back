var mysql = require('mysql');
var pool = mysql.createPool({
  // deploy connection
  // connectionLimit: 5,
  // host: 'drdatabase-1.clp3eqbbr1hl.us-east-2.rds.amazonaws.com',
  // user: 'admin',
  // password: 'drwebhost2020',
  // database: 'dues_red',
  // multipleStatements: true

  // local connection
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'dues_red',
  multipleStatements: true
})

pool.getConnection((err, connection) => {
  // console.log("Attempting to connect to DB ... ");

  if(err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log("Database connection was closed");
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.log('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.log('Database connection was refused');
    }
  }

  if(connection) {
    console.log('DB connected successfully');
    connection.release();
  }
  return;
});

// Needed to use this line in the DB to make the connection work:
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';


module.exports = pool;