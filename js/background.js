var timeout,
	default_icon = '/img/icon@2x.png',
	active_icon = '/img/icon_active@2x.png';

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		var action = request.action;
		var since = parseTime(request.since);
		var settings = request.settings;

		// Clear browser data
		if (action == 'clear' && since > 0) {
			chrome.browsingData.remove({
				"since": since,
				"originTypes": {
					"unprotectedWeb": true,
					"protectedWeb": false, // preserve protectedWeb data
					"extension": false // preserve extension data
				}
			}, settings, getLostInWoods);
		}

		// Init
		if (action == 'init') {
			setIcon(active_icon);
			setIcon(default_icon, 10000);
		}
	}
);

// Close all windows and open new window with clean state
function getLostInWoods() {
	chrome.windows.getAll({}, function(windows){
		Array.prototype.forEach.call(windows, function(window, i){
			chrome.windows.remove(window.id);
		});
		chrome.windows.create();
		setIcon(default_icon);
	});
}

function setIcon(icon, time) {
	if (time) {
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			setIcon(icon);
		}, time);
	} else {
		chrome.action.setIcon({path: icon});
	}
}

function parseTime(since) {
	switch (since) {
		case "five_minutes":
			return (new Date()).getTime() - 1000 * 60 * 5;
		case "one_hour":
			return (new Date()).getTime() - 1000 * 60 * 60;
		case "one_day":
			return (new Date()).getTime() - 1000 * 60 * 60 * 24;
		default:
			return 0;
	}
}
