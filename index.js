let fs = require('fs');

let path = 'lcdb.json';

let methods = {
	version: require('./package.json').version,
	set: (key, val) => {
		let obj = read();

		obj[key] = val;

		write(obj);
	},
	get: key => read()[key],
	delete: key => {
		let obj = read();

		delete obj[key];

		write(obj);
	},
	add: (key, val) => {
		let obj = read();

		if (obj[key] && typeof obj[key] != 'number')
			throw new Error('A value of key is not a number.');

		obj[key] = (Number(obj[key]) || 0) + val;

		write(obj);
	},
	subtract: (key, val) => {
		let obj = read();

		if (obj[key] && typeof obj[key] != 'number')
			throw new Error('A value of key is not a number.');

		obj[key] = (obj[key] || 0) - val;

		write(obj);
	},
	push: (key, ...val) => {
		if (!Array.isArray(...val)) val = Array(val);

		let obj = read();

		let objVal = obj[key] || [];

		if (!Array.isArray(objVal)) objVal = Array(objVal);

		obj[key] = objVal.concat(...val);

		write(obj);
	},
	has: key => (read()[key] ? true : false),
	all: () => read(),
	type: key => typeof methods.get(key)
};

module.exports = Object.assign(methods, {
	path: ref => {
		if (ref) {
			ref = String(ref)
				.split('/')
				.filter(a => a);

			let name = ref.pop() + '.json';

			let refName = (ref.length ? ref.join('/') + '/' : '') + name;

			!fs.existsSync(refName) &&
				ref.length >= 1 &&
				fs.mkdirSync(ref.join('/'), { recursive: true });

			path = refName;
		}

		return methods;
	}
});

function read() {
	return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : {};
}

function write(obj) {
	fs.writeFileSync(path, JSON.stringify(obj, null, 2));
}
