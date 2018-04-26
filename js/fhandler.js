function saveBoards(boardInfos) {
	
}


function addtoboard(boardindex, name) {
	var item = new Object();
	var board = boards[boardindex];
	item.name = name;

	//Need to be checked in server
	item.type = board.type;

	if(board.type == 0) {
		item.tags = board.opt.tags;
		item.goalid = board.opt.goalid;
		item.timerange = board.opt.timerange;
		item.iteration = board.opt.timerange.length;
		item.deadline = board.opt.deadline;
		item.duration = board.opt.duration.min;
	} else if (board.type == 1) {
		item.tags = board.opt.tags;
		item.goalid = board.opt.goalid;
		item.timerange = board.opt.timerange;
	}

	request = $.ajax({
		url: 'blockmodel.php',
		type: 'post',
		contentType: 'application/json',
		data: item
	});

	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){
		console.log(response);
	});

	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error("Connection Failed");
	});	
}