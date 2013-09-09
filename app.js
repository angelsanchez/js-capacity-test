var express = require('express'), path = require('path');

var app = express();

app.configure(function() {
    app.use(express.static( path.join(__dirname, 'public') ));
});

app.listen(3000);
