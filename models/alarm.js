var mongoose = require('mongoose');

var alarmSchema = mongoose.Schema({
	time : {
		type:Date,
		require:true
	},
	subject :{
		type:String,
		required:true
	},
	done :{
		type:Boolean
	}
});

var Alarm = module.exports = mongoose.model('Alarm', alarmSchema);

module.exports.getAlarms = function(callback){
	Alarm.find(callback);
}

module.exports.addAlarm= function(alarm,callback){
	Alarm.create(alarm, callback);
}

module.exports.removeAlarm = function(id, callback){
	var query = {_id:id};
	Alarm.remove(query, callback);
}

module.exports.updateAlarm =function(id, alarm, options, callback){
	var query = {_id:id};
	var update = {
		time : alarm.time,
		subject : alarm.subject,
		done : alarm.done
	}
	Alarm.findOneAndUpdate(query, update, options, callback);
}