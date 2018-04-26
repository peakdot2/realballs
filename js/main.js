var contextmenu;
var selectedElement;
var doc = $(document);
var jwindow = $(window);
var body = $(document.body);

$('nav .trigger').click(function(){
	$('nav').toggleClass('active');
});

function showContextMenu(x, y) {
	if(x + contextmenu.outerWidth() > jwindow.width()) {
		x = jwindow.width() - contextmenu.outerWidth();
	}
	if(y + contextmenu.outerHeight() > jwindow.height()) {
		y = jwindow.height() - contextmenu.outerHeight();
	}
	
	contextmenu.css('top', y);
	contextmenu.css('left', x);
	contextmenu.addClass('active');
}

function changeContextMenu(customcontextmenu) {
	contextmenu.removeClass('active');
	contextmenu = customcontextmenu;
}

function setCustomContextmenu(customcontextmenu, handler) {
	contextmenu = customcontextmenu;

	window.oncontextmenu = function () {
		return false;
	}

	$('body').click(function (){
		$('.context-menu').removeClass('active');
	});

	$('body').mousedown(function (e) {
		console.log('Checking');

		var isRightMB;
		e = e || window.event;

		if ("which" in e)
			isRightMB = e.which == 3; 
		else if ("button" in e) 
			isRightMB = e.button == 2; 

		if(isRightMB) {
			console.log('Recognized rightmb');
			handler(e);
		}
	});
}