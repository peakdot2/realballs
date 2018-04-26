var container = $('#container');
var selectedElement = null;

var svg = $('#svg1'); 
svg.attr('width', document.body.clientWidth); 
svg.attr('height', document.body.clientHeight);
var svgH = document.body.clientHeight; 
var svgW = document.body.clientWidth;

var radius2 = (svgH>svgW? svgW:svgH)/2;
var radiusmin = 50;
var startDegree = 180;

$('.add-area').click(function () {
	var newboard = {
		degree: 5,
		name: "Untitled",
		description: "No Description",
		color: "cyan"
	};

	for (var i = 0; i < boards.length; i++) {
		if(boards[i].degree > 5) {
			boards[i].degree -= 5;
			break;
		}
	}

	boards.push(newboard);
	svg.empty();
	buildAreas();
	gotoEditMode();
});

$('.delete-area').click(function () {
	deleteArea(selectedElement);
});

$('.edit').click(function () {
	gotoEditMode();
});

$('.input-field').change(function (){
	var jthis = $(this);
	var id = selectedElement.attr('groupid');
	switch(jthis.attr('name')) {
		case 'title': {
			$('#text' + id).html(jthis.val()); 
			boards[id].name = jthis.val();
			break;
		}
		case 'color': {
			$('#acurve' + id).attr('fill', jthis.val());
			$('#curve' + id).attr('stroke', jthis.val());   
			boards[id].color = jthis.val();
			break;
		}
		case 'order': {  
			boards[id].order = jthis.val();
			break;
		}
		case 'description': { 
			boards[id].description = jthis.val();
			break;
		}
	}
});

function deleteArea(svggroup) {
	var id = Number(svggroup.attr('groupid'));
	boards[(id + 1)%boards.length].degree += boards[id].degree;
	if (id > -1) {
		boards.splice(id, 1);
	}
	svg.empty();
	buildAreas();
	gotoEditMode();
}

setCustomContextmenu(function (e) {
	var element = $(document.elementFromPoint(e.clientX, e.clientY));
	console.log(element);
	console.log(element.parents('#svg1'));
	if(element.parents('#svg1').length > 0) {
		element = element.parents('g');
		console.log('Element:', element);
		selectedElement = element;
		fillProperties(element);
		showContextMenu(e.clientX, e.clientY);
	}
});

function fillProperties(element) {
	var id = element.attr('groupid');
	$('#input-title').val(boards[id].name);
	$('#input-color').val(boards[id].color);
	$('#input-order').val(boards[id].order);
	$('#input-desc').val(boards[id].description);
}

function buildAreas() {
	var degree = startDegree;
	for (var i = 0; i < boards.length; i++) {
		boards[i].startDeg = degree % 360;
		buildArea(i, degree, (degree += boards[i].degree) % 360, boards[i].color, boards[i].name);
		boards[i].endDeg = degree % 360;
	}
}

function buildArea(id, startAngle, endAngle, fillStyle, name) {
	console.log(radius2);
	console.log(startAngle + ', ' +endAngle);

	var group = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
	group.attr('id', 'svggroup' + id);
	group.attr('groupid', id);

	var x1 = radius2 * Math.cos(startAngle / 180 * Math.PI) + svgW/2; 
	var y1 = radius2 * Math.sin(startAngle / 180 * Math.PI) + svgH/2;
	var x2 = radius2 * Math.cos(endAngle / 180 * Math.PI) + svgW/2; 
	var y2 = radius2 * Math.sin(endAngle / 180 * Math.PI) + svgH/2;
	var x3 = radiusmin * Math.cos(startAngle / 180 * Math.PI) + svgW/2; 
	var y3 = radiusmin * Math.sin(startAngle / 180 * Math.PI) + svgH/2;
	var x4 = radiusmin * Math.cos(endAngle / 180 * Math.PI) + svgW/2; 
	var y4 = radiusmin * Math.sin(endAngle / 180 * Math.PI) + svgH/2;
	var length = ((endAngle<startAngle? endAngle + 360:endAngle) - startAngle) / 180 * Math.PI * radius2;

	var largeArcFlag = (endAngle<startAngle? endAngle + 360:endAngle) - startAngle <= 180 ? "0" : "1";

	var patt = 'M' + x3 + ' ' + y3 + ' L' + x1 + ' ' + y1 + ' A' + radius2 + ' ' + radius2 + ', 0, ' + largeArcFlag + ', 1, ' + x2 + ' ' + y2 + ' L' + x4 + ' ' + y4 + ' A' + radiusmin + ' ' + radiusmin + ', 0, ' + largeArcFlag + ', 0, ' + x3 + ' ' + y3 + ' Z'; 
	var el = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
	el.attr('d', patt);
	el.attr('fill', fillStyle);
	el.addClass('area');
	el.attr('id', 'acurve' + id);
	group.append(el);

	var patt2 = 'M' + x1 + ' ' + y1 + ' A' + radius2 + ' ' + radius2 + ', 0, ' + largeArcFlag + ', 1, ' + x2 + ' ' + y2;
	var el = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
	el.attr('id', 'curve' + id);
	el.attr('d', patt2);
	el.attr('fill', 'none');
	el.attr('stroke', fillStyle);
	group.append(el);


	var text = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
	var textpath = $(document.createElementNS('http://www.w3.org/2000/svg', 'textPath'));
	textpath.html('<tspan x="' + length/2 + '" dy="40" text-anchor="middle" class="area-text unselectable" id="text' + id + '" fill="white">' + name + '</tspan>');
	textpath[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#curve' + id);
	text.append(textpath);
	text.attr('x', 25);
	group.append(text);

	svg.append(group);
}

function changeArea(id, startAngle, endAngle) {
	console.log(startAngle + ', ' +endAngle);
	var x1 = radius2 * Math.cos(startAngle / 180 * Math.PI) + svgW/2; 
	var y1 = radius2 * Math.sin(startAngle / 180 * Math.PI) + svgH/2;
	var x2 = radius2 * Math.cos(endAngle / 180 * Math.PI) + svgW/2; 
	var y2 = radius2 * Math.sin(endAngle / 180 * Math.PI) + svgH/2;
	var x3 = radiusmin * Math.cos(startAngle / 180 * Math.PI) + svgW/2; 
	var y3 = radiusmin * Math.sin(startAngle / 180 * Math.PI) + svgH/2;
	var x4 = radiusmin * Math.cos(endAngle / 180 * Math.PI) + svgW/2; 
	var y4 = radiusmin * Math.sin(endAngle / 180 * Math.PI) + svgH/2;
	var length = ((endAngle<startAngle? endAngle + 360:endAngle) - startAngle) / 180 * Math.PI * radius2;

	var largeArcFlag = (endAngle<startAngle? endAngle + 360:endAngle) - startAngle <= 180 ? "0" : "1";

	var patt = 'M' + x3 + ' ' + y3 + ' L' + x1 + ' ' + y1 + ' A' + radius2 + ' ' + radius2 + ', 0, ' + largeArcFlag + ', 1, ' + x2 + ' ' + y2 + ' L' + x4 + ' ' + y4 + ' A' + radiusmin + ' ' + radiusmin + ', 0, ' + largeArcFlag + ', 0, ' + x3 + ' ' + y3 + ' Z'; 
	$('#acurve' + id).attr('d', patt);

	var patt2 = 'M' + x1 + ' ' + y1 + ' A' + radius2 + ' ' + radius2 + ', 0, ' + largeArcFlag + ', 1, ' + x2 + ' ' + y2;
	$('#curve' + id).attr('d', patt2);

	$('#text' + id).attr('x', length/2);
}

function gotoEditMode() {
	$('.area').css('opacity', '1');
	$('.edit').addClass('switched');
	$('.edit').click(gotoNormalMode);
	$('.edit i').html('done');
	$('nav').addClass('active');
	var degree = startDegree;
	for (var i = 0; i < boards.length; i++) {
		degree += boards[i].degree

		var el = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
		el.attr('lineid', i);
		el.attr('fill', 'none');
		el.attr('stroke', 'white');
		el.attr('stroke-width', '10'); 
		el.attr('x1', svgW/2 + radius2);
		el.attr('y1', svgH/2);
		el.attr('x2', svgW/2 + radiusmin);
		el.attr('y2', svgH/2);
		el.attr('transform', 'rotate(' + degree + ' ' + svgW/2 + ' ' + svgH/2 + ')');
		el.css('cursor', 'all-scroll');
		el.addClass('editline');
		el.mousedown(draggedLine);
		svg.append(el);
	}
}

function gotoNormalMode() {
	$('.editline').remove();
	$('.area').css('opacity', '');
	$('.edit').removeClass('switched');
	$('.edit').click(gotoEditMode);
	$('.edit i').html('edit');
}

function draggedLine() {
	var target = $(this);
	var id = Number(target.attr('lineid'));

	container.mousemove(function(e) {
		var x1 = e.clientX - svgW/2;
		var y1 = e.clientY - svgH/2;
		var degree = Math.atan2(- y1, x1) / Math.PI * 180;
		degree = degree < 0? -degree:360 - degree;

		console.log(id);
		console.log(degree);
		console.log('boards startdeg = ' + boards[id].startDeg + 'boards enddeg = ' + boards[(id + 1)%boards.length].endDeg);
		if(boards[id].startDeg < boards[(id + 1)%boards.length].endDeg) {
			if(degree < boards[(id + 1)%boards.length].endDeg - 5 && degree > boards[id].startDeg + 5) {
				changeSplit(id, degree, target);
			}
		} else {
			if(degree < boards[(id + 1)%boards.length].endDeg - 5 || degree > boards[id].startDeg + 5) {
				changeSplit(id, degree, target);
			}			
		}

	});

	container.mouseup(function(e) {
		container.unbind('mousemove');
		container.unbind('mouseup');
	});

}

function changeSplit(id, degree, line) {
	line.attr('transform', 'rotate(' + degree + ' ' + svgW/2 + ' ' + svgH/2 + ')');
	changeArea(id, boards[id].startDeg, degree);
	changeArea((id + 1)%boards.length, degree, boards[(id + 1)%boards.length].endDeg);
	boards[(id + 1)%boards.length].startDeg = degree;
	boards[id].endDeg = degree;
	boards[id].degree = (boards[id].endDeg < boards[id].startDeg? boards[id].endDeg + 360:boards[id].endDeg) - boards[id].startDeg;
	boards[(id + 1)%boards.length].degree = (boards[(id + 1)%boards.length].endDeg < boards[(id + 1)%boards.length].startDeg? boards[(id + 1)%boards.length].endDeg + 360:boards[(id + 1)%boards.length].endDeg) - boards[(id + 1)%boards.length].startDeg;
}

var board1 = {
	degree: 90,
	name: "Important Urgent",
	description: "1 Deee  scrip toooo aaaaaaaaaaa huuuuuuuuuuuu aaaaaaaaa",
	order: 1,
	color: "#ff0000"
};

var board2 = {
	degree: 90,
	name: "Important Not Urgent",
	description: "2 Deee  scrip toooo aaaaaaaaaaa huuuuuuuuuuuu aaaaaaaaa",
	order: 2,
	color: "#ffc0cb"
};

var board3 = {
	degree: 90,
	name: "Not Important Urgent",
	description: "3 Deee  scrip toooo aaaaaaaaaaa huuuuuuuuuuuu aaaaaaaaa",
	order: 3,
	color: "#00ffff"
};

var board4 = {
	degree: 90,
	name: "Not Important Not Urgent",
	description: "3 Deee  scrip toooo aaaaaaaaaaa huuuuuuuuuuuu aaaaaaaaa",
	order: 4,
	color: "#0000ff"
};

var boards = [board1, board2, board3, board4];
buildAreas();