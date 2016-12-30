var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname+'/client'));

app.use(bodyParser.json());

Alarm = require('./models/alarm');

mongoose.connect('mongodb://localhost/alarmstore');

app.get('/api/alarms', function(req, res){
	Alarm.getAlarms(function(err, alarms){
		if(err){
			throw err;
		}
		res.json(alarms);
	})
});

app.post('/api/alarms', function(req, res){
	var alarm = {};
	alarm.time = req.body.time;
	alarm.remaining = req.body.remaining;
	alarm.subject = req.body.subject;

	Alarm.addAlarm(alarm, function(err,alarm){
		if(err){
			console.log(err);
		}
		res.json(alarm);
	})
});

app.delete('/api/alarms/:_id', function(req, res){
	var id = req.params._id;
	Alarm.removeAlarm(id, function(err, alarm){
		if(err){
			console.log(err);
		}
		res.json(alarm);
	})
});

app.listen(3000);