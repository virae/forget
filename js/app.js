angular.module('app', []).controller('forget', function ($scope) {

	// Views
	$scope.view = 'default'; // [default, options, about]
	$scope.since = localStorage.getItem('since') || 'five_minutes';

	$scope.i18n = function(key) {
		return chrome.i18n.getMessage(key);
	}

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
		"history": $scope.i18n('item_history'),
		"cookies": $scope.i18n('item_cookies'),
		"cache": $scope.i18n('item_cache'),
		"downloads": $scope.i18n('item_downloads'),
		"formData": $scope.i18n('item_formData'),
		"passwords": $scope.i18n('item_passwords'),
		"appcache": $scope.i18n('item_appcache'),
		"localStorage": $scope.i18n('item_localStorage'),
		"pluginData": $scope.i18n('item_pluginData'),
		"fileSystems": $scope.i18n('item_fileSystems'),
		"indexedDB": $scope.i18n('item_indexedDB'),
		"webSQL": $scope.i18n('item_webSQL')
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

	// i18n
	[].forEach.call(document.querySelectorAll('[i18n]'), function(element) {

		element.innerHTML = chrome.i18n.getMessage(element.getAttribute('i18n'));

	});

	// Handle external links
	[].forEach.call(document.querySelectorAll('[data-href]'), function(link) {

		link.addEventListener('click',function(){
			window.open(link.getAttribute('data-href'));
		});

	});

})();
