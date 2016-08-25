'use strict';

const mysql = require('./lib/mysql');
const P2PSpider = require('./lib');


mysql.connect(function(err) {
  if(err) {
    console.log(err);
    process.exit(1)
  }

  function getInsertSql(data) {
    return `insert into metadata(name, magnet, ip, infohash, fetched_at)
            values("${data.name}", "${data.magnet}", "${data.ip}", "${data.infohash}", now())`;
  }

  let p2p = P2PSpider({
    nodesMaxSize: 100,   // be careful
    maxConnections: 150, // be careful
    timeout: 5000
  });

  p2p.ignore(function (infohash, rinfo, callback) {
      // false => always to download the metadata even though the metadata is exists.
      var theInfohashIsExistsInDatabase = false;
      callback(theInfohashIsExistsInDatabase);
  });

  p2p.on('metadata', function (metadata) {
      // At here, you can extract data and save into database.
    let data = {
      magnet: metadata.magnet,
      name: metadata.info.name ? metadata.info.name.toString() : '',
      ip: metadata.address,
      infohash: metadata.infohash
    };
    mysql.query(getInsertSql(data));
  });

  p2p.listen(6882, '0.0.0.0');
})
