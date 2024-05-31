import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, _reject) => {
			const settings = store.getState().settings_data;
			const data     = settings.getSetting("tts.rules.critical");
			const exists   = settings.getSetting("tts.rules.critical_hp");

			if (exists === undefined) {
				store.dispatch(
					updateSetting({
						key       : "tts.rules.critical_hp",
						value     : data,
						skip_save : true,
					}),
				);
			}

			resolve();
		});
	}
}

export default new Migration();
