const { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } = require("fs"),
objm = require("objm");

class Lcdb {
	constructor(path, options = { replacer: null, space: 2 }) {
		if (typeof path === "object") options = path;
		this.options = options;
		var path = typeof path === "string" ? path : path.path;
		this.path = path ? path : "db";
		if (options.path) delete options.path;
		this.obj = this._read(path);
	}
	set(ref, value) {
		objm.set(this.obj, ref, value);
		this._write();
		return true;
	}
	get(ref) {
		return ref === "/" ? this.obj : objm.get(this.obj, ref);
	}
	delete(ref) {
		if (ref === "/") return this.clear();
		else objm.delete(this.obj, ref);
		this._write();
		return true;
	}
	stat() {
		return statSync(this.path);
	}
	add(ref, value) {
		return this.set(ref, Number(this.get(ref) || 0) + Number(value));
	}
	subtract(ref, value) {
		return this.set(ref, Number(this.get(ref) || 0) - Number(value));
	}
	push(ref, ...values) {
		var arr = this.get(ref) || [];
		arr.push(...values);
		return this.set(ref, arr);
	}
	shift(ref) {
		var arr = this.get(ref) || [];
		arr.shift();
		return this.set(ref, arr);
	}
	pop(ref) {
		var arr = this.get(ref) || [];
		arr.pop();
		return this.set(ref, arr);
	}
	splice(ref, ...args) {
		var arr = this.get(ref) || [];
		arr.splice(...args);
		return this.set(ref, arr);
	}
	type(ref) {
		return typeof this.get(ref);
	}
	entries(ref) {
		return Object.entries(ref ? this.get(ref) : this.obj);
	}
	keys(ref) {
		return Object.keys(ref ? this.get(ref) : this.obj);
	}
	values(ref) {
		return Object.values(ref ? this.get(ref) : this.obj);
	}
	all() {
		return this.obj;
	}
	clear() {
		delete this.obj;
		this.obj = {};
		this._write();
		return true;
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
		length && !existsSync(ref) && mkdirSync(ref, { recursive: true });
		return writeFileSync(this.path + ".json", JSON.stringify(this.obj, this.options.replacer, this.options.space));
	}
}
module.exports = path => new Lcdb(path);