class ObjectService {
	getByKeyPath(object, key_path) {
		if (typeof key_path === "string") {
			return this.getByKeyPath(object, key_path.split("."));
		} else if (key_path.length === 1) {
			return object[key_path[0]];
		} else {
			if (!object[key_path[0]]) {
				object[key_path[0]] = {};
			}

			return this.getByKeyPath(object[key_path[0]], key_path.slice(1));
		}
	}

	setByKeyPath(object, key_path, value) {
		if (typeof key_path === "string") {
			return this.setByKeyPath(object, key_path.split("."), value);
		} else if (key_path.length === 1) {
			return object[key_path[0]] = value;
		} else {
			if (!object[key_path[0]]) {
				object[key_path[0]] = {};
			}

			return this.setByKeyPath(object[key_path[0]], key_path.slice(1), value);
		}
	}
}

export default new ObjectService();