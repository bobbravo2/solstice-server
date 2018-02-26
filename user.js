const fs = require('fs');
const _ = require('lodash');
const deepKeys = require('deep-keys');


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
			this.data = User.readUserProfile($user_id);
			this.data.records = User.readUserRecords($user_id);
			//Computed columns
			this.data.records.forEach(
				(
					row,
					index
				) => {
					this.data.records[index].timestamp = new Date(
						row.year,
						(row.month - 1)
					);
					//Parse our savings into a float, get the absolute value
					//  (in case data interchange formats change) and then make it negative for the UI
					this.data.records[index].savings = -Math.abs(parseFloat(row.savings));
				});
		}
	}

	static loadFileJSON ($path) {
		let data = fs.readFileSync(
			$path,
			{encoding: 'utf-8'}
		);
		//Strip newlines from FS.
		data = JSON.parse(data.replace(
			'/n',
			''
		));
		return data;
	}

	static writeFileJSON (
		$path,
		$data
	)
	{
		return fs.writeFileSync(
			$path,
			$data,
			{encoding: 'utf8'}
		);
	}

	/**
	 * Checks if a user profile exists with the given user id
	 * @param $user_id
	 * @return {boolean}
	 */
	static userProfileExists ($user_id) {
		let filePath = `data/${$user_id}.json`;
		return fs.existsSync(filePath);
	}

	static readUserProfile ($user_id) {
		let filePath = `data/${$user_id}.json`;
		return User.loadFileJSON(filePath);
	}

	static readUserRecords ($user_id) {
		let filePath = `data/records/${$user_id}.json`;
		return User.loadFileJSON(filePath);
	}

	static getRecordValidationRules () {
		return {
			'utility-kwh': (number) => {
				number = parseFloat(number);
				return number >= 0 && number < 50000;
			},
			'solar-kwh':   (number) => {
				number = parseFloat(number);
				return number >= 0 && number < 50000;
			},
			'year':        (number) => {
				number = parseInt(number);
				return (number > 1970 && number < 2100); //Y21k FTW!
			},
			'month':       (number) => {
				number = parseInt(number);
				return number > 0 && number < 13;
			},
			'bill':        (number) => {
				number = parseFloat(number);
				return isFinite(number) && number > 0;
			},
			'savings':     (number) => {
				// Negative number!
				number = parseFloat(number);
				return number <= 0;
			},
			'zip-code':    (number) => {
				return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(number);
			}
		};
	}

	/**
	 *  Used to edit the JSON objects. Only used for edit operations
	 *  Using a fully validated schema would be used in production.
	 *  @throws Error
	 * @param $data
	 */
	edit ($data) {
		//Validate the user id from the filesystem
		if ( !User.userProfileExists($data.user.id) ) {

			throw new Error("User ID Not Found:" + parseInt($data.user.id));
		}
		//Validate profile data
		let diskUserProfileData = User.readUserProfile($data.user.id).user;
		let missingUserKeys = _.difference(
			deepKeys($data.user),
			deepKeys(diskUserProfileData)
		);
		if ( 0 === missingUserKeys.length ) {
			console.log('Validated Profile JSON keys from Disk');
		} else {
			console.log(
				'ERROR, missing keys',
				missingUserKeys
			);
			console.log(
				'POST',
				$data.user
			);
			console.log(
				'DISK',
				diskUserProfileData
			);
		}

		//Load User Records to compare with computed columns
		let originalUser = new User($data.user.id);
		let missingRecordKeys = _.difference(
			deepKeys($data.records),
			deepKeys(originalUser.toJSON().records)
		);
		if ( 0 === missingRecordKeys.length ) {
			console.log('Validated Record JSON keys from Disk');
		} else {
			console.log(
				'ERROR, missing keys',
				missingRecordKeys
			);
			console.log(
				'POST',
				$data.records
			);
			console.log(
				'DISK',
				originalUser.toJSON().records
			);
		}
		if ( missingRecordKeys.length > 0 || missingUserKeys > 0 ) {
			throw new Error('Validation of JSON Failed');
		}

		_.each(
			$data.records,
			(
				value,
				key
			) => {

				if ( !_.conformsTo(
						value,
						User.getRecordValidationRules()
					) ) {
					throw new Error(
						`Record Validation Failed on Item (#${key})`,
						__filename,
						key
					);
				}
			}
		);
		//Sort by timestamp just to be sure
		let dataToBeWritten = [];
		_.each(
			_.sortBy(
				$data.records,
				['timestamp']
			),
			(value) => {
				//Remove computed columns from the input.
				let cleanRecord = _.omit(
					value,
					['timestamp']
				);
				dataToBeWritten.push(cleanRecord);
			}
		);
		User.writeFileJSON(
			`data/records/${$data.user.id}.json`,
			JSON.stringify(dataToBeWritten)
		);
		//User profile isn't as important as it's mostly for reads.
		// need to make sure the ID is immutable, though.
		let postedProfileWithoutID = _.omit(
			$data.user,
			['id']
		);
		//Here we trust the disk for the ID only after verifying it matches the filename
		//  (at the very start of the method)
		let profileToBeWritten = _.merge(
			diskUserProfileData,
			postedProfileWithoutID
		);
		User.writeFileJSON(
			`data/${$data.user.id}.json`,
			JSON.stringify({user: profileToBeWritten})
		);
		console.log(
			'dataToBeWritten',
			dataToBeWritten,
			'profileToBeWritten: ',
			profileToBeWritten,
			'Sans ID: ',
			postedProfileWithoutID
		);
		console.log('Finished Record Validation');
	}

	toJSON () {
		return this.data;
	}

}

module.exports = User;