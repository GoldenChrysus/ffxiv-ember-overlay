import store from "../redux/store/index";
import $ from "jquery";

class ThemeService {
	setTheme(light_theme) {
		$("body").toggleClass("light", light_theme);
	}
}

export default new ThemeService();