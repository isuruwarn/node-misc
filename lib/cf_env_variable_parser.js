/*

References:
- https://medium.com/stackfame/how-to-run-shell-script-file-or-command-using-nodejs-b9f2455cb6b7

Required Packages:
npm i -s minimist

*/

const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

var appName = argv.a || 'aggregate-calculator-hyperscaler-blue';
var sharedHanaHost = 'localhost';
var sharedHanaPort = '30015';
var secureHanaHost = 'localhost';
var secureHanaPort = '30015';
var zookeeperHost = 'localhost';
var zookeeperPort = '2181';
var kafkaBrokerHost = 'localhost';
var kafkaBrokerPort = '9092';
var cassandraHost = 'localhost';
var cassandraPort = '9042';
var redisHost = 'localhost';
var redisPort = '6379';

var cmd = 'cf env ' + appName;
console.log('Command: ' + cmd);
console.log();

exec(cmd, (err, stdout, stderr) => {
	
	if (err) {
		console.error(err);
		
	} else {
		
		var vcapSvcStartIndex = stdout.indexOf("VCAP_SERVICES:") + 15;
		var vcapSvcEndIndex = stdout.indexOf("VCAP_APPLICATION:") - 2;
		var vcapSvcStr = stdout.substring( vcapSvcStartIndex, vcapSvcEndIndex );
		//console.log('vcapSvcStr=' + vcapSvcStr);
		var vcapSvcJson = JSON.parse( vcapSvcStr );
		
		var vcapAppStartIndex = stdout.indexOf("VCAP_APPLICATION:") + 18;
		var vcapAppEndIndex = stdout.indexOf("User-Provided:");
		var vcapAppStr = stdout.substring( vcapAppStartIndex, vcapAppEndIndex );
		//console.log('vcapAppStr=' + vcapAppStr);
		var vcapAppJson = JSON.parse( vcapAppStr );
		
		if( vcapSvcJson['hana'] != null ) {
			
			vcapSvcJson['hana'].forEach( function(h) {
				
				var host = sharedHanaHost;
				var port = sharedHanaPort;
				if( h.plan == 'securestore' ) {
					host = secureHanaHost;
					port = secureHanaPort;
				}
				h.credentials.url = h.credentials.url.toString().replace( h.credentials.host, host ).replace( h.credentials.port, port );
				h.credentials.host = host;
				h.credentials.port = port;
			});
		}
		
		if( vcapSvcJson['kafka'] != null ) {
			
			vcapSvcJson['kafka'].forEach( function(k) {
				k.credentials.cluster.zk = zookeeperHost + ':' + zookeeperPort;
				k.credentials.cluster.brokers = kafkaBrokerHost + ':' + kafkaBrokerPort;
				k.credentials.cluster['brokers.auth_ssl'] = kafkaBrokerHost + ':' + kafkaBrokerPort;
			});
		}
		
		if( vcapSvcJson['cassandra'] != null ) {
			
			vcapSvcJson['cassandra'].forEach( function(c) {
				c.credentials.port = cassandraPort;
				c.credentials.seeds = [];
				c.credentials.seeds.push( cassandraHost );
				c.credentials.protocols = [];
				c.credentials.protocols.push("plain");
			});
		}
		
		if( vcapSvcJson['redis'] != null ) {
			
			vcapSvcJson['redis'].forEach( function(r) {
				r.credentials.end_points = [];
				r.credentials.redis_nodes = [];
				//r.credentials.redis_nodes.push( { "hostname": redisHost, "port": redisPort } );
				r.credentials.sentinel_nodes = [];
				//delete r.credentials['sentinel_nodes'];
				r.credentials.hostname = redisHost;
				r.credentials.port = redisPort;
				r.credentials.password = "";
			});
		}
		
		console.log("VCAP_SERVICES:");
		console.log( JSON.stringify( vcapSvcJson ) );
		console.log();
		console.log("VCAP_APPLICATION:");
		console.log( JSON.stringify( vcapAppJson ) );
	}
});