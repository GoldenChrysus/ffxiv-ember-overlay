import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, _reject) => {
			const settings    = store.getState().settings_data;
			const light_theme = settings.getSetting("interface.light_theme");
			const new_theme   = (light_theme) ? "ffxiv-light" : "ffxiv-dark";

			store.dispatch(
				updateSetting({
					key       : "interface.theme",
					value     : new_theme,
					skip_save : true,
				}),
			);
			resolve();
		});
	}
}

export default new Migration();
