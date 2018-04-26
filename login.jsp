<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/login.css">
</head>
<body>
	<div id="container">
		<form id="loginform" method="POST">
			<h1>Login</h1>
			<input type="text" name="email" placeholder="Email">
			<input type="text" name="password" placeholder="Password">
			<button>Go! Go! Go!</button>
		</form>

		<form id="registerform" method="POST">
			<h1>Sign up</h1>
			<input type="text" name="fname" placeholder="First name">
			<input type="text" name="lname" placeholder="Last name">
			<input type="email" name="email" placeholder="Email">
			<input type="password" name="password" placeholder="Password">
			<input type="password" name="repassword" placeholder="Confirm password">
			<button>Just let me in!</button>
		</form>
	</div>
	<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
</body>
</html>