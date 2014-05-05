// A static file server for development use.
// Curran Kelleher 5/5/2014
var port = 8000,
    express = require('express'),
    app = express();

app.use('/', express.static(__dirname + '/'));

app.listen(port);
console.log('Now serving http://localhost:'+port);
