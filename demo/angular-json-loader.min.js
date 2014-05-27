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
		// Put the json-paths into the options so theyre available within the factory
//		.config(['ngJSONLoaderProvider', function (ngJSONLoaderProvider) {
//			ngJSONLoaderProvider.jsonPaths = _jsonPaths;
//		}])
		.run(['ngJSONLoader', function (ngJsonLoader) {
			ngJsonLoader.getDataJSON(_jsonPaths)
				.then(function (data) {
					console.log(data);
					// Create the actual ngResolve Module and add the data from the json(s) as a constant
					var dataModule = angular.module('ngResolve', []);
					dataModule.constant('ngResolveData', data);
					// Bootstrap the actual app on the defined or default element
					angular.bootstrap(_element, [moduleName]);
//					document.body.removeChild(_tempDiv);
				})
				.catch(function (err) {
					console.error(err.message);
				});
		}]);

	angular.element(document).ready(function () {
		document.body.appendChild(_tempDiv);
		angular.bootstrap(_tempDiv, ['ngJSONLoaderModule']);
	});
}


/**
* Created by dave2 on 18.05.14.
*/
angular.module('ngJSONLoaderModule')
	.factory('ngJSONLoader', ['$http', '$q', function ($http, $q) {
		return {
			'getDataJSON': function (jsonPaths) {
				var deferred = $q.defer();
				var allLoaded = false;
				var dataJsons = {};

				var getErrorCallback = function (path) {
					return function (err) {
						console.error('Error while trying to get file ' + path);
						deferred.reject(err);
						throw new Error(err);
					}
				};
				var jsonCount = 0;
				var getSuccessCallback = function (jsonKey) {
					return function (data) {
						dataJsons[jsonKey] = data;
						jsonCount++;

						if (jsonCount === Object.keys(jsonPaths).length) {
							allLoaded = true;
							deferred.resolve(dataJsons);
						}
					}
				};

				angular.forEach(jsonPaths, function (path, key) {
					$http.get(path).success(getSuccessCallback(key)).catch(getErrorCallback(path));
				});

				return deferred.promise;
			}
		}
 	}]);