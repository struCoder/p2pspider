'use strict';

const mysql = require('mysql');
const config = require('../config').mysql;

let connection = mysql.createConnection(config);

module.exports = connection;
