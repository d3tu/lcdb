const fs = require('fs');

var path = 'lcdb.json',
	methods = {
		set: (key, val) => write(setObj(key, val, read())),
		get: key => getObj(key, read()),
		delete: key => write(delObj(key, read())),
		has: key => (getObj(key, read()) ? true : false),
		type: key => typeof getObj(key, read()),
		push: (key, ...val) => {
			if (!Array.isArray(...val)) val = Array(val);

			let obj = read(),
				objVal = getObj(key, obj) || [];

			if (!Array.isArray(objVal)) objVal = Array(objVal);

			write(setObj(key, objVal.concat(...val), obj));
		},
		add: (key, val) => {
			let obj = read(),
				objVal = getObj(key, obj);

			if (isNaN(objVal)) throw new Error('A value of key is not a number.');

			write(setObj(key, Number(objVal || 0) + val, obj));
		},
		subtract: (key, val) => {
			let obj = read(),
				objVal = getObj(key, obj);

			if (isNaN(objVal)) throw new Error('A value of key is not a number.');

			write(setObj(key, Number(objVal || 0) - val, obj));
		},
		all: () => read(),
		clear: () => write({})
	};

module.exports = Object.assign(
	{
		version: require('./package.json').version,
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
	},
	methods
);

function getObj(ref, obj) {
	return ref.split('/').reduce((a, b) => a[b], obj);
}

function setObj(ref, val, obj) {
	ref = ref.split('/');
	let res = obj;
	while (ref.length > 1) {
		let req = ref.shift();
		res = res[req] = res[req] || {};
	}
	res[ref] = val;
	return obj;
}

function delObj(ref, obj) {
	ref = ref.split('/');
	let res = obj;
	while (ref.length > 1) {
		let req = ref.shift();
		res = res[req] = res[req] || {};
	}
	delete res[ref];
	return obj;
}

function read() {
	if (fs.existsSync(path)) {
		let content = fs.readFileSync(path, 'utf8');
		if (!content) return {};
		else return JSON.parse(content);
	} else return {};
}

function write(obj) {
	fs.writeFileSync(path, JSON.stringify(obj, null, 2));
}
