/*
References:
- https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
*/

const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter; //prerequisite -> npm i -s csv-writer

const directoryPath = 'C:/Users/user1234/Documents/dev/';
const fileSuffix = '2020_06_16_14_30';
const inputDirectory = 'dynatrace_raw_results/';
const outputDirectory = 'dynatrace_formatted_results/';

fs.readFile( directoryPath + inputDirectory + 'dynatrace_system_metrics_' + fileSuffix + '.json', (err, data) => {
	
	if(err)
		throw err;
	
	var dataJson = JSON.parse(data);
	var outputArr = [];
	
	var chartsArr = dataJson.rows[0].charts;
	for( let chart of chartsArr ) {
		
		var chartDisplayName = chart.displayName;
		console.log("Chart Name: " + chartDisplayName);
		
		var seriesList = chart.seriesList;
		var seriesIndex = 0;
		for( let series of seriesList ) {
			
			var seriesDisplayName = series.displayName;
			console.log("Series Name: " + seriesDisplayName);
			
			var dataPointsArr = series.data.dataPoints;
			console.log("No of DataPoints: " + dataPointsArr.length);
			
			// format the datapoints
			var dataPointIndex = 0;
			for( let dataPoint of dataPointsArr ) {
				
				var dateTimeString = new Date(dataPoint.timestamp).toISOString();
				dataPoint.timestamp = dateTimeString;
				
				if( chartDisplayName == 'Memory' ) {
					var valueInMb = dataPoint.value / ( 1000 * 1000 );
					dataPoint.value = valueInMb;
				}
				
				var outputRow = outputArr[dataPointIndex];
				if( !outputRow ) {
					outputRow = [];
				}
				
				if( seriesIndex == 0 ) {
					outputRow['timestamp'] = dataPoint.timestamp;
					outputArr[dataPointIndex] = outputRow;
				}
				
				if( chartDisplayName == 'Memory' && seriesDisplayName == 'Initial' ) {
					outputRow['memoryInitial'] = dataPoint.value;
				} else if( chartDisplayName == 'Memory' && seriesDisplayName == 'Used' ) {
					outputRow['memoryUsed'] = dataPoint.value;
				} else if( chartDisplayName == 'Memory' && seriesDisplayName == 'Maximum' ) {
					outputRow['memoryTotal'] = dataPoint.value;
				} else if( chartDisplayName == 'Threads' && seriesDisplayName == 'Thread Count' ) {
					outputRow['threadsTotal'] = dataPoint.value;
				} else if( chartDisplayName == 'Threads' && seriesDisplayName == 'Runnable Count' ) {
					outputRow['threadsRunnable'] = dataPoint.value;
				} else if( chartDisplayName == 'Threads' && seriesDisplayName == 'Daemon Count' ) {
					outputRow['threadsDaemons'] = dataPoint.value;
				} else if( chartDisplayName == 'Threads' && seriesDisplayName == 'Waiting Count' ) {
					outputRow['threadsWaiting'] = dataPoint.value;
				} else if( chartDisplayName == 'FileDescriptor' && seriesDisplayName == 'FileDescriptor Open Count' ) {
					outputRow['fileDescriptorOpen'] = dataPoint.value;
				} else if( chartDisplayName == 'FileDescriptor' && seriesDisplayName == 'FileDescriptor Max Count' ) {
					outputRow['fileDescriptorMax'] = dataPoint.value;
				}
				
				outputArr[dataPointIndex] = outputRow;
				
				dataPointIndex++;
			}
			
			seriesIndex++;
		}
		
	}
	
	var csvWriter = createCsvWriter({
			path: directoryPath + outputDirectory + fileSuffix + '_results.csv',
			header: [
				{id:'timestamp', title: 'Timestamp'},
				{id:'memoryInitial', title: 'MemoryInitial'},
				{id:'memoryUsed', title: 'MemoryUsed'},
				{id:'memoryTotal', title: 'MemoryTotal'},
				{id:'threadsTotal', title: 'ThreadsTotal'},
				{id:'threadsRunnable', title: 'ThreadsRunnable'},
				{id:'threadsDaemons', title: 'ThreadsDaemons'},
				{id:'threadsWaiting', title: 'ThreadsWaiting'},
				{id:'fileDescriptorOpen', title: 'FileDescriptorOpen'},
				{id:'fileDescriptorMax', title: 'FileDescriptorMax'}
			]
		});
	
	csvWriter
		.writeRecords(outputArr)
		.then(()=> console.log('The CSV file was written successfully'));
	
});

