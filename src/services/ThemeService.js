import $ from "jquery";

class ThemeService {
	mode_classes = [
		"stats",
		"spells"
	];
	
	setTheme(theme) {
		$("body").attr("theme", theme);
	}

	toggleHorizontal(active) {
		$("body").toggleClass("horizontal", active);
	}

	toggleMinimal(active) {
		$("body").toggleClass("minimal", active);
	}

	setMode(new_mode) {
		for (let mode of this.mode_classes) {
			$("body").toggleClass(`mode-${mode}`, (mode === new_mode));
		}
	}
}

export default new ThemeService();