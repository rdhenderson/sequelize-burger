//Get sequelize models
var db = require("./models");

//Call database check function to confirm DB exists or create it if not.
require('./db/databaseCheck.js')('burgers');
console.log("Confirming Database Existence");

console.log("Seeding database");
require('./db/seeds.js')();
