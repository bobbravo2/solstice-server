const express = require('express');
const User = require('./user');
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
	'/user/:user_id',
	(
		request,
		response
	) => {
		console.log('fetch request for id', request.params.user_id);
		try {
			let user = new User(request.params.user_id);
			response.json(user.toJSON());
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

app.listen(
	PORT,
	() => console.log(` Energy Management Dashboard - Server is running on ${PORT}`)
);