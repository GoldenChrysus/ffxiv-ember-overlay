import $ from "jquery";

class ThemeService {
	setTheme(options) {
		for (let key of Object.keys(options)) {
			$("body").toggleClass(key, options[key]);
		}
	}
}

export default new ThemeService();