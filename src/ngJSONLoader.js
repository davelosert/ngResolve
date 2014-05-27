/**
 * ngJSONLoader-Factory offers a simple functionality to load one or several jsons and resolve a defferer as soon
 * as all data was loaded successfully.
* Created by Charminbear on 18.05.14.
*/
angular.module('ngJSONLoaderModule')
	.factory('ngJSONLoader', ['$http', '$q', function ($http, $q) {
		return {
			'getDataJSON': function (jsonPaths) {
				var deferred = $q.defer(); // Deferrer to delay real app-start until all jsons are loaded
				var dataJsons = {}; // Holder for the already loaded json-files

				// Error callback to inject into http-call. Lambda-Function makes it possible to give more information
				// about the cause of the loading-failure (e.g. with which path)
				var getErrorCallback = function (path) {
					return function (err) {
						// Print Path-Related error message
						console.error('Error while trying to get file ' + path);
						deferred.reject(err);
					}
				};

				var jsonCount = 0; // Counter of how many jsons have been loaded succesfully so far
				var jsonPathCount = Object.keys(jsonPaths).length; // number of jsons to load
				// Success-Callback with lambda-function to insert the loaded jsons with their given key as property-key
				var getSuccessCallback = function (jsonKey) {
					return function (data) {
						dataJsons[jsonKey] = data;
						jsonCount++;

						// As soon as all data is loaded, resolve the promise with the data as attribute
						if (jsonCount === jsonPathCount) {
							deferred.resolve(dataJsons);
						}
					}
				};

				// Send the actuall http-request for the jsons and insert success and error-callback
				angular.forEach(jsonPaths, function (path, key) {
					$http.get(path).success(getSuccessCallback(key)).catch(getErrorCallback(path));
				});

				// Return the promise which will carry the data in its resolved state (and thus can be retrieved in the
				// "then()"-Callback
				return deferred.promise;
			}
		}
 	}]);