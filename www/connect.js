var port = 7777;
var connect = require('connect');
connect.createServer( connect.static(__dirname)).listen(port);

console.log("hello @" + port);
