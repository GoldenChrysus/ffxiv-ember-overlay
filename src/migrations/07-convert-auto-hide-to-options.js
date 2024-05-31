import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, _reject) => {
			const settings = store.getState().settings_data;
			const enabled  = settings.getSetting("interface.auto_hide");

			store.dispatch(
				updateSetting({
					key       : "interface.auto_hide",
					value     : (enabled) ? "hide" : "disabled",
					skip_save : true,
				}),
			);
			resolve();
		});
	}
}

export default new Migration();
