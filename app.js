var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname+'/client'));

app.use(bodyParser.json());

Alarm = require('./models/alarm');

mongoose.connect('mongodb://localhost/alarmapp');

app.get('/api/alarms', function(req, res){
	Alarm.getAlarms(function(err, alarms){
		if(err){
			throw err;
		}
		res.json(alarms);
	})
});

app.listen(3000);