

window.addEventListener('DOMContentLoaded', function() {
	var header = document.querySelector('.header');
	var mainContent = document.querySelector('.main-content');
	if (header && mainContent) {
		var headerHeight = header.offsetHeight;
		var newHeight = 'calc(100vh - ' + headerHeight + 'px)';
		mainContent.style.height = newHeight;
		mainContent.style.maxHeight = newHeight;
		mainContent.style.overflowY = 'auto';
	}
});


