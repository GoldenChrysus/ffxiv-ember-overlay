import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, reject) => {
			let settings = store.getState().settings_data;
			let minimal  = settings.getSetting("spells_mode.minimal_layout");
			let layout   = (minimal) ? "compact" : "normal";

			store.dispatch(
				updateSetting({
					key       : "spells_mode.layout",
					value     : layout,
					skip_save : true
				})
			);
			resolve();
		});
	}	
}

export default new Migration();