import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		return new Promise((resolve, _reject) => {
			const settings = store.getState().settings_data;
			const minimal  = settings.getSetting("spells_mode.minimal_layout");
			const layout   = (minimal) ? "compact" : "normal";

			store.dispatch(
				updateSetting({
					key       : "spells_mode.layout",
					value     : layout,
					skip_save : true,
				}),
			);
			resolve();
		});
	}
}

export default new Migration();
