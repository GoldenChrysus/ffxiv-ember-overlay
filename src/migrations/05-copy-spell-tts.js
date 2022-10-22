import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, _reject) => {
			const settings = store.getState().settings_data;
			const enabled  = settings.getSetting("spells_mode.use_tts");

			store.dispatch(
				updateSetting({
					key       : "spells_mode.party_use_tts",
					value     : enabled,
					skip_save : true,
				}),
			);
			resolve();
		});
	}
}

export default new Migration();
