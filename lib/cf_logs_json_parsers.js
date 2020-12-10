const fs = require('fs');
const lineReader = require('line-reader');

const directoryPath = 'C:/Users/i830520/Downloads/';
const fileName = 'logs.txt';
const outputFileName = 'parsed_' + fileName;

// npm i line-reader
// npm install --save n-readlines
// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/

lineReader.eachLine(directoryPath + fileName, function(line) {
	
	//if( line.indexOf('[RTR/') > -1 )
	//	return;
	
	var parsedLine = '';
	var i = line.indexOf(']OUT ') + line.indexOf('] OUT ');
	
	parsedLine = line;
	if( i > -1 )  {
		// handle json output
		parsedLine = parsedLine.substr( i + 6 );
		try {
			var lineJson = JSON.parse(parsedLine);
			parsedLine = lineJson.level + " " + lineJson.msg;
		} catch(e) {
			console.error(e.message);
		}
	}
	console.log(parsedLine);
	
	fs.appendFileSync( directoryPath + outputFileName, parsedLine + '\n' );
});
