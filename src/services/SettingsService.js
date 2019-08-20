import store from "../redux/store/index";
import { updateState } from "../redux/actions/index";

class SettingsService {
	openSettingsWindow() {
		let new_data = {
			key   : "internal.new_version",
			value : false
		}

		store.dispatch(updateState(new_data));
		window.open("#/settings/about", "", "width=600,height=400,location=no,menubar=no");
	}

	openSettingsImport() {
		let new_data = {
			key   : "internal.viewing",
			value : "import"
		}

		store.dispatch(updateState(new_data));
	}
}

export default new SettingsService();