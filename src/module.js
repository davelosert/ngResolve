/**
 * Created by dave2 on 18.05.14.
 */
angular.module('ngJSONLoaderModule', []);
angular.ngResolve = function (moduleName, options) {

	var _jsonPaths = options.jsonPaths;
	var _element = options.element || document;

	var _tempDiv = document.createElement('div');
	if (!_jsonPaths) {
		console.warn('No JSON-Paths given to angular-resolve. Bootstrapping app immidiately...');
	}

	angular.module('ngJSONLoaderModule')
		// As soon as the loader-app is bootstrapped, inject the jsonLoader and start loading data.
		.run(['ngJSONLoader', function (ngJsonLoader) {
			ngJsonLoader.getDataJSON(_jsonPaths)
				.then(function (data) {
					// As soon as all data is loaded, create the linking module "ngResolve" and add the data as a constant
					var dataModule = angular.module('ngResolve', []);
					dataModule.constant('ngResolveData', data);
					// Bootstrap the actual app on the defined or default element
					angular.bootstrap(_element, [moduleName]);
//					document.body.removeChild(_tempDiv);
				})
				.catch(function (err) {
					console.error(err.stack);
				});
		}]);

	// Bootstrap the ngResolve-App on the temporary div
	angular.element(document).ready(function () {
		document.body.appendChild(_tempDiv);
		angular.bootstrap(_tempDiv, ['ngJSONLoaderModule']);
	});
}

