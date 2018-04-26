<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/list.css">
	<!-- <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> -->
</head>
<body>
	<div id="container">
		<div id="board-picker">
		</div>

		<div id="context-menu3" class="context-menu">
			<div class="item edit context">Go to edit mode</div>
		</div>

		<div id="context-menu4" class="context-menu">
			<div class="item add-task">Add task</div>
			<div class="item edit context">Go to edit mode</div>
		</div>

		<div id="context-menu1" class="context-menu">
			<form id="board-prop-form" class="board-properties">
				<label>Name</label>
				<input type="text" name="title" id="input-title" class="input-field">
				<label>Text size</label>
				<input type="number" name="text-size" id="input-textsize" class="input-field">
				<label>Show</label>
				<select name="title" id="input-type" class="input-field">
					<option value="0">Tasks</option>
					<option value="1">Rules</option>					
					<option value="2">Goal</option>
				</select>
				<label id="label-by" style="display: none">By</label>
				<select name="filter-type" id="task-filter-type" style="display: none" class="input-field">
					<option value="0">Timerange</option>
					<option value="1">Goal</option>
					<option value="2">Length</option>
					<option value="3">Status</option>
					<option value="4">Tag</option>
				</select>
				<select name="filter-type" id="rule-filter-type" style="display: none" class="input-field">
					<option value="0">Timerange</option>
					<option value="1">Goal</option>
				</select>
				<select name="filter-type" id="goal-filter-type" style="display: none" class="input-field">
					<option value="0">Timerange</option>
					<option value="1">Goal</option>
					<option value="4">Tag</option>
				</select>
				<div id="tag-input-g" style="display: none" class="input-group">
					<label>Tags</label>
					<input type="text" name="title" id="input-tags" class="input-field">
					<div id="tag-container" class="tag-container"></div>
				</div>
				<div id="timerange-input-g" style="display: none" class="input-group">
					<label>Timerange</label>
					<input type="date-time" name="time1" id="input-time1" class="input-field">
					<input type="date-time" name="time2" id="input-time2" class="input-field">
					<span>
						<input type="checkbox" name="fixed" value="1"> Fixed
					</span>
				</div>
				<div id="length-input-g" style="display: none" class="input-group">
					<label>Length</label>
					<input type="number" name="length" id="input-length" class="input-field">
				</div>
				<div id="goal-input-g" style="display: none" class="input-group">
					<label>Goal</label>
					<select name="goalid" id="input-goal" class="input-field">
						<option value="0">Big goal</option>
						<option value="1">Blur goal</option>
						<option value="2">Xaxa lol me</option>
					</select>
				</div>
				<div id="status-input-g" style="display: none" class="input-group">
					<label>Status</label>
					<select name="status" id="input-task-status" class="input-field">
						<option value="0">Pending</option>
						<option value="1">Done</option>
						<option value="2">Postponed</option>
					</select>
				</div>
			</form>
			<div class="item context gotonormal">Save changes</div>
			<div class="item delete-board" style="color: red">Delete</div>
		</div>
		<div id="context-menu2" class="context-menu">
			<div class="add-board item">Add board</div>
			<div class="item context gotonormal">Save changes</div>
		</div>
		<nav>
			<div class="add-ball item" style="background-color: #00b300"><i class="material-icons md-36 md-light unselectable">add</i></div>
			<div class="edit item"><i class="material-icons md-36 md-light unselectable">mode_edit</i></div>
			<div class="trigger"><i class="material-icons md-36 md-light unselectable">menu</i></div>
		</nav>

		<div id="task-form-container" class="context-menu">
			<form id="task-form">
				<label>Name</label>
				<input type="text" name="title" class="input-field">
				<div class="input-group">
					<label>Tags</label>
					<input type="text" id="input-task-tags" class="input-field">
					<div id="task-tag-container" class="tag-container"></div>
				</div>
				<div id="input-task-length-g" class="input-group" style="display: none">
					<label>Duration(Min)</label>
					<input type="number" name="length" id="input-task-length" class="input-field">
				</div>
				<div id="input-task-time1-g" class="input-group" style="display: none">
					<label>Start time</label>
					<input type="date-time" name="time1" id="input-task-time1" class="input-field">
				</div>
				<div id="input-task-deadline-g" class="input-group" style="display: none">
					<label>Deadline</label>
					<input type="date-time" name="deadline" id="input-task-deadline" class="input-field">
				</div>
				<div id="input-task-date-g" class="input-group" style="display: none">
					<label>Start date</label>
					<input type="date-time" name="date1" id="input-task-date1" class="input-field">
					<label>End date</label>
					<input type="date-time" name="date2" id="input-task-date2" class="input-field">
					<label>Interval(Day)</label>
					<input type="number" name="length" id="input-task-interval" class="input-field">
				</div>
				<div id="input-task-goal-g" class="input-group" style="display: none">
					<label>Goal</label>
					<select name="goalid" id="input-goal" class="input-field">
						<option value="0">Big goal</option>
						<option value="1">Blur goal</option>
						<option value="2">Xaxa lol me</option>
					</select>
				</div>
				<span style="margin-top: 10px">
					<select id="add-field-type" class="input-field">
						<option value="0">Duration</option>
						<option value="1">Start time</option>
						<option value="2">Deadline</option>
						<option value="3">Interval</option>
						<option value="4">Goal</option>
					</select>
					<a id="add-task-field" class="flat-button">Add</a>
				</span>
			</form>
			<div class="item">Save</div>
			<div class="item">Discard</div>
		</div>
	</div>
	<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<script type="text/javascript" src="js/fhandler.js"></script>
	<script type="text/javascript" src="js/list.js"></script>
</body>
</html>