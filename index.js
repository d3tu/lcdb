const {
	readFileSync,
	writeFileSync,
	existsSync,
	mkdirSync,
} = require("fs"),
	objm = require("objm");

class Lcdb {
	constructor(path) {
		this.path = path;

		this.obj = this._read(path);
	}

	set(ref, value) {
		objm.set(this.obj, ref, value);

		this._write();

		return true;
	}

	get(ref) {
		return objm.get(this.obj, ref);
	}

	delete(ref) {
		objm.delete(this.obj, ref);

		this._write();

		return true;
	}
	
	all() {
		return this.obj;
	}
	
	_read() {
		if (existsSync(this.path + ".json")) {
			var content = readFileSync(this.path + ".json", "utf8");

			if (!content) return {};
			else return JSON.parse(content);
		} else return {};
	}

	_write() {
		var parts = this.path.split("/");

		parts.pop();

		var length = parts.length,
			ref = parts.join("/");

		length && !existsSync(ref) && mkdirSync(ref, {
			recursive: true
		});

		return writeFileSync(this.path + ".json", JSON.stringify(this.obj, null, 2));
	}
}

module.exports = (ref) => new Lcdb(ref);