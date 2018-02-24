const fs = require('fs');

/**
 * User object.
 */
class User {
	/**
	 * @param $user_id (int) Optional user id for existing record. Passing undefined will create a new record
	 */
	constructor ($user_id) {
		this.isNewRecord = false;
		if ( undefined === $user_id ) {
			//Create a new record
			this.isNewRecord = true;
		} else if ( isNaN(parseInt($user_id)) ) {
			throw new Error('Invalid User Id. Please enter a number');
		}
		this.userId = $user_id;
		if ( !this.isNewRecord ) {
			const data = fs.readFileSync(`data/${$user_id}.json`, {encoding: 'utf-8'});
			this.data = JSON.parse(data.replace('/n', ''));

			console.log(
				'data',
				data
			);
		}
	}
}

module.exports = User;