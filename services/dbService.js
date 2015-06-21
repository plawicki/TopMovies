var pg = require('pg');

var aDBparams = { host: 'ec2-54-217-202-110.eu-west-1.compute.amazonaws.com', user: 'iwzexazhfjxbbt', password: '4JVMJFooosyfdM5Y79Si-c691D', database: 'd8u6uelvine6d6', ssl: true };

var process = function(query, callback) {
	var client = new pg.Client(aDBparams);
	client.connect(function(err) {
		if(err) {
			callback(false);
			return console.error("Error, cannot connect to db", err);
		} else {
			client.query(query, [], function(err, result){
				if(err) {
					callback(false);
					return console.error("Query is not proper sql query", err);
				} else {
					callback(result);
				}
				client.end();
			});
		}
	});
}

exports.makeQuery = process;