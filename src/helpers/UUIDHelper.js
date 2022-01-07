export function createUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		let r = Math.random() * 16 | 0;

		// eslint-disable-next-line
		let v = (c === "x") ? r : (r & 0x3 | 0x8);

		return v.toString(16);
	});
}