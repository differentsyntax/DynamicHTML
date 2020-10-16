let express = require("express");
let app = express();

let port = 3000;
let hostname = "localhost"
var devices = {};
const bodyParser = require('body-parser')

app.use(express.static("public_html"));
app.use(bodyParser.json())


app.post("/api/:devId", function (req, res) {
	var devId = parseInt(req.params.devId);

	if ((req.body.hasOwnProperty("energy-usage")) && (Number.isInteger(req.body['energy-usage']))) {
		
		if(devId in devices) {
			devices[devId].push(req.body['energy-usage']);
		} else {
			devices[devId] = [req.body['energy-usage']];
		}
		
		res.status = 200;
		res.send();
	} else {
		res.status = 400;
		res.set('Content-Type', 'text/plain');
		res.send('Invalid Request');
	}
});

app.get("/api/:devId", function (req, res) {
	var devId = req.params.devId;
		
	if (devId in devices) {
		res.status = 200;
		res.set('Content-Type', 'application/json');
		res.json({"total-energy-usage": devices[devId]});
	} else {
		res.status = 404;
		res.set('Content-Type', 'text/plain');
		res.send('Device Not Found');
	}
});

app.get("/", function (req, res) {

	var rows = ``;
	for (var d in devices) {
		var summ = 0;
		for(var i in devices[d]) {
			summ += devices[d][i]; 
		}
		if (summ > 1000) {
			rows += `<tr class='red'>
						<td>` + d + `</td>
						<td>` + summ + `</td>
					</tr>`
		} else {
			rows += `<tr>
						<td>` + d + `</td>
						<td>` + summ + `</td>
					</tr>`
		}
	}
	
	res.status = 200;
	res.set('Content-Type', 'text/html');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>Device Dashboard</title>
		<style>
			#deviceDB {
			border-collapse: collapse;
			}
	
			#deviceDB, th, td {
			border: 1px solid black;
			}

			.red {
				background-color: red;
			}
		  </style>
	</head>
	<body>
	
	<div>
		<table id = 'deviceDB'>
			<tr>
				<td>Device ID</td>
				<td>Energy Usage</td>
			</tr>` + rows +
		`</table>
	</div>
	
	</body>
	</html>`);
});

app.listen(port, hostname, () => {
	console.log(`Listening at: http://${hostname}:${port}`);
});