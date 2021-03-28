var http = require('http');
var mockserver = require('mockserver');

http.createServer(mockserver('./tests/mocks/api')).listen(3001);
