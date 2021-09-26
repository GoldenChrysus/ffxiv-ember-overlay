import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, reject) => {
			let settings = store.getState().settings_data;
			let data     = settings.getSetting("tts.rules.critical");

			store.dispatch(
				updateSetting({
					key       : "tts.rules.critical_hp",
					value     : data,
					skip_save : true
				})
			);
			resolve();
		});
	}	
}

export default new Migration();