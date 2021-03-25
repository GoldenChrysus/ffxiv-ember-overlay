class StringHelper {
	toBinary(string) {
		const units = new Uint16Array(string.length);

		for (let i = 0; i < units.length; i++) {
			units[i] = string.charCodeAt(i);
		}

		return String.fromCharCode.apply(null, new Uint8Array(units.buffer));
	}

	fromBinary(binary) {
		const bytes = new Uint8Array(binary.length);

		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}

		return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
	}
}

export default new StringHelper();