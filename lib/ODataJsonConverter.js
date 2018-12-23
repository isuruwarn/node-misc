
function process() {
	
	var resultsObj = JSON.parse( "{\"d\":{\"results\":[]}}" );
	var arrResults = resultsObj.d.results;

	for( var i = 0; i< arrResults.length; i++ ) {
		
		var strRow = '';
		var resultMap = arrResults[i];
		
		Object.keys(resultMap).forEach(function(key) {
			
			var val = resultMap[key];
			
			if( key != '__metadata' ) {
				//console.log(val);
				if( val && val != undefined && val.indexOf( '/Date(' ) > -1 ) {
					
					try {
						val = new Date(resultMap[key]).toISOString();
					} catch(RangeError) {
						val = resultMap[key];
					}
				}
			
				strRow += val + ',';
			}
			
		});
		
		console.log(strRow + '\n');
	}

}


process();

