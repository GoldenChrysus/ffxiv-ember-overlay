class ObjectService {
	getByKeyPath(object, key_path) {
		if (typeof key_path === "string") {
			return this.getByKeyPath(object, key_path.split("."));
		}

		if (key_path.length === 1) {
			return object[key_path[0]];
		}

		if (!object[key_path[0]]) {
			object[key_path[0]] = {};
		}

		return this.getByKeyPath(object[key_path[0]], key_path.slice(1));
	}

	setByKeyPath(object, key_path, value) {
		if (typeof key_path === "string") {
			return this.setByKeyPath(object, key_path.split("."), value);
		}

		if (key_path.length === 1) {
			return object[key_path[0]] = value;
		}

		if (!object[key_path[0]]) {
			object[key_path[0]] = {};
		}

		return this.setByKeyPath(object[key_path[0]], key_path.slice(1), value);
	}
}

export default new ObjectService();
