/**
 * Created by David on 26.05.14.
 */


var demoApp = angular.module('demoApp', ['ngResolve']);

angular.module('demoApp').controller('demoCtrl', function ($scope, ngResolveData) {
	this.welcomeMessage = ngResolveData.configData.welcomeMessage;
	this.anotherMessage = 'This is another Message!';
});

angular.ngResolve('demoApp', {
	jsonPaths: {
		'configData' : 'config/config.json'
	},
	element : document
});