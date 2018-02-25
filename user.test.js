const User = require('./user');

test('it is exported', () => {
	expect(User).not.toBe(undefined);
});

test('it can be instantiated', () => {
	let user = new User();
	expect(user).toBeInstanceOf(User);
});

test('it can accept a user id argument', () => {
	let $user_id_under_test = 1158;
	let user = new User($user_id_under_test);
	expect(user.userId).toEqual($user_id_under_test);
});
test('it throws an exception on passing an invalid user id', () => {
	expect(() => {
		let user = new User('foobar');
	}).toThrow()
});

test('it throws an exception when there is no valid file for this user id', () => {
	expect(() => {
		let user = new User(404);
	}).toThrow();
});

it('loads valid json record if the user id is valid', () => {
	let user = new User(1158);
	expect(user.data.user.id).toBe(1158);
	expect(user.data.user.name).toBe("Sally Solar")
});

test('it loads records based on the user id', () => {
	let user = new User(1158);
	expect(user.data.records).toBeDefined();
	expect(typeof user.data.records).toBe('object');
	expect(user.data.records).toHaveLength(14);
	//Check CSV column definitions for our data model
	expect(user.data.records[0].year).toBeDefined();
	expect(user.data.records[0].month).toBeDefined();
	expect(user.data.records[0].kwh).toBeDefined();
	expect(user.data.records[0]["solar-kwh"]).toBeDefined();
	expect(user.data.records[0]["utility-kwh"]).toBeDefined();
	expect(user.data.records[0].bill).toBeDefined();
	expect(user.data.records[0].savings).toBeDefined();
	expect(user.data.records[0]["zip-code"]).toBeDefined();
});

test('it has a toJSON method', () => {
	let user = new User(1158);
	expect(user.toJSON()).toBeDefined();
});

test('it has a toJSON method that returns an object', () => {
	let user = new User(1158);
	expect(typeof user.toJSON()).toBe("object");
});

test('it has a toJSON method that returns an object that matches the internal state', () => {
	let user = new User(1158);
	//Note how the data root is abstracted away from the client side.
	expect(user.toJSON().user.name).toEqual(user.data.user.name);
});

test('user records have a computed timestamp column based on month and day', () => {
	let user = new User(1158);
	expect(user.data.records[0].timestamp).toBeDefined();
															//Js Date with seconds
															// @link https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
	let timestamp = new Date(user.data.records[0].year, user.data.records[0].month);
	expect(user.data.records[0].timestamp).toEqual(timestamp);
});