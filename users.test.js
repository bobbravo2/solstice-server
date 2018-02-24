const Users = require('./users');
const User = require('./user');
test('it is exported', () => {
	expect(Users).not.toBe(undefined);
});

test('it can be instantiated', () => {
	let users = new Users();
	expect(users).toBeInstanceOf(Users);
});

test('it only adds filenames that end in .json', () => {
	let users = new Users();
	expect(users.dataFiles).toHaveLength(2);
});

test('it loads file metadata from filenames', () => {
	let users = new Users();
	expect(users.data).toBeDefined();
	expect (users.data[0]).toBeInstanceOf(User)
});