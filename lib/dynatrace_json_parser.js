/*
References:
- https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
*/

const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter; //prerequisite -> npm i -s csv-writer

const directoryPath = '/perf/tenant-resource-consumption/';
const fileSuffix = '2020_06_13_16_30';
const inputDirectory = 'dynatrace_raw_results/';
const outputDirectory = 'dynatrace_formatted_results/';

fs.readFile( directoryPath + inputDirectory + 'dynatrace_system_metrics_' + fileSuffix + '.json', (err, data) => {
	
	if(err)
		throw err;
	
	var dataJson = JSON.parse(data);
	
	var chartsArr = dataJson.rows[0].charts;
	for( let chart of chartsArr ) {
		
		var chartDisplayName = chart.displayName;
		console.log("Chart Name: " + chartDisplayName);
		
		var seriesList = chart.seriesList;
		for( let series of seriesList ) {
			
			var seriesDisplayName = series.displayName;
			console.log("Series Name: " + seriesDisplayName);
			
			var dataPointsArr = series.data.dataPoints;
			console.log("No of DataPoints: " + dataPointsArr.length);
			
			// format the datapoints`
			for( let dataPoint of dataPointsArr ) {
				
				var dateTimeString = new Date(dataPoint.timestamp).toISOString();
				dataPoint.timestamp = dateTimeString;
				
				if( chartDisplayName == 'Memory' ) {
					var valueInMb = dataPoint.value / ( 1000 * 1000 );
					dataPoint.value = valueInMb;
				}
			}
			
			var csvWriter = createCsvWriter({
				path: directoryPath + outputDirectory + fileSuffix + '_' + chartDisplayName + '_' + seriesDisplayName + '.csv',
				header: [
					{id: 'timestamp', title: 'Timestamp'},
					{id: 'value', title: 'Value'}
				]
			});
			
			csvWriter
				.writeRecords(dataPointsArr)
				.then(()=> console.log('The CSV file was written successfully'));
		}
		
	}
});

