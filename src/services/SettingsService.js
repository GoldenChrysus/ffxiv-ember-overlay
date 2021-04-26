import store from "../redux/store/index";
import { updateState } from "../redux/actions/index";

class SettingsService {
	openSettingsWindow() {
		let new_data = {
			key   : "internal.new_version",
			value : false
		};

		let state       = store.getState();
		let querystring = String(window.location.search);
		let joiner      = (querystring.indexOf("?") !== -1) ? "&" : "?";
		
		querystring = `${querystring}${joiner}mode=${state.internal.mode}`;

		store.dispatch(updateState(new_data));
		window.open(`${querystring}#/settings/about`, "", "width=1000,height=630,location=no,menubar=no");
	}

	openSettingsImport() {
		let new_data = {
			key   : "internal.viewing",
			value : "import"
		}

		store.dispatch(updateState(new_data));
	}

	getNoticeClass() {
		return (!window.obsstudio && store.getState().internal.new_version) ? "notice" : "";
	}
}

export default new SettingsService();