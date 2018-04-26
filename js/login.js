$('loginform').submit(function () {
	event.preventDefault();

	var $form = $(this);

	var $inputs = $form.find("input, select, button, textarea");

	var serializedData = $form.serialize();

	$inputs.prop("disabled", true);

	request = $.ajax({
		url: "user/registerUser",
		type: "post",
		data: serializedData
	});

	request.done(function (response, textStatus, jqXHR){
		console.log(response);
		response = JSON.parse(response);

	});

	request.fail(function (jqXHR, textStatus, errorThrown){
		console.error("Connection Failed");
	});

	request.always(function () {
		$inputs.prop("disabled", false);
	});
});