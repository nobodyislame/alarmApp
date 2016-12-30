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

	.controller('AddAlarmCtrl', function($scope, $interval, $http){
		console.log('in add alarm ctrl');
		
		$scope.input = {};
		
		$scope.load = function(){
			$http.get('/api/alarms')
				.success(function(response){
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
							subject : $scope.input.subject		
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

		var loadRemaining = function(alarm) {
			var now = new Date();
			var diff = alarm - now;
			if(diff > 0) {
				var remaining_hours = Math.round((diff / (1000 * 60 * 60)) % 24);
				var remaining_mins = Math.round((diff / (1000 * 60)) % 60);
				var remaining_secs = Math.round((diff / (1000)) % 60);
				return remaining_hours + ":" + remaining_mins + ":" + remaining_secs;
			}
			return 'Completed';
		}

		$interval(
			function(){
				if($scope.records){
					for(var i=0; i<$scope.records.length; i++) {
						$scope.records[i].remaining = loadRemaining($scope.records[i].time);
					}
				}
				else{
					return;
				}
			},1000);

		$scope.load();
	})

	.controller('TotalAlarmsCtrl', function($scope){
		console.log('in total alarms ctrl');
	})

	.controller('AboutCtrl', function($scope){
		console.log('in about ctrl');
	});