import $ from "jquery";

class ThemeService {
	mode_classes = [
		"stats",
		"spells"
	];
	
	setTheme(options) {
		for (let key of Object.keys(options)) {
			$("body").toggleClass(key, options[key]);
		}
	}

	setMode(new_mode) {
		for (let mode of this.mode_classes) {
			$("body").toggleClass(`mode-${mode}`, (mode === new_mode));
		}
	}
}

export default new ThemeService();