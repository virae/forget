(function() {

	// Highlight browser icon
	chrome.runtime.sendMessage({ action: "init" });

	// Handle submit
	document.querySelector('button[type="submit"]').addEventListener('click',function(){
		since = document.querySelector('input[name="since"]:checked').value;
		chrome.runtime.sendMessage({ action: "clear", since: since });
	});

	// Handle views
	[].forEach.call(document.querySelectorAll('[data-toggle]'), function(link) {

		link.addEventListener('click',function(){
			[].forEach.call(document.querySelectorAll('section'), function(section) {
				section.classList.add("hide")
			})
			target = this.getAttribute('data-toggle');
			document.querySelector(target).classList.remove('hide');
		});

	});

	// Handle external links
	[].forEach.call(document.querySelectorAll('[data-href]'), function(link) {

		link.addEventListener('click',function(){
			window.open(link.getAttribute('data-href'));
		});

	});

})();
