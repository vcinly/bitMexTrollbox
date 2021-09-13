'use strict';

var httpProxy = require('http-proxy');
var apiURL = 'https://www.bitmex.com';
var port = process.argv[2] || 2080;

var proxy = httpProxy.createProxyServer({});

var server = require('http').createServer(function(req, res) {
    // API validates origin and referer to prevent certain types of csrf attacks, so delete them
    delete req.headers['origin'];
    delete req.headers['referer'];
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url == "/mexbox") {
        require('fs').createReadStream(`${__dirname}/mexbox.html`).pipe(res);
    } else {
        req.url = '/api/v1' + req.url;
        console.log('Start proxy ' + req.url)
        proxy.web(req, res, {
            changeOrigin: true,
            target: apiURL,
            rejectUnauthorized: false
        }, (e) => {
            console.log(e)
        });
    }
});

server.listen(port);
console.log('Started BitMEX proxy on port', port);
