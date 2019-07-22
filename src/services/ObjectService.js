class ObjectService {
	setByKeyPath(object, key_path, value) {
		if (typeof key_path === "string") {
			return this.setByKeyPath(object, key_path.split("."), value);
		} else if (key_path.length === 1 && value !== undefined) {
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