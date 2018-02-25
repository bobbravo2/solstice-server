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
			const records = fs.readFileSync(`data/records/${$user_id}.json`, {encoding: 'utf-8'});
			this.data.records = JSON.parse(records.replace('/n', ''));
			this.data.records.forEach((row, index) => {
				//Computed columns
				this.data.records[index].timestamp = new Date(row.year, (row.month - 1));
				//Parse our savings into a float, get the absolute value
				//  (in case data interchange formats change) and then make it negative for the UI
				this.data.records[index].savings =  - Math.abs(parseFloat(row.savings))
			})
		}
	}
	toJSON () {
		return this.data;
	}

}

module.exports = User;