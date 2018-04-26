<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/arrange.css">
</head>
<body>
	<div id="container">
		<svg id="svg1" xmlns="http://www.w3.org/2000/svg"></svg>

		<nav>
			<div class="add-ball item" style="background-color: #00b300"><i class="material-icons md-36 md-light unselectable">add</i></div>
			<div class="edit item"><i class="material-icons md-36 md-light unselectable">mode_edit</i></div>
			<div class="trigger"><i class="material-icons md-36 md-light unselectable">menu</i></div>
		</nav>
	</div>

	<div id='context-menu'>
		<div class="area-properties">
			<label>Title</label>
			<input type="text" name="title" id="input-title" class="input-field">
			<label>Color</label>
			<input type="color" name="color" id="input-color" class="input-field">
			<label>Order</label>
			<input type="number" name="order" id="input-order" class="input-field">
			<label>Description</label>
			<textarea name="description" id="input-desc" class="input-field"></textarea>
		</div>
		<div class="add-area item">Add</div>
		<div class="delete-area item" style="color: red">Delete</div>
	</div>

	<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<script type="text/javascript" src="js/arrange.js"></script>
</body>
</html>