angular.module('alarm.controllers',[])
	
	.controller('CurrentTimeCtrl', function($scope, $interval){
		console.log('in current time control');
		var time = function() {
			var today = new Date();
			$scope.hours = today.getHours();
			$scope.minutes = today.getMinutes();
			$scope.seconds = today.getSeconds();
		}
		time();
		$interval(time, 1000);
	})

	.controller('AddAlarmCtrl', function($scope, $interval, $http, SoundService){
		console.log('in add alarm ctrl');
		
		$scope.input = {};
		$scope.editMode = false;

		$scope.load = function(){
			$http.get('/api/alarms')
				.success(function(response){
					console.log(response);
					$scope.records = response;
					for(var i=0; i< $scope.records.length;i++){
						$scope.records[i].time = new Date($scope.records[i].time);
						$scope.records[i].remaining = loadRemaining($scope.records[i].time);
					}

				});
		}

		$scope.add = function() {
			var alarm_time = new Date();
			alarm_time.setHours($scope.input.hr);
			alarm_time.setMinutes($scope.input.min);
			alarm_time.setSeconds($scope.input.sec);

			var hrs = alarm_time.getHours();
			var now = new Date();
			
			if(hrs < now.getHours()) {
				alarm_time.setDate(alarm_time.getDate() + 1);
			}

			$scope.alarm = {
							time : alarm_time,
							subject : $scope.input.subject,
							done : false		
						};

			$http.post('/api/alarms', $scope.alarm)
				.success(function(response){
					$scope.load();
				})
				.error(function(err){
					console.log("Error "+err);
				});
			
			$scope.input.hr = '';
			$scope.input.min = '';
			$scope.input.sec = '';
			$scope.input.subject = '';
		}

		$scope.remove = function(id){
			$http.delete('/api/alarms/'+id)
				.success(function(response){
					$scope.load();
				})
				.error(function(err){
					console.log(err);
				});
		}

		$scope.update = function(id){
			var time = new Date();
			time.setHours($scope.input.hr);
			time.setMinutes($scope.input.min);
			time.setSeconds($scope.input.sec);

			var alarm = {
				time: time,
				subject: $scope.input.subject,
				done:false
			}

			$http.put('/api/alarms/'+id, alarm)
				.success(function(response){
					$scope.load();
					$scope.editMode = false;
					$scope.input = '';
				});
		}

		$scope.play = function(){
			SoundService.loadSound({
				name : 'sound',
				src: 'http://localhost:3000/asset/tone.mp3'
			}).then(function(sound){
				$scope.sound = sound;
				console.log($scope.sound);
				$scope.sound.start();
			});
		}

		$scope.editAlarm = function(alarm){
			$scope.editMode = true;
			$scope.input.hr = alarm.time.getHours();
			$scope.input.min = alarm.time.getMinutes();
			$scope.input.sec = alarm.time.getSeconds();
			$scope.input.subject = alarm.subject;
			$scope.input.id = alarm._id;
		}

		$scope.cancel = function(){
			$scope.editMode= false;
			$scope.input = {};
		}

		var loadRemaining = function(alarm) {
			var target = alarm.time;
			var now = new Date();
			var diff = target - now;
			if(diff > 0) {
				var remaining_hours = Math.round((diff / (1000 * 60 * 60)) % 24);
				var remaining_mins = Math.round((diff / (1000 * 60)) % 60);
				var remaining_secs = Math.round((diff / (1000)) % 60);
				return remaining_hours + ":" + remaining_mins + ":" + remaining_secs;
			}
			else if(!alarm.done && diff < 0){
				(function(alarm){
					alarm.done = true;
					var id = alarm._id;
					$http.put('/api/alarms/'+id,alarm)
						.success(function(response){
							$scope.load();
							$scope.play();
						});
				})(alarm);
			}
			
		}

		$interval(
			function(){
				if($scope.records){
					for(var i=0; i<$scope.records.length; i++) {
						if(!$scope.records.done){
							$scope.records[i].remaining = loadRemaining($scope.records[i]);
						}
					}
				}
				else{
					return;
				}
			},1000);

		$scope.load();
	})

	.controller('TotalAlarmsCtrl', function($scope, $http){
		console.log('in total alarms ctrl');
		$scope.load = function(){
			$http.get('/api/alarms')
				.success(function(response){
					for(var i=0;i<response.length;i++){
						response[i].time = new Date(response[i].time);
					}

					$scope.records = [];
					var found = false;
					for(var i=0;i<response.length;i++){
						if($scope.records.length==0){
							$scope.records.push({
								date : response[i].time.getDate()+'/'+response[i].time.getMonth()+1+'/'+response[i].time.getFullYear(),
								count : 1
							});
						}
						else{

							var target = response[i].time.getDate()+'/'+response[i].time.getMonth()+1+'/'+response[i].time.getFullYear();
							for(var j=0;j<$scope.records.length;j++){
								if($scope.records[j].date == target){
									$scope.records[j].count+=1;
									found = true;
								}
							}
							if(!found){
								console.log("called");
								$scope.records.push({
									date : response[i].time.getDate()+'/'+response[i].time.getMonth()+1+'/'+response[i].time.getFullYear(),
									count : 1
								});
							}
							found = false;

						}
					}
					console.log($scope.records);
				});
		}
		$scope.load();
	})

	.controller('AboutCtrl', function($scope){
		console.log('in about ctrl');
	});