
var jwt = '';
var prompt = require('prompt');

prompt.start();

prompt.get(['jwt'], function (err, result) {
	
    jwt = result.jwt;
	var decodedJWT = Buffer.from( jwt, 'base64' ).toString('ascii');
	console.log( '\n' + decodedJWT );
	
});
