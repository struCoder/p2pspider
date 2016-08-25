'use strict';

const mysql = require('mysql');
const config = require('../config').mysql;
console.log(config)

let connection = mysql.createConnection(mysql);

module.exports = connection;
