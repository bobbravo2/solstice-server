const express = require('express');
const User = require('./user');
const Users = require('./users');
const app = express();
const PORT = process.env.PORT || 3001;
const ENV = process.env.ENV || 'dev';
app.get(
	'/',
	(
		request,
		response
	) => res.send('Hello World!')
);

app.get(
	'/user/:user_id?',
	(
		request,
		response
	) => {
		try {
			let serverResponse = {};
			if (request.params.user_id) {
				console.log('GET request for /user/:id', request.params.user_id);
				serverResponse  = new User(request.params.user_id);
			} else {
				console.log('GET request for /user/');
				serverResponse  = new Users();
			}
			response.json(serverResponse.toJSON());
		} catch (e) {
			response.status(400);
			if ('dev' === ENV || 'stage' === ENV) {
				//Send error in dev / stage
				response.json(e);
			} else {
				//Only log in production
				console.log(`Fatal error for /user/user_id`, e);
			}
			response.end();
		}

	}
);
//TODO static file server
app.get('*', function(request, response) {
	response.sendFile(__dirname + '/../public/index.html');
});
app.listen(
	PORT,
	() => console.log(` Energy Management Dashboard - Server is running on ${PORT}`)
);