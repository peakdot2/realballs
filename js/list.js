var container = $('#container');
var docHeight = container.outerHeight(), docWidth = container.outerWidth();
var boardmenu = $('#board-menu');
var boardProperties = $('.board-properties');
var boardPicker = $('#board-picker');
var draggedBoard, draggedX, draggedY;
var cellWidth = docWidth/16, cellHeight = docHeight/16;
var newBoardIndex = 1;

var boards, oldboards;

var NORMAL_MODE = 0, EDIT_MODE = 1;
var mode = NORMAL_MODE;

var availabilityMap = [];
var currentX = -1, currentY = -1, available = false;
var feededBoard, feededBoardInfo;

var taskformcontainer = $('#task-form-container');

initBoardPropInputs();
$('.gotonormal').click(gotoNormalMode);
$('#input-tags').keypress(checkTagText);
$('#input-task-tags').keypress(checkTagText);
$('.add-task').click(showTaskForm);
$('#add-task-field').click(function() {
	var type = $('#add-field-type');
	switch(type.val()) {
		case '0': {
			$('#input-task-length-g').css('display','flex');
			type.find('option[value=0]').remove();
			break;
		}
		case '1': {
			$('#input-task-time1-g').css('display','flex');
			type.find('option[value=1]').remove();
			break;
		}
		case '2': {
			$('#input-task-deadline-g').css('display','flex');
			type.find('option[value=2]').remove();
			break;
		}
		case '3': {
			$('#input-task-date-g').css('display','flex');
			type.find('option[value=3]').remove();
			break;
		}
		case '4': {
			$('#input-task-goal-g').css('display','flex');
			type.find('option[value=4]').remove();
			break;
		}
	}
	if(type.find('option').length == 0) {
		type.remove();
		$(this).remove();
	}

	allocatePopup(taskformcontainer);
});

$('.add-board').click(function(e) {
	var x = Math.floor(e.clientX/cellWidth);
	var y = Math.floor(e.clientY/cellHeight);
	var newBoardInfo = {
		id: - (newBoardIndex ++),
		x: null,
		y: null,
		w: 1,
		h: 1,
		fontsize: 12,
		name: 'Board Name'
	};
	if(checkAvailability(x, y, newBoardInfo)){
		newBoardInfo.x = x;
		newBoardInfo.y = y;
		if(availabilityMap[x] == undefined) {
			availabilityMap[x] = [];
		}
		availabilityMap[x][y] = true;
		boards.push(newBoardInfo);
		placeBoard(newBoardInfo, boards.length - 1);
	}
});

$('.delete-board').click(function() {
	deleteBoard(feededBoard);
});

function clearTaskForm() {
	$('#input-task-length-g').css('display','none');
	$('#input-task-time1-g').css('display','none');
	$('#input-task-deadline-g').css('display','none');
	$('#input-task-date-g').css('display','none');
	$('#input-task-goal-g').css('display','none');

}

function clearBoardPropInputs() {
	var contextmenu1 = $('#context-menu1');
	contextmenu1.find('#label-by').css('display','none');
	contextmenu1.find('#task-filter-type').css('display','none');
	contextmenu1.find('#rule-filter-type').css('display','none');
	contextmenu1.find('#goal-filter-type').css('display','none');
	contextmenu1.find('#timerange-input-g').css('display','none');
	contextmenu1.find('#length-input-g').css('display','none');
	contextmenu1.find('#goal-input-g').css('display','none');
	contextmenu1.find('#status-input-g').css('display','none');
	contextmenu1.find('#tag-input-g').css('display','none');
	$('#tag-container').html('');
	// contextmenu1.find('#board-prop-form')[0].clear();
}

function hideOnlyBoardPropFilters() {
	var contextmenu1 = $('#context-menu1');
	contextmenu1.find('#timerange-input-g').css('display','none');
	contextmenu1.find('#length-input-g').css('display','none');
	contextmenu1.find('#goal-input-g').css('display','none');
	contextmenu1.find('#status-input-g').css('display','none');
	contextmenu1.find('#tag-input-g').css('display','none');
	contextmenu1.find('#timerange-input-g').val('');
	contextmenu1.find('#length-input-g').val('');
	contextmenu1.find('#goal-input-g').val('');
	contextmenu1.find('#status-input-g').val('');
	contextmenu1.find('#tag-input-g').val('');
	$('#tag-container').html('');
}

function placeBoard(boardInfo, index) {
	var board = $('<div class="board unselectable"><div class="board-body unselectable"><div class="board-name"></div></div><div class="board-name"></div></div>');
	board.attr('boardId', boardInfo.id);
	board.attr('boardIndex', index);
	var boardBody = board.find('.board-body');
	boardBody.attr('style', boardInfo.style);

	var boardwidth = boardInfo.w * cellWidth - 10, boardheight = boardInfo.h * cellHeight - 10;
	boardBody.css('width', boardwidth);
	boardBody.css('height', boardheight);

	//To the container
	board.css('top', boardInfo.y*cellHeight);
	board.css('left', boardInfo.x*cellWidth);

	if(availabilityMap[boardInfo.x] == undefined) {
		availabilityMap[boardInfo.x] = [];
	}
	availabilityMap[boardInfo.x][boardInfo.y] = true;

	board.mousedown(dragBoardFromContainer);
	addResizers(board);

	container.append(board);
}

$('.edit').click(function () {
	gotoEditMode();
});

taskformcontainer.click(function(e) {
	e.stopPropagation();
});

boardProperties.click(function (e) {
	e.stopPropagation();
});

setCustomContextmenu($("#context-menu1"), function (e) {
	var target = $(document.elementFromPoint(e.clientX, e.clientY));
	console.log(target);

	if(target.parents('#container>.board').length > 0 && mode == EDIT_MODE) {
		feedBoardProperties(target.parents('#container>.board'));
		changeContextMenu($('#context-menu1'));
	} else if(target.parents('#container>.board').length > 0 && mode == NORMAL_MODE) {
		changeContextMenu($('#context-menu4'));
	} else if(mode == NORMAL_MODE) {
		changeContextMenu($('#context-menu3'));
	} else if(mode == EDIT_MODE) {
		changeContextMenu($('#context-menu2'));		
	}

	showContextMenu(e.clientX, e.clientY);
});

function deleteBoard(board) {
	boards[board.attr('boardIndex')] = undefined;
	board.remove();
}

function feedBoardProperties(board) {
	clearBoardPropInputs();

	feededBoard = board;
	var boardinfo = feededBoardInfo = boards[board.attr('boardIndex')];

	var contextmenu1 = $('#context-menu1');

	contextmenu1.find('#input-title').val(boardinfo.name);
	contextmenu1.find('#input-type').val(boardinfo.type);
	contextmenu1.find('#input-textsize').val(boardinfo.fontsize);
	
	switch(boardinfo.type) {
		case '0': {
			contextmenu1.find('#task-filter-type').val(boardinfo.filtertype);
			contextmenu1.find('#task-filter-type').css('display','block');  
			break;
		}
		case '1': {
			contextmenu1.find('#rule-filter-type').val(boardinfo.filtertype);
			contextmenu1.find('#rule-filter-type').css('display','block');  
			break;
		}
		case '2': {
			contextmenu1.find('#goal-filter-type').val(boardinfo.filtertype);
			contextmenu1.find('#goal-filter-type').css('display','block');  
			break;
		}
	}

	switch(boardinfo.filtertype) {
		case '0': {
			contextmenu1.find('#input-time1').val(boardinfo.timerange.time1);
			contextmenu1.find('#input-time2').val(boardinfo.timerange.time2);
			contextmenu1.find('#timerange-input-g').css('display','block');
			break;
		}
		case '1': {
			contextmenu1.find('#input-goal').val(boardinfo.goalid);
			contextmenu1.find('#goal-input-g').css('display','block');
			break;
		}
		case '2': {
			contextmenu1.find('#input-length').val(boardinfo.length);
			contextmenu1.find('#length-input-g').css('display','block');
			break;
		}
		case '3': {
			contextmenu1.find('#input-task-status').val(boardinfo.status);
			contextmenu1.find('#status-input-g').css('display','block');
			break;
		}
		case '4': {
			for (var i = 0; i < boardinfo.tags.length; i++) {
				$('#tag-container').append('<span class="tag">#' + boardinfo.tags[i] + '</span>');
			}
			contextmenu1.find('#tag-input-g').css('display','block');
			break;			
		}
	}
}

function initBoardPropInputs() {
	var contextmenu1 = $('#context-menu1');

	contextmenu1.find('#input-title').change(function(e) {
		feededBoard.find('.board-name').html(this.value);
		feededBoardInfo.name = this.value;
	});
	contextmenu1.find('#input-textsize').change(function(e) {
		console.log(feededBoard.children('.board-body'));
		feededBoard.children('.board-body').css('font-size', this.value + 'px');
		console.log(feededBoard.children('.board-body').css('font-size'));
		feededBoardInfo.fontsize = this.value;
	});

	contextmenu1.find('#input-type').change(function(e) {
		clearBoardPropInputs();
		$('#label-by').css('display','block');
		feededBoardInfo.type = this.value;
		switch(this.value) {
			case '0': {
				contextmenu1.find('#task-filter-type').css('display','block');
				contextmenu1.find('#rule-filter-type').css('display','none');
				contextmenu1.find('#goal-filter-type').css('display','none');
				break;
			}
			case '1': {
				contextmenu1.find('#task-filter-type').css('display','none');
				contextmenu1.find('#rule-filter-type').css('display','block');
				contextmenu1.find('#goal-filter-type').css('display','none');
				break;
			}
			case '2': {
				contextmenu1.find('#task-filter-type').css('display','none');
				contextmenu1.find('#rule-filter-type').css('display','none');
				contextmenu1.find('#goal-filter-type').css('display','block');
				break;
			}
		}
	});
	contextmenu1.find('#task-filter-type').change(function(e) {
		feededBoardInfo.filtertype = this.value;
		hideOnlyBoardPropFilters();
		switch(this.value) {
			case '0': {
				contextmenu1.find('#timerange-input-g').css('display','flex');
				break;
			}
			case '1': {
				contextmenu1.find('#goal-input-g').css('display','flex');
				break;
			}
			case '2': {
				contextmenu1.find('#length-input-g').css('display','flex');
				break;
			}
			case '3': {
				contextmenu1.find('#status-input-g').css('display','flex');
				break;
			}
			case '4': {
				contextmenu1.find('#tag-input-g').css('display','flex');
				break;
			}
		}
	});
	contextmenu1.find('#rule-filter-type').change(function(e) {
		feededBoardInfo.filtertype = this.value;
		hideOnlyBoardPropFilters();
		switch(this.value) {
			case '0': {
				contextmenu1.find('#timerange-input-g').css('display','flex');
				break;
			}
			case '1': {
				contextmenu1.find('#goal-input-g').css('display','flex');
				break;
			}
		}
	});
	contextmenu1.find('#goal-filter-type').change(function(e) {
		feededBoardInfo.filtertype = this.value;
		hideOnlyBoardPropFilters();
		switch(this.value) {
			case '0': {
				contextmenu1.find('#timerange-input-g').css('display','flex');
				break;
			}
			case '1': {
				contextmenu1.find('#goal-input-g').css('display','flex');
				break;
			}
			case '4': {
				contextmenu1.find('#tag-input-g').css('display','flex');
				break;
			}
		}
	});

	$('#input-time1').change(function() {
		feededBoardInfo.timerange.time1 = this.value;
	});

	$('#input-time2').change(function() {
		feededBoardInfo.timerange.time1 = this.value;
	});

	$('#input-length').change(function() {
		feededBoardInfo.length = this.value;
	});

	$('#input-goal').change(function() {
		feededBoardInfo.goalid = this.value;
	});

	$('#input-task-status').change(function() {
		feededBoardInfo.status = this.value;
	});
}

function checkTagText(event) {
	if((event.which == 32 || event.which == 13) && this.value != '') {
		$(this).siblings('.tag-container').append('<span class="tag">#' + this.value + '</span>');
		//Add tags to boards array

		this.value = "";
		event.preventDefault();
	} else if(String.fromCharCode(event.which).search(/[a-zA-Z0-9_]/) == -1){
		event.preventDefault();
	}
} 

function buildBoards() {
	for (var i = 0; i < boards.length; i++) {
		var board = $('<div class="board unselectable"><div class="board-body unselectable"><div class="board-name"></div></div><div class="board-name"></div></div>');
		board.attr('boardId', boards[i].id);
		board.attr('boardIndex', i);
		var boardBody = board.find('.board-body');
		boardBody.css('font-size', boards[i].fontsize);
		//To the board picker
		board.find('.board-name').html(boards[i].name);
		if(boards[i].list.length == 1) {
			boardBody.append(boards[i].list[0]);
		} else {
			var ul = $('<ul></ul>');
			for (var j = 0; j < boards[i].list.length; j++) {
				ul.append('<li>' + boards[i].list[j] + '</li>');
			}
			boardBody.append(ul);
		}
		var boardwidth = boards[i].w * cellWidth - 10, boardheight = boards[i].h * cellHeight - 10;
		boardBody.css('width', boardwidth);
		boardBody.css('height', boardheight);

		if(boards[i].x == null || boards.y == null) {
			addBoardToPicker(board, boardwidth, boardheight);
		} else {
			//To the container
			board.css('top', boards[i].y*cellHeight);
			board.css('left', boards[i].x*cellWidth);
			container.append(board);
		}
	}
}

function gotoEditMode() {
	boardPicker.addClass('active');
	$('.edit').addClass('switched');
	$('.edit').click(gotoNormalMode);
	$('.edit i').html('done');
	$('nav').addClass('active');
	oldboards = boards;
	addResizersAll();
	mode = EDIT_MODE;
}

function gotoNormalMode() {
	boardPicker.removeClass('active');
	$('.edit').removeClass('switched');
	$('.edit').click(gotoEditMode);
	$('.edit i').html('edit');
	removeResizers();
	mode = NORMAL_MODE;
}

function addResizers(board) {
	if(board.parents('#board-picker').length == 0) {
		var boardInfo = boards[board.attr('boardIndex')];

		var topresizer = $('<div class="top resizer"><i class="material-icons">drag_handle</i></div>');
		var rightresizer = $('<div class="right resizer"><i class="material-icons">drag_handle</i></div>');
		var bottomresizer = $('<div class="bottom resizer"><i class="material-icons">drag_handle</i></div>');
		var leftresizer = $('<div class="left resizer"><i class="material-icons">drag_handle</i></div>');

		topresizer.css('top', '-10px');
		topresizer.css('left', '50%');
		rightresizer.css('top', '50%');
		rightresizer.css('right', '-10px');
		bottomresizer.css('bottom', '-10px');
		bottomresizer.css('left', '50%');
		leftresizer.css('top', '50%');
		leftresizer.css('left', '-10px');

		board.append(topresizer);
		board.append(rightresizer);
		board.append(bottomresizer);
		board.append(leftresizer);

		topresizer.mousedown(resizerdrag);
		rightresizer.mousedown(resizerdrag);
		bottomresizer.mousedown(resizerdrag);
		leftresizer.mousedown(resizerdrag);
	}
}

function addResizersAll() {
	for (var i = 0; i < boards.length; i++) {
		addResizers($('.board[boardindex=' + i + ']'));
	}
}

function resizerdrag(e) {
	e.stopPropagation();

	var isLeftMB;
	e = e || window.event;

	if ("which" in e)
		isLeftMB = e.which == 1; 
	else if ("button" in e) 
		isLeftMB = e.button == 0; 

	if(isLeftMB) {
		var draggedItem = $(this);
		var board = draggedItem.parents('#container>.board');
		var boardBody = board.children('.board-body');
		var boardInfo = boards[board.attr('boardIndex')];
		console.log(draggedItem);

		for (var i = boardInfo.x; i < boardInfo.w + boardInfo.x; i++) {
			for (var j = boardInfo.y; j < boardInfo.h + boardInfo.y; j++) {
				console.log(i, j);
				availabilityMap[i][j] = false;
			}
		}

		if(draggedItem.hasClass('top')) {
			container.css('cursor', 'n-resize');
			container.mousemove(function(ev) {
				var y = Math.floor(ev.clientY/cellHeight);
				var oldh = boardInfo.h, oldy = boardInfo.y;

				if(boardInfo.h + boardInfo.y > y) {
					boardInfo.y = y;
					boardInfo.h += oldy - y;
					if(checkAvailability(boardInfo.x, y, boardInfo)) {
						board.css('top', y * cellHeight + 10);
						boardBody.css('height', boardInfo.h * cellHeight - 20);
					} else {
						boardInfo.h = oldh;
						boardInfo.y = oldy;
					}	
				}
			});
		} else if(draggedItem.hasClass('right')) {
			container.css('cursor', 'e-resize');
			container.mousemove(function(ev) {
				var x = Math.floor(ev.clientX/cellWidth);
				var oldw = boardInfo.w;

				console.log(x, boardInfo.x);
				if(boardInfo.x <= x) {
					boardInfo.w = x - boardInfo.x + 1;
					if(checkAvailability(boardInfo.x, boardInfo.y, boardInfo)) {
						boardBody.css('width', boardInfo.w * cellWidth - 20);
					} else {
						boardInfo.w = oldw;
					}	
				}
			});
		} else if(draggedItem.hasClass('bottom')) {
			container.css('cursor', 'n-resize');
			container.mousemove(function(ev) {
				var y = Math.floor(ev.clientY/cellHeight);
				var oldh = boardInfo.h;

				if(boardInfo.y <= y) {
					boardInfo.h = y - boardInfo.y + 1;
					if(checkAvailability(boardInfo.x, boardInfo.y, boardInfo)) {
						boardBody.css('height', boardInfo.h * cellHeight - 20);
					} else {
						boardInfo.h = oldh;
					}	
				}
			});
		} else if(draggedItem.hasClass('left')) {
			container.css('cursor', 'e-resize');
			container.mousemove(function(ev) {
				var x = Math.floor(ev.clientX/cellWidth);
				var oldw = boardInfo.w, oldx = boardInfo.x;

				if(boardInfo.w + boardInfo.x > x) {
					boardInfo.x = x;
					boardInfo.w += oldx - x;
					if(checkAvailability(x, boardInfo.y, boardInfo)) {
						board.css('left', x * cellWidth + 10);
						boardBody.css('width', boardInfo.w * cellWidth - 20);
					} else {
						boardInfo.w = w;
						boardInfo.x = oldx;
					}	
				}
			});
		}

		console.log(boardInfo);

		container.mouseup(function() {
			container.unbind('mousemove');
			container.unbind('mouseup');
			container.css('cursor','');

			for (var i = boardInfo.x; i < boardInfo.w + boardInfo.x; i++) {
				if(availabilityMap[i] == undefined) {
					availabilityMap[i] = [];
				}
				for (var j = boardInfo.y; j < boardInfo.h + boardInfo.y; j++) {
					availabilityMap[i][j] = true;
				}
			}
		});
	}
}

function removeResizers() {
	$('.resizer').remove();
}

function dragBoardFromContainer(e) {
	console.log('Dragged board from container');

	var isLeftMB;
	e = e || window.event;

	if ("which" in e)
		isLeftMB = e.which == 1; 
	else if ("button" in e) 
		isLeftMB = e.button == 0; 

	if(isLeftMB) {
		draggedBoard = $(this);
		draggedX = e.clientX - parseInt(draggedBoard.css('left'));
		draggedY = e.clientY - parseInt(draggedBoard.css('top'));
		console.log(draggedX, draggedY);
		draggedBoard.addClass('dragging');
		draggedBoard.css('transition', 'none');
		var board = boards[draggedBoard.attr('boardIndex')];
		for (var i = board.x; i < board.x + board.w; i++) {
			for (var j = board.y; j < board.y + board.h; j++) {
				if(availabilityMap[i] == undefined) {
					availabilityMap[i] = [];
				}
				availabilityMap[i][j] = false;
			}
		}
		container.mousemove(dragBoard);
		container.mouseup(dropBoard);
		boardPicker.removeClass('active');
	}
}

function dragBoardFromPicker(e) {
	var isLeftMB;
	e = e || window.event;

	if ("which" in e)
		isLeftMB = e.which == 1; 
	else if ("button" in e) 
		isLeftMB = e.button == 0; 

	if(isLeftMB) {
		console.log('Dragged board from picker');
		e.stopPropagation();

		draggedBoard = $(this);
		var offset = draggedBoard.offset();

		draggedX = e.clientX - offset.left;
		draggedY = e.clientY - offset.top;

		draggedBoard.css('top', offset.top);
		draggedBoard.css('left', offset.left);
		draggedBoard.addClass('dragging');
		draggedBoard.css('transition', 'none');
		draggedBoard.find('.board-body').css('transform', 'scale(1) translate(0, 0)');
		container.mousemove(dragBoard);
		container.mouseup(dropBoard);
		boardPicker.removeClass('active');
		draggedBoard.appendTo(container);
	}
}

function dragBoard(e) {
	var x = Math.floor((e.clientX - draggedX)/cellWidth);
	var y = Math.floor((e.clientY - draggedY)/cellHeight);
	if(x != currentX || y != currentY) {
		var id = draggedBoard.attr('boardIndex');
		console.log('x=' + x + ', ' + 'y=' + y + ' clientx=' + e.clientX + ', ' + 'clienty=' + e.clientY);
		if(checkAvailability(x, y, boards[id])) {
			draggedBoard.css('top', y * cellHeight + 10);
			draggedBoard.css('left', x * cellWidth + 10);
			draggedBoard.addClass('active');
			draggedBoard.removeClass('notavailable');
			available = true;
			currentX = x;
			currentY = y;
		} else {
			currentX = x;
			currentY = y;
			available = false;
			draggedBoard.css('top', y * cellHeight + 10);
			draggedBoard.css('left', x * cellWidth + 10);
			draggedBoard.removeClass('active');
			draggedBoard.addClass('notavailable');
		}
	}
	console.log('Dragging board: Y=' + draggedBoard.outerHeight());
}

function dropBoard(e) {
	e.stopPropagation();

	draggedBoard.removeClass('dragging');
	draggedBoard.css('transition', '');
	container.unbind('mousemove');
	container.unbind('mouseup');

	if(available) {
		var board = boards[draggedBoard.attr('boardIndex')];
		for (var i = currentX; i < currentX + board.w; i++) {
			for (var j = currentY; j < currentY + board.h; j++) {
				if(availabilityMap[i] == undefined) {
					availabilityMap[i] = [];
				}
				availabilityMap[i][j] = true;
			}
		}
		board.x = currentX;
		board.y = currentY;
		draggedBoard.unbind('mousedown');
		draggedBoard.mousedown(dragBoardFromContainer);
	} else {	
		addBoardToPicker(draggedBoard);
	}
	draggedBoard = null;
	draggedX = null;
	draggedY = null;
	boardPicker.addClass('active');
}

function addBoardToPicker(board, boardwidth = -1, boardheight = -1) {
	console.log(board);
	var boardbody = board.find('.board-body');
	console.log(boardbody, boardwidth, boardheight);
	if(boardwidth == -1 || boardheight == -1) {
		boardheight = parseInt(boardbody.css('height'));
		boardwidth = parseInt(boardbody.css('width'));
	}
	console.log(boardbody, boardwidth, boardheight);

	var maxlength = boardwidth>boardheight? boardwidth:boardheight;
	var scale = 70/maxlength;

	console.log('translate(-' + boardwidth/2 + 'px, -' + boardheight/2 + 'px) scale(' + scale + ')');
	console.log('width' + boardwidth + ' height' + boardheight);

	board.attr('style', '');
	boardbody.css('transform', 'translate(-' + boardwidth/2 + 'px, -' + boardheight/2 + 'px) scale(' + scale + ')');
	board.removeClass('notavailable');
	board.unbind('mousedown');
	board.mousedown(dragBoardFromPicker);
	board.appendTo(boardPicker);
	available = false;
}

function checkAvailability(x, y, boardInfo) {
	var result = true;

	if(x + boardInfo.w > 16 || y + boardInfo.h > 16 || x < 0 || y < 0) {
		return false;
	} 

	for (var i = x; i < x + boardInfo.w; i++) {
		if(result) {
			for (var j = y; j < y + boardInfo.h; j++) {
				if(availabilityMap[i] != undefined && availabilityMap[i][j]) {
					result = false;
					break;
				}
			}
		} else {
			break;
		}
	}

	return result;
}

function allocatePopup(popup) {
	var offset = popup.offset();
	if(offset.left + popup.outerWidth() > jwindow.width()) {
		popup.css('left', jwindow.width() - popup.outerWidth());
	}
	if(offset.top + popup.outerHeight() > jwindow.height()) {
		popup.css('top', jwindow.height() - popup.outerHeight());
	}
}

function showTaskForm(e) {
	e.stopPropagation();

	var board = $(this).parents('.board');
	var offset = $(this).offset();
	console.log('XAXAX', offset);

	$('.context-menu').removeClass('active');

	taskformcontainer.css('top', offset.top);
	taskformcontainer.css('left', offset.left);
	taskformcontainer.addClass('active');

	allocatePopup(taskformcontainer);
}

var board1 = {
	id: 1,
	x: null,
	y: null,
	w: 3,
	h: 4,
	name: 'Board Name',
	type: 0,
	filtertype: 0,
	timerange: {
		time1: '',
		time2: ''
	},
	length: 14,
	goalid: 0,
	status: 0,
	tags: ['ЮУВАЙН'],
	fontsize: 12,
	list: ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4']
};
var board2 = {
	id: 2,
	x: null,
	y: null,
	w: 5,
	h: 7,
	name: 'Board Name',
	type: 0,
	filtertype: 0,
	timerange: {
		time1: '',
		time2: ''
	},
	length: 14,
	goalid: 0,
	status: 0,
	tags: ['ЮУВАЙН'],
	fontsize: 12,
	list: ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4']
};
var board3 = {
	id: 3,
	x: null,
	y: null,
	w: 8,
	h: 3,
	name: 'Board Name',
	type: 0,
	filtertype: 0,
	timerange: {
		time1: '',
		time2: ''
	},
	length: 14,
	goalid: 0,
	status: 0,
	tags: ['ЮУВАЙН'],
	fontsize: 12,
	list: ['Biiiiiiiig Goal of the future.']
};
var board4 = {
	id: 4,
	x: null,
	y: null,
	w: 3,
	h: 1,
	name: 'Board Name',
	type: 0,
	filtertype: 0,
	timerange: {
		time1: '',
		time2: ''
	},
	length: 14,
	goalid: 0,
	status: 0,
	tags: ['ЮУВАЙН'],
	fontsize: 24,
	list: ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4']
};
var board5 = {
	id: 5,
	x: null,
	y: null,
	w: 1,
	h: 1,
	name: 'Board Name',
	type: 0,
	filtertype: 0,
	timerange: {
		time1: '',
		time2: ''
	},
	length: 14,
	goalid: 0,
	status: 0,
	tags: ['ЮУВАЙН'],
	fontsize: 12,
	list: ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4']
};

boards = [board1, board2, board3, board4, board5];
buildBoards();

$('#board-picker .board').mousedown(dragBoardFromPicker);