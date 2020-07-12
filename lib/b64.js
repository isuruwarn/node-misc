
var jwt = '';
var decodedString = '';
var prompt = require('prompt');

prompt.start();

prompt.get(['jwt'], function (err, result) {
	
	jwt = result.jwt;
	if( jwt.indexOf('.') > -1 ) { // decode JWTs
		
		var jwtParts = jwt.split('.');
		decodedString = Buffer.from( jwtParts[0], 'base64' ).toString('ascii');
		console.log( '\nHeader:\n' + decodedString );
		
		decodedString = Buffer.from( jwtParts[1], 'base64' ).toString('ascii');
		console.log( '\nPayload:\n' + decodedString );
		
		decodedString = Buffer.from( jwtParts[2], 'base64' ).toString('ascii');
		console.log( '\nSignature:\n' + decodedString );
		
	} else {
		decodedString = Buffer.from( jwt, 'base64' ).toString('ascii');
		console.log( '\n' + decodedString );
	}
	
});
