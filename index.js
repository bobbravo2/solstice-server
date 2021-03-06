const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonParser = bodyParser.json();

const User = require('./user');
const Users = require('./users');
const app = express();
const PORT = process.env.PORT || 3001;
const ENV = process.env.ENV || 'dev';
/**
 * Edit End Point
 * @param user_id (int) User id to edit
 */
app.post(
	'/admin/:user_id',
	jsonParser,
	(
		req,
		res,
		next
	) => {
		setTimeout(
			() => {
				console.log('Adding latency to show state transitions on client side');
				next();
			}
		);
	},
	(
		request,
		response
	) => {
		try {
			let user = new User();
			user.edit(request.body);
		}
		catch (e) {
			response.status(400);
			console.log(
				'e',
				e
			);
			response.json({error: e.toString()});
			response.end();
		}
		response.json({error: false});
	}
);
/**
 * Create a new record
 * @param user_id (int) user id to append the new record to.
 */
app.post(
	'/admin/:user_id/create',
	jsonParser,
	(
		request,
		response
	) => {
		try {
			User.create(
				request.params.user_id,
				request.body
			);
			response.json({error: false});
		}
		catch (e) {
			response.json({error: e.toString()});
		}

	}
);
/**
 * Read endpoint
 */
app.get(
	'/user/:user_id?',
	(
		request,
		response
	) => {
		try {
			let serverResponse = {};
			if ( request.params.user_id ) {
				console.log(
					'GET request for /user/:id',
					request.params.user_id
				);
				serverResponse = new User(request.params.user_id);
			} else {
				console.log('GET request for /user/');
				serverResponse = new Users();
			}
			response.json(serverResponse.toJSON());
		}
		catch (e) {
			response.status(400);
			if ( 'dev' === ENV || 'stage' === ENV ) {
				//Send error in dev / stage
				response.json(e);
			} else {
				//Only log in production
				console.log(
					`Fatal error for /user/user_id`,
					e
				);
			}
			response.end();
		}

	}
);
//TODO static file server
app.get(
	'*',
	function (
		request,
		response
	) {
		response.sendFile(__dirname + '/../public/index.html');
	}
);
app.listen(
	PORT,
	() => console.log(` Energy Management Dashboard - Server is running on ${PORT}`)
);