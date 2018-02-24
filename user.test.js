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