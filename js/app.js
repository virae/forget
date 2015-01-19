angular.module('app', []).controller('forget', function ($scope) {

	// Views
	$scope.view = 'default'; // [default, options, about]
	$scope.since = localStorage.getItem('since') || 'five_minutes';

	// Default settings
	$scope.defaults = {
		"history": true,
		"cookies": true,
		"cache": true,
		"downloads": true,
		"formData": false,
		"passwords": false,
		"appcache": false,
		"localStorage": false,
		"pluginData": false,
		"fileSystems": false,
		"indexedDB": false,
		"webSQL": false
	};

	$scope.labels = {
		"history": "Browsing history",
		"cookies": "Cookies",
		"cache": "Browser cache",
		"downloads": "List of downloads",
		"formData": "Form data",
		"passwords": "Passwords",
		"appcache": "Application cache",
		"localStorage": "LocalStorage data",
		"pluginData": "Plugin data",
		"fileSystems": "Filesystems",
		"indexedDB": "IndexedDB Databases",
		"webSQL": "WebSQL Databases"
	};

	$scope.init = function() {
		$scope.settings = $scope.loadSettings() || angular.copy($scope.defaults);
	}

	// Reset to default settings
	$scope.reset = function() {
		localStorage.removeItem('settings');
		$scope.init();
	}

	// Save settings
	$scope.save = function() {
		localStorage.setItem('settings', JSON.stringify($scope.settings));
	}

	$scope.show = function(screen) {
		$scope.view = screen;
	}

	$scope.forget = function(screen) {
		localStorage.setItem('since', $scope.since);
		chrome.runtime.sendMessage({ action: "clear", since: $scope.since , settings: $scope.settings});
	}

	// Load settings
	$scope.loadSettings = function() {
		try {
			return JSON.parse(localStorage.getItem('settings'));
		} catch (e) {
			return false;
		}
	}

	$scope.init();
});


(function() {

	// Highlight browser icon
	chrome.runtime.sendMessage({ action: "init" });

	// Handle external links
	[].forEach.call(document.querySelectorAll('[data-href]'), function(link) {

		link.addEventListener('click',function(){
			window.open(link.getAttribute('data-href'));
		});

	});

})();
