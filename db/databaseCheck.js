var mysql = require('mysql');

module.exports = function(dbName) {
	
	//Ignore this if we're in production environment
	if (process.env.JAWSDB_URL) return true;


	this.connection = mysql.createConnection({
			 host     : 'localhost',
			 user     : 'root',
			 password : ''
	});

	);
	//Get database names and call init to check for dbName db.
	this.connection.query('SHOW DATABASES', (err, results) => {
    if(err) throw err;
    var dbExists = false;
    for (var i = 0; i < results.length; i++) {
      if (results[i].Database === dbName) {
        this.connection.end();
        return true;
      }
    }
    // Database doesn't exist, create it, end connection, and return.
    this.connection.query('CREATE DATABASE ' + dbName, (err, results) => {
      if (err) throw err;
      this.connection.end();
      return true;
    });
	});
};
