const fs = require('fs');
const User = require('./user');

/**
 * User object.
 */
class Users {
	/**
	 */
	constructor () {
		const users = fs.readdirSync(
			'./data/',
			{encoding: 'utf-8'}
		);
		let dataFiles = [];
		this.data = [];
		users.map((value) => {
			if ( value.indexOf('.json') !== -1 ) {
				//Only push files ending in .json. Node's FS package already ignores dotfiles
				dataFiles.push(value);
				//For TDD
				this.dataFiles = dataFiles;
				//Push a new user object to the response after parsing the integer and removing .json from the filename
				this.data.push(new User(parseInt(value.replace('.json', ''))));
			}
		});
	}

	toJSON () {
		return this.data;
	}

}

module.exports = Users;