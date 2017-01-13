angular.module('alarm',['ui.router',
						'mcwebb.sound',
						'alarm.controllers'])

	.config(function( $stateProvider, $urlRouterProvider){
		$stateProvider
			.state('current', {
				url : '/current',
				templateUrl : 'templates/currentTime.html',
				controller : 'CurrentTimeCtrl'
			})

			.state('add', {
				url : '/add',
				templateUrl : 'templates/addAlarm.html',
				controller : 'AddAlarmCtrl'
			})

			.state('total', {
				url : '/total',
				templateUrl : 'templates/totalAlarms.html',
				controller : 'TotalAlarmsCtrl'
			})

			.state('about', {
				url : '/about',
				templateUrl : 'templates/about.html',
				controller : 'AboutCtrl'
			});

		$urlRouterProvider.otherwise('/current');
	})